const mongoose = require('mongoose');
const product_detailsSchema = mongoose.Schema({

    name: { type: String,required: true },
    description: { type: String,required: true },
    cost: { type: String,required: true },
    offer: { type: String,required: true },
    image: { type: String},
    selling_price: { type: String },
    status:{ type: String },
    product_cat_id :{ type: String},
    store_id :{ type: String},
    delivery_id :{ type: String},
    product_quantity:{type: Number}

},
{timestamps: true}
)

module.exports = mongoose.model('Product_details', product_detailsSchema);

