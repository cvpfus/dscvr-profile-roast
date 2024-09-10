import { useGetAssetsByOwnerQuery } from "@/hooks/useGetAssetsByOwnerQuery.js";
import { Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { useUmi } from "@/hooks/useUmi.js";
import { useRemoveAssetMutation } from "@/hooks/useRemoveAssetMutation.js";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination.jsx";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card } from "@/components/ui/card.jsx";
import { Explorer } from "@/components/Explorer.jsx";
import { useCanvasClient } from "@/hooks/useCanvasClient.js";

export const MyNFTs = () => {
  const { umi } = useUmi();

  const [visiblePages, setVisiblePages] = useState([]);
  const [isImgLoading, setIsImgLoading] = useState(true);

  const getAssetsByOwnerQuery = useGetAssetsByOwnerQuery();

  const { page, setPage } = getAssetsByOwnerQuery;

  const { isBurning, ...removeAssetMutation } = useRemoveAssetMutation();

  const { client } = useCanvasClient();

  const { publicKey } = useWallet();

  const address = publicKey ? publicKey.toString() : null;

  const assetsByOwnerData =
    getAssetsByOwnerQuery.data?.assets.length > 0
      ? getAssetsByOwnerQuery.data.assets
      : null;

  const isAssetsEmpty = getAssetsByOwnerQuery.data?.assets.length === 0;

  const maxPage = getAssetsByOwnerQuery.data
    ? getAssetsByOwnerQuery.data.maxPage
    : null;

  useEffect(() => {
    if (assetsByOwnerData) {
      if (maxPage === 1) setVisiblePages([1]);
      else if (maxPage === 2) setVisiblePages([1, 2]);
      else {
        if (page <= 2) setVisiblePages([1, 2, 3]);
        else if (page >= maxPage - 1)
          setVisiblePages([maxPage - 2, maxPage - 1, maxPage]);
        else setVisiblePages([page - 1, page, page + 1]);
      }
    }
  }, [assetsByOwnerData]);

  console.log(getAssetsByOwnerQuery.data);

  const handleBurn = async (asset) => {
    try {
      await removeAssetMutation.mutate({
        umi,
        asset,
        page,
        getAssetsByOwnerQuery,
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleShare = async (asset) => {
    const html = `
    <p>Test</p>
    <div style="display: flex;">
    <img src="https://storage.cvpfus.xyz/image/-U4ylGZt5w0cHaHds3fIe.svg" alt="test"/>
    <embedded-canvas url="https://dscvr-practice.vercel.app/"></embedded-canvas>
    </div>
    
    `;

    await client.createPost(html);
  };

  const handleImgLoad = () => {
    setIsImgLoading(false);
  };

  const handleImgError = () => {
    setIsImgLoading(false);
    toast.error("Error loading image");
  };

  return (
    <div>
      {!address ? <div>Connect your wallet first.</div> : null}
      {getAssetsByOwnerQuery.isLoading && (
        <div className="flex justify-center">
          <Loader2 className="animate-spin" />
        </div>
      )}

      {address && isAssetsEmpty && <div>You currently have no NFTs.</div>}

      {address && assetsByOwnerData && (
        <>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {assetsByOwnerData.map((asset) => {
              return (
                <Card
                  key={asset.publicKey}
                  className="w-[360px] p-1 flex flex-col items-center justify-center min-h-[200px]"
                >
                  {!asset.burnt && (
                    <div>
                      {isImgLoading && (
                        <div className="flex justify-center">
                          <Loader2 className="animate-spin" />
                        </div>
                      )}
                      <img
                        src={asset.imageUri}
                        alt={asset.name}
                        className={`${isImgLoading ? "opacity-0" : ""}`}
                        onLoad={handleImgLoad}
                        onError={handleImgError}
                      />
                      <Explorer publicKey={asset.publicKey} />
                      <div className="flex mt-2">
                        <Button
                          variant="destructive"
                          onClick={() => handleBurn(asset)}
                          className="flex-1 mr-0.5"
                          disabled={isBurning}
                        >
                          {isBurning === asset.publicKey ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "🔥"
                          )}

                          <span className="ml-2">Burn</span>
                        </Button>
                        <Button
                          onClick={() => handleShare(asset)}
                          className="flex-1 ml-0.5"
                        >
                          <Share2 className="h-4 w-4" />
                          <span className="ml-2">Share</span>
                        </Button>
                      </div>
                    </div>
                  )}
                  {asset.burnt && <div>Asset is burned</div>}
                </Card>
              );
            })}
          </div>
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem
                onClick={() => {
                  if (page > 1) setPage(page - 1);
                }}
                className={
                  page === 1
                    ? "pointer-events-none opacity-50"
                    : "hover:cursor-pointer"
                }
              >
                <PaginationPrevious />
              </PaginationItem>
              {visiblePages.map((p) => {
                return (
                  <PaginationItem
                    onClick={() => setPage(p)}
                    className="hover:cursor-pointer"
                    key={p}
                  >
                    <PaginationLink isActive={page === p}>{p}</PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem
                onClick={() => {
                  if (page < maxPage) setPage(page + 1);
                }}
                className={
                  page === maxPage
                    ? "pointer-events-none opacity-50"
                    : "hover:cursor-pointer"
                }
              >
                <PaginationNext />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
};
