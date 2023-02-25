import React from "react";
import { useDisconnect, useMetamask, useAddress } from "@thirdweb-dev/react";
import { GetServerSideProps } from "next";
import { sanityClient, urlFor } from "../../sanity";
import { Collection } from "../../typings";

type Props = {
  collection: Collection[];
};

const NFTDropPage = ({ collection }: Props) => {
  //Auth
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();

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
            <h1 className="text-4xl font-bold text-white">CRAZY APES</h1>
            <h2 className="text-xl text-gray-300">
              A collection of crazy apes who live & breathe in Metaverse!
            </h2>
          </div>
        </div>
      </div>
      {/* Right Side */}
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        {/* Header of Right Side */}
        <header className="flex items-center justify-between">
          <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
            The{" "}
            <span className="font-extrabold underline decoration-pink-600/50">
              CRAZY
            </span>{" "}
            Apes NFT Market Place
          </h1>

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

          <p className="pt-2 text-xl text-green-500">13/21 NFT's claimed</p>
        </div>

        {/* Mint Button */}
        <button
          className="mt-10 h-16 bg-red-600/80 w-full text-white 
        rounded-full font-bold"
        >
          Mint NFT (0.001 MATIC)
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
