const mongoose = require('mongoose');



const rooms = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,

    user_id1: {

        type: mongoose.Schema.Types.ObjectId , 

		ref: 'User'

    },

    user_id2: {

        type: mongoose.Schema.Types.ObjectId , 

		 ref: 'User'

    }},{

        timestamps:true

    }	

);



module.exports = mongoose.model('rooms', rooms);