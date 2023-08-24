import Link from "next/link"
import { EventPreviewData } from "./PostPreviewData"

const EventPreview = (props: EventPreviewData) => {

    // rendered on the archive tabs
    if (!props.published) {
        return (
            <div key={props.id} >
            <Link href={`/archive/${props.slug}`}>
                <div className="flex flex-col gap-2 w-[22rem] cursor-pointer">
                    <img src={props.cover} alt="" className="h-[22rem] w-[22rem] object-cover "/>
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
                <div className="flex flex-col gap-2 w-80 cursor-pointer">
                    <img src={props.cover} alt="" className="h-80 w-80 object-cover "/>
                    <a className="text-xl text-center h-12 font-bold">{displayDate}: {props.title}</a>
                    <p>{props.subtitle}...</p>
                </div>
            </Link>
        </div>
    )
}

export default EventPreview;