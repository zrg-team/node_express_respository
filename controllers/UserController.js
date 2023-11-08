// PATH: /controllers/UserController.js
const userRepository = require('../repositories/userRepository');
const response = require('../helpers/response');
const ERROR_CODES = require('../constants/errorCodes');
const status = require('http-status');
const updateLoggedInStatus = async (req, res, next) => {
  try {
    const { user_id, logged_in } = req.body;
    // Validate the "user_id" to ensure it corresponds to an existing user.
    const user = await userRepository.findById(user_id);
    if (!user) {
      return response(res).error({
        code: ERROR_CODES.USER_NOT_EXIST,
        message: 'User not found.',
      }, status.BAD_REQUEST);
    }
    // Update the "logged_in" column in the "users" table for the given "user_id".
    await userRepository.updateLoggedInStatus(user_id, logged_in);
    // Return a confirmation of the update.
    return response(res).success({ message: 'User logged-in status updated successfully.' });
  } catch (err) {
    return next(err);
  }
}
module.exports = {
  // ... other methods
  updateLoggedInStatus,
}
