const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const notesRouter = require('./controllers/notes')
const blogsRouter = require('./controllers/blog')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/user')

app.use(express.json())

app.use('/api/login', loginRouter)
app.use('/api/notes', notesRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)


// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong.' })
})

const start = async () => {
    await connectToDatabase()
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

start()