const Note = require('./note')
const Blog = require('./blog')
const User = require('./user')

User.hasMany(Note)
Note.belongsTo(User)

User.hasMany(Blog)
Blog.belongsTo(User)

const syncModels = async () => {
    await User.sync({ alter: true })
    await Note.sync({ alter: true })
    await Blog.sync({ alter: true })
}

syncModels()

module.exports = {
    Note,
    Blog,
    User
}