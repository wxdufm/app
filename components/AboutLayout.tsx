import React from "react";
import ArchiveBreadcrumbs from "./ArchiveBreadcrumbs";
import Link from "next/link";
import { useRouter } from "next/router";

const AboutLayout = ({children}) => {

const currentRoute = useRouter().asPath;
 
  return (
    <div className="w-5/6 mx-auto text-white flex">

      {currentRoute === "/about" &&
        <div className="flex flex-col">
            <Link href="/about"><u>About</u></Link>
            <Link href="/about/history">History</Link>
            <Link href="/about/mission">Mission</Link>
        </div>
      }

      {currentRoute === "/about/history" &&
        <div className="flex flex-col">
            <Link href="/about">About</Link>
            <Link href="/about/history"><u>History</u></Link>
            <Link href="/about/mission">Mission</Link>
        </div>
      }

      {currentRoute === "/about/mission" &&
        <div className="flex flex-col">
            <Link href="/about">About</Link>
            <Link href="/about/history">History</Link>
            <Link href="/about/mission"><u>Mission</u></Link>
        </div>
      }
      {children}
    </div>
  );
};

export default AboutLayout;