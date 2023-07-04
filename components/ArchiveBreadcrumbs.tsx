import Crumb from "./Crumb";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useRouter } from 'next/router';
import React from 'react';
import { IoIosArrowForward } from "react-icons/io";


export default function ArchiveBreadcrumbs() {
    // Gives us ability to load the current route details
    const router = useRouter();

    
    const breadcrumbs = React.useMemo(function generateBreadcrumbs() {
 
      const asPathNestedRoutes = router.asPath.split("/").filter(v => v.length > 0);
      
      if (asPathNestedRoutes[0] === "archive") {
        asPathNestedRoutes.shift();
      }

      const crumblist = asPathNestedRoutes.map((subpath, idx) => {
        const href = "/archive/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
        const words = subpath.split('-');
        const transformedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
        const title = transformedWords.join(' ');
        
        return { href: href, text: title }; 
        
      })
      
      return [{ href: "/archive", text: "Archive" }, ...crumblist];
    }, [[router.asPath]]);
    

    return (
      <Breadcrumbs aria-label="breadcrumb" separator={<IoIosArrowForward size={18} className="ml-1 mt-0.5" />} color="white">
        {breadcrumbs.map((crumb, idx) => (
	      <Crumb {...crumb} key={idx} last={idx === breadcrumbs.length - 1}/>
	    ))}
      </Breadcrumbs>
    );
  }