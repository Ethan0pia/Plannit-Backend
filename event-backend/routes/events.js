const express = require('express');
const statusCode = require('http-status');
const Event = require('../controllers/eventController');
var router = express.Router();

router.get('/', function(req, res) {
  return Event.getEvents(function(err, events) {
    if (err) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR);
    }
    for (const event in events) {
      event.date = new Date(event.date);
      delete event.organizer_id;
    }
    return res.status(statusCode.OK).json(events);
  });
});

router.get('/past', function(req, res, next) {
  return Event.getPastEvents(function(err, events) {
    if (err) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR);
    }
    for (const event in events) {
      event.date = new Date(event.date);
    }
    return res.status(statusCode.OK).json(events);
  });
});

//works
router.get('/short/:start/:limit', function(req, res) {
  if (isNaN(req.params.start) || isNaN(req.params.limit)) {
    return res.status(statusCode.CONFLICT).json({
      msg: 'start and/or limit were not numbers.'
    });
  }
  return Event.getEvents(function(err, events) {
    if (err) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR);
    }
    events.splice(0, req.params.start);
    events.splice(req.params.limit, events.length);
    for (const event in events) {
      event.date = new Date(event.date);
      delete event.organizer_id;
    }
    return res.status(statusCode.OK).json(events);
  });
});

//done
router.get('/event/:_id', function(req, res) {
  const id = req.params._id;
  Event.getEventById(id, function(err, event) {
    if (event === undefined || event === null) {
      return res.sendStatus(statusCode.NOT_FOUND);
    } else if (err) {
      return res.sendStatus(statusCode.INTERNAL_SERVER_ERROR);
    } else {
      delete event.organizer_id;
      event.date = new Date(event.date);
      return res.status(statusCode.OK).json(event);
    }
  });
});

//done
router.post('/', function(req, res) {
  const userProfile = JSON.parse(req.header('userProfile'));
  const user = userProfile.user;
  if (user && user._id && user.username) {
    req.body.organizer_id = user._id;
    req.body.organizer_username = user.username;
    if (
      req.body.name &&
      req.body.date &&
      req.body.location &&
      req.body.description &&
      req.body.category
    ) {
      return Event.addEvent(req.body, res);
    } else {
      return res.status(statusCode.BAD_REQUEST).json({
        msg:
          'You were missing a required field. Check the API documentation and try again.'
      });
    }
  }
  return res.status(statusCode.UNAUTHORIZED).json({
    msg: 'You are not logged in or did not send a user id'
  });
});

//done
router.put('/', function(req, res) {
  if (
    req.body.name &&
    req.body.date &&
    req.body.location &&
    req.body.description &&
    req.body.category &&
    req.body._id
  ) {
    if (req.body.organizer_username && req.body.organizer_id) {
      return Event.updateEvent(
        req.body._id,
        req.body,
        req.body.organizer_id,
        res
      );
    }
    return res.status(statusCode.UNAUTHORIZED).json({
      msg:
        'You are not logged in, did not send a user id, or did not send an event id'
    });
  } else {
    console.log(req.body);
    return res.sendStatus(statusCode.BAD_REQUEST);
  }
});

//done
router.delete('/:_id', function(req, res) {
  if (req.body.organizer_id && req.params._id) {
    return Event.deleteEvent(
      req.params._id,
      req.body.organizer_id,
      req.body.role,
      res
    );
  } else {
    return res.status(statusCode.UNAUTHORIZED).json({
      msg:
        'You are not logged in, did not send a user id, or did not send an event id'
    });
  }
});

module.exports = router;
