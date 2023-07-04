import Link from "next/link";
import BlogBreadcrumbs from "./BlogBreadcrumbs";



const BlogLayout = ({children}) => {
    
    return(

        <div>
            <div className="flex flex-row justify-between w-5/6 mx-auto mb-7">
        {/* <Link href="/blog">
            <p className="text-3xl cursor-pointer">WXYC PRESS</p>
        </Link> */}
                <BlogBreadcrumbs/>
                <div className="flex flex-row ml-auto w-1/3 justify-between">
                    <Link 
                        href="/blog/category/show-review"
                        scroll={false}
                    >
                        Show Reviews
                    </Link>
                    <Link 
                        href="/blog/category/album-review"
                        scroll={false}
                    >
                        Album Reviews
                    </Link>
                    <Link 
                        href="/blog/category/artist-interview"
                        scroll={false}
                    >
                        Artist Interviews
                    </Link>
                </div>
            </div>
            {children}
        </div>
    )
}

export default BlogLayout;