import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import * as dotenv from "dotenv"
import authRoutes from './routes/auth.js'
import blogRoutes from './routes/blogs.js'
import userRoutes from './routes/user.js'

const port = process.env.PORT || 4000;
const app = express()
dotenv.config()


//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use('/uploads', express.static("uploads"))


//db connection
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'blogify-mern'
}).then(()=>console.log("Connected to db"))
.catch((error)=> console.log("error in db", error))


//routes 
app.use('/auth', authRoutes)
app.use('/blogs', blogRoutes)
app.use('/user', userRoutes)

//server 
app.listen(port, ()=> console.log("server running at "+port));