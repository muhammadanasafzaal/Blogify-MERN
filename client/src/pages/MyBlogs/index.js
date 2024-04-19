import React from 'react'
import Blogs from '../Blogs'

const MyBlogs = () => {

    const userId = JSON.parse(localStorage.getItem('user'))?.id
    
  return (
    <div>
        <Blogs userId={userId} />
    </div>
  )
}

export default MyBlogs