require('dotenv').config()
const { Sequelize, QueryTypes, Model, DataTypes, BOOLEAN } = require('sequelize')
const express = require('express')
const app = express()

app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL)

class Blog extends Model { }
Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: {
        type: DataTypes.TEXT,

    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
}
)

Blog.sync()

app.get('/api/blogs', async (req, res) => {
    const blogs = await Blog.findAll()
    res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {

    console.log('req.body', req.body)

    try {
        const blog = await Blog.create(req.body)
        res.json(blog)
    } catch (error) {
        console.log('error', error)
        return res.status(400).json({ error })
    }

})

app.delete('/api/blogs/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
        console.log('blog to delete: ', blog.toJSON())
        await blog.destroy();
        res.json({
            "message": "blog deleted",
            "blog": blog
        })
    } else {
        res.status(404).end()
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})