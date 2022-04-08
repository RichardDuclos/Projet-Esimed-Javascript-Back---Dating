const Meeting = require('./meeting.models');

const createMeeting = async function (data) {
    if((data.date !== undefined) &&
        (data.place !== undefined) &&
        (data.rank !== undefined)) {

        const meeting = await Meeting.create({
            date : data.date,
            place : data.place,
            rank : data.rank,
            comment : data.comment
        });
        return meeting;
    }
    return false;

}



module.exports = {

    createMeeting


}
