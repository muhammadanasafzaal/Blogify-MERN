import express from 'express'
import { updateProfile, getUserProfile, getUsers, saveUnsaveFollowerForUser } from '../controllers/user.js'
import authenticateToken from '../middlewares/authenticate-token.js'
import upload from '../middlewares/file-upload.js'

const router = express.Router()
router.put('/profile/update/:id', upload.fields([{
    name: 'avatar', maxCount: 1
  }, {
    name: 'cover', maxCount: 1
  }]), authenticateToken, updateProfile)
router.get('/profile/:id', authenticateToken, getUserProfile)
router.get('/', authenticateToken, getUsers)
router.put('/update-follower', authenticateToken, saveUnsaveFollowerForUser)

export default router;