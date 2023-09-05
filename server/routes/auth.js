import express from 'express'
import { registerUser, loginUser, forgotPassword, verifyEmail, resetPassword } from '../controllers/auth.js'


const router = express.Router()
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/forgot-password', forgotPassword)
router.get('/verify-email/:id/:token', verifyEmail)
router.post('/reset-password', resetPassword)
export default router;