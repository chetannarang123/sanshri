const mongoose = require('mongoose');
const cartSchema = mongoose.Schema({
    user_id: { type: String},
    product_id: mongoose.Schema.Types.ObjectId,
    quantity: { type: Number},
},
{timestamps: true}
)

module.exports = mongoose.model('cart', cartSchema);
