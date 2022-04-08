const { sequelize } = require('./db');
const { Sequelize, DataTypes } = require('sequelize');
const Own = require('./own.models');

const User = require('./user.models');

const Person = sequelize.define('Person', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender : {
        type : DataTypes.STRING
    },
    birthday : {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    comment :  {
        type: DataTypes.TEXT,
        allowNull: true
    },
}, {

});

module.exports = Person;
