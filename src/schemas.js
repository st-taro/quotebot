const joi = require('joi')

module.exports.quoteSchema = joi.object({
  quote: joi
  .object({
    quote: joi.string().required(),
    url: joi.string().uri().required(),
    stripped: joi.string(),
    
  })
})