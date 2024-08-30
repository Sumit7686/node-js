const { createError, createResponse } = require("../../utils/helpers");

const User = require("../../models/user");

class UserController {
  /**
   * @description get Me
   */
  async getMe(req, res) {
    try {
      const userId = req.user.id;

      const playerData = await User.findById(userId);

      return createResponse(res, true, "Success!", playerData);
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description update user
   */
  async updateUser(req, res) {
    try {
      const userId = req.user.id;
      const { f_name, l_name } = req.body;

      const playerData = await User.findByIdAndUpdate(
        userId,
        {
          $set: { f_name, l_name },
        },
        { new: true }
      ).select("email f_name l_name");

      return createResponse(res, true, "Success!", playerData);
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description Search Users
   */
  async searchUsers(req, res) {
    try {
      const { name } = req.body;

      const playerData = await User.aggregate(
        [
          {
            $match: {
              $or: [{ name: { $regex: new RegExp(name, "i") } }],
            },
          },
          {
            $project: {
              _id: 1,
              email: 1,
              name: 1,
              status: 1,
            },
          },
        ],
        { allowDiskUse: true }
      );

      return createResponse(res, true, "Success!", playerData);
    } catch (e) {
      return createError(res, e);
    }
  }
}

const userController = new UserController();
module.exports = userController;
