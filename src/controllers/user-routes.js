const express = require('express')

const userRoutes = express.Router();
const userRepository = require('../models/user-repository');
let ejwt = require("express-jwt");
let jwt = require('jsonwebtoken');
const {body, validationResult} = require("express-validator");

let guard = require('express-jwt-permissions')({
    permissionsProperty : "roles"
})

require('dotenv').config()



//GET ALL USERS
userRoutes.route('/')
    .get( guard.check([["admin"], ["member"]]), async (req, res) => {

    res.status(200).send( await userRepository.getUsers());
    })
    .post(guard.check(["admin"]),
    body('firstName').notEmpty(),
    body('lastName').notEmpty(),
    body('password').isLength({ min: 8 })
        .withMessage("Le mot de passe doit faire 8 caractères minimum"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        if(userRepository.getUserByFirstName(req.body.firstName)) {
            return res.status(405).send();
        }
        userRepository.createUser(req.body);

        res.status(201).send();

    });
//GET USER BY NAME
userRoutes.get('/:name', (req, res) => {
    res.status(200).send(userRepository.getUserByFirstName(req.params.name));
    }) ;


userRoutes.route('/:id/')
    .put(guard.check(["admin"]), (req, res) => {

        let result = userRepository.updateUser(req.body);
        if(!result) {
            throw new Error("Update failed");
        }
        res.status(204).send();
    })
    .delete(guard.check(["admin"]), async (req, res) => {

        let result = await userRepository.deleteUser(req.params.id);
        if(!result) {
            throw new Error("Delete failed");
        }
        res.status(204).send();
});
exports.initializeRoutes = () => {
    return userRoutes;
}