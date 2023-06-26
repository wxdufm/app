import Link from "next/link";

const BlogHeader = () => {
    return(
    <div className="flex flex-row justify-between">
        <h1>WXYC PRESS</h1>
        <div className="flex flex-row">
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