import {Typography} from "@mui/material"
import Link from "next/link";

// Each individual "crumb" in the breadcrumbs list
export default function Crumb({ text, href, last=false }) {
    // The last crumb is rendered as normal text since we are already on the page
    if (last || text === "Category") {
        return <Typography color="white">{text}</Typography>
    }
  
    // All other crumbs will be rendered as links that can be visited 
    return (
      <Link href={href}>
        <p className="text-red-300 hover:underline">{text}</p>
      </Link>
    );
  }

//   NO MORE CATEGORY FOLDER; MOVE EVENTS INTO ARCHIVE, AND MAKE A SPECIALTY SHOW FOLDER WITH AN INDEX AND A SLUG