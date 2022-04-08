const express = require('express')

const userRoutes = express.Router();
const userRepository = require('../models/user-repository');
const personRepository = require('../models/person-repository');
const meetingRepository = require('../models/meeting-repository');
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
/*
userRoutes.get('/:name', (req, res) => {
    res.status(200).send(userRepository.getUserByFirstName(req.params.name));
    }) ;
*/


userRoutes.route('/:id/')
    .get(guard.check([["admin"], ["member"]]), async (req, res) => {

        let user = await userRepository.getUserById(req.params.id);
        if(!user) {
            throw new Error("No user");
        }
        res.status(200).send({
            id: user.id,
            email : user.email,
            firstName : user.firstName,
            lastName : user.lastName,
            role : user.role
        });
    })
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

//GET all persons and create a person
userRoutes.route('/:id/persons')
    .get(guard.check([["admin"], ["member"]]),
        async (req, res) => {
        if((req.user.id !== req.params.id) && (req.user.roles.includes("admin"))) {
            return res.status(403).send();
        }

        const user = await userRepository.getUserById(req.params.id);

        if(!user) {
            return res.status(400).send();
        }
        //SEED
        //const person = await personRepository.getPersonById("67df3425-32d9-40f9-b5ca-f8ea39edc5e8");
        //const person2 = await personRepository.getPersonById("b35d7af9-866f-4862-a240-f4c8ee277d89");
        //await user.addPerson(person, { through: { comment: "j'adore" } })
        //await user.addPerson(person2, { through: { comment: "ça passe" } })
        const array = [];
        user.People.forEach(person =>
            {
                array.push({
                    id: person.id,
                    firstName : person.firstName,
                    lastName: person.lastName,
                    birthday: person.birthday,
                    comment : person.comment,
                    gender : person.gender
                });


        });
        res.status(200).send(array);
    })
    .post(guard.check([["admin"], ["member"]]),
        body('firstName').notEmpty()
            .withMessage("Veuillez saisir un prénom"),
        body('lastName').notEmpty()
            .withMessage("Veuillez saisir un nom"),
        body('gender').notEmpty()
            .withMessage("Veuillez saisir un genre"),
        body('gender').isIn(["M", "W", "O"])
            .withMessage("Veuillez saisir un genre valide"),

        body('birthday').isDate({format : "YYYY-MM-DD"})
            .withMessage("Veuillez saisir une date d'anniversaire"),
        async (req, res) => {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
        if((req.user.id !== req.params.id) && (req.user.roles.includes("admin"))) {
            return res.status(403).send();
        }

        const user = await userRepository.getUserById(req.params.id);
        if(!user) {
            return res.status(400).send();
        }
        let newPerson = user.People.find(p =>
            (req.body.firstName === p.firstName) &&
            (req.body.lastName === p.lastName) && (req.body.birthday === p.birthday));
        if(!newPerson) {
            newPerson = await personRepository.createPerson({
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                birthday : req.body.birthday,
                comment : req.body.comment,
                gender : req.body.gender
            });
        }
        await user.addPerson(newPerson)
        res.status(204).send();
    });
userRoutes.route('/:id/persons/:id_person/')
    .delete(guard.check([["admin"], ["member"]]), async (req, res) => {
        if((req.user.id !== req.params.id) && (req.user.roles.includes("admin"))) {
            return res.status(403).send();
        }
        const user = await userRepository.getUserById(req.params.id);
        if(!user) {
            return res.status(400).send();
        }
        const person = user.People.find(p => p.id === req.params.id_person);
        if(!person) {
            return res.status(400).send();

        }
        person.destroy();

        res.status(204).send();
    })
    .put(guard.check([["admin"], ["member"]]),
        body('comment').isLength({max : 500})
            .withMessage("Votre commentaire doit faire 500 caractères ou moins"),
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            if((req.user.id !== req.params.id) && (req.user.roles.includes("admin"))) {
                return res.status(403).send();
            }
            const user = await userRepository.getUserById(req.params.id);
            if(!user) {
                return res.status(400).send();
            }
            const person = user.People.find(p => p.id === req.params.id_person);
            person.comment = req.body.comment;
            person.save();
            res.status(204).send();
        })

