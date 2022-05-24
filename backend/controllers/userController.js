const bcrypt = require('bcryptjs')

const User = require('../models/userModel')

// Get All Users
const getAllUsers = async (req, res) => {
  let users

  try {
    users = await User.find()
  } catch (error) {
    console.log(error)
  }

  if (!users) {
    res.status(404)

    throw new Error('No users found')
  }

  res.status(200).json({ users })
}

// Create a new user
const singupUser = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)

    throw new Error('Please include all the fields')
  }

  // Check if user exists already
  let userExists

  try {
    userExists = await User.findOne({ email })
  } catch (error) {
    console.log(error)
  }

  if (userExists) {
    res.status(400)

    throw new Error('User already exists')
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  let user

  try {
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      blogs: []
    })
  } catch (error) {
    console.log(error)
  }

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      blogs: user.blogs
    })
  } else {
    req.status(400)

    throw new Error('Invalid user data')
  }
}

// Login User account
const loginUser = async (req, res) => {
  const { email, password } = req.body

  let user

  try {
    user = await User.findOne({ email })
  } catch (error) {
    console.log(error)
  }

  if (!user) {
    res.status(404)

    throw new Error(`Couldn't find user registered by this email`)
  }

  // check if email and password match
  const isMatching = bcrypt.compare(password, user.password)

  if (!isMatching) {
    res.status(400)

    throw new Error('Email or Password incorrect')
  }

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email
  })
}

module.exports = {
  getAllUsers,
  singupUser,
  loginUser
}
