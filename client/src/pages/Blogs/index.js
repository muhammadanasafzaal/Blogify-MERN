import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

const Blogs = ({ category }) => {

    const api = process.env.REACT_APP_API_KEY
    const [blogs, setBlogs] = useState([])

    const getBlogs = async () => {
        try {
            const res = await axios.get(api+'blogs/');
            if (res && res.data) {
                if (res.data.length) {
                    setBlogs([...res.data])
                    console.log(res.data)
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getBlogs()
    }, [])


    return (
        <div className='container py-5'>
            <div className="row">
                {blogs?.map((item, index) => {
                    return (
                        <div className='col-md-4 col-12 blog mb-5' key={index}>
                            <div className='cover mb-3'>
                                <span className='category-badge'>{item.category}</span>
                                <img src={item.cover} alt={item.title} className="img-fluid cover-img" />
                            </div>
                            <div className='mb-3'>
                                <span>
                                    <img src={item.author_img} alt="" className='img-fluid author-img' />
                                    <span className='ml-2'>
                                        {item.author}
                                    </span>
                                </span>
                                <small className='ml-1'>- {item.date}</small>
                            </div>
                            <h4>{item.title}</h4>
                            <p>{item.excerpt}</p>
                            <hr />
                            <div className='feedback'>
                                <span>
                                    <i className='fa fa-heart mr-1'></i>
                                    {item.likes}
                                </span>
                                <span className='ml-3'>
                                    <i className='fa fa-comment mr-1'></i>
                                    {item.comments}
                                </span>
                            </div>
                        </div>
                    )
                })}

            </div>
        </div>
    )
}

export default Blogs