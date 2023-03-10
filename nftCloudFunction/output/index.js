"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ff = __importStar(require("@google-cloud/functions-framework"));
const tonweb_mnemonic_1 = require("tonweb-mnemonic");
const tonweb_1 = __importDefault(require("tonweb"));
const bn_js_1 = __importDefault(require("bn.js"));
const { NftItem, NftCollection } = tonweb_1.default.token.nft; // Get NFT funC bytecode
const ONE_TON = new bn_js_1.default('1000000000');
function delay(ms) {
    return new Promise((resolve) => setTimeout(() => {
        resolve();
    }, ms));
}
function ensureDeployerBalance(tonweb, wallet) {
    return __awaiter(this, void 0, void 0, function* () {
        const address = yield wallet.getAddress();
        const sBalance = yield tonweb.getBalance(address);
        if (!sBalance || typeof sBalance !== 'string') {
            throw new Error('[Deployer] Balance error');
        }
        const balance = new bn_js_1.default(sBalance);
        const minBalance = new bn_js_1.default('1000000000'); // 1 ton
        if (balance.lt(minBalance)) {
            const currentBalance = balance.div(ONE_TON).toString();
            const currentAddress = address.toString(true, true, true);
            throw new Error(`[Deployer] Deployer balance insufficient (Min balance 1 TON). Current balance ${currentBalance}. Current wallet: ${currentAddress}`);
        }
    });
}
// Spend 8s everytime to make sure sequence correct
function ensureSeqnoInc(wallet, seqno) {
    return __awaiter(this, void 0, void 0, function* () {
        let seqIncremented = false;
        for (let i = 0; i < 5; i++) {
            yield delay(8000);
            const newSeqno = yield wallet.methods.seqno().call();
            if (newSeqno === seqno + 1) {
                seqIncremented = true;
                break;
            }
        }
        if (!seqIncremented) {
            throw new Error('seq not incremented');
        }
    });
}
function isNftExists(tonweb, collection, index) {
    return __awaiter(this, void 0, void 0, function* () {
        const nftItemAddress = yield collection.getNftItemAddressByIndex(index);
        const nftItem = new NftItem(tonweb.provider, {
            address: nftItemAddress,
        });
        let i = 0;
        while (i < 20) {
            i++;
            try {
                const res = yield collection.getNftItemContent(nftItem);
                return res && res.index === index;
            }
            catch (e) {
                const parseError = e;
                if (parseError && parseError.result && parseError.result.exit_code === -13) {
                    return false;
                }
                yield delay(100);
            }
        }
        return false;
    });
}
function deployCollection(tonweb, wallet, nftCollection, walletKey) {
    return __awaiter(this, void 0, void 0, function* () {
        // Address that deploys everything should have tons
        yield ensureDeployerBalance(tonweb, wallet);
        const nftCollectionAddress = yield nftCollection.getAddress();
        let seqno = yield wallet.methods.seqno().call();
        if (seqno === null) {
            seqno = 0;
        }
        if (typeof seqno !== 'number') {
            throw new Error('[Deployer] Blockchain issue. No seqno found');
        }
        // Deploy collection
        yield wallet.methods
            .transfer({
            secretKey: walletKey.secretKey,
            toAddress: nftCollectionAddress.toString(true, true, false),
            amount: tonweb_1.default.utils.toNano('1'),
            seqno: typeof seqno === 'number' ? seqno : 0,
            payload: '',
            sendMode: 3,
            stateInit: (yield nftCollection.createStateInit()).stateInit,
        })
            .send();
        // Make sure that seqno increased from one we used
        yield ensureSeqnoInc(wallet, seqno);
        try {
            const newData = yield nftCollection.getCollectionData();
            if (newData.collectionContentUri === '') {
                throw new Error('[Deployer] Collection data after deploy not found');
            }
        }
        catch (e) {
            throw new Error('[Deployer] Collection data after deploy not found catch');
        }
    });
}
function ensureCollectionBalance(tonweb, wallet, nftCollection, walletKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const nftCollectionAddress = yield nftCollection.getAddress();
        const sBalance = yield tonweb.getBalance(nftCollectionAddress);
        if (!sBalance || typeof sBalance !== 'string') {
            throw new Error('[Deployer] Balance error');
        }
        const balance = new bn_js_1.default(sBalance);
        const minBalance = new bn_js_1.default('500000000'); // 0.5 ton
        // Balance is ok, no need to topup
        if (balance.gt(minBalance)) {
            return;
        }
        const seqno = yield wallet.methods.seqno().call();
        if (typeof seqno !== 'number') {
            throw new Error('[Deployer] No seqno found');
        }
        yield wallet.methods
            .transfer({
            secretKey: walletKey.secretKey,
            toAddress: nftCollectionAddress.toString(true, true, true),
            amount: tonweb_1.default.utils.toNano(`1`),
            seqno,
            payload: '',
            sendMode: 3,
        })
            .send();
        yield ensureSeqnoInc(wallet, seqno);
        const newSBalance = yield tonweb.getBalance(nftCollectionAddress);
        if (!newSBalance || typeof newSBalance !== 'string') {
            throw new Error('[Deployer] Cannot retrieve balance');
        }
        const newBalance = new bn_js_1.default(newSBalance);
        if (minBalance.gt(newBalance)) {
            throw new Error('[Deployer] Collection balance deposit error');
        }
    });
}
function ensurePreviousNftExists(tonweb, nftCollection, nftId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (nftId < 0) {
            throw new Error('Wrong nftId');
        }
        // don't need to check first one
        if (nftId === 0) {
            return;
        }
        const id = nftId - 1;
        const exists = yield isNftExists(tonweb, nftCollection, id);
        if (!exists) {
            throw new Error('Previous ID is not existed!');
        }
    });
}
function deployNft(tonweb, wallet, nftCollection, walletKey, itemDeployTo) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!nftCollection.address) {
            throw new Error('[Deployer] Corrupt nft collection');
        }
        // If we have seqno in db, use it to rebroadcast tx
        const seqno = (yield (yield fetch(`https://testnet.toncenter.com/api/v2/getWalletInformation?address=EQAe6wqa8lLOUPTffs5aEjmfkROZRIXQBJR_xD9qZav343ke&api_key=62335bb74fb725d03f32733aea0e47bd4ff464a0cc33f28c501b271673ba9c58`)).json()).result.seqno;
        console.log(`Finish get seqno: ${seqno}`);
        // Address that deploys everything should have tons
        yield ensureDeployerBalance(tonweb, wallet);
        console.log(`Finish ensureDeployerBalance()`);
        // We need to make sure that nft collection has enough balance to create nft
        yield ensureCollectionBalance(tonweb, wallet, nftCollection, walletKey);
        console.log(`Finish ensureCollectionBalance()`);
        // Previous nft should be deployed, otherwise nft will not be created and we will get stuck seqno
        // await ensurePreviousNftExists(tonweb, nftCollection, itemDeployTo.id)
        // console.log(`Finish ensurePreviousNftExists()`)
        // Check if nft exists
        const nftItemAddress = yield nftCollection.getNftItemAddressByIndex(itemDeployTo.id);
        console.log(`Finish get nftItemAddress: ${nftItemAddress}`);
        const exists = yield isNftExists(tonweb, nftCollection, itemDeployTo.id);
        if (exists) {
            throw new Error('[Deployer] ID has been minted');
        }
        console.log(`Finish check isNftExists`);
        // If we have no seqno from db and api - throw.
        // It can't be 0 since we already should've deployed collection
        if (typeof seqno !== 'number' || seqno === 0) {
            throw new Error('[Deployer] No seqno found');
        }
        // deploy nft
        // 0.05 should be enough to deploy nft
        // eslint-disable-next-line prettier/prettier
        const amount = tonweb_1.default.utils.toNano('0.05');
        yield wallet.methods
            .transfer({
            secretKey: walletKey.secretKey,
            toAddress: nftCollection.address,
            amount,
            seqno,
            payload: yield nftCollection.createMintBody({
                amount,
                itemIndex: itemDeployTo.id,
                itemOwnerAddress: new tonweb_1.default.utils.Address(itemDeployTo.ownerAddress),
                itemContentUri: `${itemDeployTo.id}.json`,
            }),
            sendMode: 3,
        })
            .send();
        console.log(`Finish Mint Item`);
        // Make sure that seqno increased from one we used
        yield ensureSeqnoInc(wallet, seqno);
        console.log(`Finish ensureSeqnoInc(), delay 8s...`);
        // Wait to make sure blockchain updated and includes our nft
        yield delay(8000);
        // Get new nft from blockchain
        const nftItem = new NftItem(tonweb.provider, {
            address: nftItemAddress,
        });
        const itemInfo = yield nftCollection.getNftItemContent(nftItem);
        if (!itemInfo) {
            throw new Error(`[Deployer] no nft item info ${itemDeployTo.id}`);
        }
        if (!itemInfo.ownerAddress) {
            throw itemInfo;
        }
        console.log(itemInfo);
    });
}
const main = (id, to) => __awaiter(void 0, void 0, void 0, function* () {
    // Connect to tonweb API
    const tonweb = new tonweb_1.default(new tonweb_1.default.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC?api_key=62335bb74fb725d03f32733aea0e47bd4ff464a0cc33f28c501b271673ba9c58'));
    // Get wallet
    const mnemonic = 'express oblige maple venture real inhale fiber virtual attend child garage inhale merge hire wise dog pledge present cool toast loyal shoot category book';
    const words = mnemonic.split(' ');
    const walletKey = yield (0, tonweb_mnemonic_1.mnemonicToKeyPair)(words);
    const WalletClass = tonweb.wallet.all.v4R2;
    const wallet = new WalletClass(tonweb.provider, {
        publicKey: walletKey.publicKey,
        wc: 0,
    });
    const walletAddress = yield wallet.getAddress();
    const createCollectionParams = {
        ownerAddress: walletAddress,
        royalty: 0.003,
        royaltyAddress: walletAddress,
        collectionContentUri: 'https://storage.googleapis.com/tob-dooby-metadata/collectionMetadata.json',
        nftItemContentBaseUri: 'https://storage.googleapis.com/tob-dooby-metadata/',
        nftItemCodeHex: NftItem.codeHex,
    };
    const nftCollection = new NftCollection(tonweb.provider, createCollectionParams);
    // If throw error, means that collection not exists
    try {
        yield nftCollection.getCollectionData();
    }
    catch (e) {
        deployCollection(tonweb, wallet, nftCollection, walletKey);
    }
    // Deploy NFT Item
    const itemDeployTo = {
        id,
        ownerAddress: to,
        contentURI: `https://storage.googleapis.com/tob-dooby-metadata/`,
    };
    yield deployNft(tonweb, wallet, nftCollection, walletKey, itemDeployTo);
});
ff.http('TONMint', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.query.id, 10);
    const to = req.query.to;
    res.status(200).send({ id, to });
    // await main(id, to)
}));
