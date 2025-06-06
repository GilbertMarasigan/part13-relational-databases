const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { Blog, User } = require('../models')
const { SECRET } = require('../util/config')
const { Op } = require('sequelize')

const asyncHandler = require('../util/asyncHandler')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.get('/', async (req, res) => {

    const where = {}

    if (req.query.search) {
        const search = `%${req.query.search.toLowerCase()}%`

        where[Op.or] = [
            { title: { [Op.iLike]: search } },
            { author: { [Op.iLike]: search } }
        ]
    }

    const blogs = await Blog.findAll({
        include: {
            model: User,
            attributes: ['username', 'name'] // optional
        },
        where,
        order: [['likes', 'DESC']]
    })
    res.json(blogs)
})

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        } catch (error) {
            return res.status(401).json({ error: 'token invalid' })
        }
    } else {
        return res.status(401).json({ error: 'token missing' })
    }
    next()
}


router.post('/', tokenExtractor, async (req, res) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)
        const blog = await Blog.create({ ...req.body, userId: user.id, date: new Date() })
        res.json(blog)
    } catch (error) {
        return res.status(400).json({ error })
    }
})

router.get('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        res.json(req.blog)
    } else {
        res.status(404).end()
    }
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
    if (!req.blog) {
        return res.status(404).json({ error: 'Blog not found' })
    }

    // Check if logged-in user is the owner
    if (req.blog.userId !== req.decodedToken.id) {
        return res.status(403).json({ error: 'You are not allowed to delete this blog' })
    }

    await req.blog.destroy()
    res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        req.blog.likes = req.body.likes
        await req.blog.save()
        res.json(req.blog)
    } else {
        res.status(404).end()
    }
})

module.exports = router