const { mongoose } = require('mongoose')

const Blog = require('../models/blogModel')
const User = require('../models/userModel')

// Get All Blogs
const getAllBlogs = async (req, res) => {
  let blogs

  try {
    blogs = await Blog.find()
  } catch (error) {
    console.log(error)
  }

  if (!blogs) {
    res.status(500)

    throw new Error('Nothing found!')
  }

  return res.status(200).json({ blogs })
}

// Add New Blog
const addNewBlog = async (req, res) => {
  const { title, description, image, user } = req.body

  // Author of the blog
  let existingUser

  try {
    existingUser = await User.findById(user)
  } catch (error) {
    console.log(error)
  }

  if (!existingUser) {
    res.status(400)

    throw new Error('Unable to create new blog')
  }

  // Create blog
  let newBlog = new Blog({
    title,
    description,
    image,
    user
  })

  try {
    const session = await mongoose.startSession()

    session.startTransaction()

    await newBlog.save({ session })

    // push the new blog to the author user's blogs array
    existingUser.blogs.push(newBlog)

    await existingUser.save({ session })

    await session.commitTransaction()
  } catch (error) {
    console.log(error)

    await session.abortTransaction()
  }

  if (!newBlog) {
    res.status(500)

    throw new Error('Unable to create the blog')
  }

  res.status(201).json(newBlog)
}

// Update existing blog
const updateBlog = async (req, res) => {
  const blogId = req.params.id

  if (!blogId) {
    res.status(404)

    throw new Error('Blog not found')
  }

  const { title, description } = req.body

  let updatedBlog

  try {
    updatedBlog = await Blog.findByIdAndUpdate(blogId, {
      title,
      description
    })
  } catch (error) {
    console.log(error)
  }

  if (!updateBlog) {
    res.status(500)

    throw new Error('Unable to update the blog')
  }

  res.status(200).json(updatedBlog)
}

// Get a Blog by it's id
const getSingleBlog = async (req, res) => {
  const blogId = req.params.id

  if (!blogId) {
    res.status(404)

    throw new Error('Invalid blog id')
  }

  let blog

  try {
    blog = await Blog.findById(blogId)
  } catch (error) {
    console.log(error)
  }

  if (!blog) {
    res.status(500)

    throw new Error('Unable to get the blog')
  }

  res.status(200).json(blog)
}

// Delete a single blog
const deleteBlog = async (req, res) => {
  const blogId = req.params.id

  if (!blogId) {
    res.status(404)

    throw new Error('Invalid blog id')
  }

  let blog

  try {
    blog = await Blog.findByIdAndRemove(blogId).populate('user')

    await blog.user.blogs.pull(blog)

    await blog.user.save()
  } catch (error) {
    console.log(error)
  }

  if (!blog) {
    res.status(500)

    throw new Error('Unable to delete')
  }

  res.status(200).json({ success: true })
}

// Get blog by user id
const getBlogByUserId = async (req, res) => {
  const userId = req.params.id

  let userBlogs

  try {
    userBlogs = await User.findById(userId).populate('blogs')
  } catch (error) {
    console.log(error)
  }

  if (!userBlogs) {
    res.status(400)

    throw new Error('No blog found')
  }

  res.status(200).json(userBlogs)
}

// Export all modules
module.exports = {
  getAllBlogs,
  addNewBlog,
  updateBlog,
  getSingleBlog,
  deleteBlog,
  getBlogByUserId
}
