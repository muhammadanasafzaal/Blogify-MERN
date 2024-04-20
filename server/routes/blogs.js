import express from 'express'
import { addBlogCategories, getBlogs, getBlogCategories, addBlog, updateBlog, deleteBlogPost, getBlogsByCategory, getBlogsForUser, saveReactionForPost, saveUserComment, saveReactionForComment, getCommentsForBlog } from '../controllers/blogs.js'
import upload from '../middlewares/file-upload.js'
import authenticateToken from '../middlewares/authenticate-token.js'

const router = express.Router()
router.get('/category/:id', authenticateToken, getBlogsByCategory)
router.post('/add-category', authenticateToken, addBlogCategories)
router.get('/categories', authenticateToken, getBlogCategories)
router.get('/', authenticateToken, getBlogs)
router.get('/user/:id', authenticateToken, getBlogsForUser)
router.post('/add-blog/:id', upload.single('cover'), authenticateToken, addBlog)
router.put('/update-blog/:id', authenticateToken, updateBlog)
router.put('/update-reaction', authenticateToken, saveReactionForPost)
router.delete('/delete-blog/:id', authenticateToken, deleteBlogPost)
router.post('/comment/add', authenticateToken, saveUserComment)
router.put('/comment/update-reaction', authenticateToken, saveReactionForComment)
router.get('/:id?/:title?', authenticateToken, getBlogs)
router.get('/comment/:blog_id?', authenticateToken, getCommentsForBlog)



export default router;