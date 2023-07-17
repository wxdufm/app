import Link from "next/link"
import { EventPreviewData } from "./PostPreviewData"

const EventPreview = (props: EventPreviewData) => {

    // rendered on the archive tabs
    if (!props.published) {
        return (
            <div key={props.id} className="flex flex-col gap-5 w-80 ">
            <Link href={`/archive/${props.slug}`}>
                <div>
                    <img src={props.cover} alt="" className="h-80 w-80 object-cover "/>
                    <p className="text-xl text-center h-12 font-bold">{props.title}</p>
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
        <div key={props.id} className="flex flex-col gap-5 w-80 ">
            <Link href={`/archive/${props.slug}`}>
                <div>
                    <img src={props.cover} alt="" className="h-80 w-80 object-cover "/>
                    <p className="text-xl text-center h-12 font-bold">{displayDate}: {props.title}</p>
                    <p>{props.subtitle}...</p>
                </div>
            </Link>
        </div>
    )
}

export default EventPreview;