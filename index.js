const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const notesRouter = require('./controllers/notes')
const blogsRouter = require('./controllers/blog')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/user')
const authorsRouter = require('./controllers/author')

app.use(express.json())

app.use('/api/login', loginRouter)
app.use('/api/notes', notesRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/authors', authorsRouter)


// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong.' })
})


const start = async () => {
    try {
        await connectToDatabase()
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    } catch (error) {
        console.error('Failed to start app:', error)
    }
}


start()