userRoutes.route('/:id/meetings')
    .get(guard.check([["admin"], ["member"]]), async(req, res) => {
        if((req.user.id !== req.params.id) && (req.user.roles.includes("admin"))) {
            return res.status(403).send();
        }

        const user = await userRepository.getUserById(req.params.id);

        if(!user) {
            return res.status(400).send();
        }
        const people = user.People;
        const array = [];
        people.forEach(person => {

            person.Meetings.forEach(meeting => {
                array.push( {
                    person : {
                        id: person.id,
                        firstName : person.firstName,
                        lastName : person.lastName
                    },
                    meeting : {
                        id : meeting.id,
                        date : meeting.date,
                        place : meeting.place,
                        rank : meeting.rank,
                        comment : meeting.comment
                    }

                });
            });
        });
        res.status(200).send(array);
    });

userRoutes.route('/:id/persons/:id_person/meetings')
    .get(guard.check([["admin"], ["member"]]),
        async (req, res) => {
        if((req.user.id !== req.params.id) && (req.user.roles.includes("admin"))) {
            return res.status(403).send();
        }

        const user = await userRepository.getUserById(req.params.id);

        if(!user) {
            return res.status(400).send();
        }
        const person = user.People.find(p => p.id === req.params.id_person);
        if(!person) {
            return res.status(400).send();
        }
        const meetings = person.Meetings;
        const array = [];
        meetings.forEach(meeting =>
        {
            array.push({
                id: meeting.id,
                date : meeting.date,
                place: meeting.date,
                rank: meeting.rank,
            });


        });
        res.status(200).send(array);
    })
    .post(guard.check([["admin"], ["member"]]),
        body('comment').notEmpty()
            .withMessage("Veuillez écrire un commentaire"),
        body('comment').isLength({max: 500})
            .withMessage("Votre commentaire doit faire 500 caractères ou moins"),
        body('rank').notEmpty()
            .withMessage("Veuillez noter le rendez vous"),
        body('place').notEmpty()
            .withMessage("Veuillez renseigner le lieu"),
        body('date')./*isDate({format : "YYYY-MM-DD HH:II:SS"})*/isISO8601()
            .withMessage("Veuillez renseigner la date"),
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            if((req.user.id !== req.params.id) && (req.user.roles.includes("admin"))) {
                return res.status(403).send();
            }

            const user = await userRepository.getUserById(req.params.id);
            if(!user) {
                return res.status(400).send();
            }

            const person = user.People.find(p => p.id === req.params.id_person);
            if(!person) {
                return res.status(400).send();
            }
            const meeting = await meetingRepository.createMeeting({
                date : req.body.date,
                place : req.body.place,
                rank : req.body.rank,
                comment : req.body.comment
            });
            person.addMeetings(meeting);
            res.status(204).send();
        });

userRoutes.route('/:id/persons/:id_person/meetings/:meeting_id')
    .delete((guard.check([["admin"], ["member"]]),
        async (req, res) => {
            if((req.user.id !== req.params.id) && (req.user.roles.includes("admin"))) {
                return res.status(403).send();
            }

            const user = await userRepository.getUserById(req.params.id);

            if(!user) {
                return res.status(400).send();
            }
            const person = user.People.find(p => p.id === req.params.id_person);
            if(!person) {
                return res.status(400).send();
            }
            const meeting = person.Meetings.find(u => u.id === req.params.meeting_id);
            if(!meeting) {
                return res.status(400).send();

            }
            meeting.destroy();
            res.status(204).send();
        }));


exports.initializeRoutes = () => {
    return userRoutes;
}