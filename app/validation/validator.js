const Joi = require('joi'); 
const validator = (schema, property) => { 
  return (req, res, next) => {
    // const validation = schema.validate(req.body, { abortEarly: false });
    // res.send(validation);

    const valid = schema.validate(req.body, { abortEarly: false });
    // const valid = error == null; 
  
    if (valid?.error) { 
        
        res.send(valid);
    } else {
        next();
        
        // const { details } = valid.error; 
        // const message = details.map(i => i.message).join(',');
    
        // res.status(422).json({ error: details }) 
    }

  } 
}
module.exports = validator;