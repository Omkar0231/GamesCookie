import Joi from 'joi';

export const createHtmlGames = Joi.object({
  name: Joi.string().required(),
  number: Joi.number().required(),
  website_url: Joi.string().required(),
});

export const createApplyJob = Joi.object({
  name: Joi.string().required(),
  resume: Joi.string().required(),
});