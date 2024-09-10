import { useGetAssetsQuery } from "@/hooks/useGetAssetsQuery.js";
import { Loader2 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.jsx";
import { useEffect, useState } from "react";
import { useCanvasClient } from "@/hooks/useCanvasClient.js";
import { useAddReactionMutation } from "@/hooks/useAddReactionMutation.js";
import { useRemoveReactionMutation } from "@/hooks/useRemoveReactionMutation.js";
import toast from "react-hot-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination.jsx";
import { useWallet } from "@solana/wallet-adapter-react";
import { utf8 } from "@metaplex-foundation/umi/serializers";
import { Card } from "@/components/ui/card.jsx";
import { COLLECTION_ADDRESS } from "@/constants/index.js";
import { Explorer } from "@/components/Explorer.jsx";

export const Collection = () => {
  const { publicKey, signMessage } = useWallet();

  const { client } = useCanvasClient();

  const [visiblePages, setVisiblePages] = useState([]);
  const [isImgLoading, setIsImgLoading] = useState(true);

  const getAssetsQuery = useGetAssetsQuery();

  const addReactionMutation = useAddReactionMutation();
  const removeReactionMutation = useRemoveReactionMutation();

  const { user } = useCanvasClient();

  const address = publicKey ? publicKey.toString() : null;

  const { page, setPage } = getAssetsQuery;

  const assetsQueryData =
    getAssetsQuery.data?.assets.length > 0 ? getAssetsQuery.data.assets : null;
  const maxPage = getAssetsQuery.data ? getAssetsQuery.data.maxPage : null;

  const isAssetsEmpty = getAssetsQuery.data?.assets.length === 0;

  const setInitialReaction = () => {
    const foundFirstEntry = Object.entries(assetsQueryData[0]).find(
      ([key, _]) => key === user.username,
    );

    const firstReaction = foundFirstEntry ? foundFirstEntry[1] : "";

    const initialValue = {
      [assetsQueryData[0].publicKey]: firstReaction,
    };

    return assetsQueryData.reduce((acc, curr) => {
      const foundEntry = Object.entries(curr.appDatas).find(
        ([key, _]) => key === user.username,
      );
      const reaction = foundEntry ? foundEntry[1] : "";
      return {
        ...acc,
        [curr.publicKey]: reaction,
      };
    }, initialValue);
  };

  const [selectedReaction, setSelectedReaction] = useState(() => {
    if (assetsQueryData) {
      return setInitialReaction();
    } else return null;
  });

  useEffect(() => {
    if (assetsQueryData) {
      const initialReaction = setInitialReaction();
      setSelectedReaction(initialReaction);

      if (maxPage === 1) setVisiblePages([1]);
      else if (maxPage === 2) setVisiblePages([1, 2]);
      else {
        if (page <= 2) setVisiblePages([1, 2, 3]);
        else if (page >= maxPage - 1)
          setVisiblePages([maxPage - 2, maxPage - 1, maxPage]);
        else setVisiblePages([page - 1, page, page + 1]);
      }
    }
  }, [assetsQueryData]);

  const handleReaction = async (asset, value) => {
    try {
      const signature = Array.from(
        await signMessage(utf8.serialize(user.username)),
      );

      if (!value) {
        await removeReactionMutation.mutate({
          username: user.username,
          signature,
          reaction: selectedReaction[asset.publicKey],
          userAddress: address,
          assetAddress: asset.publicKey,
          page,
        });

        setSelectedReaction({ ...selectedReaction, [asset.publicKey]: "" });
      } else {
        await addReactionMutation.mutate({
          username: user.username,
          signature,
          reaction: value,
          userAddress: address,
          assetAddress: asset.publicKey,
          page,
        });

        setSelectedReaction({ ...selectedReaction, [asset.publicKey]: value });
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
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
      {address && (
        <>
          <h2 className="text-2xl text-center">RoastMeAI NFT Collection</h2>
          <div className="text-center mb-4">
            <Explorer publicKey={COLLECTION_ADDRESS} isCollection />
          </div>
        </>
      )}
      {!address ? <div>Connect your wallet first.</div> : null}
      {address && isAssetsEmpty && (
        <div className="text-center">Collection is currently empty.</div>
      )}

      {address && getAssetsQuery.isLoading && (
        <div className="flex justify-center">
          <Loader2 className="animate-spin" />
        </div>
      )}

      {address && assetsQueryData && (
        <>
          <div className="grid grid-cols-2 gap-4">
            {selectedReaction &&
              assetsQueryData.map((asset) => {
                return (
                  <Card
                    key={asset.publicKey}
                    className="w-[360px] p-1 flex flex-col items-center"
                  >
                    {isImgLoading && (
                      <div className="flex justify-center items-center">
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
                    <ToggleGroup
                      variant="outline"
                      type="single"
                      className="flex gap-2"
                      value={selectedReaction[asset.publicKey]}
                      onValueChange={(value) => handleReaction(asset, value)}
                    >
                      <ToggleGroupItem value="sad">
                        <span className="mr-1">😭</span>
                        <span>
                          {
                            Object.values(asset.appDatas).filter(
                              (reaction) => reaction === "sad",
                            ).length
                          }
                        </span>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="fire">
                        <span className="mr-1">🔥</span>
                        <span>
                          {
                            Object.values(asset.appDatas).filter(
                              (reaction) => reaction === "fire",
                            ).length
                          }
                        </span>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="funny">
                        <span className="mr-1">🤣</span>
                        <span>
                          {
                            Object.values(asset.appDatas).filter(
                              (reaction) => reaction === "funny",
                            ).length
                          }
                        </span>
                      </ToggleGroupItem>
                    </ToggleGroup>
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
