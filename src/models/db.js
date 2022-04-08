const { Sequelize } = require('sequelize');

exports.sequelize = new Sequelize(`postgres://postgres:password@localhost/projet_js_1`, {
logging: false
})
