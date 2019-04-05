const mongoose = require('mongoose');
const mess_categoriesSchema = mongoose.Schema({
    category_name: { type: String},
},
{timestamps: true}
)

module.exports = mongoose.model('mess_categories', mess_categoriesSchema);
