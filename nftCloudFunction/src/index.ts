import * as ff from '@google-cloud/functions-framework';
import { mnemonicToKeyPair } from 'tonweb-mnemonic';
import TonWeb from 'tonweb';
import path from 'path';
import fs from 'fs';

ff.http('TONMint', async (req: ff.Request, res: ff.Response) => {
    // Get to address
    const to: string = req.query.to as string;
    if (!to) {
        res.status(401).send({ error: 'Must set to=ADDRESS in query string' });
    }

    const configPath = path.join('/tmp', 'config.json');

    // Generate token ID
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify({ id: 1 }));
    }
    const id = JSON.parse(fs.readFileSync(configPath).toString()).id;
    fs.writeFileSync(configPath, JSON.stringify({ id: id + 1 }));

    // Connect to tonweb API
    const tonweb = new TonWeb(
        new TonWeb.HttpProvider(
            'https://testnet.toncenter.com/api/v2/jsonRPC?api_key=62335bb74fb725d03f32733aea0e47bd4ff464a0cc33f28c501b271673ba9c58'
        )
    );

    // Get wallet
    const mnemonic =
        'express oblige maple venture real inhale fiber virtual attend child garage inhale merge hire wise dog pledge present cool toast loyal shoot category book';
    const words = mnemonic.split(' ');
    const walletKey = await mnemonicToKeyPair(words);
    const WalletClass = tonweb.wallet.all.v4R2;
    const wallet = new WalletClass(tonweb.provider, {
        publicKey: walletKey.publicKey,
        wc: 0,
    });

    // Get NFT funC bytecode and NftCollection Data
    const { NftItem, NftCollection } = TonWeb.token.nft;
    const walletAddress = await wallet.getAddress();
    const createCollectionParams = {
        ownerAddress: walletAddress,
        royalty: 0.001,
        royaltyAddress: walletAddress,
        collectionContentUri: 'https://storage.googleapis.com/tob-dooby-metadata/collectionMetadata.json',
        nftItemContentBaseUri: 'https://storage.googleapis.com/tob-dooby-metadata/',
        nftItemCodeHex: NftItem.codeHex,
    };
    const nftCollection = new NftCollection(tonweb.provider, createCollectionParams);

    // If throw error, means that collection not exists
    try {
        await nftCollection.getCollectionData();
    } catch (e) {
        res.status(401).send({ error: 'NFT Collection is not deployed' });
    }

    // Gather NFT metadata
    const tokenId = id;
    const ownerAddress = to;
    const seqno = (
        await (
            await fetch(
                `https://testnet.toncenter.com/api/v2/getWalletInformation?address=EQAe6wqa8lLOUPTffs5aEjmfkROZRIXQBJR_xD9qZav343ke&api_key=62335bb74fb725d03f32733aea0e47bd4ff464a0cc33f28c501b271673ba9c58`
            )
        ).json()
    ).result.seqno;
    const nftItemAddress = await nftCollection.getNftItemAddressByIndex(tokenId);
    const amount = TonWeb.utils.toNano('0.05');

    // Deploy NFT Item
    if (nftCollection.address !== undefined) {
        await wallet.methods
        .transfer({
            secretKey: walletKey.secretKey,
            toAddress: nftCollection.address,
            amount,
            seqno,
            payload: await nftCollection.createMintBody({
                amount,
                itemIndex: tokenId,
                itemOwnerAddress: new TonWeb.utils.Address(ownerAddress),
                itemContentUri: `${tokenId}.json`,
            }),
            sendMode: 3,
        })
        .send();
    }

    res.status(200).send({ tokenId: id, tokenAddress: nftItemAddress.toString(true, true, true), error: '' });
});
