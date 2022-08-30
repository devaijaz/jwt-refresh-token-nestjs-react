import * as Joi from 'joi';

export const EnvSchemaValidation = Joi.object({
  STAGE: Joi.string().valid('dev', 'prod').required(),
  JWT_SECRET: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  PORT: Joi.number().port().required(),
  DATABASE_CONNECTION_URL: Joi.string().required(),
});
