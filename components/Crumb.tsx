import {Typography} from "@mui/material"
import Link from "next/link";

// Each individual "crumb" in the breadcrumbs list
export default function Crumb({ text, href, last=false }) {
  
    // Blog header on blog home page
    if (last && text === "WXYC PRESS") {
      return <Typography className="text-4xl text-pink-400">{text}</Typography>
    }
    //Blog header when you're not on blog home page (links back to blog home page)
    if (!last && text === "WXYC PRESS") {
      return (
        <Link href={href}>
          <p className="text-red-300 hover:underline text-4xl">{text}</p>
        </Link>
      );
    }

    // Archive header on archive home page
    if (last && text === "Archive") {
      return <Typography className="text-4xl text-pink-400">{text}</Typography>
    }
    //Archive header when you're not on archive home page (links back to archive home page)
    if (!last && text === "Archive") {
      return (
        <Link href={href}>
          <p className="text-red-300 hover:underline text-4xl">{text}</p>
        </Link>
      );
    }

    //when the crumb doesn't link anywhere (b/c it's category or ur currently on the page)
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
