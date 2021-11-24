const joi = require('joi')

module.exports.quoteSchema = joi.object({
  quote: joi
  .object({
    quote: joi.string().required(),
    url: joi.string().url().required(),
    stripped: joi.string(),
    
  })
})