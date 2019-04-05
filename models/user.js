const mongoose = require('mongoose');
const userSchema = mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String },//required: true }
    //date: { type: Date, default: Date.now }
    name: { type: String,required: true },
    contact_no: { type: Number },
    address_line :{ type: String},
    city :{ type: String},
    state :{ type: String},
    district :{ type: String},
    pincode :{ type: String},
    otp:{type:String},
    expiry_date:{type:Date},
    current_date:{type:Date},
    profileimage:{ type: String },
    status:{ type: String },
    type:{ type: String },
    socialid:{ type: String },
    payment_id:{ type: String }
},
{timestamps: true}
)

module.exports = mongoose.model('User', userSchema);

