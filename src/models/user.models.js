const { sequelize } = require('./db');
const { Sequelize, DataTypes } = require('sequelize');
const  uuidv4 = require('uuid');

 const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING
    }
}, {

});
module.exports = User;