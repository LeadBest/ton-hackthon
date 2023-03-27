import dotenv from 'dotenv'
import {Address, toNano} from 'ton-core'
import {NFTCollection} from '../wrappers/NFTCollection'
import {compile, NetworkProvider} from '@ton-community/blueprint'
import { Config } from './models'
import { validateMnemonic } from 'tonweb-mnemonic'
import TonWeb from 'tonweb' // should be on top
import { NftCollection as NftCollectionType } from 'tonweb/dist/types/contract/token/nft/nft-collection'
const { NftItem } = TonWeb.token.nft

export async function getConfig(): Promise<Config> {
    const c = {
      walletMnemonic: process.env.WALLET_MNEMONIC || '',
      walletType: process.env.WALLET_TYPE || '',
      walletAddress: process.env.WALLET_ADDRESS || '',
  
      startIndex: process.env.START_INDEX ? parseInt(process.env.START_INDEX, 10) : -1,
  
      tonApiUrl: process.env.TON_API_URL || 'https://testnet.toncenter.com/api/v2/jsonRPC',
      tonApiKey: process.env.TON_API_KEY,
  
      collection: {
        royalty: process.env.COLLECTION_ROYALTY ? parseFloat(process.env.COLLECTION_ROYALTY) : 0,
        content: process.env.COLLECTION_CONTENT || '',
        base: process.env.COLLECTION_BASE || '',
      },
  
      deployAmount: process.env.DEPLOY_AMOUNT || '1',
      topupAmount: process.env.TOPUP_AMOUNT || '1',
    }
  
    await checkConfig(c)
  
    return c
  }

  export async function checkConfig(c: Config) {
    if (!c.walletMnemonic) {
      throw new Error('[Config] WalletMnemonic error')
    } else {
      const words = c.walletMnemonic.split(' ')
  
      const isValid = await validateMnemonic(words)
      if (!isValid) {
        throw new Error('[Config] Unknown mnemonic error')
      }
    }
  
    if (!c.walletType) {
      throw new Error('[Config] WalletType error')
    } else if (
      c.walletType !== 'v3R1' &&
      c.walletType !== 'v3R2' &&
      c.walletType !== 'v4R1' &&
      c.walletType !== 'v4R2'
    ) {
      throw new Error('[Config] WalletType unknown error')
    }
  
    if (Number.isNaN(c.startIndex)) {
      throw new Error('[Config] Start index not specified. Use -1 for auto detection')
    } else if (c.startIndex < -1) {
      throw new Error('[Config] Start index less than -1. Use -1 for auto detection')
    }
  
    if (!c.tonApiKey) {
      throw new Error('[Config] TonApiKey error')
    }
  
    if (!c.collection.royalty) {
      throw new Error('[Config] Collection Royalty error')
    }
  
    if (!c.collection.content) {
      throw new Error('[Config] Collection Content error')
    }
  
    if (!c.collection.base) {
      throw new Error('[Config] Collection Base error')
    }
  
    const fDeployAmount = parseFloat(c.deployAmount)
    if (isNaN(fDeployAmount)) {
      throw new Error('[Config] Deploy amount is NaN')
    } else if (fDeployAmount < 0.1) {
      throw new Error('[Config] Deploy amount is less than 0.1')
    }
  
    const fTopupAmount = parseFloat(c.topupAmount)
    if (isNaN(fTopupAmount)) {
      throw new Error('[Config] Topup amount is NaN')
    } else if (fTopupAmount < 0.1) {
      throw new Error('[Config] Topup amount is less than 0.1')
    }
  }

export async function run(provider: NetworkProvider) {

const config = await getConfig();
const walletAddress = await this.wallet.getAddress()

if (typeof config.collection.royalty !== 'number') {
  throw new Error('Wrong collection royalty')
}

const createCollectionParams = {
  ownerAddress: walletAddress,
  royalty: config.collection.royalty,
  royaltyAddress: walletAddress,
  collectionContentUri: config.collection.content,
  nftItemContentBaseUri: config.collection.base,
  nftItemCodeHex: NftItem.codeHex,
}

const nftCollection = new NftCollection(this.tonweb.provider, createCollectionParams)

try {
  const collectionData = await callTonApi<ReturnType<typeof nftCollection.getCollectionData>>(
    () => nftCollection.getCollectionData()
  )

  // If we collection is deployed - return it
  if (collectionData.collectionContentUri !== '') {
    return nftCollection
  }
} catch (e) {}

// Address that deploys everything should have tons
await this.ensureDeployerBalance()

this.log('[Deployer] Deploying new collection')
const nftCollectionAddress = await nftCollection.getAddress()

let seqno = await callTonApi(this.wallet.methods.seqno().call)

if (seqno === null) {
  seqno = 0
}
if (typeof seqno !== 'number') {
  throw new Error('[Deployer] Blockchain issue. No seqno found')
}

// Deploy collection
await callTonApi(async () =>
  this.wallet.methods
    .transfer({
      secretKey: this.key.secretKey,
      toAddress: nftCollectionAddress.toString(true, true, false), // non-bounceable
      amount: TonWeb.utils.toNano(config.deployAmount),
      seqno: typeof seqno === 'number' ? seqno : 0,
      payload: '', // body
      sendMode: 3,
      stateInit: (await nftCollection.createStateInit()).stateInit,
    })
    .send()
)

// Make sure that seqno increased from one we used
await this.ensureSeqnoInc(seqno)

try {
  const newData = await callTonApi<ReturnType<typeof nftCollection.getCollectionData>>(() =>
    nftCollection.getCollectionData()
  )

  if (newData.collectionContentUri === '') {
    throw new Error('[Deployer] Collection data after deploy not found')
  }
} catch (e) {
  throw new Error('[Deployer] Collection data after deploy not found catch')
}

this.log('[Deployer] Collection deployed')

return nftCollection
}
