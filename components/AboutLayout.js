import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

// sidebar menu for about subpages
const AboutLayout = ({ children }) => {
  const currentRoute = useRouter().asPath;

  return (
    <div className="md:w-5/6 w-full mx-auto text-white flex md:flex-row flex-col pb-10">
      {/* active route is about */}
      {currentRoute === "/about" && (
        <div className="kallisto flex md:flex-col flex-row md:w-1/5 w-full ml-2 mr-2 md:mr-2 md:ml-2 h-14 md:h-full justify-between mx-auto md:mx-0 mb-10 md:mb-0 text-xl bg-gradient-to-b from-neutral-900 to-black">
          <div className="w-full text-center md:text-left px-6 py-4 bg-neutral-700 hover:bg-neutral-500">
            <Link href="/about">About</Link>
          </div>
          <div className="w-full text-center md:text-left px-6 py-4 hover:bg-neutral-500 text-neutral-400 hover:text-white">
            <Link href="/about/history">History</Link>
          </div>
          <div className="w-full text-center md:text-left px-6 py-4 hover:bg-neutral-500 text-neutral-400 hover:text-white">
            <Link href="/about/mission">Mission</Link>
          </div>
        </div>
      )}
      {/* active route is history */}
      {currentRoute === "/about/history" && (
        <div className="kallisto flex md:flex-col flex-row md:w-1/5 w-full ml-2 mr-2 md:mr-2 md:ml-2 h-14 md:h-full justify-between mx-auto md:mx-0 mb-10 md:mb-0 text-xl bg-gradient-to-b from-neutral-900 to-black">
          <div className="w-full text-center md:text-left px-6 py-4 hover:bg-neutral-500 text-neutral-400 hover:text-white">
            <Link href="/about">About</Link>
          </div>
          <div className="w-full text-center md:text-left px-6 py-4 bg-neutral-700 hover:bg-neutral-500">
            <Link href="/about/history">History</Link>
          </div>
          <div className="w-full text-center md:text-left px-6 py-4 hover:bg-neutral-500 text-neutral-400 hover:text-white">
            <Link href="/about/mission">Mission</Link>
          </div>
        </div>
      )}
      {/* active route is mission */}
      {currentRoute === "/about/mission" && (
        <div className="kallisto flex md:flex-col flex-row md:w-1/5 w-full ml-2 mr-2 md:mr-2 md:ml-2 h-14 md:h-full justify-between mx-auto md:mx-0 mb-10 md:mb-0 text-xl bg-gradient-to-b from-neutral-900 to-black">
          <div className="w-full text-center md:text-left px-6 py-4 hover:bg-neutral-500 text-neutral-400 hover:text-white">
            <Link href="/about">About</Link>
          </div>
          <div className="w-full text-center md:text-left px-6 py-4 hover:bg-neutral-500 text-neutral-400 hover:text-white">
            <Link href="/about/history">History</Link>
          </div>
          <div className="w-full text-center md:text-left px-6 py-4 bg-neutral-700 hover:bg-neutral-500">
            <Link href="/about/mission">Mission</Link>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default AboutLayout;
