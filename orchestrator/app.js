const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');
const httpStatus = require('http-status');
const got = require('got');

const gotAuthenticated = req => {
  let userProfile = false;
  if (req && req.authStatus) userProfile = req.authStatus;
  return got.extend({
    headers: {
      userProfile: JSON.stringify(userProfile)
    }
  });
};

const authController = require('./auth/authController');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, PUT, POST, PATCH, DELETE, HEAD'
  );
  res.header('Access-Control-Allow-Credentials', 'true');

  if ('OPTIONS' === req.method) {
    res.sendStatus(204);
  } else {
    next();
  }
});

app.use(authController.checkUserAuthStatus);

const port = process.env.PORT || 4000;
const orchApiUri = `/api/v${process.env.npm_package_version}`;

const eventDomain = 'http://event-backend:4000';
const eventVersion = '1.1.0';
const eventApiUri = `/api/v${eventVersion}`;

const userDomain = 'http://user-backend:4000';
const userVersion = '1.1.0';
const userApiUri = `/api/v${userVersion}`;

const allEventsUri = eventDomain + eventApiUri + '/events';
const allUsersUri = userDomain + userApiUri + '/users';

const loginUri = userDomain + userApiUri + '/users/login';
const logoutUri = userDomain + userApiUri + '/users/auth/logout';

//Get all Events
app.get(`${orchApiUri}/events`, (req, res) => {
  got
    .get(allEventsUri, { json: true })
    .then(response => {
      return res.status(response.statusCode).json(response.body);
    })
    .catch(err => {
      return res.status(err.statusCode).json(err.body);
    });
});

//Get Past Events
app.get(`${orchApiUri}/events/past`, (req, res) => {
  got
    .get(allEventsUri + '/past', { json: true })
    .then(response => {
      return res.status(response.statusCode).json(response.body);
    })
    .catch(err => {
      return res.status(err.statusCode).json(err.body);
    });
});

//Get events within range
app.get(`${orchApiUri}/events/short/:start/:limit`, (req, res) => {
  got
    .get(allEventsUri + '/short/' + req.params.start + '/' + req.params.limit, {
      json: true
    })
    .then(response => {
      return res.status(response.statusCode).json(response.body);
    })
    .catch(err => {
      return res.status(err.statusCode).json(err.body);
    });
});

//Get event with specific id
app.get(`${orchApiUri}/events/event/:_id`, (req, res) => {
  got
    .get(allEventsUri + '/event/' + req.params._id, { json: true })
    .then(response => {
      return res.status(response.statusCode).json(response.body);
    })
    .catch(err => {
      return res.status(err.statusCode).json(err.body);
    });
});

//Get event with specific id
app.put(`${orchApiUri}/events/`, (req, res) => {
  got
    .put(allEventsUri, { body: req.body, json: true })
    .then(response => {
      return res.status(response.statusCode).json(response.body);
    })
    .catch(err => {
      return res.status(err.statusCode).json(err.body);
    });
});

//Create an event
app.post(`${orchApiUri}/events`, (req, res) => {
  return gotAuthenticated(req)
    .post(allEventsUri, {
      body: req.body,
      json: true
    })
    .then(response => {
      return res.status(response.statusCode).json(response.body);
    })
    .catch(err => {
      return res.status(err.statusCode).json(err.body);
    });
});

//Get all Users
app.get(`${orchApiUri}/users`, (req, res) => {
  gotAuthenticated(req)
    .get(allUsersUri, { json: true })
    .then(response => {
      return res.status(response.statusCode).json(response.body);
    })
    .catch(err => {
      return res.status(httpStatus.UNAUTHORIZED).json(err.body);
    });
});

//Get user with specific id
app.get(`${orchApiUri}/users/:_id`, (req, res) => {
  gotAuthenticated(req)
    .get(allUsersUri + '/' + req.params._id, { json: true })
    .then(response => {
      return res.status(response.statusCode).json(response.body);
    })
    .catch(err => {
      return res.status(err.statusCode).json(err.body);
    });
});

//delete user by id
app.delete(`${orchApiUri}/users/:_id`, (req, res) => {
  gotAuthenticated(req)
    .delete(allUsersUri + '/' + req.params._id, { json: true })
    .then(response => {
      return res.status(response.statusCode).json(response.body);
    })
    .catch(err => {
      return res.status(err.statusCode).json(err.body);
    });
});

//update password
app.put(`${orchApiUri}/users/:_id/password`, (req, res) => {
  gotAuthenticated(req)
    .put(allUsersUri + '/' + req.params._id + '/password', {
      body: req.body,
      json: true
    })
    .then(response => {
      return res.status(response.statusCode).json(response.body);
    })
    .catch(err => {
      return res.status(err.statusCode).json(err.body);
    });
});

//update profile
app.put(`${orchApiUri}/users/:_id/profile`, (req, res) => {
  gotAuthenticated(req)
    .put(allUsersUri + '/' + req.params._id + '/profile', {
      body: req.body,
      json: true
    })
    .then(response => {
      return res.status(response.statusCode).json(response.body);
    })
    .catch(err => {
      return res.status(err.statusCode).json(err.body);
    });
});

//Create a user
app.post(`${orchApiUri}/users`, (req, res) => {
  return got
    .post(allUsersUri, {
      body: req.body,
      json: true
    })
    .then(response => {
      return res.status(response.statusCode).json(response.body);
    })
    .catch(err => {
      return res.status(err.statusCode).json(err.body);
    });
});

//Login
app.post(`${orchApiUri}/users/login`, (req, res) => {
  return got(loginUri, {
    body: req.body,
    json: true
  })
    .then(response => {
      res
        .status(response.statusCode)
        .cookie('token', authController.generateJwtToken(response.body), {
          httpOnly: true,
          path: '/'
        })
        .json(response.body);
    })
    .catch(err => {
      return res.status(httpStatus.UNAUTHORIZED).json(err.body);
    });
});

//Logout
app.get(`${orchApiUri}/users/auth/logout`, (req, res) => {
  got
    .get(logoutUri, {
      json: false
    })
    .then(response => {
      res
        .clearCookie('token', { path: '/' })
        .status(response.statusCode)
        .json('ok');
    })
    .catch(err => {
      return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    });
});

//global error handling
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(httpStatus.UNAUTHORIZED).send('Unauthorized');
  } else {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ errorType: err.name });
  }
});
const httpServer = http.createServer(app);
httpServer.listen(port);

module.exports = app;
