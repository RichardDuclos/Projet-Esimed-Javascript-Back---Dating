const express = require('express')

const personRoutes = express.Router();
const personRepository = require('../models/person-repository');
let ejwt = require("express-jwt");
let jwt = require('jsonwebtoken');
const {body, validationResult} = require("express-validator");

let guard = require('express-jwt-permissions')({
    permissionsProperty : "roles"
})

require('dotenv').config()



/*
personRoutes.route('/')
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
 */

exports.initializeRoutes = () => {
    return personRoutes;
}