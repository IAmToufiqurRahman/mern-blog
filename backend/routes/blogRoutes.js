const express = require('express')

const router = express.Router()

const { getAllBlogs, addNewBlog, updateBlog, getSingleBlog, deleteBlog, getBlogByUserId } = require('../controllers/blogController')

router.get('/', getAllBlogs)

router.post('/add', addNewBlog)

router.put('/update/:id', updateBlog)

router.get('/:id', getSingleBlog)

router.delete('/:id', deleteBlog)

router.get('/user/:id', getBlogByUserId)

module.exports = router
