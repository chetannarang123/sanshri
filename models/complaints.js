const mongoose = require('mongoose');
const complaintsSchema = mongoose.Schema({
    reason: { type: String},
    comments:{ type: String},
    user_id:{type: String},
    subscription_id:{type: String}
},
{timestamps: true}
)

module.exports = mongoose.model('Complaints', complaintsSchema);
