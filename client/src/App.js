
import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login';
import Landing from './pages/Landing';
import { useSelector } from "react-redux";
import PostBlog from './pages/PostBlog';
import MyBlogs from './pages/MyBlogs';
import Categories from './pages/Categories';
import Header from './components/Header';
import Footer from './components/Footer';
import Blogs from './pages/Blogs';
import Blog from './pages/Blog';
import Profile from './pages/Profile';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const tk = useSelector((state) => state.general.hasToken)
  
  useEffect(() => {
    console.log(tk)
    setIsLoggedIn(tk)
  }, [tk])


  return (
    <BrowserRouter>
      { isLoggedIn && <Header />}
      <Routes>
        <Route path="" element={
          isLoggedIn ?
            <Landing />
            :
            <Navigate replace to={"/login"} />
        } />
        <Route path="/login" element={
          !isLoggedIn ?
            <Login />
            :
            <Navigate replace to={"/"} />
        } />
        <Route path="/register" element={
          !isLoggedIn ?
            <Register />
            :
            <Navigate replace to={"/"} />
        } />
        <Route path="/categories" element={
          isLoggedIn ?
            <Categories />
            :
            <Navigate replace to={"/login"} />
          } />
        <Route path="/add-blog" element={
          isLoggedIn ?
            <PostBlog />
            :
            <Navigate replace to={"/login"} />
          } />
        <Route path="/my-blogs" element={
          isLoggedIn ?
            <MyBlogs />
            :
            <Navigate replace to={"/login"} />
          } />
        <Route path="/blogs" element={
          isLoggedIn ?
            <Blogs />
            :
            <Navigate replace to={"/login"} />
          } />
        <Route path="/blog" element={
          isLoggedIn ?
            <Blog />
            :
            <Navigate replace to={"/login"} />
          } />
        <Route path="/profile" element={
          isLoggedIn ?
            <Profile />
            :
            <Navigate replace to={"/login"} />
          } />
        <Route path="/forgot-password" element={
          !isLoggedIn ?
            <ForgotPassword />
            :
            <Navigate replace to={"/"} />
          } />
        <Route path="/reset-password/:token" element={
          !isLoggedIn ?
            <ResetPassword />
            :
            <Navigate replace to={"/"} />
          } />
      </Routes>
      { isLoggedIn && <Footer />}
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
