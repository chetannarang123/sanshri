const mongoose = require('mongoose');
const product_categoriesSchema = mongoose.Schema({
    category_name: { type: String},
},
{timestamps: true}
)

module.exports = mongoose.model('Product_categories', product_categoriesSchema);
