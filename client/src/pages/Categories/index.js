import axios from 'axios'
import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../../util/axios'

const Categories = () => {
  const api = process.env.REACT_APP_API_KEY

  const [categories, setCategories] = useState([])
  const [categoriesWithBlogCount, setCategoriesWithBlogCount] = useState([])
  const [hasData, setHasData] = useState(false)
  // const [headers, setHeaders] = useState({
  //   'Authorization': localStorage.getItem('access_token')
  // })


  const getCategories = async () => {
    // const res = await axios.get("/data/blogs.json")
    const res = await axiosInstance.get(`${api}blogs/categories`)
    if (res && res.data.data) {
      setCategories([...res.data.data])
    }
  }

  const getBlogCountByCategory = async () => {
    console.log('working')
    if(categories.length){
      console.log('has catg')
      categories.forEach(async (c, index) => {
        const res = await axiosInstance.get(`${api}blogs/category/${c._id}`)
        if(res && res.data.data){
          const data = { ...c, blog_count: res.data.data.length }
          console.log(data, 'done') 
          setCategoriesWithBlogCount(oldArray => [...oldArray, data] );
        }
        if(index == categories.length-1){
          console.log(index, categories.length-1, 'index')
          setHasData(true)  
        }
      })
      
    }
  }

  const generateRandomHex = () => {
    return '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
  }

  useEffect(() => {
    if(!categories.length){
      getCategories()
    }
  }, [])

  useEffect(() => {
    getBlogCountByCategory()
  }, [categories])
  


  return (
    <div className='container py-5'>
      <div className="row">
        <div className="col-12 mb-3">
          <h2>Browse by Categories</h2>
          <p>Discover the most outstanding articles in all topics of life.</p>
        </div>
        {
          hasData ?
          categoriesWithBlogCount?.map((item, index) => {
            return (
              <div className="col-3 category mb-2" key={index}> 
              <Link to={`/blogs/${item._id}`}>
                <img src="/images/covers/blog1.jpg" alt="" className='img-fluid' />
                <div className='d-flex align-items-center mt-3'>
                  <div>
                    <span className='border sphere' style={{background: generateRandomHex()}}></span>
                  </div>
                  <div className='pl-3'>
                    <h6 className='mb-0'>{item.name}</h6>
                    <small>{item.blog_count}</small>
                  </div>
                </div>
              </Link>
              </div>
            )
          })
          : "Loading"
        }

      </div>
    </div>
  )
}

export default Categories