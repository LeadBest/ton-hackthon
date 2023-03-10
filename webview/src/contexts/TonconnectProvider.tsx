/** @format */

import React, { useEffect, useCallback, useState, useMemo } from 'react';

import TonConnect, {
	isWalletInfoInjected,
	CHAIN,
	type WalletInfoInjected,
	type WalletInfo,
	type Wallet,
} from '@tonconnect/sdk';
import { Address } from 'ton';
import isMobile from 'ismobilejs';

interface Props {
	children?: React.ReactNode;
}

interface TonconnectContextProps {
	connector: TonConnect;
	universalLink: string;
	wallet: Wallet | null;
	address: string;
	connectWallet: () => Promise<void>;
}

export const TonconnectContext = React.createContext<TonconnectContextProps>({} as any);
// const manifestUrl = 'https://gist.githubusercontent.com/siandreev/75f1a2ccf2f3b4e2771f6089aeb06d7f/raw/d4986344010ec7a2d1cc8a2a9baa57de37aaccb8/gistfile1.txt';
const manifestUrl = 'https://app-cplk6yhpaq-de.a.run.app/tonconnect-manifest.json';

const connector = new TonConnect({ manifestUrl });

const TonconnectProvider = (props: Props) => {
	const [walletsList, setWalletList] = useState<{
		walletsList: any;
		embeddedWallet: WalletInfoInjected | undefined;
	}>();
	const [universalLink, setUniversalLink] = useState('');
	const [wallet, setWallet] = useState<Wallet | null>(connector.wallet);

	const address: string = useMemo(() => {
		const walletAddress = wallet?.account.address;
		const walletChain = wallet?.account.chain;

		if (!walletAddress) {
			return '';
		}

		return Address.parseRaw(walletAddress).toFriendly({ testOnly: walletChain === CHAIN.TESTNET });
	}, [wallet]);

	const getWalletList = async () => {
		const walletsList = await connector.getWallets();
		const embeddedWallet = walletsList.filter(isWalletInfoInjected).find(wallet => wallet.embedded);

		return {
			walletsList,
			embeddedWallet,
		};
	};

	const connectWallet = useCallback(async () => {
		// const result = await getWalletList();
		// console.log(result)
		// Use loading screen/UI instead (while wallets list is loading)
		if (!walletsList) return;
		/* if (!(walletsList.state === 'hasValue')) {
			setTimeout(handleButtonClick, 200);
		}

		if (!isDesktop() && walletsList.contents.embeddedWallet) {
			connector.connect({ jsBridgeKey: walletsList.contents.embeddedWallet.jsBridgeKey });
			return;
		}
    */
		const tonkeeperConnectionSource = {
			universalLink: walletsList.walletsList[0].universalLink,
			bridgeUrl: walletsList.walletsList[0].bridgeUrl,
		};

		const universalLink = connector.connect(tonkeeperConnectionSource);

		if (isMobile(window.navigator).phone) {
			window.open(universalLink, 'none', 'noreferrer noopener');
		} else {
			setUniversalLink(universalLink);
		}
	}, [walletsList]);

	useEffect(() => {
		connector.onStatusChange(
			reslut => {
				// console.log(reslut);
			},
			(error: unknown) => {
				console.log(error);
			},
		);
		const init = async () => {
			try {
				await connector.restoreConnection();
				const result = await getWalletList();
				setWalletList(result);
			} catch (error) {
				console.log(error);
			}
		};
		connector.onStatusChange(setWallet, console.error);

		init()
			.then(result => {
				// console.log(result);
			})
			.catch(error => {
				console.log(error);
			});
	}, []);

	return (
		<TonconnectContext.Provider value={{ connector, wallet, connectWallet, universalLink, address }}>
			{props.children}
		</TonconnectContext.Provider>
	);
};

export default TonconnectProvider;
