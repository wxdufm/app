import React from "react";
import ArchiveBreadcrumbs from "./ArchiveBreadcrumbs";
import Link from "next/link";
import { useRouter } from "next/router";

const AboutLayout = ({children}) => {

const currentRoute = useRouter().asPath;
 
  return (
    <div className="md:w-5/6 w-full mx-auto text-white flex">

      {currentRoute === "/about" &&
        <div className="flex flex-col w-1/5 text-xl bg-gradient-to-b from-neutral-900 to-black">
            <div className="px-6 py-4 bg-neutral-700 hover:bg-neutral-500"><Link href="/about">About</Link></div>
            <div className="px-6 py-4 hover:bg-neutral-500 text-neutral-400 hover:text-white"><Link href="/about/history">History</Link></div>
            <div className="px-6 py-4 hover:bg-neutral-500 text-neutral-400 hover:text-white"><Link href="/about/mission">Mission</Link></div>
        </div>
      }

      {currentRoute === "/about/history" &&
        <div className="flex flex-col w-1/5 text-xl bg-gradient-to-b from-neutral-900 to-black">
            <div className="px-6 py-4 hover:bg-neutral-500 text-neutral-400 hover:text-white"><Link href="/about">About</Link></div>
            <div className="px-6 py-4 bg-neutral-700 hover:bg-neutral-500"><Link href="/about/history">History</Link></div>
            <div className="px-6 py-4 hover:bg-neutral-500 text-neutral-400 hover:text-white"><Link href="/about/mission">Mission</Link></div>
        </div>
      }

      {currentRoute === "/about/mission" &&
        <div className="flex flex-col w-1/5 text-xl bg-gradient-to-b from-neutral-900 to-black">
            <div className="px-6 py-4 hover:bg-neutral-500 text-neutral-400 hover:text-white"><Link href="/about">About</Link></div>
            <div className="px-6 py-4 hover:bg-neutral-500 text-neutral-400 hover:text-white"><Link href="/about/history">History</Link></div>
            <div className="px-6 py-4 bg-neutral-700 hover:bg-neutral-500"><Link href="/about/mission">Mission</Link></div>
        </div>
      }
      {children}
    </div>
  );
};

export default AboutLayout;