import BlogPost from "../models/blog.js";
import BlogCategory from "../models/blog-categories.js";
import User from "../models/auth.js"
import mongoose from "mongoose";

export const getBlogs = async (req, res) => {
    const { title } = req.params
    try {
        let blogs;
        console.log(req.params,'===>')
        if (title) {
            blogs = await BlogPost.aggregate([
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "author",
                        "foreignField": "_id",
                        "as": "author"
                    }
                },
                { "$unwind": '$author' },
                {
                    "$match":
                    {
                        "title":
                        {
                            $regex: title,
                            $options: "i" // case-insensitive
                        }
                    }
                },
                {
                    "$project": {
                        "_id": 1,
                        "title": 1,
                        "content": 1,
                        "categories": 1,
                        "cover": 1,
                        "likes": 1,
                        "comments": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "author": {
                            "_id": "$author._id",
                            "username": "$author.username",
                            "designation": "$author.designation",
                            "avatar": "$author.avatar",
                            "avatar": "$author.avatar",
                            "followers": "$author.followers",
                            "following": "$author.following"
                        },
                    }
                }
            ]);
        }
        else {
            blogs = await BlogPost.aggregate([
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "author",
                        "foreignField": "_id",
                        "as": "author"
                    }
                },
                { $unwind: '$author' },
                {
                    "$project": {
                        "_id": 1,
                        "title": 1,
                        "content": 1,
                        "categories": 1,
                        "cover": 1,
                        "likes": 1,
                        "comments": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "author": {
                            "_id": "$author._id",
                            "username": "$author.username",
                            "designation": "$author.designation",
                            "avatar": "$author.avatar",
                            "avatar": "$author.avatar",
                            "followers": "$author.followers",
                            "following": "$author.following"
                        },
                    }
                }
            ]);
        }

        res.status(200).json({ status_code: 200, data: blogs })
    } catch (error) {
        res.status(500).json({ status_code: 500, message: error.message })
    }
}

export const addBlog = async (req, res) => {
    const { id } = req.params
    console.log(req.body)
    // console.log(req.file)
    try {
        if (id) {
            const user = await User.findOne({
                _id: id
            })
            if (user) {
                console.log(req.body.categories, 'bef')
                const tmpCat = req.body.categories.split(',')
                tmpCat?.forEach(cat => {
                    new mongoose.Types.ObjectId(cat)
                })
                req.body['categories'] = tmpCat
                const data = { ...req.body, cover: req.file.path, author: new mongoose.Types.ObjectId(user._id) }

                for (const key in data) {
                    if (!data[key]) {
                        res.status(200).json({ status_code: 400, message: "One or multiple field missing" })
                        return
                    }
                }
                const blog = new BlogPost(data)
                await blog.save()
                res.status(200).json({ status_code: 200, message: "Blog posted" })
            }
            else {
                res.status(200).json({ status_code: 200, message: "User not found" })
            }
        }
        else {
            res.status(200).json({ status_code: 404, message: "missing user id" })
        }

    } catch (error) {
        res.status(500).json({ status_code: 500, message: error.message })
    }
}

