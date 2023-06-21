import Link from "next/link"
import { EventPreviewData } from "./PostPreviewData"

const EventPreview = (props: EventPreviewData) => {
    return (
        <div className="archive-event" key={props.id}>
            <Link href={`/archive/${props.slug}`}>
                <div>
                    <img src={props.cover} alt="" width="250" height="250"/>
                    <h3>{props.title}</h3>
                    <p>{props.subtitle}...</p>
                </div>
            </Link>
        </div>
    )
}

export default EventPreview;