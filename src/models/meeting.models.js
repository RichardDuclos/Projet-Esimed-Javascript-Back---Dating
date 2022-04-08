const { sequelize } = require('./db');
const { Sequelize, DataTypes } = require('sequelize');
const User = require('./user.models');
const Person = require('./person.models');

const Meeting = sequelize.define('Meeting', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        date  : {
            type : DataTypes.DATE,
            allowNull: false
        },
       place : {
            type : DataTypes.STRING,
            allowNull: false
        },
        rank : {
            type : DataTypes.INTEGER
        },
        comment : {
            type : DataTypes.STRING
        }
});
module.exports = Meeting;