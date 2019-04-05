const mongoose = require('mongoose');
const user_rolesSchema = mongoose.Schema({

    
    user_id: { type: String},
    role_id: { type: String },
},
{timestamps: true}
)

module.exports = mongoose.model('User_roles', user_rolesSchema);
