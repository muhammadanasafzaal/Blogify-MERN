import express from 'express'
import { registerUser, loginUser, forgotPassword, verifyEmail, resetPassword, refreshAccessToken } from '../controllers/auth.js'

const router = express.Router()
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/forgot-password', forgotPassword)
router.get('/verify-email/:id/:access_token', verifyEmail)
router.post('/reset-password', resetPassword)
router.post('/refresh-token', refreshAccessToken)
export default router;