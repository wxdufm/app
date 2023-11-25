import Link from "next/link";

// used for any pages of lists of blog posts
const PostPreview = (props) => {
  return (
    <Link href={`/blog/${props.slug}`}>
      <div
        key={props.id}
        className="flex flex-col gap-2 w-80 lg:w-[22rem] cursor-pointer"
      >
        <img
          src={props.cover}
          className="lg:w-[22rem] lg:h-[22rem] w-80 h-80 object-cover"
          alt=""
        />
        <a className="text-xl text-center h-12 font-bold">{props.title}</a>
        <p>{props.subtitle}...</p>
      </div>
    </Link>
  );
};

export default PostPreview;
