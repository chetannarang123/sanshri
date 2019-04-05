const mongoose = require('mongoose');
const product_quantitySchema = mongoose.Schema({
    quantity: { type: Number},
    product_id:{ type: String},
},
{timestamps: true}
)

module.exports = mongoose.model('Product_quantity', product_quantitySchema);
