const Person = require('./person.models');
const bcrypt = require("bcrypt");

const { sequelize } = require('./db');
const { Op } = require("sequelize");
const User = require("./user.models");

const getPersons = async function () {
    return await Person.findAll();
}
/*const getUserById = async function (id) {
    return await User.findOne({
        where: {
            id:  id
        }
    });
}
*/
const getPerson = async function (firstName, lastName, birthday ) {
    return await Person.findOne({
        where: {
            firstName:  firstName,
            lastName: lastName,
            birthday : birthday
        }
    });
}
const createPerson = async function (data) {
    if((data.firstName !== undefined) &&
        (data.lastName !== undefined) &&
        (data.birthday !== undefined)) {

        const person = await Person.create({
            firstName : data.firstName,
            lastName : data.lastName,
            birthday : data.birthday,
            comment : data.comment,
            gender : data.gender
        });
        return person;
    }
    return false;

}
const getPersonById = async function (id) {
    return await Person.findOne({
        where: {
            id:  id
        }
    });
}


module.exports = {
    getPersons,
    getPerson,
    getPersonById,
    createPerson
    /*
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    checkPassword,
    getUserByEmail*/

}
