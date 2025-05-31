const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const notesRouter = require('./controllers/notes')
const blogsRouter = require('./controllers/blog')

app.use(express.json())

app.use('/api/notes', notesRouter)
app.use('/api/blogs', blogsRouter)

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