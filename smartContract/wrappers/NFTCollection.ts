import {
    Address,
    beginCell,
    Cell,
    Slice,
    Contract,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode,
} from 'ton-core';

export type NFTCollectionConfig = {
    owner_address: Slice;
    next_item_index: number;
    content: Cell;
    nft_item_code: Cell;
    royalty_params: Cell;
};

export function nftCollectionConfigToCell(config: NFTCollectionConfig): Cell {
    return beginCell()
        .storeSlice(config.owner_address)
        .storeUint(config.next_item_index, 64)
        .storeRef(config.content)
        .storeRef(config.nft_item_code)
        .storeRef(config.royalty_params)
        .endCell();
}

export const Opcodes = {
    get_royalty_params: 0x693d3950,
    report_royalty_params: 0xa8cb00ad
};

export class NFTCollection implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new NFTCollection(address);
    }

    static createFromConfig(config: NFTCollectionConfig, code: Cell, workchain = 0) {
        const data = nftCollectionConfigToCell(config);
        const init = { code, data };
        return new NFTCollection(contractAddress(workchain, init), init);
    }

    // async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    //     await provider.internal(via, {
    //         value,
    //         sendMode: SendMode.PAY_GAS_SEPARATLY,
    //         body: beginCell().endCell(),
    //     });
    // }

    // async sendIncrease(
    //     provider: ContractProvider,
    //     via: Sender,
    //     opts: {
    //         increaseBy: number;
    //         value: bigint;
    //         queryID?: number;
    //     }
    // ) {
    //     await provider.internal(via, {
    //         value: opts.value,
    //         sendMode: SendMode.PAY_GAS_SEPARATLY,
    //         body: beginCell()
    //             .storeUint(Opcodes.increase, 32)
    //             .storeUint(opts.queryID ?? 0, 64)
    //             .storeUint(opts.increaseBy, 32)
    //             .endCell(),
    //     });
    // }

    // async getNFTCollection(provider: ContractProvider) {
    //     const result = await provider.get('get_nftCollection', []);
    //     return result.stack.readNumber();
    // }

    // async getID(provider: ContractProvider) {
    //     const result = await provider.get('get_id', []);
    //     return result.stack.readNumber();
    // }
}
