import React from "react";
import ArchiveBreadcrumbs from "./ArchiveBreadcrumbs";


const ArchiveLayout = (props) => {
 
  return (
    <div className="w-5/6 mx-auto text-white pb-10 overflow-hidden">
      <ArchiveBreadcrumbs/>
      
      {props.children}
    </div>
  );
};

export default ArchiveLayout;