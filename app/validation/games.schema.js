import Joi from 'joi';

export const create = Joi.object({
  title: Joi.string().required(),
  categoryId: Joi.number().required(),
  game_url: Joi.string().required(),
  image: Joi.string().required(),
  description: Joi.string().max(5000).required(),
  meta_title: Joi.string().max(1000).empty(''),
  meta_keywords: Joi.string().max(1000).empty(''),
  meta_description: Joi.string().max(1000).empty(''),
  status: Joi.boolean().truthy('1').falsy('0').sensitive()
});

export const update = Joi.object({
  title: Joi.string().required(),
  categoryId: Joi.number().required(),
  game_url: Joi.string().required(),
  image: Joi.string().required(),
  description: Joi.string().max(5000).required(),
  meta_title: Joi.string().max(1000).empty(''),
  meta_keywords: Joi.string().max(1000).empty(''),
  meta_description: Joi.string().max(1000).empty(''),
  status: Joi.boolean().truthy('1').falsy('0').sensitive()
});