import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'

const LatestArticles = () => {

    const [blogs, setBlogs] = useState([])

    const getBlogs = async () => {
        try {
            const res = await axios.get('/data/blogs.json');
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
        <div className='container'>
            <div className="row">
                <div className="col-12 mb-3">
                    <h2>Latest Blogs</h2>
                    <p>Discover the most outstanding articles in all topics of life.</p>
                </div>
                <div className="col-md-10 col-12 mb-4 category-filter">
                    <button className='btn btn-dark'>All Items</button>
                    <button className='btn btn-outline ml-md-2'>Electronics</button>
                    <button className='btn btn-outline ml-md-2'>Politics</button>
                    <button className='btn btn-outline ml-md-2'>Health</button>
                </div>
                <div className="col-md-2 col-12 text-md-right category-filter">
                    <button className='btn btn-outline mb-5'>View All</button>
                </div>
            </div>
            {
                !blogs?.length ? "No blogs available"
                    :
                    <div className='row'>
                        <div className='col-md-6 col-12 blog'>
                            <div className='cover mb-3'>
                                <span className='category-badge'>{blogs[0].category}</span>
                                <img src={blogs[0].cover} alt={blogs[0].title} className="img-fluid cover-img" />
                            </div>
                            <div className='mb-3'>
                                <span>
                                    <img src={blogs[0].author_img} alt="" className='img-fluid author-img' />
                                    <span className='ml-2'> 
                                        {blogs[0].author}
                                    </span>
                                </span>
                                <small className='ml-1'>- {blogs[0].date}</small>
                            </div>
                            <h4>{blogs[0].title}</h4>
                            <p>{blogs[0].excerpt}</p>
                            <hr />
                            <div className='feedback'>
                                <span>
                                    <i className='fa fa-heart mr-1'></i>
                                    {blogs[0].likes}
                                </span>
                                <span className='ml-3'>
                                    <i className='fa fa-comment mr-1'></i>
                                    {blogs[0].comments}
                                </span>
                            </div>
                        </div>
                        <div className='col-md-6 col-12 mt-5 mt-md-2'>
                            <div className="row">
                                {
                                    blogs.filter(b => b.id != blogs[0].id).map((item2, index2) => {
                                        return (
                                            <div className='col-12 mb-3 blog' key={index2}>
                                                <div className="row">
                                                    <div className="col-7 p-3">
                                                        <span className='category-badge'>{blogs[0].category}</span>
                                                        <h4>{item2.title}</h4>
                                                        <div>
                                                            <img src={item2.author_img} alt="" className='img-fluid author-img' />
                                                            <span className='ml-2'>
                                                                {item2.author}
                                                            </span>
                                                            <small className='ml-1'>- {item2.date}</small>
                                                        </div>
                                                        <hr />
                                                        <span>
                                                            <span>
                                                                <i className='fa fa-heart mr-1'></i>
                                                                {item2.likes}
                                                            </span>
                                                            <span className='ml-3'>
                                                                <i className='fa fa-comment mr-1'></i>
                                                                {item2.comments}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div className="col-5">
                                                        <img src={item2.cover} alt={item2.title} className="img-fluid cover-img" />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}

export default LatestArticles