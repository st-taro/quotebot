const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuoteSchema = new Schema({
  quote: String,
  author: String,
  url: String,
  stripped: String,
});

module.exports = mongoose.model('Quote', QuoteSchema);
