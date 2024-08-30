const router = require("express").Router();
const AuthController = require("./auth.controller");
const { auth, verifyToken } = require("../../middleware/authJWT");

// Validation
const {
  userLoginValidation,
  userSignUpValidation,
  userForgotPasswordValidation,
  userForgotPasswordOtpVerifyValidation,
  updatePasswordValidation,
} = require("../../middleware/userValidation");

/**
 * @route POST api/auth/login
 * @description login
 * @returns JSON
 * @access public
 */
router.post("/login", userLoginValidation, (req, res) => {
  AuthController.login(req, res);
});

/**
 * @route POST api/auth/signup
 * @description signup
 * @returns JSON
 * @access public
 */
router.post("/signup", userSignUpValidation, (req, res) => {
  AuthController.signup(req, res);
});

/**
 * @route POST api/auth/forgot-password
 * @description forgot-password
 * @returns JSON
 * @access public
 */
router.post("/forgot-password", userForgotPasswordValidation, (req, res) => {
  AuthController.forgotPassword(req, res);
});

/**
 * @route POST api/auth/forgot-password-otp-verify
 * @description forgot-password
 * @returns JSON
 * @access public
 */
router.post(
  "/forgot-password-otp-verify",
  userForgotPasswordOtpVerifyValidation,
  (req, res) => {
    AuthController.forgotPasswordOTPVerify(req, res);
  }
);

/**
 * @route POST api/auth/update-password
 * @description Update Password
 * @returns JSON
 * @access public
 */
router.post("/update-password", updatePasswordValidation, (req, res) => {
  AuthController.updatePassword(req, res);
});

/**
 * @route POST api/auth/email-verification
 * @description email-verification
 * @returns JSON
 * @access public
 */
router.post("/email-verification", userForgotPasswordValidation, (req, res) => {
  AuthController.emailVerification(req, res);
});

/**
 * @route POST api/auth/otp-verify
 * @description otp verify
 * @returns JSON
 * @access public
 */
router.post(
  "/otp-verify",
  userForgotPasswordOtpVerifyValidation,
  (req, res) => {
    AuthController.otpVerify(req, res);
  }
);

/**
 * @route GET api/auth/token-verify
 * @description Token Verify
 * @returns JSON
 * @access public
 */
router.get("/token-verify", auth, (req, res) => {
  AuthController.tokenVerify(req, res);
});

/**
 * @route GET api/auth/update-jwt-token
 * @description Update Token
 * @returns JSON
 * @access public
 */
router.get("/update-jwt-token", verifyToken, (req, res) => {
  AuthController.verifyRefreshToken(req, res);
});

module.exports = router;
