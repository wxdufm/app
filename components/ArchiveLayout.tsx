import React from "react";
import ArchiveBreadcrumbs from "./ArchiveBreadcrumbs";
import ArchiveDropdown from "./ArchiveDropdown";


const ArchiveLayout = (props) => {
 
  return (
    <div className="w-5/6 mx-auto text-white">
      <ArchiveBreadcrumbs/>
      {/* {props.specialtyShows && <ArchiveDropdown specialtyShows={props.specialtyShows}/>} */}
      {props.children}
    </div>
  );
};

export default ArchiveLayout;