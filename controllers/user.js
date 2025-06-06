const router = require('express').Router()

const { User, Note, Blog } = require('../models')

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: {
            model: Blog,
            attributes: { exclude: ['id'] }
        }
    })
    res.json(users)
})

router.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.json(user)
    } catch (error) {
        return res.status(400).json({ error })
    }
})

router.get('/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id)
    if (user) {
        res.json(user)
    } else {
        res.status(404).end()
    }
})

const userFinder = async (req, res, next) => {
    req.user = await User.findOne({ where: { username: req.params.username } })
    next()
}

router.put('/:username', userFinder, async (req, res) => {
    if (req.user) {
        req.user.username = req.body.username
        await req.user.save()
        res.json(req.user)
    } else {
        res.status(404).end()
    }
})

module.exports = router