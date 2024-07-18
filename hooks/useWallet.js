import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

function useWallet() {
    const [wallet, setWallet] = useState(null)

    async function connectWallet() {
        try {
            if (typeof window !== 'undefined' && window.ethereum) {
                // Request access to user's MetaMask account
                await window.ethereum.request({ method: 'eth_requestAccounts' });

                // Create ethers provider using MetaMask provider
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                // Get signer (account connected to MetaMask)
                const connectedSigner = provider.getSigner();
                const address = await connectedSigner.getAddress()
                setWallet({ address: address })

                console.log('Connected account:', address);
            } else {
                console.log('No Ethereum wallet found');
            }
        } catch (error) {
            console.error('Error connecting to wallet:', error);
        }
    }
    function disconnectWallet() {
        setWallet(null);
        console.log('Wallet disconnected');
    }

    return [wallet, connectWallet, disconnectWallet];
}
export default useWallet;
