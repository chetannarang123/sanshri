const mongoose = require('mongoose');
const mess_detailsSchema = mongoose.Schema({
    email: {
        type: String,
        // required: true,
        // unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    name: { type: String,required: true },
    description: { type: String,required: true },
    cost: { type: String,required: true },
    offer: { type: String,required: true },
    image: { type: String},
    contact_no: { type: Number},
    address_line :{ type: String},
    city :{ type: String},
    state :{ type: String},
    pincode :{ type: String},
    status:{ type: String },
    loc: {
        type: { type: String },
        coordinates: [Number]
      },
    owner_user_id :{ type: String},
    delivery_id :{ type: String},
    mess_cat_id :{ type: String},
    offer_id :{ type: String},
    type:{type: String}
},
{timestamps: true}
)

module.exports = mongoose.model('Mess_details', mess_detailsSchema);

