import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type Props = {};

const SuccessfulMintPage = (props: Props) => {
  const router = useRouter();
  const { name, image, description, owner, supply } = router.query;

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/* Left Side */}
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="bg-gradient-to-br from-yellow-400 to-purple-600 p-2 rounded-xl">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src={`${image}`}
              alt={`${name}`}
            />
          </div>
          <div className="text-center p-5 space-y-6">
            <h1 className="text-4xl font-bold text-white">
              {description} {name}
            </h1>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
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
        </header>

        {/* Content of Right Side */}
        <div
          className="mt-10 flex flex-1 flex-col items-center 
        space-y-6 text-center lg:space-y-0 justify-center"
        >
          <h1 className="text-4xl font-bold lg:text-5xl lg:font-extrabold text-green-500">
            ! CONGRATULATION !
          </h1>
          <p className="text-base font-bold lg:text-xl lg:font-extrabold text-center text-rose-400">
            {owner?.slice(0, 5) + "..." + owner?.slice(-5)}
          </p>

          <p className="text-2xl font-bold lg:text-4xl lg:font-extrabold text-gray-400">
            You successful minted x{supply} NFT
          </p>
          <span className="text-lg font-bold lg:text-xl lg:font-extrabold text-gray-300">
            From collection: {description}
          </span>
        </div>

        {/* NAVIGATION BUTTONS */}
        <div
          className="flex items-end 
       text-center  justify-center"
        >
          <button
            onClick={() => router.back()}
            className="bg-gradient-to-br from-cyan-800 to-rose-500 p-5 rounded-3xl"
          >
            <p className="text-white font-bold text-lg">
              Let's mint another one
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessfulMintPage;

// metadata.description, metadata.name , metadata.image,
// owner
// supply
