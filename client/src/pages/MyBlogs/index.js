import React, { useState } from 'react'
import Blogs from '../Blogs'

const MyBlogs = () => {

    const [category, setCategory] = useState("")
    
  return (
    <div>
        <Blogs category={category} />
    </div>
  )
}

export default MyBlogs