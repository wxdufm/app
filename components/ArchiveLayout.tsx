import React from "react";
import ArchiveBreadcrumbs from "./ArchiveBreadcrumbs";


const ArchiveLayout = ({children}) => {
 
  return (
    <div className="w-5/6 mx-auto text-white">
      {/* Add any additional layout elements specific to the archive pages */}
      <ArchiveBreadcrumbs/>
      {children}
    </div>
  );
};

export default ArchiveLayout;