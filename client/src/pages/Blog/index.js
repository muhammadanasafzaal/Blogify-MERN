import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

const Blog = () => {

    const [blog, setBlog] = useState(null)

    const getBlog = async () => {
        try {
            const res = await axios.get('/data/blogs.json');
            if (res && res.data) {
                if (res.data.length) {
                    setBlog(res.data[0])
                    console.log(res.data)
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getBlog()
    }, [])

    return (
        <div className='container py-5' id='blog-page'>
            <div className="row">
                <div className="col-md-7 col-12 offset-md-2 mb-3">
                    <span className='category-badge'>{blog?.category}</span>
                    <h1>{blog?.title}</h1>
                    <p>{blog?.excerpt}</p>
                    <hr />
                    <div className='row blog-details mb-2'>
                        <div className="col-md-5 col-12 d-flex align-items-center">
                            <img src={blog?.author_img} alt={blog?.author} className="img-fluid author-img" />
                            <div className='d-flex align-items-start ml-3 flex-column'>
                                <h6 className='mb-0'>{blog?.author}</h6>
                                <small>{blog?.date}</small>
                            </div>
                        </div>
                        <div className="col-md-2 col-3 d-flex justify-content-center align-items-center">
                            <span><i className='fa fa-heart'></i></span>
                            <span className='ml-2'>{blog?.likes}</span>
                        </div>
                        <div className="col-md-2 col-3 d-flex justify-content-center align-items-center">
                            <span><i className='fa fa-comment'></i></span>
                            <span className='ml-2'>{blog?.comments}</span>
                        </div>
                        <div className="col-md-2 col-6 d-flex justify-content-center align-items-center">
                            <span><i className='fa fa-save'></i></span>
                            <span className='ml-2'><i className='fa fa-share'></i></span>
                        </div>
                    </div>
                </div>
                <div className="col-12 cover mb-4">
                    <img src={blog?.cover} alt={blog?.title} className="img-fluid"/>
                </div>
                <div className="col-md-8 col-12 offset-md-2 blog-content mb-5">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga dolor aut deserunt facere commodi distinctio amet, illo recusandae aspernatur earum dolores nisi voluptatibus odit rerum illum adipisci sit omnis consequuntur.
                    <hr />
                </div>
                <div className="col-md-8 col-12 offset-md-2 author-detail">
                    <div className="row mb-3">
                        <div className="col-md-2 col-12">
                            <img src={blog?.author_img} alt={blog?.author} className="img-fluid author-img" style={{height:'100px'}}/>
                        </div>
                        <div className="col-md-10 col-12">
                            <small>WRITTEN BY</small>
                            <h4>{blog?.author}</h4>
                            <p>{blog?.about}</p>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-12">
                            <h3>Responses { `(${blog?.comment_list.length})` }</h3>
                        </div>
                        <div className="col-12">
                            <textarea className='form-control mb-2 comment' name="" id="" cols="30" rows="10"></textarea>
                            <button className='btn btn-primary bg-purple'>Submit</button>
                            <button className='btn btn-outline-dark ml-2'>Cancel</button>
                        </div>
                    </div>
                    {blog?.comment_list.length && blog?.comment_list.map((c, c_idx)=> {
                        return(
                            <div className="row mb-3" key={c_idx}>
                                <div className="col-2 d-flex justify-content-center align-items-center">
                                    <img src={c?.avatar} alt="" className='img-fluid author-img' />
                                </div>
                                <div className="col-10 border p-3 comment">
                                    <div className='d-flex align-items-center'>
                                        <h5 className='mb-1'>{c?.name}</h5>
                                        <small className='ml-2'>- {c?.posted_on}</small>
                                    </div>
                                    <p>{c?.comment}</p>
                                    <div>
                                        <span><i className='fa fa-heart'></i> {c?.likes} </span>
                                        <span><i className='fa fa-reply ml-3'></i></span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    
                </div>
            </div>
        </div>
    )
}

export default Blog