import React from 'react'
import { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from '../../util/axios';
import { isLoading } from '../../store/generalSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, 'title should be atleast 3 characters long')
        .max(20, "title should not exceed 20 characters")
        .required('title is required'),
    content: Yup.string()
        .min(30, 'content should have at least 30 characters')
        .max(250, 'content should not exceed 250 characters')
        .required('content is required'),
    cover: Yup.mixed()
        .required('Cover image is required')
        .test('fileType', 'Invalid file type', (value) => {
            if (value) {
                const supportedFormats = ['image/jpeg', 'image/png', 'image/jpg'];
                return supportedFormats.includes(value.type);
                // for(let i=0; i<supportedFormats.length; i++){
                //     if(value.includes(supportedFormats[i])){
                //         console.log("Type is "+supportedFormats[i])
                //         return value.includes(supportedFormats[i])
                //     }
                // }
            }
            return true; // Allow no file to be uploaded
        })
        .test('fileSize', 'File size is too large', (value) => {
            if (value) {
                return value.size <= 5242880; // 1MB in bytes
            }
            return true; // Allow no file to be uploaded
        }),
    categories: Yup.array().min(1, 'At least one option must be selected'),
});

const initialValues = {
    title: '',
    content: '',
    cover: null
};

const options = [
    // { value: 'option1', label: 'Option 1' },
    // { value: 'option2', label: 'Option 2' },
    // { value: 'option3', label: 'Option 3' },
];


const PostBlog = () => {

    const api = process.env.REACT_APP_API_KEY
    const categories = useSelector((state) => state.blog.blogCategories)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [title, setTitle] = useState("")
    const [cover, setCover] = useState(null)
    // const [categories, setCategories] = useState(null)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [content, setContent] = useState("")

    const handleSubmit = async (values) => {
        if (selectedCategories.length) {
            values['categories'] = []
            selectedCategories.forEach(c => {
                values['categories'].push(c._id)
            })
            console.log(values)

            const userId = JSON.parse(localStorage.getItem('user'))?.id
            if (!userId) {
                return
            }

            let formData = new FormData()
            for (const key in values) {
                formData.append(key, values[key])
            }
            // const headers = {
            //   "Content-Type": "multipart/form-data",
            //   "Authorization": localStorage.getItem('access_token')
            // }
            dispatch(isLoading(true))
            const res = await axiosInstance.post(`${api}blogs/add-blog/${userId}`, formData)

            if (res && res.data.status_code == 200) {
                dispatch(isLoading(false))
                toast.success(res.data.message,{
                    theme:'colored',
                    autoClose: 2000
                });
                setTimeout(() => {
                    navigate('/') 
                }, 2000);               
            }
            else {
                dispatch(isLoading(false))
                toast.error(res.data.message,{
                    theme:'colored',
                    autoClose: 2000
                });
            }
        }
    };

    const handleCategories = (e) => {
        const idx = categories.findIndex(c => {
            return c._id === e.target.value;
        });
        if (idx != -1) {
            console.log(categories[idx])
            const sidx = selectedCategories.findIndex(sc => {
                return sc._id === categories[idx]._id
            })
            if (sidx === -1) {
                setSelectedCategories([...selectedCategories, categories[idx]]);
            }
        }
    }

    const resetForm = () => {
        setTitle("")
        setCover(null)
        setSelectedCategories([])
        setContent("")
    }

    const handleDeleteCategory = (cat) => {
        const filteredCatg = categories.filter(c => c != cat)
        setSelectedCategories([])
        setSelectedCategories([...filteredCatg])
    }


    useEffect(() => {
        resetForm()
    }, [])


    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-md-6 col-12 offset-md-3 py-4 d-flex justify-content-center align-items-center flex-wrap shadow">
                    <div>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue }) => (
                                <Form>
                                    <h4 className='text-center mb-4'>Post Your Blog</h4>
                                    <div className="mb-3">
                                        <label htmlFor="title" className="form-label">Enter Title</label>
                                        <Field className="form-control" type="text" id="title" name="title" />
                                        <small className='d-block' style={{ color: 'red', width: '100%' }} >
                                            <ErrorMessage name="title" component="div" />
                                        </small>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="cover" className="form-label">Upload Cover</label>
                                        <input
                                            className="form-control"
                                            type="file"
                                            id="cover"
                                            name="cover"
                                            accept=".jpg, .jpeg, .png"
                                            onChange={(event) => {
                                                setFieldValue('cover', event.currentTarget.files[0]);
                                            }} />
                                        <small className='d-block' style={{ color: 'red', width: '100%' }} >
                                            <ErrorMessage name="cover" component="div" />
                                        </small>
                                    </div>
                                    <div className='mb-2'>
                                        <label>Select category:</label>
                                        <select
                                            id="categories"
                                            name="categories"
                                            className="form-control mb-1"
                                            onChange={handleCategories}
                                        >
                                            <option value="">Select a value</option>
                                            {categories?.map(option => (
                                                <option key={option._id} value={option._id}>
                                                    {option.name}
                                                </option>
                                            ))}
                                        </select>
                                        {
                                            selectedCategories?.length ?
                                                <p>Selected Categories:</p>
                                                : ""
                                        }
                                        {selectedCategories?.map((item, index) => {
                                            return (
                                                <small className='d-block' key={index}>
                                                    {item.name}
                                                    <i className='fa fa-close ml-2 mb-2' onClick={() => handleDeleteCategory(item)}></i>
                                                </small>
                                            )
                                        })}
                                        {(!selectedCategories?.length) &&
                                            <small className='d-block' style={{ color: 'red', width: '100%' }} >
                                                Please select a category
                                            </small>
                                        }
                                        {!selectedCategories?.length > 3 &&
                                            <small className='d-block' style={{ color: 'red', width: '100%' }} >
                                                Max 3 categories can be selected
                                            </small>
                                        }
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="formFile" className="form-label">Blog Content</label>
                                        <Field
                                            as="textarea"
                                            id="content"
                                            name="content"
                                            className="form-control"
                                            rows="4"
                                            cols="50"
                                        />
                                        <small className='d-block' style={{ color: 'red', width: '100%' }} >
                                            <ErrorMessage name="content" component="div" />
                                        </small>
                                    </div>
                                    <button type="submit" className="btn bg-purple text-light">Submit</button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostBlog