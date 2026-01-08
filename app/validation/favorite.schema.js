import Joi from 'joi';

export const create = Joi.object({
  gameId: Joi.number().required(),
});