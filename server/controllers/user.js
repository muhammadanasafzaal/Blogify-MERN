import User from '../models/auth.js'
import mongoose from "mongoose";

export const getUserProfile = async (req, res) => {
    const { id } = req.params
    try {
        if (id) {
            const user = await User.findOne({
                _id: id
            })
            if (user) {
                const user = await User.aggregate([
                    {
                        "$lookup": {
                            "from": "blogposts",
                            "localField": "_id",
                            "foreignField": "author",
                            "as": "user_blogs"
                        }
                    },
                    {
                        "$match": {
                          "_id": new mongoose.Types.ObjectId(id)  // Your match condition
                        }
                    },
                    {
                        "$project": {
                            "_id": 1,
                            "username": 1,
                            "email": 1,
                            "avatar": 1,
                            "cover": 1,
                            "followers": 1,
                            "following": 1,
                            "designation": 1,
                            "blog_count":{ $size: "$user_blogs"}
                        }
                    },
                ]);
               
                res.status(200).json({ status_code: 200, data: user[0] })
            }
            else {
                res.status(200).json({ status_code: 404, message: "User not found" })
            }
        }
        else {
            res.status(404).json({ status_code: 404, message: "incomplete data" })
        }
    } catch (error) {
        res.status(500).json({ status_code: 404, message: error.message })
    }
}

export const updateProfile = async (req, res) => {
    // const { id, username, avatar, cover, designation } = req.body
    // const files = req.files
    const id = req.params.id
    try {
        if(id){
            const user = await User.findOne({
                _id: id
            })
            if (user) {
                const valuesToUpdate = 
                (req.body.username || req.body.designation) ? req.body : 
                req.files.avatar ? { avatar: req.files.avatar[0].path } : 
                req.files.cover ? { cover: req.files.cover[0].path } : null
                await User.findOneAndUpdate({
                    _id: id
                },
                {
                    $set: valuesToUpdate
                })
                res.status(200).json({ status_code: 200, message: "Profile updated" })
            }
            else {
                res.status(404).json({ status_code: 404, message: "User not found" })
            }
        }
    } catch (error) {
        res.status(500).json({ status_code: 500, message: error.message })
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await User.find()
        if (users.length) {
            res.status(200).json({ status_code: 200, data: users })
        }
        else {
            res.status(200).json({ status_code: 404, message: "Users not found" })
        }
    } catch (error) {
        res.status(500).json({ status_code: 404, message: error.message })
    }
}


export const saveUnsaveFollowerForUser = async (req, res) => {
    const { userId, userToFollowId, hasFollowed } = req.body 
    try {
        let update=null;
        if(userId && userToFollowId){
            if(hasFollowed){
                update = await User.findOneAndUpdate({
                    _id: userToFollowId
                },
                {
                    $push: { followers: new mongoose.Types.ObjectId(userId) }
                },
                {upsert: true}
                )
            }
            else{
                update = await User.findOneAndUpdate({
                    _id: userToFollowId 
                },
                {
                    $pull: { followers: new mongoose.Types.ObjectId(userId) }
                })
            }
    
            if(update){
                res.status(200).json({ status_code:200, message: "User followed" })
            }
            else{
                res.status(200).json({ status_code:404, message:"User not found" })
            }
        }
        else{
            res.status(200).json({ status_code:400, message:"Missing fields" })
        }
        
    } catch (error) {
        res.status(500).json({ status_code:500, message: error.message })
    }
}