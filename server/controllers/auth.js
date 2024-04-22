import User from '../models/auth.js'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const access_secret = process.env.ACCESS_SECRET
const refresh_secret = process.env.REFRESH_SECRET

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body
    try {
        // const users = User.find()
        if(email && password){
            const hashedPw = await bcrypt.hash(password, 10)
            const newUser = new User({
                username: username,
                email: email,
                password: hashedPw,
                avatar: "",
                cover: "",
                designation: ""
            })

            const existingUser = await User.findOne({
                email: email
            })
            if(existingUser){
                res.status(200).json({ status_code:400, message: 'Email already registered'})
            }
            else{
                const saveUser = await newUser.save()
                res.status(200).json({ status_code: 200, message: "Registered successfully", data: saveUser})
            }
        }
    } catch (error) {
    }
}

export const loginUser = async (req, res) => {
    const { email, password, rememberMe } = req.body
    try {
        if(email && password){
            const user = await User.findOne({
                email: email
            })
            if(user){
                const validPw = await bcrypt.compare(password, user.password)

                if(validPw){
                    const accessToken = jwt.sign({
                        username: user.username,
                        email: user.email
                    }, access_secret ,{expiresIn: '30m'})

                    const refreshToken = jwt.sign({
                        username: user.username,
                        email: user.email
                    }, refresh_secret ,{expiresIn: rememberMe ? '1d' : '30m'})

                    const userData = {
                        id:user._id,
                        email:user.email,
                        username:user.username
                    }
                    res.status(200).json({ message: "Login success", status_code: 200, access_token: accessToken, refresh_token: refreshToken, data: userData })
                }
                else{
                    res.status(200).json({ message: "Invalid credentials", status_code: 401 })
                }
            }
            else{
                res.status(200).json({ message: "User not found", status_code: 404 })
            }
        }
        else{
            res.status(200).json({ status_code: 400, message: "Incomplete data" })
        }
    } catch (error) {
        res.status(500).json({ status_code: 500, message: error.message })
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body
    try {
        if(email){
            const user = await User.findOne({ email: email })
            if(user){
                const access_token = jwt.sign({
                    id: user._id,
                    email: email
                }, access_secret , {expiresIn: '30m'})
                const link = `http://localhost:4000/auth/verify-email/${user._id}/${access_token}`
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'anasdev86@gmail.com',
                      pass: 'zltcrymekezqhjym'
                    }
                  });
                  
                  var mailOptions = {
                    from: 'youremail@gmail.com',
                    to: email,
                    subject: 'Password Reset | Blogify',
                    text: `Click the link below to verify your account. \n \n ${link} \n Regards \n \n Team Blogify`
                  };

                  let mailResp = null
                  
                  mailResp = await transporter.sendMail(mailOptions);
                  if(mailResp){
                    if(mailResp.accepted.length){
                        res.status(200).json({ status_code:200, message: "Check your mail inbox to verify email account" })
                    }
                    else{
                        res.status(200).json({ status_code:200, message: "Something went wrong" })
                    }
                  } 

            }
            else{
                res.status(200).json({ message: "User not found", status_code: 404 })
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message, status_code: 500 })
    }
}


export const verifyEmail = async (req, res) => {
    const { id, access_token } = req.params
    try {
        if(id && access_token){
            // res.send('done')
            const user = await User.findOne({
                _id: id
            })
            if(user){
                const verifyUser = jwt.verify(access_token, access_secret)
                if(verifyUser){
                    res.redirect('http://localhost:3000/reset-password/'+access_token);
                }
            }
            else{
                res.send('user not found')
                // res.status(200).json({ message: "User not found", status_code: 404 })
            }
        }
        else{
            res.send('incomplete data')
            // res.status(200).json({ message: "incomplete data", status_code: 404 })     
        }
    } catch (error) {
        res.status(500).json({ message: error.message, status_code: 500 }) 
    }
}


export const resetPassword = async (req, res) => {
    const { access_token, password } = req.body
    try {
        if(access_token && password){
            const validUser = jwt.verify(access_token, access_secret)
            if(validUser){
                const hashedPw = await bcrypt.hash(password, 10)
                const updatePw = await User.findOneAndUpdate({
                    _id: validUser.id
                },
                {
                    $set: {
                        password: hashedPw
                    },
                })

                if(updatePw){
                    res.status(200).json({ message: "Password updated", status_code:200 })
                }
                else{
                    res.status(200).json({ message: "Something went wrong", status_code:500 })
                }
            }
            else{
                res.status(200).json({ status_code:200, message: "Invalid user. Please try again" })
            }
        }
        else{
            res.status(200).json({ message:"incomplete data" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message, status_code:500 })
    }
}


export const updateProfile = async (req, res) => {
    const { id, username, avatar, cover,  designation} = req.body
    try {
        const valuesToUpdate = {
            username: username,
            avatar: avatar,
            cover: cover,
            designation: designation
        }
        Object.keys(valuesToUpdate).forEach(async (k) => {
            if(valuesToUpdate[k]){
                await User.findOneAndUpdate({
                    _id: id
                },
                {
                    $set: {
                        k: valuesToUpdate[k]
                    },
                })
            }
        })
        res.status(200).json({ status_code:200, message:"Profile updated" })
    } catch (error) {
        res.status(500).json({ status_code:500, message:error.message })
    }
}


export const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body
    try {
        if(!refreshToken) return res.sendStatus(401)
        jwt.verify(refreshToken, refresh_secret, (err, user)=>{
            if(err) return res.status(200).json({ status_code:403, message:err.message })
            const accessToken = jwt.sign({
                username: user.username,
                email: user.email
            }, access_secret ,{expiresIn: '30m'})
            res.status(200).json({ status_code: 200, access_token: accessToken })
        })        
    } catch (error) {
        res.status(500).json({ status_code: 500, message: error.message })
    }
}