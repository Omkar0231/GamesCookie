import Joi from 'joi';

export const create = Joi.object({
  gameId: Joi.number().required(),
  tag: Joi.string().required(),
  status: Joi.boolean().truthy('1').falsy('0').sensitive()
});

export const update = Joi.object({
  gameId: Joi.number().required(),
  tag: Joi.string().required(),
  status: Joi.boolean().truthy('1').falsy('0').sensitive()
});
