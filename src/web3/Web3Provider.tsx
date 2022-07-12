import {
    useWeb3React,
    Web3ContextType,
    Web3ReactHooks,
    Web3ReactProvider,
} from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { EIP1193Provider } from 'eip1193-provider';
import { metaMask, metamaskHooks } from './connectors';

const connectors: [MetaMask, Web3ReactHooks][] = [
    [metaMask, metamaskHooks],
    // [coinbaseWallet, coinbaseWalletHooks],
];

export interface Web3ProviderProps {
    account: Required<Web3ContextType['account']> | null;
    provider: EIP1193Provider | null;
    isActivating: Web3ContextType['isActivating'];
    chainId: Required<Web3ContextType['chainId']> | null;
    connector: Web3ContextType['connector'] | null;
}

export const Web3Context = createContext<Web3ProviderProps>({
    account: null,
    provider: null,
    isActivating: true,
    chainId: null,
    connector: null
});

function Web3LocalProvider({ children }: { children: ReactNode }) {
    const { isActivating, account, chainId, connector } = useWeb3React();
    const [provider, setProvider] = useState<Web3ProviderProps['provider']>(null);


    useEffect(() => {
        if (!connector || !connector.provider) {
            return;
        }
        const p = new ethers.providers.Web3Provider(connector.provider as any);
        // https://docs.metamask.io/guide/ethereum-provider.html#ethereum-provider-api
        // MetaMask's Ethereum JS Provider API is specified by EIP-1193
        setProvider(p.provider as EIP1193Provider);
    }, [connector, connector.provider]);

    const memoValue = useMemo(
        () => ({
            account: account || null,
            provider: provider || null,
            isActivating,
            chainId: chainId || null,
            connector: connector || null
        }),
        [account, chainId, connector, isActivating, provider]
    );

    return <Web3Context.Provider value={memoValue}>{children}</Web3Context.Provider>;
}

export function Web3Provider({ children }: { children: ReactNode }) {
    return (
        <Web3ReactProvider connectors={connectors}>
            <Web3LocalProvider>{children}</Web3LocalProvider>
        </Web3ReactProvider>
    );
}