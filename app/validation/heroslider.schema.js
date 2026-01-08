import Joi from 'joi';

export const create = Joi.object({
  title: Joi.string().required(),
  icon: Joi.string().required(),
  description: Joi.string().required(),
  url: Joi.string().required(),
  image: Joi.string().required(),
  status: Joi.boolean().truthy('1').falsy('0').sensitive()
});

export const update = Joi.object({
  title: Joi.string().required(),
  icon: Joi.string().required(),
  description: Joi.string().required(),
  url: Joi.string().required(),
  image: Joi.string(),
  status: Joi.boolean().truthy('1').falsy('0').sensitive()
});
