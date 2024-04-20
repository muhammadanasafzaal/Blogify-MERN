import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import GetCategoryName from '../../components/CategoryName'
import FormatDate from '../../components/FormatDate'
import axiosInstance from '../../util/axios'
import { useDispatch } from 'react-redux'
import { isLoading } from '../../store/generalSlice'


const SearchResults = () => {
    const api = process.env.REACT_APP_API_KEY
    const dispatch = useDispatch()

    const [searchResults, setSearchResults] = useState([])

    const getSearchedBlog = async (query) => {
        if (query) {
            dispatch(isLoading(true))
            const res = await axiosInstance.get(`${api}blogs/0/${query}`);
            if (res && res.data.status_code==200) {
                if (res.data.data.length) {
                    setSearchResults(null)
                    setSearchResults([...res.data.data])
                    dispatch(isLoading(false))
                }
                else dispatch(isLoading(false))
            }
            else dispatch(isLoading(false))
        }
    }

    useEffect(() => {
        const queryParameters = new URLSearchParams(window.location.search)
        let query = queryParameters.get("query")
        if (query) getSearchedBlog(query)
    }, [])


    return (
        <div className='container py-5'>
            <h1>Search Results</h1>
            <div className="row">
                {searchResults?.map((item, index) => {
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
                                        <img src={item.author.avatar ? api+item.author.avatar : api+'uploads/user.jpg'} alt={item.title} className='img-fluid author-img' />
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

export default SearchResults