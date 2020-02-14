const mongoose = require('mongoose');
const User = require('../models/userModel');
const status = require('http-status');

// ###Create User
const addNewUser = (req, res) => {
  addUserHelper(User, req.body)
    .then(user => {
      const { password, ...sensitiveUser } = user._doc;
      res.status(status.CREATED).json(sensitiveUser);
    })
    .catch(err => {
      res.status(status.CONFLICT).json({ error: 'User already exists.' });
    });
};

// Helper: save a user
const addUserHelper = (mongoUserObject, data) => {
  return new Promise((resolve, reject) => {
    data.role = 0; //always default to 0
    mongoUserObject.create(data, (err, user) => {
      if (err) return reject(err);
      return resolve(user);
    });
  });
};
//Helper: query User object
const getAllUsersHelper = mongoUserObject => {
  return new Promise((resolve, reject) => {
    mongoUserObject.find({}, (err, users) => {
      if (err) return reject(err);
      return resolve(
        users.map(row => {
          let { password, ...y } = row._doc;
          return y;
        })
      );
    });
  });
};

//###Get All Users
const getAllUsers = (req, res) => {
  getAllUsersHelper(User)
    .then(users => {
      res.status(status.OK).json(users);
    })
    .catch(err => {
      res.sendStatus(status.UNAUTHORIZED);
    });
};

//###Get User by id

const getUserwithId = (req, res) => {
  User.findById(req.params._id, (err, user) => {
    if (err) {
      res.status(status.BAD_REQUEST).json({ error: 'Please try again' });
    } else if (user) {
      const { password, ...sensitiveUser } = user._doc;
      res.status(status.OK).json(sensitiveUser);
    } else {
      res.status(status.BAD_REQUEST).json('User does not exist');
    }
  });
};

//###Delete User
const deleteUser = (req, res) => {
  User.deleteOne({ _id: req.params._id }, (err, user) => {
    if (!user) {
      res.status(status.BAD_REQUEST).json({ error: 'Please try again' });
    } else if (user.n === 1) {
      res.status(status.OK).json('User deleted');
    } else {
      //case token remain but user removed from db
      res.status(status.BAD_REQUEST).json('User does not exist');
    }
  });
};
//###Update User profile except for password and email data
const updateUserProfile = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params._id },
    { $set: req.updatedProfile },
    { new: true },
    (err, user) => {
      if (err) {
        res.status(status.BAD_REQUEST).json('Failed to update');
      } else if (user) {
        const { password, ...sensitiveUser } = user._doc;
        res.status(status.OK).json(sensitiveUser);
      } else {
        res.status(status.UNAUTHORIZED).json('Failed to update');
      }
    }
  );
};

/**
 * Middleware updates loggedIn user password
 */
const updateUserPassword = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params._id },
    { $set: { password: req.body.password } },
    { new: true },
    (err, user) => {
      if (err) {
        res.status(status.BAD_REQUEST).json('Failed to update');
      } else if (user) {
        const { password, ...sensitiveUser } = user._doc;
        res.status(status.OK).json(sensitiveUser);
      } else {
        res.status(status.UNAUTHORIZED).json('Failed to update');
      }
    }
  );
};
/**
 * Middleware makes pre email updates checkup for loggedIn user
 * also checks for duplicates before the update
 */
const preProfileUpdateCheckup = (req, res, next) => {
  let updatedProfile = {};
  const { firstName, lastName, email } = req.body;
  if (firstName != undefined) updatedProfile.firstName = firstName;
  if (lastName != undefined) updatedProfile.lastName = lastName;

  if (email == req.loggedInUser.email) {
    updatedProfile.email = email; //no change
    req.updatedProfile = updatedProfile;
    return next();
  } else {
    User.findOne({ email: { $in: [email] } }).exec((err, user) => {
      if (err)
        return res
          .status(status.BAD_REQUEST)
          .json({ error: 'Please try again.' });
      if (!user) {
        updatedProfile.email = email;
        req.updatedProfile = updatedProfile;
        return next();
      }

      return res.status(status.CONFLICT).json({ msg: 'Email already exist' });
    });
  }
};

module.exports = {
  addNewUser,
  addUserHelper,
  getAllUsers,
  getAllUsersHelper,
  getUserwithId,
  deleteUser,
  updateUserProfile,
  updateUserPassword,
  preProfileUpdateCheckup
};
