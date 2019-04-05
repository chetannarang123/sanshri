const mongoose = require('mongoose');
const subscription_planSchema = mongoose.Schema({

    description: { type: String,required: true },
    title :{ type: String},
    cost :{ type: String},
    time_interval :{ type: String},
    hostel_or_mess_id :{ type: String},
    status:{ type: String },
    offer:{ type: String },
    status:{ type: String }
    
},
{timestamps: true}
)


module.exports = mongoose.model('Subscription_plan', subscription_planSchema);

