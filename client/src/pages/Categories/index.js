import axios from 'axios'
import React from 'react'
import { useState, useEffect } from 'react'

const Categories = () => {
  const [categories, setCategories] = useState([])

  const getCategories = async () => {
    const res = await axios.get("/data/blogs.json")
    if(res && res.data){
      console.log(res.data)
    }
  }
 
  useEffect(() => {
    getCategories()
  }, [])
  
  
  return (
    <div className='container py-5'>
      <div className="row">
        <div className="col-12 mb-3">
            <h2>Latest Blogs</h2>
            <p>Discover the most outstanding articles in all topics of life.</p>
        </div>
        <div className="col-3 category">
          <img src="/images/covers/blog1.jpg" alt="" className='img-fluid' />
          <div className='d-flex align-items-center mt-3'>
            <div>
              <span className='border sphere'></span>  
            </div> 
            <div className='pl-3'>
              <h5 className='mb-0'>Industrial</h5>
              <small>12 Blogs</small>  
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Categories