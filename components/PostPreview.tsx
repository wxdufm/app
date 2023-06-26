import Link from "next/link";
import { PostPreviewData} from "./PostPreviewData";

const PostPreview = (props: PostPreviewData) => {
    return(
    <div key={props.id} className="flex flex-col gap-5 w-96">
        <img src={props.cover} className="h-96 w-96 object-cover" alt=""/>
        <Link href={`/blog/${props.slug}`}>
          <a>{props.title}</a>
        </Link>
        <p>{props.subtitle}</p>
      </div>
    )

}

export default PostPreview;