import Link from "next/link";

const BlogHeader = () => {
    return(
    <div className="flex flex-row justify-between w-5/6 mx-auto mb-7">
        <Link href="/blog">
            <p className="text-3xl cursor-pointer">WXYC PRESS</p>
        </Link>
        <div className="flex flex-row ml-auto w-1/3 justify-between">
            <Link href="/blog/category/show-review">
                Show Reviews
            </Link>
            <Link href="/blog/category/album-review">
                Album Reviews
            </Link>
            <Link href="/blog/category/artist-interview">
                Artist Interviews
            </Link>
        </div>
    </div>
    )
}

export default BlogHeader;