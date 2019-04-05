const mongoose = require('mongoose');
const store_categoriesSchema = mongoose.Schema({
    store_categories: { type: String},
},
{timestamps: true}
)

module.exports = mongoose.model('Store_categories', store_categoriesSchema);
