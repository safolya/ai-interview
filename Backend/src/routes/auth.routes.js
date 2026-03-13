const {Router} = require('express');
const authController=require("../controller/auth.controller");
const authMiddleware=require("../middleware/auth.middleware");
const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register',authController.registerUser);

/**
 * @route POST /api/auth/login
 * @desc Login a user using email and password, and return a JWT token
 * @access Public
 */
router.post('/login',authController.loginUser);

/**
 * @route GET /api/auth/logout
 * @desc Logout user by blacklisting the JWT token
 * @access Public
 */
router.get('/logout',authController.logoutUser);

/**
 * @route GET /api/auth/get-me
 * @desc Get the authenticated user's information
 * @access Private (Requires authentication)
 */

  router.get('/get-me',authMiddleware,authController.getMe);

module.exports = router;