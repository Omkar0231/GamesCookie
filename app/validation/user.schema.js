import Joi from 'joi';

export const login = Joi.object({
  email: Joi.string().email({ 
    minDomainSegments: 2, // Requires at least two domain segments (e.g., example.com)
    tlds: { allow: ['com', 'net', 'org', 'io', 'in'] } // Optional: restrict to specific TLDs
  }).required(),
  role: Joi.string().required(),
  type: Joi.string().required(),
});


export const otpLogin = Joi.object({
  email: Joi.string().email({ 
    minDomainSegments: 2, // Requires at least two domain segments (e.g., example.com)
    tlds: { allow: ['com', 'net', 'org', 'io', 'in'] } // Optional: restrict to specific TLDs
  }).required(),
  otp: Joi.string().required(),
});


export const updateProfile = Joi.object({
  name: Joi.string().required(),
  image: Joi.string(),
});



//for admin role users

export const create = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email({ 
    minDomainSegments: 2, // Requires at least two domain segments (e.g., example.com)
    tlds: { allow: ['com', 'net', 'org', 'io', 'in'] } // Optional: restrict to specific TLDs
  }).required(),
  // image: Joi.string().required(),
  status: Joi.boolean().truthy('1').falsy('0').sensitive()
});

export const update = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email({ 
    minDomainSegments: 2, // Requires at least two domain segments (e.g., example.com)
    tlds: { allow: ['com', 'net', 'org', 'io', 'in'] } // Optional: restrict to specific TLDs
  }).required(),
  // image: Joi.string(),
  status: Joi.boolean().truthy('1').falsy('0').sensitive()
});