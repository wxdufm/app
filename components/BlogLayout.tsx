import Link from "next/link";
import BlogBreadcrumbs from "./BlogBreadcrumbs";
import BlogHeader from "./BlogHeader";


const BlogLayout = ({children}) => {
    
    return(

        <div>
            <div className=" w-5/6 mx-auto">
                <BlogBreadcrumbs/>

                
            </div>

            {children}
            
        </div>
    )
}

export default BlogLayout;