import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import GetCategoryName from '../../components/CategoryName'
import FormatDate from '../../components/FormatDate'
import { isLoading } from '../../store/generalSlice';
import axiosInstance from "../../util/axios";


const LatestBlogs = () => {

    const api = process.env.REACT_APP_API_KEY
    const [blogs, setBlogs] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)

    const categories = useSelector((state) => state.blog.blogCategories)
    const dispatch = useDispatch()

    // const [headers, setHeaders] = useState({
    //     "Authorization": localStorage.getItem('access_token')
    // })

    const getBlogs = async (cat) => {
        try {
            // const res = await axios.get('/data/blogs.json');
            dispatch(isLoading(true))
            setSelectedCategory(cat)
            const res = await axiosInstance.get(`${api}blogs/`);
            if (res && res.data.data) {
                dispatch(isLoading(false))
                if (res.data.data.length) {
                    if (!cat) {
                        setBlogs([])
                        setBlogs([...res.data.data])
                        // setBlogs(blogs.length=4)
                        console.log('all')
                    }
                    else {
                        console.log(cat, 'type')

                        const typeCat = res.data.data.filter(c => c.categories.includes(cat))
                        console.log(typeCat)
                        if (typeCat.length) {
                            setBlogs([])
                            setBlogs([...typeCat])
                        }
                    }
                }
            }
            else {
                console.log('no resp latest blog')
                dispatch(isLoading(false))
            }
        } catch (error) {
            console.error(error, 'err latest blog');
            dispatch(isLoading(false))
        }
    }


    useEffect(() => {
        getBlogs('')
    }, [])


    return (
        <div className='container'>
            <div className="row">
                <div className="col-12 mb-3">
                    <h2>Latest Blogs</h2>
                    <p>Discover the most outstanding articles in all topics of life.</p>
                </div>
                <div className="col-md-12 col-12 mb-4 category-filter">
                    <button className={`btn mr-md-2 ${!selectedCategory ? 'btn-dark' : 'btn-outline'}`} onClick={() => getBlogs('')}>All Items</button>
                    {
                        categories?.map((item, index) => {
                            return (
                                <button className={`btn mr-md-2 ${selectedCategory == item._id ? 'btn-dark' : 'btn-outline'}`} key={index} onClick={() => getBlogs(item._id)}>
                                    {item.name}
                                </button>
                            )
                        })
                    }
                </div>
            </div>
            {
                !blogs?.length ? "No blogs available"
                    :
                    <div className='row'>
                        <div className='col-md-6 col-12'>
                            <a className='blog'>
                                <div className='cover mb-3'>
                                    <div className="tags">
                                        {
                                            blogs[0]?.categories.map((item, index) => {
                                                return (
                                                    <span className='category-badge mr-1' key={index}>
                                                        <GetCategoryName catId={item} />
                                                    </span>
                                                )
                                            })
                                        }
                                    </div>
                                    <Link to={`blog/${blogs[0]._id}`}>
                                        <img src={blogs[0].cover ? api + blogs[0].cover : ""} alt={blogs[0].title} className="img-fluid cover-img" />
                                    </Link>
                                </div>
                                <div className='mb-3'>
                                    <span>
                                        <img src={blogs[0].author.avatar ? api + blogs[0].author.avatar : api + 'uploads/user.jpg'} alt="" className='img-fluid author-img' />
                                        <span className='ml-2'>
                                            {blogs[0].author.username}
                                        </span>
                                    </span>
                                    <small className='ml-1'>
                                        -<FormatDate createdDate={blogs[0].createdAt} />
                                    </small>
                                </div>
                                <h4>{blogs[0].title}</h4>
                                <p>{blogs[0].content}</p>
                                <hr />
                                <div className='feedback'>
                                    <span>
                                        <i className='fa fa-heart mr-1'></i>
                                        {blogs[0].likes.length}
                                    </span>
                                    <span className='ml-3'>
                                        <i className='fa fa-comment mr-1'></i>
                                        {blogs[0].comments.length}
                                    </span>
                                </div>
                            </a>
                        </div>
                        <div className='col-md-6 col-12 mt-5 mt-md-2'>
                            <div className="row">
                                {
                                    blogs.filter(b => b._id != blogs[0]._id).slice(0, 3).map((item2, index2) => {
                                        return (
                                            <div className='col-12 mb-3 blog' key={index2}>
                                                <div className="row">
                                                    <div className="col-7 p-3">
                                                        {
                                                            item2.categories.map((c, index) => {
                                                                return (
                                                                    <span className='category-badge mr-1' key={index}>
                                                                        <GetCategoryName catId={c} />
                                                                    </span>
                                                                )
                                                            })
                                                        }
                                                        <h4>{item2.title}</h4>
                                                        <div>
                                                            <img
                                                                src={item2.author.avatar ? api + item2.author.avatar : api + 'uploads/user.jpg'}
                                                                alt={item2.author.username}
                                                                className='img-fluid author-img' />
                                                            <span className='ml-2'>
                                                                {item2.author.username}
                                                            </span>
                                                            <small className='ml-1'>
                                                                - <FormatDate createdDate={item2.createdAt} />
                                                            </small>
                                                        </div>
                                                        <hr />
                                                        <span>
                                                            <span>
                                                                <i className='fa fa-heart mr-1'></i>
                                                                {item2.likes.length}
                                                            </span>
                                                            <span className='ml-3'>
                                                                <i className='fa fa-comment mr-1'></i>
                                                                {item2.comments.length}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div className="col-5">
                                                        <Link to={`blog/${item2._id}`}>
                                                            <img src={api + item2.cover} alt={item2.title} className="img-fluid cover-img" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        {blogs.length > 5 && 
                            <div className='col-12 text-center'>
                                <Link to="/categories" className='nav-link'>
                                    <button className='btn-dark cp' style={{padding: '.5rem 1rem', borderRadius: '25px' }}>Show More</button>
                                </Link>
                            </div>
                        }
                    </div>
            }
        </div>
    )
}

export default LatestBlogs