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

const Seed =  async () => {
    let persons = await Person.findAll();
    if (persons.length === 0) {
        new Date(2001, 4, 1);

        createPerson(
            {
                firstName: "Marie-Amélie",
                lastName: "Lanoux",
                gender : "W",
                birthday: new Date(2003, 0, 8)
            });
    }
}
module.exports = {
    getPersons,
    getPerson,
    Seed,
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
