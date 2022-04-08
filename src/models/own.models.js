const { sequelize } = require('./db');
const { Sequelize, DataTypes } = require('sequelize');
const User = require('./user.models');
const Person = require('./person.models');

const Own = sequelize.define('Own', {



}, {

});
module.exports = Own;
