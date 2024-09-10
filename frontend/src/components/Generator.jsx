import { Button } from "@/components/ui/button.jsx";
import { useAddAssetMutation } from "@/hooks/useAddAssetMutation.js";
import { useCanvasClient } from "@/hooks/useCanvasClient.js";
import toast from "react-hot-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { Loader2 } from "lucide-react";
import { Explorer } from "@/components/Explorer.jsx";
import { EXAMPLE_IMG_URL } from "@/constants/index.js";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { useState } from "react";

export const Generator = () => {
  const { publicKey } = useWallet();

  const { user } = useCanvasClient();

  const { mutate, isPending, data, isSuccess } = useAddAssetMutation();

  const [imgLoading, setImgLoading] = useState(true);

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

      {!data && !isPending && (
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-xl mt-4 mb-1">Example</h2>
          <img src={EXAMPLE_IMG_URL} alt="example-roast" />
        </div>
      )}

      {!data && isPending && (
        <>
          <Skeleton className="w-24 h-5 mt-4" />
          <div className="rounded-2xl shadow border p-4 flex flex-col items-center mt-3">
            <Skeleton className="w-36 h-5" />
            <Skeleton className="w-[410px] h-[270px] mt-4" />
            <Skeleton className="w-28 h-5 mt-4" />
          </div>
        </>
      )}

      {isSuccess && (
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-xl mt-4 mb-1">Result</h2>
          {imgLoading && <Loader2 className="animate-spin my-4" />}
          <img
            src={data.data.message.imageUri}
            alt="generated-roast"
            onLoad={() => setImgLoading(false)}
          />
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
