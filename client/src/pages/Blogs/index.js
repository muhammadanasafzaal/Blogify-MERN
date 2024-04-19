import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import GetCategoryName from '../../components/CategoryName'
import FormatDate from '../../components/FormatDate'
import axiosInstance from '../../util/axios'


const Blogs = ({ userId }) => {

    const api = process.env.REACT_APP_API_KEY
    const { categoryId } = useParams()

    const [blogs, setBlogs] = useState([])
    // const [headers, setHeaders] = useState({
    //     'Authorization': localStorage.getItem('access_token')
    // })

    const getBlogs = async () => {
        if (categoryId) {
            const res = await axiosInstance.get(`${api}blogs/category/${categoryId}`);
            if (res && res.data.data) {
                if (res.data.data.length) {
                    setBlogs([])
                    setBlogs([...res.data.data])
                    console.log(res.data.data)
                }
            }
            console.log('blogs by cat')
        }
        else if (userId) {
            const res = await axiosInstance.get(`${api}blogs/user/${userId}`);
            if (res && res.data.data) {
                if (res.data.data.length) {
                    setBlogs([])
                    setBlogs([...res.data.data])
                    console.log(res.data.data)
                }
            }
            console.log('blogs by user')
        }
    }

    useEffect(() => {
        getBlogs()
    }, [])


    return (
        <div className='container py-5'>
            <h4 className='mb-4'>{categoryId ? <> Blogs In <GetCategoryName catId={categoryId} /> </> : userId ? 'Your Blogs' : ""} </h4>
            <div className="row">
                {blogs?.map((item, index) => {
                    return (
                        <div className='col-md-4 col-12 mb-5' key={index}>
                            <Link className='blog' to={`../blog/${item._id}`}>
                                <div className='cover mb-3'>
                                    <div className="tags pl-2">
                                    {
                                        item.categories?.map((item, index) => {
                                            return (
                                                <span className='category-badge mr-1' key={index}>
                                                    <GetCategoryName catId={item} />
                                                </span>
                                            )
                                        })
                                    }
                                    </div>
                                    <img src={api + item.cover} alt={item.title} className="img-fluid cover-img" />
                                </div>
                                <div className='mb-3'>
                                    <span>
                                        <img src={item.author.avatar} alt="" className='img-fluid author-img' />
                                        <span className='ml-2'>
                                            {item.author.username}
                                        </span>
                                    </span>
                                    <small className='ml-1'>- <FormatDate createdDate={item.createdAt} /></small>
                                </div>
                                <h4>{item.title}</h4>
                                <p>{item.content}</p>
                                <hr />
                                <div className='feedback'>
                                    <span>
                                        <i className='fa fa-heart mr-1'></i>
                                        {item.likes.length}
                                    </span>
                                    <span className='ml-3'>
                                        <i className='fa fa-comment mr-1'></i>
                                        {item.comments.length}
                                    </span>
                                </div>
                            </Link>
                        </div>

                    )
                })}

            </div>
        </div>
    )
}

export default Blogs