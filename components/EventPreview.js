import Link from "next/link"

const EventPreview = (props) => {

    // rendered on the archive tabs
    if (!props.published) {
        return (
            <div className=" w-full flex" key={props.id} >
            <Link href={`/archive/${props.slug}`}>
                <div className="flex flex-col gap-2 w-72 md:w-80 lg:w-[22rem] cursor-pointer">
                    <img src={props.cover} alt="" className="h-72 w-72 md:h-80 md:w-80 lg:h-[22rem] lg:w-[22rem] object-cover "/>
                    <a className="text-xl text-center h-12 font-bold">{props.title}</a>
                    <p>{props.subtitle}...</p>
                </div>
            </Link>
        </div>
        )
    }

    
    const date = new Date(props.published).toISOString();
    const arr = date.split("-");
    const arrTime = arr[2].split("T");
    const displayDate = `${arr[1]}/${arrTime[0]}`

    // rendered on home page with "xx/xx"
    return (
        <div key={props.id} >
           <Link href={`/archive/${props.slug}`}>
                <div className="flex flex-col gap-2 w-72 md:w-80 lg:w-[22rem] cursor-pointer">
                    <img src={props.cover} alt="" className="h-72 w-72 md:h-80 md:w-80 lg:h-[22rem] lg:w-[22rem] object-cover "/>
                    <a className="text-xl text-center h-12 font-bold">{props.title}</a>
                    <p>{props.subtitle}...</p>
                </div>
            </Link>
        </div>
    )
}

export default EventPreview;