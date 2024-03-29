const { sequelize } = require('./db');
const { Sequelize, DataTypes } = require('sequelize');
const Person = require('./person.models');
const Own = require('./own.models');

 const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    email : {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false

    },
     role: {
         type: DataTypes.STRING,
         allowNull: false,
         defaultValue : "member"
     },
     birthday : {
        type: DataTypes.DATEONLY,
         allowNull: false
     }
}, {

});
module.exports = User;
