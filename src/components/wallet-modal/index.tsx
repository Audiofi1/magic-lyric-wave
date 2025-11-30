import { useAccount, useDisconnect } from 'wagmi';
import { Button } from '../ui/button';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function WalletConnect() {
   const { address, isConnected, isConnecting } = useAccount();
   const { disconnect } = useDisconnect();

   return (
      <div>
         {isConnecting ? (
            <div>Loading...</div>
         ) : isConnected ? (
            <div>
               <p>Connected: {address}</p>
               <Button onClick={() => disconnect()} variant="outline">
                  Disconnect
               </Button>
            </div>
         ) : (
            <ConnectButton />
         )}
      </div>
   );
}
