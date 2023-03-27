import {Blockchain} from '@ton-community/sandbox'
import {Cell, toNano} from 'ton-core'
import {NFTCollection} from '../wrappers/NFTCollection'
import '@ton-community/test-utils'
import {compile} from '@ton-community/blueprint'

describe('NFTCollection', () => {
    let code: Cell

    beforeAll(async () => {
        code = await compile('NFTCollection')
    })

    it('should deploy', async () => {
        const blockchain = await Blockchain.create()

        const nFTCollection = blockchain.openContract(await NFTCollection.createFromConfig({}, code))

        const deployer = await blockchain.treasury('deployer')

        const deployResult = await nFTCollection.sendDeploy(deployer.getSender(), toNano('0.05'))

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: nFTCollection.address,
            deploy: true,
        })
    })
})
