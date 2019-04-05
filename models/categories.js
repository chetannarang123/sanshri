const mongoose = require('mongoose');
const categoriesSchema = mongoose.Schema({
    name: { type: String},
    type: { type: String}
},
{timestamps: true}
)

module.exports = mongoose.model('Categories', categoriesSchema);
