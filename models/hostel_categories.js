const mongoose = require('mongoose');
const hostel_categoriesSchema = mongoose.Schema({
    category_name: { type: String},
},
{timestamps: true}
)

module.exports = mongoose.model('Hostel_categories', hostel_categoriesSchema);
