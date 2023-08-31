import React from 'react'
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { hasToken } from '../../store/generalSlice';

const Header = () => {

    const dispatch = useDispatch()

    const logOut = () => {
        localStorage.removeItem('token')
        dispatch(hasToken(false))
    }

    return (
        <div className='container-fluid'>
            <div className="row">
                <div className="col-12 p-0">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <a className="navbar-brand" href="/">Blogify</a>
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
                                            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                                        </div>
                                        <div className="col-2 d-flex align-items-center">
                                            <i className='fa fa-search cp'></i>
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