export const updateBlog = async (req, res) => {
    const { id } = req.params //blog id
    const { title, content, categories } = req.body
    const cover = req.files.path
    try {
        if (id) {
            const blog = await BlogPost.findOne({
                _id: id
            })
            if (blog) {
                const valuesToUpdate = {
                    title: title,
                    cover: cover,
                    designation: designation,
                    content: content,
                    categories: categories
                }
                Object.keys(valuesToUpdate).forEach(k => {
                    if (!valuesToUpdate[k]) {
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
                res.status(200).json({ status_code: 200, message: "Blog updated" })
            }
            else {
                res.status(200).json({ status_code: 200, message: "Blog not found" })
            }
        }
        else {
            res.status(200).json({ status_code: 404, message: "Missing blog id" })
        }

    } catch (error) {
        res.status(500).json({ status_code: 500, message: error.message })
    }
}

export const deleteBlogPost = async (req, res) => {
    const { id } = req.params // blog id
    console.log(id, 'del')
    try {
        if (id) {
            await BlogPost.findOneAndDelete({
                _id: id
            })
            res.status(200).json({ status_code: 200, message: "Blog deleted" })
        }
        else {
            res.status(404).json({ status_code: 404, message: "Missing blog id" })
        }
    } catch (error) {
        res.status(500).json({ status_code: 500, message: error.message })
    }
}

export const getBlogCategories = async (req, res) => {
    try {
        const categories = await BlogCategory.find()
        // console.log(categories, 'cat')
        res.status(200).json({ status_code: 200, data: categories })
    } catch (error) {
        res.status(500).json({ status_code: 500, message: error.message })
    }
}

export const addBlogCategories = async (req, res) => {
    const { categories } = req.body
    // console.log(categories , 'cat')
    try {
        if (categories.length) {
            for (const c of categories) {
                const newCat = new BlogCategory({
                    name: c
                })
                await newCat.save()
            }
            res.status(200).json({ status_code: 200, message: `${categories.length > 1 ? "categories" : "category"} added` })
        }
        else {
            res.status(200).json({ status_code: 404, message: "incomplete data" })
        }

    } catch (error) {
        res.status(500).json({ status_code: 500, message: error.message })
    }
}

export const getBlogsByCategory = async (req, res) => {
    const { id } = req.params
    try {
        const blogs = await BlogPost.aggregate([
            {
                "$lookup": {
                    "from": "users",
                    "localField": "author",
                    "foreignField": "_id",
                    "as": "author"
                }
            },
            { "$unwind": '$author' },
            { "$match": { "categories": new mongoose.Types.ObjectId(id) } },
            {
                "$project": {
                    "_id": 1,
                    "title": 1,
                    "content": 1,
                    "categories": 1,
                    "cover": 1,
                    "likes": 1,
                    "comments": 1,
                    "createdAt": 1,
                    "updatedAt": 1,
                    "author": {
                        "_id": "$author._id",
                        "username": "$author.username",
                        "designation": "$author.designation",
                        "avatar": "$author.avatar",
                        "avatar": "$author.avatar",
                        "followers": "$author.followers",
                        "following": "$author.following"
                    },
                }
            }
        ]);
        // console.log(categories, 'cat')
        if (blogs.length) {
            res.status(200).json({ status_code: 200, data: blogs })
        }
        else {
            res.status(200).json({ status_code: 404, message: "blog not found" })
        }
    } catch (error) {
        res.status(500).json({ status_code: 500, message: error.message })
    }
}

export const getBlogsForUser = async (req, res) => {
    const { id } = req.params //userid
    try {
        const blogs = await BlogPost.aggregate([
            {
                "$lookup": {
                    "from": "users",
                    "localField": "author",
                    "foreignField": "_id",
                    "as": "author"
                }
            },
            { "$unwind": '$author' },
            {
                "$match": {
                    "author._id": new mongoose.Types.ObjectId(id)  // Your match condition
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "title": 1,
                    "content": 1,
                    "categories": 1,
                    "cover": 1,
                    "likes": 1,
                    "comments": 1,
                    "createdAt": 1,
                    "updatedAt": 1,
                    "author": {
                        "_id": "$author._id",
                        "username": "$author.username",
                        "designation": "$author.designation",
                        "avatar": "$author.avatar",
                        "avatar": "$author.avatar",
                        "followers": "$author.followers",
                        "following": "$author.following"
                    },
                }
            },

        ]);
        if (blogs.length) {
            res.status(200).json({ status_code: 200, data: blogs })
        }
        else {
            res.status(200).json({ status_code: 404, message: "blogs not found" })
        }
    } catch (error) {
        res.status(500).json({ status_code: 500, message: error.message })
    }
}

export const saveReactionForPost = async (req, res) => {
    const { userId, blogId, like } = req.body
    try {
        if (userId && blogId) {
            let update = null;
            if (like) {
                update = await BlogPost.findOneAndUpdate({
                    _id: blogId
                },
                    {
                        $push: { likes: new mongoose.Types.ObjectId(userId) }
                    },
                    { upsert: true }
                )
            }
            else {
                update = await BlogPost.findOneAndUpdate({
                    _id: blogId
                },
                    {
                        $pull: { likes: new mongoose.Types.ObjectId(userId) }
                    })
            }

            console.log(update, 'sasasasas')
            if (update) {
                res.status(200).json({ status_code: 200, message: "Liked updated" })
            }
            else {
                res.status(200).json({ status_code: 404, message: "Blog not found" })
            }

        }
        else {
            res.status(200).json({ status_code: 400, message: "Missing fields" })
        }
    } catch (error) {
        res.status(500).json({ status_code: 500, message: error.message })
    }
}

export const saveUserComment = async (req, res) => {
    const { authorId, comment, blogId } = req.body
    try {
        if (!authorId || !comment || !blogId) return res.status(200).json({ status_code: 400, message: "Missing data for one or more fields" })
        const hasBlog = await BlogPost.findOne({
            _id: blogId
        })
        if (!hasBlog) return res.status(200).json({ status_code: 404, message: "Blog not found" })
        const author = await User.findOne({
            _id: authorId
        })
        if (!author) return res.status(200).json({ status_code: 404, message: "Author not found" })
        const commentData = {
            author_id: new mongoose.Types.ObjectId(author._id),
            author_name: author.username,
            author_avatar: author.avatar,
            blog_id: blogId,
            comment: comment
        }
        const update = await BlogPost.findOneAndUpdate({
            _id: blogId
        },
            {
                $push: { comments: commentData }
            },
            { upsert: true }
        )

        res.status(200).json({ status_code: 200, data: update })

    } catch (error) {
        res.status(500).json({ status_code: 500, message: error.message })
    }
}

export const saveReactionForComment = async (req, res) => {
    const { userId, blogId, commentId, like } = req.body
    try {
        if (userId && blogId && commentId) {
            let update = null;
            // const blog = await BlogPost.findOne({
            //     _id: blogId
            // })
            // if(!blog) return res.status(200).json({ status_code: 404, message:"Blog not found" })
            if (like) {
                console.log('push')
                update = await BlogPost.findOneAndUpdate(
                    {
                        "_id": blogId,
                        "comments._id": commentId
                    },
                    {
                        "$push": {
                            "comments.$[comments].likes": new mongoose.Types.ObjectId(userId)
                        }
                    },
                    {
                        "arrayFilters": [
                            {
                                "comments._id": commentId
                            }
                        ]
                    },
                    { upsert: true }
                )
            }
            else {
                console.log('pull')
                update = await BlogPost.findOneAndUpdate({
                    "_id": blogId,
                    "comments._id": commentId
                },
                    {
                        $pull: { "comments.$[comments].likes": new mongoose.Types.ObjectId(userId) }
                    },
                    {
                        "arrayFilters": [
                            {
                                "comments._id": commentId
                            }
                        ]
                    },
                )
            }

            if (update) {
                res.status(200).json({ status_code: 200, data: update, message: "Liked updated" })
            }
            else {
                res.status(200).json({ status_code: 404, message: "Blog not found" })
            }

        }
        else {
            res.status(200).json({ status_code: 400, message: "Missing fields" })
        }
    } catch (error) {
        res.status(500).json({ status_code: 500, message: error.message })
    }
}