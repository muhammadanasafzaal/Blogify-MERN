import React from 'react'
import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { hasToken } from "../../store/generalSlice";
import { useSelector } from "react-redux";
import { isLoading } from '../../store/generalSlice'
import axiosInstance from '../../util/axios';
import { allBlogs } from '../../store/blogSlice';

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(4, 'Password must be at least 4 characters').max(8, 'Password must not exceed 8 characters').required('Password is required'),
});

const initialValues = {
    email: '',
    password: '',
};

const Login = () => {

    const api = process.env.REACT_APP_API_KEY
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const [isPwVisible, setIsPwVisible] = useState(false)

    const togglePasswordVisibility = () => {
        setIsPwVisible(!isPwVisible)
    }

    const handleSubmit = async (values) => {
        const res = await axiosInstance.post(api+'auth/login',values)
        dispatch(isLoading(true))
        if(res && res.data.status_code == 200){
            dispatch(isLoading(false))
            toast.success(res.data.message,{
                theme:'colored',
                autoClose: 2000
            });
            localStorage.setItem('access_token', res.data['access_token'])
            localStorage.setItem('refresh_token', res.data['refresh_token'])
            localStorage.setItem('user', JSON.stringify(res.data.data))            
            dispatch(hasToken(true))
            setTimeout(() => {
                navigate('/')                
            }, 2000);
        }
        else{
            dispatch(isLoading(false))
            toast.error(res.data.message,{
                theme:'colored',
                autoClose: 2000
            });
        }
    };

    return (
        <div className='auth'>
            <div className='auth-form'>
                <div className="container bg-light shadow-lg" style={{ borderRadius: '5px' }}>
                    <div className="row">
                        <div className="col-md-8 bg-purple d-flex justify-content-center align-items-center flex-wrap">
                            <img src="/images/blog2.png" alt="" className='img-fluid' />
                        </div>
                        <div className="col-md-4 p-4 d-flex justify-content-center align-items-center flex-wrap">
                            <div>
                                <h3  className='text-center' style={{fontWeight:'bold'}}>Welcome to Blogify</h3>
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ errors, touched }) => (
                                        <Form className='p-3'>
                                            <h4 className='text-center mb-4'>Login</h4>
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="email">
                                                        <i className='fa fa-envelope'></i>
                                                    </span>
                                                </div>
                                                <Field className="form-control" type="email" id="email" name="email" />
                                                <small className='d-block' style={{ color: 'red', width: '100%' }} >
                                                    <ErrorMessage name="email" component="div" />
                                                </small>
                                            </div>
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text">
                                                        <i className='fa fa-lock'></i>
                                                    </span>
                                                </div>
                                                <Field className="form-control" type={isPwVisible ? 'text' : 'password'} id="password" name="password" />
                                                <div className="input-group-append" onClick={togglePasswordVisibility}>
                                                    <span className="input-group-text" >
                                                        <i className={isPwVisible ? 'fa fa-eye-slash' : 'fa fa-eye'} ></i>
                                                    </span>
                                                </div>
                                                <small className='d-block' style={{ color: 'red', width: '100%' }} >
                                                    <ErrorMessage name="password" component="div" />
                                                </small>
                                            </div>
                                            <div className='d-flex justify-content-md-between align-items-center'>
                                                <button type="submit" className="btn bg-purple text-light" disabled={errors.email || errors.password}>Submit</button>
                                                <Link to='/register' style={{color: '#333'}}>
                                                    <small>Not a user?</small> |
                                                </Link>
                                                <Link to='/forgot-password' style={{color: '#333'}}>
                                                    <small>Forgot password?</small>
                                                </Link>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login