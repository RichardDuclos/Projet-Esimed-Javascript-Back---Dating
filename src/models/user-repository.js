const { users }  = require('./db');
const User = require('./user.models');
const bcrypt = require("bcrypt");
const uuidv4 = require('uuid');

const { sequelize } = require('./db');
const { Op } = require("sequelize");

const getUsers = async function () {
    return await User.findAll({
        attributes: ["id", "firstName", "lastName", "password"]
    });
}
const getUserById = function (id) {
    return User.findAll();
}
const getUserByFirstName = function (fname) {
    return User.findAll({
        where : {
            firstName : {
                [Op.eq] : fname
            }
        }
    });
}
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
            password : user.password,
            role : user.role
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
const updateUser = async function (data) {
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
}
const checkPassword = async function (user){
    let targetUser = getUserByFirstName(user.firstName);
    if(targetUser === undefined) {
        return false;
    }
    return await bcrypt.compare(user.password, targetUser.password);
}
module.exports = {
    getUsers,
    getUserById,
    createUser,
    getUserByFirstName,
    updateUser,
    deleteUser,
    checkPassword
}
/*
createUser(
    {
        "firstName" : "Richard",
        "lastName" : "Duclos",
        "password" : "Password",
        "role" : "admin"
    });
createUser(
    {
        "firstName" : "John",
        "lastName" : "Doe",
        "password" : "Password"
    });
*/