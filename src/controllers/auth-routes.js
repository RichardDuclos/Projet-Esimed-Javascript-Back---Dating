const express = require('express')

const authRoute = express.Router();
const userRepository = require('../models/user-repository');
let ejwt = require("express-jwt");
let jwt = require('jsonwebtoken');

let guard = require('express-jwt-permissions')({
    permissionsProperty : "roles"
})
require('dotenv').config()

let auth = require("../security/auth");

const { body, validationResult } = require('express-validator')

//LOGIN REQUEST
authRoute.post('/login',
    body('firstName').notEmpty(),
    body('password').notEmpty()
    , async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let result = await userRepository.checkPassword(req.body);
    if(!result) {
        return res.status(401).send();
    }
    let user = userRepository.getUserByFirstName(req.body.firstName);
    let token = auth.getJWT(user.id, user.role);
    res.status(200).send(token);
});

//CREATE USER
authRoute.post(
    '/register',
    body('firstName').notEmpty()
        .withMessage("Prenom requis"),
    body('lastName').notEmpty()
    .withMessage("Nom requis"),
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

exports.initializeRoutes = () => {
    return authRoute;
}