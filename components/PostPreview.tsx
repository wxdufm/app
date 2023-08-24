import Link from "next/link";
import { PostPreviewData} from "./PostPreviewData";

const PostPreview = (props: PostPreviewData) => {
    return(
      <Link href={`/blog/${props.slug}`}>
        <div key={props.id} className="flex flex-col gap-2 w-[22rem] cursor-pointer">
          <img src={props.cover} className="w-[22rem] h-[22rem] object-cover" alt=""/>
          <a className="text-xl text-center h-12 font-bold">{props.title}</a>
          <p>{props.subtitle}...</p>
        </div>
      </Link>
    )

}

export default PostPreview;