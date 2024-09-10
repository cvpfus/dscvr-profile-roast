import Login from "./components/Login.jsx";
import { useCallback, useEffect, useState } from "react";
import { useCanvasClient } from "./hooks/useCanvasClient.js";
import { useResizeObserver } from "./hooks/useResizeObserver.js";
import { Button } from "@/components/ui/button.jsx";
import { Generator } from "@/components/Generator.jsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.jsx";
import { Collection } from "@/components/Collection.jsx";
import { MyNFTs } from "@/components/MyNFTs.jsx";
import toast, { Toaster } from "react-hot-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { Loader2 } from "lucide-react";
import { getWallets } from "@wallet-standard/core";
import { CANVAS_WALLET_NAME } from "@dscvr-one/canvas-wallet-adapter";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // const { get } = getWallets();
  // const wallets = get();

  const {
    connect,
    disconnect,
    publicKey,
    select,
    connecting,
    wallets,
    wallet,
    connected,
  } = useWallet();

  const address = publicKey ? publicKey.toString() : null;

  const { client, user } = useCanvasClient();

  useResizeObserver(client);

  select(CANVAS_WALLET_NAME);

  // if (!isLoggedIn) return <Login setIsLoggedIn={setIsLoggedIn} />;

  const handleConnect = async () => {
    try {
      // select(CANVAS_WALLET_NAME);
      await connect();

    } catch (error) {
      console.error(error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="m-4">
      <Toaster position="top-right" />
      <div className="flex justify-end items-center gap-2 mb-4">
        {address && (
          <div>{`${address.substring(0, 4)}...${address.substring(address.length - 4)}`}</div>
        )}
        {connected ? (
          <Button onClick={handleDisconnect}>Disconnect Wallet</Button>
        ) : (
          <Button onClick={handleConnect}>
            {connecting && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
            Connect Wallet
          </Button>
        )}
      </div>
      <div className="flex justify-center">
        <Tabs
          defaultValue="generate-mint"
          className="flex flex-col items-center"
        >
          <TabsList>
            <TabsTrigger value="generate-mint">Generate & Mint</TabsTrigger>
            <TabsTrigger value="my-nfts">My NFTs</TabsTrigger>
            <TabsTrigger value="collection">Collection</TabsTrigger>
          </TabsList>
          <TabsContent value="generate-mint">
            <Generator user={user} />
          </TabsContent>
          <TabsContent value="my-nfts">
            <MyNFTs />
          </TabsContent>
          <TabsContent value="collection">
            <Collection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default App;
