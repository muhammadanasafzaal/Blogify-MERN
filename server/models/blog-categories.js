import mongoose from "mongoose";

const blogCategorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
  );
  
  const BlogCategory = mongoose.model('Categories', blogCategorySchema);
  export default BlogCategory