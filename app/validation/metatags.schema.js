import Joi from 'joi';

export const create = Joi.object({
  title: Joi.string().required(),
  keyword: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().required()
});

export const update = Joi.object({
  title: Joi.string().required(),
  keyword: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().required()
});
