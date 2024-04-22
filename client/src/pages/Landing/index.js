import React, { useEffect, useState } from 'react'
import EditorsPick from '../../components/EditorsPick'
import LatestBlogs from '../../components/LatestBlogs'
import Hero from '../../components/Hero';
import { storeBlogCategories } from '../../store/blogSlice';
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from '../../util/axios';


const Landing = () => {

  const api = process.env.REACT_APP_API_KEY
  const dispatch = useDispatch()
  const categories = useSelector((state) => state.blog.blogCategories)

  // const [headers, setHeaders] = useState({
  //   'Authorization': localStorage.getItem('access_token')
  // })

  const getBlogCategories = async () => {
    if(!categories.length){
      const res = await axiosInstance.get(api+'blogs/categories')
      if(res && res.data.data){
        dispatch(storeBlogCategories(res.data.data))
      }
    }
  }

  useEffect(() => {
    getBlogCategories()
  }, [])
  

  return (
    <div className='container-fluid'>
        <div className="row">
            <div className="col-12 p-0">
                <section>
                  <Hero/>
                </section>
                <section className='py-5'>
                  <LatestBlogs/>
                </section>
                <section className='py-5 bg-gray'>
                  <EditorsPick/>
                </section>
            </div>
        </div>
    </div>
  )
}

export default Landing