// validationMiddleware.js
const { celebrate, Joi } = require("celebrate");

const IdValidation = celebrate({
  params: {
    id: Joi.string().hex().length(24).required(),
  },
});

const userLoginValidation = celebrate({
  body: Joi.object({
    email: Joi.string().email().label("Email"),
    password: Joi.string()
      .required()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&]).{8,}$/)
      .label("Password"),
  })
    .messages({
      "string.base": "{{#label}} must be a valid string",
      "string.email": "{{#label}} must be a valid email address",
      "string.pattern.base":
        "{{#label}} must meet password complexity requirements",
      "string.empty": "{{#label}} cannot be empty",
      "any.required": "{{#label}} is required",
    })
    .options({ abortEarly: false })
    .unknown(true),
});

const userSignUpValidation = celebrate({
  body: Joi.object({
    email: Joi.string().email().label("Email").required(),
    f_name: Joi.string().label("First Name").required(),
    l_name: Joi.string().label("Last Name").required(),
    name: Joi.string().label("Name").required(),
    password: Joi.string()
      .required()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&]).{8,}$/)
      .label("Password"),
  })
    .messages({
      "string.base": "{{#label}} must be a valid string",
      "string.email": "{{#label}} must be a valid email address",
      "string.pattern.base":
        "{{#label}} must meet password complexity requirements",
      "string.empty": "{{#label}} cannot be empty",
      "any.required": "{{#label}} is required",
    })
    .options({ abortEarly: false })
    .unknown(true),
});

const userForgotPasswordValidation = celebrate({
  body: Joi.object({
    email: Joi.string().email().label("Email").required(),
  })
    .messages({
      "string.email": "{{#label}} must be a valid email address",
      "string.empty": "{{#label}} cannot be empty",
    })
    .options({ abortEarly: false })
    .unknown(true),
});

const userForgotPasswordOtpVerifyValidation = celebrate({
  body: Joi.object({
    email: Joi.string().email().label("Email"),
    otp: Joi.number().label("otp"),
  })
    .messages({
      "string.base": "{{#label}} must be a valid string",
      "string.email": "{{#label}} must be a valid email address",
      "string.pattern.base":
        "{{#label}} must meet password complexity requirements",
      "string.empty": "{{#label}} cannot be empty",
      "any.required": "{{#label}} is required",
    })
    .options({ abortEarly: false })
    .unknown(true),
});

const updatePasswordValidation = celebrate({
  body: Joi.object({
    email: Joi.string().required().email().label("Email"),
    password: Joi.string()
      .required()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&]).{8,}$/)
      .label("Password"),
  })
    .messages({
      "string.base": "{{#label}} must be a valid string",
      "string.email": "{{#label}} must be a valid email address",
      "string.pattern.base":
        "{{#label}} must meet password complexity requirements",
      "string.empty": "{{#label}} cannot be empty",
      "any.required": "{{#label}} is required",
    })
    .options({ abortEarly: false })
    .unknown(true),
});

module.exports = {
  IdValidation,
  userLoginValidation,
  userSignUpValidation,
  userForgotPasswordValidation,
  userForgotPasswordOtpVerifyValidation,
  updatePasswordValidation,
};
