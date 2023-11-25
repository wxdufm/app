import Crumb from "./SingleCrumb";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useRouter } from "next/router";
import React from "react";
import { IoIosArrowForward } from "react-icons/io";

export default function BlogBreadcrumbs() {
  // get current route details
  const router = useRouter();

  const breadcrumbs = React.useMemo(
    function generateBreadcrumbs() {
      const asPathNestedRoutes = router.asPath
        .split("/")
        .filter((v) => v.length > 0);

      // remove "blog" from breadcrumbs to not interfere w/ styled title on main page
      if (asPathNestedRoutes[0] === "blog") {
        asPathNestedRoutes.shift();
      }

      const crumblist = asPathNestedRoutes.map((subpath, idx) => {
        // put blog back in the route so everything links correctly
        const href = "/blog/" + asPathNestedRoutes.slice(0, idx + 1).join("/");

        // format crumb labels
        const words = subpath.split("-");
        const transformedWords = words.map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1)
        );
        let title = transformedWords.join(" ");

        // "show review(s)", "artist interview(s)", etc.
        if (idx === 1) {
          title = title + "s";
        }

        return { href: href, text: title };
      });

      // put blog breadrumb back on non-index blog pages
      return [{ href: "/blog", text: "WXYC PRESS" }, ...crumblist];
    },
    [[router.asPath]]
  ); // re-run every time route changes

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<IoIosArrowForward size={18} className="ml-1 mt-0.5" />}
      color="white"
    >
      {breadcrumbs.map((crumb, idx) => (
        <Crumb {...crumb} key={idx} last={idx === breadcrumbs.length - 1} />
      ))}
    </Breadcrumbs>
  );
}
