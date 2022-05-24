const express = require('express')

const router = express.Router()

const { getAllUsers, singupUser, loginUser } = require('../controllers/userController')

router.get('/', getAllUsers)

router.post('/signup', singupUser)

router.post('/login', loginUser)

module.exports = router
