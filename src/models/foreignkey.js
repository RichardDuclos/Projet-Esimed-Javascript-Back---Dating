const { sequelize } = require('../models/db');
const queryInterface = sequelize.getQueryInterface();
const Person = require('./person.models');
const Own = require('./own.models')
const User = require('./user.models');
const Meeting = require('./meeting.models');
const initiate = async () => {
    await User.hasMany(Person, {onDelete : 'cascade'});
    await Person.hasMany(Meeting, {onDelete : 'cascade'});
}
module.exports = initiate;