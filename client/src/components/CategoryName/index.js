import { useSelector } from 'react-redux'
import React, { useState, useEffect } from 'react'

const GetCategoryName = ({ catId }) => {
    const categories = useSelector((state) => state.blog.blogCategories)

    const [categoryName, setCategoryName] = useState('')
    const getCategoryName = () => {
        console.log(catId)
        const cName = categories.filter(c => c._id == catId)
        console.log(cName)
        if(cName.length) setCategoryName(cName[0].name)
    }

    useEffect(() => {
        getCategoryName()
    }, [catId])
    

  return (
    <>
        { categoryName }
    </>
  )
}

export default GetCategoryName