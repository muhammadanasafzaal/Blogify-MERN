import React from 'react'
import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required')
});

const initialValues = {
    email: ''
};

const ForgotPassword = () => {

    const api = process.env.REACT_APP_API_KEY
    const navigate = useNavigate()

    const handleSubmit = async (values) => {
        const res = await axios.post(api+'auth/forgot-password',values)
        if(res && res.data.status_code == 200){
            toast.success(res.data.message, {
                theme: 'colored',
                autoClose: 5000
            })
        }
        else{
            toast.error(res.data.message, {
                theme: 'colored',
                autoClose: 5000
            })
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
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ errors, touched }) => (
                                        <Form className='p-4'>
                                            <h4 className='text-center mb-4'>Change Password</h4>
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="email">
                                                        <i className='fa fa-envelope'></i>
                                                    </span>
                                                </div>
                                                <Field className="form-control" type="email" id="email" name="email" placeholder="Your Email" />
                                                <small className='d-block' style={{ color: 'red', width: '100%' }} >
                                                    <ErrorMessage name="email" component="div" />
                                                </small>
                                            </div>
                                            <div className='d-flex justify-content-md-between align-items-center'>
                                                <button type="submit" className="btn bg-purple text-light" disabled={errors.email}>Submit</button>
                                                <Link to='/login' style={{color: '#333'}} className="d-flex align-items-center">
                                                    <i className='fa fa-arrow-left mr-2'></i>
                                                    <small>Back to Login</small>
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

export default ForgotPassword