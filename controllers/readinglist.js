const router = require('express').Router()

const { ReadingList } = require('../models')

router.post('/', async (req, res) => {
    try {
        const readinglist = await ReadingList.create(req.body)
        res.json(readinglist)
    } catch (error) {
        return res.status(400).json({ error })
    }
})


module.exports = router