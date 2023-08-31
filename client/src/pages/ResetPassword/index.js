import React from 'react'
import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const validationSchema = Yup.object().shape({
    password: Yup.string().min(4, 'Password must be at least 4 characters').max(8, 'Password must not exceed 8 characters').required('Password is required'),
    confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required')
});

const initialValues = {
    password: '',
    confirmPassword: '',
};

const ResetPassword = () => {

    let { token } = useParams();

    const api = process.env.REACT_APP_API_KEY
    const navigate = useNavigate()

    const [isPwVisible, setIsPwVisible] = useState(false)
    const [isConfirmPwVisible, setIsConfirmPwVisible] = useState(false)

    const togglePasswordVisibility = () => {
        setIsPwVisible(!isPwVisible)
    }

    const toggleConfirmPasswordVisibility = () => {
      setIsPwVisible(!isConfirmPwVisible)
    }

    const handleSubmit = async (values) => {
      const data = {
        token: token,
        password: values.password
      }
      const res = await axios.post(api+'auth/reset-password', data)
      console.log(res)
      if(res && res.data.status_code == 200){
        toast.success(res.data.message, {
          theme:'colored',
          autoClose: 2000
        })
        navigate('/login')
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
                                            <h4 className='text-center mb-4'>Reset Password</h4>
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
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text">
                                                        <i className='fa fa-lock'></i>
                                                    </span>
                                                </div>
                                                <Field className="form-control" type={isConfirmPwVisible ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" />
                                                <div className="input-group-append" onClick={toggleConfirmPasswordVisibility}>
                                                    <span className="input-group-text" >
                                                        <i className={isConfirmPwVisible ? 'fa fa-eye-slash' : 'fa fa-eye'} ></i>
                                                    </span>
                                                </div>
                                                <small className='d-block' style={{ color: 'red', width: '100%' }} >
                                                    <ErrorMessage name="confirmPassword" component="div" />
                                                </small>
                                            </div>
                                            <div className='d-flex justify-content-md-between align-items-center'>
                                                <button type="submit" className="btn bg-purple text-light" disabled={errors.email || errors.password}>Submit</button>
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

export default ResetPassword