const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')

const { User, Note, Team, Blog, ReadingList } = require('../models')

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: [
            {
                model: Note,
                attributes: { exclude: ['userId'] }
            },
            {
                model: Team,
                attributes: ['name', 'id'],
                through: {
                    attributes: []
                }
            }
        ]
    })
    res.json(users)
})

router.get('/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id, {
        attributes: { exclude: [''] },
        include: [{
            model: Note,
            attributes: { exclude: ['userId'] }
        },
        {
            model: Note,
            as: 'marked_notes',
            attributes: { exclude: ['userId'] },
            through: {
                attributes: []
            },
            include: {
                model: User,
                attributes: ['name']
            }
        },
        {
            model: Team,
            attributes: ['name', 'id'],
            through: {
                attributes: []
            }
        },
        {
            model: Blog,
            as: 'readings',
            attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
            through: {
                attributes: ['read', 'id']
            }
        }
        ]
    })

    if (user) {
        res.json(user)
    } else {
        res.status(404).end()
    }
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

// router.put('/:username', userFinder, async (req, res) => {
//     if (req.user) {
//         req.user.username = req.body.username
//         await req.user.save()
//         res.json(req.user)
//     } else {
//         res.status(404).end()
//     }
// })

const isAdmin = async (req, res, next) => {
    const user = await User.findByPk(req.decodedToken.id)
    if (!user.admin) {
        return res.status(401).json({ error: 'operation not allowed' })
    }
    next()
}

router.put('/:username', tokenExtractor, isAdmin, async (req, res) => {
    const user = await User.findOne({
        where: {
            username: req.params.username
        }
    })

    if (user) {
        user.disabled = req.body.disabled
        await user.save()
        res.json(user)
    } else {
        res.status(404).end()
    }
})

module.exports = router