import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    blogs: [],
}

export const BlogSlice = createSlice({
    name: "Blog",
    initialState,
    reducers: {
        allBlogs: (state, action) => {
            state.hasToken = localStorage.getItem('token') ? true : false;
        },
    }
})

export const { allBlogs } = BlogSlice.actions
export default BlogSlice.reducer