import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hasToken, isLoading } from '../../store/generalSlice';
import axiosInstance from '../../util/axios';

const Header = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const loading = useSelector((state) => state.general.isLoading)
    const [searchQuery, setSearchQuery] = useState(null)

    const logOut = () => {
        dispatch(isLoading(true))
        dispatch(hasToken(false))
        dispatch(isLoading(false))
        localStorage.clear()
    }

    const handleSearchQuery = (query) => setSearchQuery(query)
    
    const getSearchedBlog = () => {
        if(searchQuery){
            navigate(`/search?query=${searchQuery}`)
            setSearchQuery(null)
        } 
    }

    useEffect(() => {
    }, [searchQuery])
    

    return (
        <div className='container-fluid'>
            <div className="row">
                <div className="col-12 p-0">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <Link to="/" className="navbar-brand">Blogify</Link>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item">
                                    <Link to="/categories" className="nav-link">Categories</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/add-blog" className="nav-link">Post Blog</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/my-blogs" className="nav-link">My Blogs</Link>
                                </li>
                            </ul>
                            <form className="form-inline my-2 my-lg-0">
                                <div className="container-fluid p-0">
                                    <div className="row">
                                        <div className="col-10">
                                            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"
                                                onChange={(e) => handleSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-2 d-flex align-items-center">
                                            <i className='fa fa-search cp' onClick={getSearchedBlog}></i>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className='mt-md-0 mt-3'>
                                {/* <a className='btn-dark action-btn ml-md-3 cp d-block d-md-inline text-center p-2'> */}
                                <Link to="/profile" className="btn-dark action-btn ml-md-3 cp nav-link d-md-inline text-center p-2">
                                    <i className='fa fa-user'></i>
                                </Link>
                                {/* </a> */}
                                <a
                                    className='btn-dark action-btn mt-md-0 mt-2 ml-md-3 cp d-block d-md-inline text-center p-2'
                                    onClick={logOut}
                                >
                                    <i className='fa fa-sign-out'></i>
                                </a>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>

        </div>
    )
}

export default Header