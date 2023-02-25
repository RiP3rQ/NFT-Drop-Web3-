import React, { useEffect, useState } from "react";
import {
  useDisconnect,
  useMetamask,
  useAddress,
  useContract,
  useNetwork,
  useNetworkMismatch,
  ChainId,
} from "@thirdweb-dev/react";
import { GetServerSideProps } from "next";
import { sanityClient, urlFor } from "../../sanity";
import { Collection } from "../../typings";
import Link from "next/link";
import { BigNumber } from "ethers";
import { InfinitySpin } from "react-loader-spinner";

type Props = {
  collection: Collection[];
};

const NFTDropPage = ({ collection }: Props) => {
  const [claimedSupply, setClaimedSupply] = useState<number>(0);
  const [totalSupply, setTotalSupply] = useState<BigNumber>();
  const { contract: nftDrop } = useContract(collection.address, "nft-drop");
  const [loading, setLoading] = useState<boolean>(true);
  const [priceInMatic, setPriceInMatic] = useState<string>("");

  // Switch Networks if wrong
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  // ---

  // Auth
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();
  // ---

  // fetch price for minting
  useEffect(() => {
    if (!nftDrop) return;

    const fetchPrice = async () => {
      const claimCondition = await nftDrop.claimConditions.getAll();
      setPriceInMatic(claimCondition?.[0].currencyMetadata.displayValue);
    };

    fetchPrice();
  }, [nftDrop]);
  // ---

  // fetching supply of the NFT Drop
  useEffect(() => {
    if (!nftDrop) return;

    const fetchNFTDropData = async () => {
      setLoading(true);
      const claimed = await nftDrop.getAllClaimed();
      const total = await nftDrop.totalSupply();

      setClaimedSupply(claimed.length);
      setTotalSupply(total);

      setLoading(false);
    };

    fetchNFTDropData();
  }, [nftDrop]);
  // ---

  const mintNft = () => {
    if (!nftDrop || !address) return;

    if (networkMismatch) {
      switchNetwork && switchNetwork(ChainId.Mumbai);
      return;
    }

    const quantity = 1; // how many unique NFT to mint

    setLoading(true);

    nftDrop
      ?.claimTo(address, quantity)
      .then(async (tx) => {
        const receipt = tx[0].receipt; // the transaction receipt
        const claimedTokenId = tx[0].id; // the id of the NFT claimed
        const claimedNFT = await tx[0].data(); // (optional) get the claimed NFT metadata from the

        console.log(receipt);
        console.log(claimedTokenId);
        console.log(claimedNFT);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/* Left Side */}
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="bg-gradient-to-br from-yellow-400 to-purple-600 p-2 rounded-xl">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src={urlFor(collection.previewImage).url()}
              alt={collection.title}
            />
          </div>
          <div className="text-center p-5 space-y-6">
            <h1 className="text-4xl font-bold text-white">
              {collection.nftCollectionName}
            </h1>
            <h2 className="text-xl text-gray-300">{collection.description}</h2>
          </div>
        </div>
      </div>
      {/* Right Side */}
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        {/* Header of Right Side */}
        <header className="flex items-center justify-between">
          <Link href="/">
            <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
              The{" "}
              <span className="font-extrabold underline decoration-pink-600/50">
                RIP3RQ
              </span>{" "}
              NFT Market Place
            </h1>
          </Link>

          <button
            onClick={() => (address ? disconnect() : connectWithMetamask())}
            className="rounded-full bg-rose-400 px-4 py-2
           text-white text-sm font-bold lg:px-5 lg:py-3 lg:text-base"
          >
            {address ? "Disconnect" : "Connect"}
          </button>
        </header>

        <hr className="my-2 border" />

        {address && (
          <p className="text-center text-sm text-rose-400">
            You're logged in with wallet{" "}
            {address.slice(0, 5) + "..." + address.slice(-5)}
          </p>
        )}

        {/* Content of Right Side */}
        <div
          className="mt-10 flex flex-1 flex-col items-center 
        space-y-6 text-center lg:space-y-0 lg:justify-center"
        >
          <img
            className="w-80 object-cover pb-10 lg:h-40"
            src={urlFor(collection.mainImage).url()}
            alt="apes collection"
          />

          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            {collection.title}
          </h1>

          {loading ? (
            <p className="pt-2 text-xl text-green-500 animate-pulse">
              Loading supply count ...
            </p>
          ) : (
            <p className="pt-2 text-xl text-green-500">
              {claimedSupply}/{totalSupply?.toString()} NFT's claimed
            </p>
          )}

          {loading && <InfinitySpin width="200" color="#4fa94d" />}
        </div>

        {/* Mint Button */}
        <button
          onClick={mintNft}
          disabled={
            loading || claimedSupply === totalSupply?.toNumber() || !address
          }
          className="mt-10 h-16 bg-red-600/80 w-full text-white 
        rounded-full font-bold disabled:bg-gray-400"
        >
          {loading ? (
            <>loading</>
          ) : claimedSupply === totalSupply?.toNumber() ? (
            <>SOLD OUT</>
          ) : !address ? (
            <>CONNECT WALLET</>
          ) : (
            <div>Mint NFT ({priceInMatic}MATIC)</div>
          )}
        </button>
      </div>
    </div>
  );
};

export default NFTDropPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `
      * [ _type == 'collection' && slug.current == $id][0] {
      _id,
        title,
        address,
        description,
        nftCollectionName,
        mainImage {
        asset
        },
      previewImage {
        asset
      },
      slug {
        current
      },
      creator -> {
        _id,
        name,
        address,
        slug {
          current
        }
      }
    }`;

  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  });

  if (!collection) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      collection,
    },
  };
};
