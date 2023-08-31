import User from '../models/auth.js'

export const getUserProfile = async (req, res) => {
    const { id } = req.params
    console.log(id)
    try {
        if(id){
            const user = await User.findOne({
                _id:id
            })
            if(user){
                res.status(200).json({ status_code: 200, data: user })
            }
            else{
                res.status(200).json({ status_code: 404, message: "User not found" })
            }
        }
        else{
            res.status(404).json({ status_code: 404, message: "incomplete data" })
        }
    } catch (error) {
        res.status(500).json({ status_code: 404, message: error.message })
    }
}

export const updateProfile = async (req, res) => {
    const { id, username, avatar, cover,  designation} = req.body
    try {
        const user = await User.findOne({
            _id:id
        })
        if(user){
            const valuesToUpdate = {
                username: username,
                avatar: avatar,
                cover: cover,
                designation: designation
            }
            await User.findOneAndUpdate({
                _id: id
            },
            {
                $set: valuesToUpdate
            })
            res.status(200).json({ status_code:200, message:"Profile updated" })
        }
        else{
            res.status(404).json({ status_code:404, message:"User not found" })
        }

    } catch (error) {
        res.status(500).json({ status_code:500, message:error.message })
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await User.find()
        if(users.length){
            res.status(200).json({ status_code: 200, data: users })
        }
        else{
            res.status(200).json({ status_code: 404, message: "Users not found" })
        }
    } catch (error) {
        res.status(500).json({ status_code: 404, message: error.message })
    }
}