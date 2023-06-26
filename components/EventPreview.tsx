import Link from "next/link"
import { EventPreviewData } from "./PostPreviewData"

const EventPreview = (props: EventPreviewData) => {

    if (!props.published) {
        return (
            <div key={props.id} className="flex flex-col gap-5 w-80">
            <Link href={`/archive/${props.slug}`}>
                <div>
                    <img src={props.cover} alt="" className="h-80 w-80 object-cover"/>
                    <h3>{props.title}</h3>
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

    return (
        <div key={props.id} className="archive-event">
            <Link href={`/archive/${props.slug}`}>
                <div>
                    <img src={props.cover} alt="" width="250" height="250"/>
                    {props.published && <h3>{displayDate}: {props.title}</h3>}
                    {!props.published && <h3>{props.title}</h3>}
                    <p>{props.subtitle}...</p>
                </div>
            </Link>
        </div>
    )
}

export default EventPreview;