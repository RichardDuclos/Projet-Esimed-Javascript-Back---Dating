const { Sequelize } = require('sequelize');

exports.sequelize = new Sequelize(`postgres://postgres:password@localhost/tp_node`)
