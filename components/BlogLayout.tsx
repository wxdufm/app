import Link from "next/link";
import BlogBreadcrumbs from "./BlogBreadcrumbs";
import BlogHeader from "./BlogHeader";


const BlogLayout = ({children}) => {
    
    return(

        <div>
            <div className="pt-3 md:pt-0 mx-auto h-32 md:h-24 items-center justify-between w-5/6 flex flex-col md:flex-row">
                <BlogBreadcrumbs/>

                <div className=" flex flex-row h-1/3 md:h-1/2 justify-center md:justify-end  items-center w-full md:w-1/2 text-sm">
                    <div className="bg-gradient-to-b  from-neutral-700 border-0 rounded-3xl to-neutral-900 mx-2 md:mr-0 whitespace-nowrap px-2 h-full flex flex-col justify-center" >
                        <Link href="/blog/category/show-review">
                            Show Reviews
                        </Link>
                    </div>
            
                    <div className="bg-gradient-to-b from-neutral-700 border-0 rounded-3xl to-neutral-900 mx-2 md:mr-0 whitespace-nowrap px-2 h-full flex flex-col justify-center" >
                        <Link href="/blog/category/album-review">
                            Album Reviews
                        </Link>
                    </div>
            
                    <div className="bg-gradient-to-b from-neutral-700 border-0 rounded-3xl to-neutral-900 mx-2 md:mr-0 whitespace-nowrap px-2  h-full flex flex-col justify-center" >
                        <Link href="/blog/category/artist-interview">
                            Artist Interviews
                        </Link>
                    </div>
            
                </div>
            </div>

            {children}
            
        </div>
    )
}

export default BlogLayout;