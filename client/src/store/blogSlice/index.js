import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    blogs: [],
    blogCategories:[]
}

export const BlogSlice = createSlice({
    name: "blog",
    initialState,
    reducers: {
        allBlogs: (state, action) => {
            state.blogs = []
        },
        storeBlogCategories: (state, action) => {
            if(action.payload.length){
                action.payload.forEach(c => {
                    state.blogCategories.push(c)
                })
            }
        },
    }
})

export const { allBlogs, storeBlogCategories } = BlogSlice.actions
export default BlogSlice.reducer