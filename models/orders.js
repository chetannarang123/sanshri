const mongoose = require('mongoose');
const ordersSchema = mongoose.Schema({
    user_id: { type: String},
    product_id: mongoose.Schema.Types.ObjectId,
    quantity: { type: String},
    payment_id:{ type: String }
},
{timestamps: true}
)

module.exports = mongoose.model('orders', ordersSchema);
