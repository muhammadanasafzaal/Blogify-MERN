
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
import { ThreeDots } from 'react-loader-spinner'
import SearchResults from './pages/SearchResults';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const tk = useSelector((state) => state.general.hasToken)
  const loading = useSelector((state) => state.general.isLoading)


  const addLoadingScreen = () => {
    const body = document.querySelector('body')
    if (body) {
      if (loading) {
        body.classList.add("loading");
        body.classList.remove("not-loading");
      }
      else {
        body.classList.add("not-loading");
        body.classList.remove("loading");
      }
    }
  }

  useEffect(() => {
    setIsLoggedIn(tk)
  }, [tk])


  useEffect(() => {
    addLoadingScreen()
  }, [loading])


  return (
    <BrowserRouter>
      <div className={loading && "loading"}>
        {isLoggedIn && <Header />}
        <div class="content">
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
            <Route path="/blogs/:categoryId" element={
              isLoggedIn ?
                <Blogs />
                :
                <Navigate replace to={"/login"} />
            } />
            <Route path="/blog/:blogId" element={
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
            <Route path="/profile/:userId" element={
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
            <Route path="/reset-password/:access_token" element={
              !isLoggedIn ?
                <ResetPassword />
                :
                <Navigate replace to={"/"} />
            } />
            <Route path="/search" element={
              isLoggedIn ?
                <SearchResults />
                :
                <Navigate replace to={"/login"} />
            } />
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </div>
        {isLoggedIn && <Footer />}
        <ToastContainer />
      </div>
      {
        loading &&
        <div className="loader">
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#6600d7"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
          />
        </div>
      }
    </BrowserRouter>
  );
}

export default App;
