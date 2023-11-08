const bcryptService = require('../services/bcryptService'); // Assuming this service exists for password comparison
const userRepository = require('../repositories/userRepository'); // Assuming this repository exists for DB operations
const auth = require('../utils/auth'); // Assuming this utility exists for token generation
const response = require('../utils/response'); // Assuming this utility exists for standardized API responses
const ERROR_CODES = require('../constants/errorCodes'); // Assuming this constant file exists for error codes
const status = require('http-status'); // Assuming http-status package is used for HTTP status codes
const authenticateUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return response(res).error({
        code: ERROR_CODES.PARAMS_ERROR,
        message: 'Username and password are required.'
      }, status.BAD_REQUEST);
    }
    let user = await userRepository.findOne({
      where: { username }
    });
    if (!user) {
      return response(res).error({
        code: ERROR_CODES.USER_NOT_EXIST,
        message: 'User not found.'
      }, status.BAD_REQUEST);
    }
    user = user.toJSON();
    const passwordMatch = await bcryptService.comparePassword(password, user.password);
    if (!passwordMatch) {
      return response(res).error({
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Password is incorrect.'
      }, status.UNAUTHORIZED);
    }
    await userRepository.update({ logged_in: true }, { where: { id: user.id } });
    const token = auth.utils.issue({
      id: user.id,
      username: user.username
    });
    return response(res).success({ token });
  } catch (err) {
    return next(err);
  }
};
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
};
const UserController = () => {
  // ... existing methods
  return {
    // ... other methods
    authenticateUser,
    updateLoggedInStatus,
  };
};
module.exports = UserController;
