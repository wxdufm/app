import Link from "next/link";

const BlogHeader = () => {
    return(
    <div className="justify-between flex lg:flex-row flex-col w-5/6 mx-auto mb-7 overflow-hidden">
        <p className="text-4xl mb-5 ">WXYC PRESS</p>
        <div className="flex flex-row flex-wrap md:text-base text-sm ">
            <div className="bg-neutral-800 flex items-center mr-3 mb-3 h-2/3 px-2 py-1 border-0 border-white rounded-3xl whitespace-nowrap" >
            <Link href="/blog/category/show-review">
                Show Reviews
            </Link>
            </div>
            
            <div className="bg-neutral-800 flex items-center mr-3 h-2/3 px-2 py-1 border-0 border-white rounded-3xl whitespace-nowrap" >
            <Link href="/blog/category/album-review">
                Album Reviews
            </Link>
            </div>
            
            <div className="bg-neutral-800 flex items-center mr-3 h-2/3 px-2 py-1 border-0 border-white rounded-3xl whitespace-nowrap" >
            <Link href="/blog/category/artist-interview">
                Artist Interviews
            </Link>
            </div>
            
        </div>
    </div>
    )
}

export default BlogHeader;