var mongoose = require('mongoose');
var eventSchema = require('../models/eventModel');
const statusCode = require('http-status');
const Event = mongoose.exports = mongoose.model('Event', eventSchema);

//Get events
module.exports.getEvents = function(callback, limit) {
  return Event.find({
    date: {
      $gte: new Date()
    }
  }, callback).sort({
    date: 1
  }).limit(limit);
};
module.exports.getPastEvents = function(callback, limit) {
  return Event.find({
    date: {
      $lte: new Date()
    }
  }, callback).sort({
    date: 1
  }).limit(limit);
};
 
//Get event
module.exports.getEventById = function(id, callback) {
  Event.findById(id, callback);
};

//Add event
module.exports.addEvent = function(event, res) {
  event.date = Date.parse(event.date);
  return Event.create(event, function(err, event){
    if(err){
      return res.sendStatus(statusCode.INTERNAL_SERVER_ERROR);
    }
    event.toObject();
    delete event.organizer_id;
    return res.status(statusCode.CREATED).json(event);
  });
};

//edit Event
module.exports.updateEvent = function (id, event, user_id, res) {
  const query = {
    '_id': id
  };
  return Event.findById(id, function (err, oldEvent) {
    if(err){
      return res.sendStatus(statusCode.NOT_FOUND);
    }
    if (oldEvent._id) {
      if (oldEvent.organizer_id === user_id) {
        event.date = Date.parse(event.date);
        return Event.findOneAndUpdate(query, event, {}, function (err, event) {
          if(err){
            return res.sendStatus(statusCode.INTERNAL_SERVER_ERROR);
          }
          return Event.findById(id, function (err, event) {
            if(err){
              return res.sendStatus(statusCode.INTERNAL_SERVER_ERROR);
            }
            return res.status(statusCode.ACCEPTED).json(event);
          });
        });
      }else {
        return res.status(statusCode.UNAUTHORIZED).json({
          'msg': 'you are not authorized to edit that event.'
        });
      }
    } else {
      return res.status(statusCode.NOT_FOUND).json(event);
    }
  });
};

//delete Event
module.exports.deleteEvent = function (event_id, user_id, role, res) {
  const query = {
    '_id': event_id
  };
  this.getEventById(event_id, function (err, event) {
    if(err){
      return res.sendStatus(statusCode.NOT_FOUND);
    }
    if (event && event._id) {
      if (event.organizer_id === user_id || role===1) {
        return Event.remove(query, function(err){
          if(err){
            return res.sendStatus(statusCode.INTERNAL_SERVER_ERROR);
          }
          return res.sendStatus(statusCode.GONE);
        });
      }else {
        return res.status(statusCode.UNAUTHORIZED).json({
          'msg': 'you are not authorized to delete that event.'
        });
      }
    } else {
      return res.sendStatus(statusCode.NOT_FOUND);
    }
  });
  
};
