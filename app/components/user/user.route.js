const router = require("express").Router();
const UserController = require("./user.controller");
const { auth } = require("../../middleware/authJWT");

/**
 * @route GET api/user/me
 * @description get me
 * @returns JSON
 * @access public
 */
router.get("/me", auth, (req, res) => {
  UserController.getMe(req, res);
});

/**
 * @route POST api/user/update-user
 * @description update user
 * @returns JSON
 * @access public
 */
router.post("/update-user", auth, (req, res) => {
  UserController.updateUser(req, res);
});

/**
 * @route POST api/user/search-users
 * @description search users
 * @returns JSON
 * @access public
 */
router.post("/search-users", auth, (req, res) => {
  UserController.searchUsers(req, res);
});

module.exports = router;
