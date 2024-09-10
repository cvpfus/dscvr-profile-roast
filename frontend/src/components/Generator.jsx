import { Button } from "@/components/ui/button.jsx";
import { useAddAssetMutation } from "@/hooks/useAddAssetMutation.js";
import { useCanvasClient } from "@/hooks/useCanvasClient.js";
import toast from "react-hot-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { Loader2 } from "lucide-react";
import { Explorer } from "@/components/Explorer.jsx";

export const Generator = () => {
  const { publicKey } = useWallet();

  const { user } = useCanvasClient();

  const { mutate, isPending, data, isSuccess } = useAddAssetMutation();

  const address = publicKey ? publicKey.toString() : null;

  const handleMintNFT = async () => {
    if (!address) {
      toast.error("Wallet not connected.");
      return;
    }

    try {
      await mutate({
        userAddress: address,
        username: user.username,
      });
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl">Let AI roast your DSCVR profile! 🔥</h2>

      <Button onClick={handleMintNFT} className="mt-2" disabled={isPending}>
        {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        Generate & Mint NFT
      </Button>

      <h5 className="text-xs mt-1">(Rate limited to 5 mints every 2 hours)</h5>

      {isSuccess && (
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-xl mt-4 mb-1">Result</h2>
          <img src={data.data.message.imageUri} alt="generated-roast" />
          <Explorer publicKey={data.data.message.publicKey} />
          <h4 className=" text-sm text-center italic my-2">
            Note: This is a deliberately harsh and snarky roasting, and is not
            intended to be a constructive or meaningful criticism. It's just for
            fun!
          </h4>
        </div>
      )}
    </div>
  );
};
