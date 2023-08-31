import express from 'express'
import { updateProfile, getUserProfile, getUsers } from '../controllers/user.js'

const router = express.Router()
router.post('/profile/update', updateProfile)
router.get('/profile/:id', getUserProfile)
router.get('/', getUsers)

export default router;