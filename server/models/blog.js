import mongoose from "mongoose";


// Schema for comments
const commentSchema = new mongoose.Schema({
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  author_name: {
    type: String,
    required: true,
  },
  author_avatar: {
    type: String,
  },
  blog_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
    },
  ],
},
  {
    timestamps: true
  }
);

// Schema for blog posts
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categories', // Reference to the User model
      required: true
    },
  ],
  cover: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
    },
  ],
  comments: [commentSchema],
},
  {
    timestamps: true
  }
);

const BlogPost = mongoose.model('BlogPost', blogSchema);
export default BlogPost