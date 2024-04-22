import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import GetCategoryName from '../../components/CategoryName'
import FormatDate from '../../components/FormatDate'
import axiosInstance from '../../util/axios'

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { hasToken } from "../../store/generalSlice";
import { useSelector } from "react-redux";
import { isLoading } from '../../store/generalSlice'


const commentSchema = Yup.object().shape({
    comment: Yup.string().min(1, 'Comment must contain least 1 characters').max(250, 'Comment must not exceed 250 characters'),
});

const initialValues = {
    comment: ''
};


const Blog = () => {

    const api = process.env.REACT_APP_API_KEY

    const dispatch = useDispatch()
    

    const [blog, setBlog] = useState(null)
    const [hasLikedPost, setHasLikedPost] = useState(false)
    const [hasLikedComment, setHasLikedComment] = useState(false)
    const [isFollower, setIsFollower] = useState(false)
    const [isMyBlog, setIsMyBlog] = useState(false)
    const [userComment, setUserComment] = useState(null)
    const [blogComments, setBlogComments] = useState([])
    // const [headers, setHeaders] = useState({
    //     'Authorization': localStorage.getItem('access_token')
    // })

    let { blogId } = useParams();

    const getBlog = async () => {
        dispatch(isLoading(true))
        const res = await axiosInstance.get(`${api}blogs/${blogId.length > 10 ? blogId : null}`);
        if (res && res.data.status_code==200) {
            if (res.data.data) {
                dispatch(isLoading(false))

                setBlog(res.data.data[0])
                getBlogComments(res.data.data[0]._id)

                const userId = JSON.parse(localStorage.getItem('user'))?.id
                setIsMyBlog(res.data.data[0].author._id == userId ? true : false)

                const hasLiked = res.data.data[0].likes.filter(likers=> likers == userId)
                if(hasLiked.length) setHasLikedPost(true)
                else setHasLikedPost(false)
            }
            else dispatch(isLoading(false))
        }
        else dispatch(isLoading(false))
    }

    const handlePostLike = async (blogId) => {
        const userId = JSON.parse(localStorage.getItem('user'))?.id
        setHasLikedPost(!hasLikedPost)
        const data = {
            userId: userId,
            blogId: blogId,
            like: !hasLikedPost
        }
        
        const res = await axiosInstance.put(`${api}blogs/update-reaction`, data)
        // if(res && res.data.status_code == 200){
        // }
    }

    const handleCommentLike = async (commentId) => {
        const userId = JSON.parse(localStorage.getItem('user'))?.id
        
        const data = {
            userId: userId,
            blogId: blogId,
            commentId: commentId,
            like: hasUserLikedComment(commentId) ? false : true
        }
        for(const key in data){
            if(key != 'like'){
                if(!data[key]) return 
            }
        }
        setHasLikedComment(true)
        const res = await axiosInstance.put(`${api}blogs/comment/update-reaction`, data)
        if(res && res.data.status_code == 200){
            setHasLikedComment(false)
        }
    }


    const handleUserFollow = async (userToFollowId) => {
        const userId = JSON.parse(localStorage.getItem('user'))?.id
        setIsFollower(!isFollower)
        const data = {
            userId: userId,
            userToFollowId: userToFollowId,
            hasFollowed: !isFollower
        }
        const res = await axiosInstance.put(`${api}user/update-follower`, data)
        // if(res && res.data.data){
        // }
    }

    const checkIsUserFollowingAuthor = async () => {
        if(blog){
            const userId = JSON.parse(localStorage.getItem('user'))?.id //get loggedin user id
            if(blog.author.followers.includes(userId)){
                setIsFollower(true)
            }
            else{
                setIsFollower(false)
            }
        }
    }

    const hasUserLikedComment = (commentId) => {
        if(blog){
            const userId = JSON.parse(localStorage.getItem('user'))?.id //get loggedin user id
            const comment = blog?.comments?.filter(c => c._id === commentId)
            if(comment.length){
                if(comment[0].likes.includes(userId)){
                    return true
                }
                else{
                    return false
                }
            }
        } 
    }

    const handleUserComment = async (values) => {
        const userId = JSON.parse(localStorage.getItem('user'))?.id
        const info = {
            authorId: userId,
            comment: values.comment,
            blogId: blogId
        }
        if(!info.authorId || !info.comment || !info.blogId) return 
        // return
        dispatch(isLoading(true))
        const res = await axiosInstance.post(api+'blogs/comment/add', info)
        setUserComment(null)
        if(res && res.data.status_code == 200){
            dispatch(isLoading(false))
            toast.success(res.data.message,{
                theme:'colored',
                autoClose: 2000
            });
            setUserComment(values.comment)
        }
        else{
            dispatch(isLoading(false))
            toast.error(res.data.message,{
                theme:'colored',
                autoClose: 2000
            });
        }
    };

    const getBlogComments = async (blogId) => {
        dispatch(isLoading(true))
        const res = await axiosInstance.get(`${api}blogs/comments/${blogId}`);
        if (res && res.data.status_code==200) {
            if (res.data.data.length) {
                dispatch(isLoading(false))
                setBlogComments([...res.data.data])
            }
            else dispatch(isLoading(false))
        }
        else dispatch(isLoading(false))
    }

    useEffect(() => {
        getBlog()
    }, [])
    
    useEffect(() => {
        checkIsUserFollowingAuthor()
    }, [blog])

    useEffect(() => {
        getBlog()
    }, [hasLikedPost, hasLikedComment, userComment])
    

    return (
        <div className='container py-5' id='blog-page'>
            <div className="row">
                <div className="col-md-7 col-12 offset-md-2 mb-3">
                    {
                        blog?.categories.map((item, index) => {
                            return (
                                <span className='category-badge mr-1' key={index}>
                                    <GetCategoryName catId={item} />
                                </span>
                                )
                            })
                    }
                    <h1>{blog?.title}</h1>
                    <hr />
                    <div className='row blog-details mb-2'>
                        <div className="col-md-5 col-12 d-flex align-items-center">
                            <Link to={`../../profile/${blog?.author._id}`}>
                                <img src={blog?.avatar ? api+blog?.avatar : `${api}uploads/user.jpg`} alt={blog?.author.username} className="img-fluid author-img" />
                            </Link>    
                            <div className='d-flex align-items-start ml-3 flex-column'>
                                <h6 className='mb-0'>{blog?.author.username}</h6>
                                <small>
                                    <FormatDate createdAt={blog?.createdAt} />
                                </small>
                            </div>
                        </div>
                        <div className="col-md-2 col-3 d-flex justify-content-center align-items-center">
                            <span onClick={()=>handlePostLike(blog._id)}>
                            {
                                hasLikedPost ? 
                                <i className='fa fa-heart'></i>
                                :
                                <i className='fa fa-heart-o'></i>
                            }
                            </span>
                            <span className='ml-2'>{blog?.likes.length}</span>
                        </div>
                        <div className="col-md-2 col-3 d-flex justify-content-center align-items-center">
                            <span><i className='fa fa-comment'></i></span>
                            <span className='ml-2'>{blog?.comments.length}</span>
                        </div>
                        <div className="col-md-2 col-6 d-flex justify-content-center align-items-center">
                            <span><i className='fa fa-save'></i></span>
                            <span className='ml-2'><i className='fa fa-share'></i></span>
                        </div>
                    </div>
                </div>
                <div className="col-12 cover mb-4">
                    <img src={blog?.cover ? api+blog?.cover : `${api}uploads/cover.jpg`} alt={blog?.title} className="img-fluid"/>
                </div>
                <div className="col-md-8 col-12 offset-md-2 blog-content mb-5">
                    {blog?.content}
                    <hr />
                </div>
                <div className="col-md-8 col-12 offset-md-2 author-detail">
                    <div className="row mb-3">
                        <div className="col-md-2 col-12">
                            <Link to={`../../profile/${blog?.author._id}`}>
                                <img src={blog?.avatar ? api+blog?.avatar : `${api}uploads/user.jpg`} alt={blog?.author.username} className="img-fluid" style={{height:'auto'}}/>
                            </Link>
                        </div>
                        <div className="col-md-10 col-12">
                            <small>WRITTEN BY</small>
                            <h4 className='mb-0 mt-2'>{blog?.author.username}</h4>
                            {blog?.author.designation && <p>{blog?.author.designation}</p>}
                            {
                                !isMyBlog && 
                                <button className='btn btn-dark'>
                                    <Link className='text-light' onClick={()=>handleUserFollow(blog?.author._id)}>
                                        { isFollower ? 'Following' : 'Follow' }
                                    </Link>
                                </button>
                            }
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-12">
                            <h3>What's on your mind?</h3>
                        </div>
                        <div className="col-12">
                            <Formik
                                initialValues={initialValues}
                                validationSchema={commentSchema}
                                onSubmit={handleUserComment}
                            >
                                {({ values, errors, touched }) => (
                                    <Form className='py-3'>
                                        <Field className="form-control mb-2 comment" component="textarea" id="comment" name="comment" cols="10" rows="5"/>
                                        <small className='d-block' style={{ color: 'red', width: '100%' }} >
                                            <ErrorMessage name="comment" component="div" />
                                        </small>
                                        <button type="submit" className='btn btn-primary bg-purple' disabled={!values.comment}>Submit</button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <h3>Responses { `(${blogComments.length})` }</h3>
                        </div>
                    </div>
                    {blogComments?.length ? blogComments?.map((c, c_idx)=> {
                        return(
                            <div className="row mb-3" key={c_idx}>
                                <div className="col-2 d-flex justify-content-center align-items-center">
                                    <img src={api+"uploads/user.jpg"} alt="" className='img-fluid author-img' style={{width:'60px', height:'60px'}} />
                                </div>
                                <div className="col-10 border p-3 comment">
                                    <div className='d-flex align-items-center'>
                                        <h6 className='mb-1'>@{c?.author_name}</h6>
                                        <small className='ml-1'>| posted: <FormatDate createdDate={c?.createdAt} /></small>
                                    </div>
                                    <p>{c?.comment}</p>
                                    <div>
                                        {
                                              <span onClick={()=>handleCommentLike(c._id)}>
                                              {
                                                  hasUserLikedComment(c._id) ? 
                                                  <i className='fa fa-heart'></i>
                                                  :
                                                  <i className='fa fa-heart-o'></i>
                                              }
                                              </span>
                                        }
                                        <span><i className='fa fa-reply ml-3'></i></span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                    : ""
                    }
                    
                </div>
            </div>
        </div>
    )
}

export default Blog