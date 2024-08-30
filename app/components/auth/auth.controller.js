const {
  createError,
  createResponse,
  generateHash,
  comparePassword,
} = require("../../utils/helpers");
const {
  jwtGenerator,
  generateRefreshToken,
} = require("../../utils/jwtGenerator");
const { sendEmailForOtp } = require("../../utils/mailService");

const User = require("../../models/user");

class AuthController {
  /**
   * @description login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // check email
      let userData = await User.findOne({ email }).select(
        "password emailVerified"
      );
      if (!userData) return createError(res, { message: "Email not Exist!" });

      if (!userData.emailVerified)
        return createError(res, { message: "Please Verify your Account!" });

      // check passwword
      const status = comparePassword(password, userData.password);
      if (!status) return createError(res, { message: "Password is Wrong!" });

      const { token } = jwtGenerator(userData._id);

      const { refreshToken } = generateRefreshToken(userData._id);

      userData = JSON.parse(JSON.stringify(userData));

      userData.token = token;
      userData.refreshToken = refreshToken;

      return createResponse(res, true, "Login Successfully!", userData);
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description signup
   */
  async signup(req, res) {
    try {
      const { f_name, l_name, email, password, name } = req.body;

      const adminEmailData = await User.findOne({ email }).select("email");
      if (adminEmailData)
        return createError(res, { message: "Email alrady in use!" });

      const adminNameData = await User.findOne({ name }).select("name");
      if (adminNameData)
        return createError(res, { message: "User Name alrady in use!" });

      // hash paassword
      const passwordHash = generateHash(password);

      // entry
      const newAdmin = await new User({
        f_name,
        l_name,
        email,
        name,
        password: passwordHash,
        pwd: password,
        otp: 123456,
      }).save();

      return createResponse(res, true, "Signup Successfully!", newAdmin);
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description forgot-password
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      // let otp = Math.floor(Math.random() * 100000) + 111111;

      const getEmailUser = await User.findOne({ email }).select("email");

      if (!getEmailUser)
        return createError(res, { message: "Email is not Exist!" });

      await User.findOneAndUpdate({ email }, { $set: { otp: 123456 } });

      const sendOtp = await sendEmailForOtp(getEmailUser?.email, otp);

      if (sendOtp.status) {
        await User.findOneAndUpdate({ email }, { $set: { otp } });

        return createResponse(res, true, sendOtp.message);
      } else {
        return createError(res, { message: sendOtp.message });
      }
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description Forgot Password OTP Verify
   */
  async forgotPasswordOTPVerify(req, res) {
    try {
      const { email, otp } = req.body;

      const getEmailPlayer = await User.findOne({ email }).select("email otp");

      if (!getEmailPlayer)
        return createError(res, { message: "Email is not Exist!" });

      if (getEmailPlayer) {
        if (getEmailPlayer.otp === otp) {
          return createResponse(res, true, "OTP is Verified!", email);
        } else {
          return createError(res, { message: "OTP is Wrong!" });
        }
      } else {
        return createError(res, { message: "Server Error!" });
      }
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description Update Password
   */
  async updatePassword(req, res) {
    try {
      const { email, password } = req.body;

      const getEmailPlayer = await User.findOne({ email }).select(
        "email password"
      );

      if (!getEmailPlayer)
        return createError(res, { message: "Email is not Exist!" });

      const status = comparePassword(password, getEmailPlayer.password);

      if (status)
        return createError(res, {
          message: "Current and New Password both are same!",
        });

      const passwordHash = generateHash(password);
      await User.findOneAndUpdate(
        { email },
        {
          $set: { password: passwordHash, pwd: password },
        }
      ).select("email");

      return createResponse(res, true, "Update Password Successfully!");
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description email-verification
   */
  async emailVerification(req, res) {
    try {
      const { email } = req.body;

      let otp = Math.floor(Math.random() * 100000) + 111111;

      const getEmailUser = await User.findOne({ email }).select(
        "email emailVerified"
      );

      if (!getEmailUser)
        return createError(res, { message: "Email is not Exist!" });

      if (getEmailUser.emailVerified)
        return createError(res, { message: "This Email is already Verified!" });

      await User.findOneAndUpdate({ email }, { $set: { otp } });

      const sendOtp = await sendEmailForOtp(getEmailUser?.email, otp);

      if (sendOtp.status) {
        await User.findOneAndUpdate({ email }, { $set: { otp } });

        return createResponse(res, true, sendOtp.message);
      } else {
        return createError(res, { message: sendOtp.message });
      }
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description OTP Verify
   */
  async otpVerify(req, res) {
    try {
      const { email, otp } = req.body;

      const getEmailPlayer = await User.findOne({ email }).select("email otp");

      if (!getEmailPlayer)
        return createError(res, { message: "Email is not Exist!" });

      if (getEmailPlayer) {
        if (getEmailPlayer.otp === otp) {
          await User.findOneAndUpdate(
            { email },
            {
              $set: {
                emailVerified: true,
              },
            }
          ).select("email");

          return createResponse(res, true, "OTP is Verified!", email);
        } else {
          return createError(res, { message: "OTP is Wrong!" });
        }
      } else {
        return createResponse(res, false, "Server Error!");
      }
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description Token Verify
   */
  async tokenVerify(req, res) {
    try {
      return createResponse(res, true, "Success");
    } catch (e) {
      return createError(res, e);
    }
  }

  /**
   * @description Verify Refresh Token
   */
  async verifyRefreshToken(req, res) {
    try {
      const userId = req.user.id;

      const { token } = jwtGenerator(userId);
      const { refreshToken } = generateRefreshToken(userId);
      const result = {
        token: token,
        refreshToken: refreshToken,
      };

      return createResponse(res, true, "Token Get Successfully!", result);
    } catch (e) {
      return createError(res, e);
    }
  }
}

const authController = new AuthController();
module.exports = authController;
