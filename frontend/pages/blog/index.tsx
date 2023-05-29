// frontend/pages/index.tsx

import Link from 'next/link'
import groq from 'groq'
import client from '@/client'
import RootLayout from '@/app/layout'

const home = {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "row"

}



const BlogIndex = ({posts}) => {
    return (
      <RootLayout>
        <div style={home}>
            <div>
                <h1>WXYC</h1>
                {/* TODO Blog Carousel */}
                {posts.length > 0 && posts.map(
                ({ _id, title = '', slug = '', publishedAt = '' }) =>
                    slug && (
                    <li key={_id}>
                        <Link href={`/blog/post/${encodeURIComponent(slug.current)}`}>
                        {title}
                        </Link>{' '}
                        ({new Date(publishedAt).toDateString()})
                    </li>
                )

                // TODO Archive carousel

                // TODO image gallery
            )} 
            </div>
            

        
        </div>

      </RootLayout>
    )
}

export async function getStaticProps() {
     const posts = await client.fetch(groq`
       *[_type == "post"]`)
     return {
       props: {
         posts
       }
     }
 }

export default BlogIndex