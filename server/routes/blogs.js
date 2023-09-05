import express from 'express'
import { addBlogCategories, getBlogs, getBlogCategories, addBlog, updateBlog, deleteBlogPost } from '../controllers/blogs.js'

const router = express.Router()
router.get('/', getBlogs)
router.post('/add-category', addBlogCategories)
router.get('/categories', getBlogCategories)
router.post('/add-blog/:id', addBlog)
router.put('/update-blog/:id', updateBlog)
router.delete('/delete-blog/:id', deleteBlogPost)

export default router;