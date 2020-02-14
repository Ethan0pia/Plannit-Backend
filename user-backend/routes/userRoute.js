var express = require('express');
var router = express.Router();
const httpStatus = require('http-status');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// GET request to get all users
router
  .route('/')
  .get(authController.checkAdminRole, userController.getAllUsers)
  // POST request to add new user to database
  .post(
    authController.signupValidators,
    authController.checkValidationResult,
    authController.checkDuplicateUser,
    authController.saveHashPassword,
    userController.addNewUser
  );

//request with id
router
  .route('/:_id')
  .get(authController.verifyRequestWithId, userController.getUserwithId)
  .delete(authController.verifyRequestWithId, userController.deleteUser);

//update password
router
  .route('/:_id/password')
  .put(
    authController.passwordUpdateValidators,
    authController.checkValidationResult,
    authController.verifyRequestWithId,
    authController.saveHashPassword,
    userController.updateUserPassword
  );

//update profile
router
  .route('/:_id/profile')
  .put(
    authController.profileUpdateValidators,
    authController.checkValidationResult,
    authController.verifyRequestWithId,
    userController.preProfileUpdateCheckup,
    userController.updateUserProfile
  );

//login
router
  .route('/login')
  .post(
    authController.loginValidators,
    authController.checkValidationResult,
    (req, res) => {
      authController.verifyValidUser(
        req.body.email,
        req.body.password,
        (err, user) => {
          if (err) return res.status(httpStatus.UNAUTHORIZED).json(err);
          return res.status(httpStatus.OK).json(user);
        }
      );
    }
  );

//logout
router.route('/auth/logout').get((req, res) => {
  return res.sendStatus(httpStatus.OK);
});
module.exports = router;
