const dotenv = require('dotenv').config()
const express = require('express')

const connectDB = require('./config/db')
const { errorHandler } = require('./middleware/errorMiddleware')

const PORT = process.env.PORT || 5000

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/blog', require('./routes/blogRoutes'))

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
