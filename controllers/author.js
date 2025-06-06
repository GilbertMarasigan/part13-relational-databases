const router = require('express').Router()

const { Blog, } = require('../models')
const { fn, col } = require('sequelize')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.get('/', async (req, res) => {

    const blogs = await Blog.findAll({
        attributes: [
            'author',
            [fn('COUNT', col('id')), 'blogs'],
            [fn('SUM', col('likes')), 'likes']
        ],
        group: ['author'],
        order: [[fn('SUM', col('likes')), 'DESC']]
    })
    res.json(blogs)

})


module.exports = router