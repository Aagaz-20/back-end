const EventRegistration = require('../models/eventRegistration');
const Events = require('../models/events');

exports.postEventRegister = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const members = req.body.members;
    const collegeName = req.body.collegeName;
    const teamName = req.body.teamName;
    const eventName = req.body.eventName;

    try{
        const currentEvent = await EventRegistration.findOne({ email: email, eventName: eventName});

        if(currentEvent){
            return res.status(409).json({ msg: 'You have already registered for this Event'});
        }

        const eventRegistration = new EventRegistration({
            name: name,
            email:email,
            collegeName: collegeName,
            phone: phone,
            members: members,
            teamName: teamName,
            eventName: eventName
        })

        const response = await eventRegistration.save();
        return res.status(201).json({ msg: 'You have Successfully Registered for this event'});

    }
    catch(err){
        console.log(err);
    }
}

exports.getEventsData = async (req, res) => {
    try{
    const response = await Events.find({});

    return res.status(200).json({ data: response})
    }
    catch(err){
        console.log(err);
    }
}