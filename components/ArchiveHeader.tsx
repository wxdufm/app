import Dropdown from "react-dropdown"
import * as React from "react"
import Link from "next/link";

const ArchiveHeader = (props) => {
  const [open, setOpen] = React.useState(false);
  const [subOpen, setsubOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleSubOpen = () => {
    setsubOpen(!subOpen);
  }

  return (
    <div>
    <button onClick={handleOpen}>Filter V</button>
    {open ? (
      <ul>
        <li>
          <Link href={`/archive/category/events`}>
            Events
          </Link>
        </li>
        <li>
          <div>
            <button onClick={handleSubOpen}>Specialty Shows</button>
            {subOpen ? (
            <ul>
              {props.specialtyShows.map((option) => (
              <li>
                <Link href={`/archive/category/${option.value}`}>
                  {option.label}
                </Link>
              </li>
            ))}  
            </ul>
            ) : null}
          </div>
        </li>
      </ul>
    ) : null}
    </div>
  )
}

export default ArchiveHeader