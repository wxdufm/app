"use client"
import {Layout} from '../components/Layout'
import { useState, useEffect } from 'react'
import { useTina } from 'tinacms/dist/react'
import { client } from '../tina/__generated__/client'


// Tbh I don’t think for a site like this one you’re going to see improvements that matter 
// - just code it up in a way that is easy for you. If you’re worried about event 
// accumulation make sure you are using your useEffect returns to clear event listeners 
// and useCallback/useMemo + local storage to avoid multiple calls to data that persists 
// through a session. Since you’re already using a CMS the performance is mostly in Tina’s hands.

export default function BlogPostPage() {
  const [postQuery, setPostQuery] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [endCursor, setEndCursor] = useState("cG9zdCNkYXRlIzE2NTc4Njg0MDAwMDAjY29udGVudC9wb3N0cy9hbm90aGVyUG9zdC5qc29u");
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      try {
      const res = await client.request({
        query: `
          query getContent($endCursor: String) {
            blogConnection(sort: "published", last: 5, before: $endCursor){
              pageInfo {
                hasPreviousPage
                hasNextPage
                startCursor
                endCursor
              }
              edges {
                node {
                  id
                  title
                  cover
                  published
                  description
                  _sys {
                    filename
                  }
                }
              }
            }
          }
        `,
        variables: 
          {
            cursor: endCursor
          }   
      })
      if (res.data) {
        if (res.data.length === 0) {
          setCanLoadMore(false);
        } else {
          setBlogPosts((prevPosts) => [...prevPosts, ...res.data]);
          setCurrentPage((prevPage) => prevPage + 1);
        }
        const jsonData = JSON.stringify(res.data);
        console.log(jsonData);
        const data = JSON.parse(jsonData);
        setPostQuery(data);
      } else {
        console.error('Invalid response format:', res);
      }
    } catch(error) {
      console.error(error)
    }
    }
    fetchContent()
  }, [endCursor])

  // useEffect(() => {
  //   if (postQuery) {
  //     const data = JSON.parse(postQuery);
  //     if (data) {
  //       setPosts(data.blogConnection.edges);
  //       console.log("data!");
  //     } else {
  //       console.log("no data");
  //     }
  //   }
  // }, [postQuery]);

 


  
  if (postQuery) {
    console.log("data!")
    console.log(postQuery.blogConnection.edges)
    if (postQuery.blogConnection.pageInfo.hasPreviousPage) {
      setCanLoadMore(true)
      setEndCursor(postQuery.blogConnection.pageInfo.endCursor)
    } else {
      setCanLoadMore(false)
    }
  } else if (!postQuery) {
    console.log("no data")
  }

  

  return (
    <Layout>
    <div>
      {JSON.stringify(postQuery)}
      <div>
      {postQuery ? (
        <div>
          <p>Data:</p>
          <pre>{postQuery.blogConnection.edges.map((post) => (
            <div key={post.node.id}>
              <p>{post.node.title}</p>
            </div>
          ))}</pre>
        </div>
      ) : (
        <p>No data</p>
      )}
    </div> 
      {/* {posts.map((post) => (
        <div>
          <p>{post.node.title}</p>
        </div>
      ))} */}
      <p>hi</p>
    </div>
    </Layout>
  )
}