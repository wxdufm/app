import Link from "next/link"
import { EventPreviewData } from "./PostPreviewData"

const EventPreview = (props: EventPreviewData) => {
    return (
        <div className="archive-event" key={props.id}>
            <Link href={`/archive/${props.slug}`}>
                <div>
                    <p>{props.title}</p>
                    <img src={props.cover} alt="" width="250" height="250"/>
                    <p>{props.subtitle}...</p>
                </div>
            </Link>
        </div>
    )
}

export default EventPreview;