import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { PostService } from "../../services/post.service"
import { PostItem } from '../../components/postItem/PostItem';

import HomeCSS from './Home.module.css'


export const Home = () => {

   const [ resPostList, setPostList ] = useState([])

  
  useEffect(() => {

    PostService.overview()
        .then(setPostList)
        //.catch(err => setError(err.message))


  },[])


  
  return (
    <div key='1'>
        <h2>HOME PAGE /// ULTIMOS POSTS</h2>

           <div className={HomeCSS.item}>
        
                {resPostList.map((post) => (
                  <>
                    {/* {console.log("EA" , post)} */}

                    <Link to={'/post/'+ post._id}>
                      <PostItem 
                        id={post._id}
                        title={post.title}
                        exerpt={post.content_blocks[0].valor}
                        date={post.date}
                        key={post._id}
                      />
                  </Link>
                  </>
                ))} 
              </div>
    </div>
  )
}
