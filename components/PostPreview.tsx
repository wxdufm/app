import Link from "next/link";
import { PostPreviewData} from "./PostPreviewData";

const PostPreview = (props: PostPreviewData) => {
    return(
    <div key={props.id} className="blog-post">
        <img src={props.cover} width="275px" height="275px" alt=""/>
        <Link href={`/blog/${props.slug}`}>
          <a>{props.title}</a>
        </Link>
        <p>{props.subtitle}</p>
      </div>
    )

}

export default PostPreview;