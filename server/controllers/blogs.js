import BlogPost from "../models/blog.js";
import BlogCategory from "../models/blog-categories.js";
import User from "../models/auth.js"
import mongoose from "mongoose";

export const getBlogs = async (req, res) => {
    try {
        // const blogs = await BlogPost.find()
        const blogs = await BlogPost.aggregate([
            {
              "$lookup": {
                "from": "users",
                "localField": "author",
                "foreignField": "_id",
                "as": "author"
              }
            },
            {$unwind: '$author'},
            {
              "$project": {
                "_id": 1,
                "title": 1,
                "content":1,
                "categories": 1,
                "cover": 1,
                "likes": 1,
                "comments": 1,
                "createdAt": 1,
                "updatedAt": 1,
                "author":{
                    "_id":"$author._id",
                    "username":"$author.username",
                    "designation":"$author.designation",
                    "avatar":"$author.avatar",
                    "avatar":"$author.avatar",
                    "followers":"$author.followers",
                    "following":"$author.following"
                },
              }
            }
      ]);
          
        res.status(200).json({ status_code:200, data: blogs })
    } catch (error) {
        res.status(500).json({ status_code:500, message: error.message })
    }
}

export const addBlog = async (req, res) => {
    const { id } = req.params
    try {
        if(id){
            const user = await User.findOne({
                _id:id
            })
            if(user){
                const blog = new BlogPost({
                    ...req.body,
                    author: new mongoose.Types.ObjectId(user._id)
                })
                await blog.save()
                res.status(200).json({ status_code:200, message: "Blog posted" })
            }
            else{
                res.status(200).json({ status_code:200, message: "User not found" })
            }
        }
        else{
            res.status(200).json({ status_code:404, message: "incomplete data" })
        }
                
    } catch (error) {
        res.status(500).json({ status_code:500, message: error.message })
    }
}


export const updateBlog = async (req, res) => {
    const { id } = req.params //blog id
    const { cover, designation, title, content, categories } = req.body
    try {
        if(id){
            const blog = await BlogPost.findOne({
                _id:id
            })
            if(blog){
                const valuesToUpdate = {
                    title: title,
                    cover: cover,
                    designation: designation,
                    content: content,
                    categories: categories
                }
                Object.keys(valuesToUpdate).forEach(k => {
                    if(!valuesToUpdate[k]){
                        delete valuesToUpdate[k]
                    }
                })
                console.log(valuesToUpdate, 'blog update')
                await BlogPost.findOneAndUpdate({
                    _id: id
                },
                {
                    $set: valuesToUpdate
                })
                res.status(200).json({ status_code:200, message: "Blog updated" })
            }
            else{
                res.status(200).json({ status_code:200, message: "Blog not found" })
            }
        }
        else{
            res.status(200).json({ status_code:404, message: "Missing blog id" })
        }
                
    } catch (error) {
        res.status(500).json({ status_code:500, message: error.message })
    }
}

export const deleteBlogPost = async (req, res) => {
    const { id } = req.params // blog id
    console.log(id, 'del')
    try {
        if(id){
            await BlogPost.findOneAndDelete({
                _id: id
            })
            res.status(200).json({ status_code:200, message: "Blog deleted" })
        }
        else{
            res.status(404).json({ status_code:404, message: "Missing blog id" })
        }
    } catch (error) {
        res.status(500).json({ status_code:500, message: error.message })
    }
}

export const getBlogCategories = async (req, res) => {
    try {
        const categories = await BlogCategory.find()
        console.log(categories, 'cat')
        res.status(200).json({ status_code:200, data: categories })
    } catch (error) {
        res.status(500).json({ status_code:500, message: error.message })
    }
}

export const addBlogCategories = async (req, res) => {
    const { categories } = req.body
    console.log(categories , 'cat')
    try {
        if(categories.length){
            for (const c of categories) {
                const newCat = new BlogCategory({
                    name: c
                })
                await newCat.save()
            }
            res.status(200).json({ status_code:200, message: `${categories.length > 1 ? "categories" : "category"} added` })
        }
        else{
            res.status(200).json({ status_code:404, message: "incomplete data" })
        }
                
    } catch (error) {
        res.status(500).json({ status_code:500, message: error.message })
    }
}
