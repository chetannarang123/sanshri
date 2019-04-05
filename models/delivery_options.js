const mongoose = require('mongoose');
const delivery_optionsSchema = mongoose.Schema({
    option: { type: String},
},
{timestamps: true}
)

module.exports = mongoose.model('Delivery_options', delivery_optionsSchema);
