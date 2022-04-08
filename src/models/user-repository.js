const User = require('./user.models');
const Person = require('./person.models');
const Own = require('./own.models');
const Meeting = require('./meeting.models');
const bcrypt = require("bcrypt");

const { sequelize } = require('./db');
const { Op } = require("sequelize");
require("../models/own.models");
const getUsers = async function () {
    return await User.findAll({
        attributes: ["id", "firstName", "lastName", "password"]
    });
}
const getUserById = async function (id) {
    const e = sequelize.models.Person;
    return await User.findOne({
        where: {
            id:  id
        },
        include:
            [
                {model : Person,
                include : {model : Meeting}},
            ]


    });
}
/*
const getUserByFirstName = function (fname) {
    return User.findAll({
        where : {
            firstName : {
                [Op.eq] : fname
            }
        }
    });
}*/
const createUser = async function (data) {
    const user = data;

    if((user.firstName !== undefined) &&
        (user.lastName !== undefined) &&
        (user.password !== undefined)) {
        if(!user.role) {
            user.role = "member";
        }
        let hash = await bcrypt.hash(user.password, 12);
        user.password = hash;
        await User.create({
            firstName : user.firstName,
            lastName : user.lastName,
            email : user.email,
            password : user.password,
            role : user.role,
            birthday : user.birthday
        });
        return true;
    }
    return false;

}
const deleteUser = async function(id) {
    await User.destroy({
       where : {
           id : id
       }
    });

    return true;
}
/*const updateUser = async function (data) {
    await User.update({
        firstName: data.firstName,
        lastName : data.lastName,
        password : data.password,
        role : data.role
    }, {
        where: {
            id: data.id
        }
    });
}*/
const checkPassword = async function (password, hash){
    console.log("mdp moi :" + password);
    console.log("mdp target :" + hash);
    return await bcrypt.compare(password, hash);
}
const getUserByEmail = async function (email) {
    return await User.findOne({
        where : {
            email : email
        }
    });
}

const Seed =  async () => {
    let users = await User.findAll();

    if(users.length === 0) {
        new Date(2001, 4, 1);
        createUser(
            {
                "firstName" : "Richard",
                "email" : "richard.duclos1004@gmail.com",
                "lastName" : "Duclos",
                "password" : "Password",
                "role" : "admin",
                "birthday" : new Date(2001, 4, 1)
            });
        createUser(
            {
                "firstName" : "John",
                "email" : "richard.duclos1004e@gmail.com",
                "lastName" : "Doe",
                "password" : "Password",
                "birthday" : new Date(2003, 1, 8)
            });
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    /*updateUser,*/
    deleteUser,
    checkPassword,
    getUserByEmail,
    Seed
}


