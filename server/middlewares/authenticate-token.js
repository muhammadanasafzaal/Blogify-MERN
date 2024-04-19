import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config()

const access_secret = process.env.ACCESS_SECRET

const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization'); 
    const token = authHeader && authHeader.split(' ')[1]
    if(!token) return res.sendStatus(401)
    
    jwt.verify(token, access_secret, (err, user)=> {
        if(err) return res.status(403).json({ status_code: 403, message: err.message })
        req.user = user
        next()
    })
}

export default authenticateToken;