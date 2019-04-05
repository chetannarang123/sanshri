const mongoose = require('mongoose');
const user_subscriptionSchema = mongoose.Schema({

    user_id :{ type: String},
    subscription_id :{ type: String},
    status : {type: String}
    
},
{timestamps: true}
)


module.exports = mongoose.model('User_subscription', user_subscriptionSchema);

