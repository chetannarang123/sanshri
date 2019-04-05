// const mongoose = require('mongoose'),  
//       Schema = mongoose.Schema;

// const MessageSchema = new Schema({  
//   conversationId: {
//     type: Schema.Types.ObjectId,
//     required: true
//   },
//   body: {
//     type: String,
//     required: true
//   },
//   author: {
//     type: Schema.Types.ObjectId,
//     ref: 'User'
//   }
// },
// {
//   timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
// });

// module.exports = mongoose.model('Message', MessageSchema);  

const mongoose = require('mongoose');



const messageSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,

    from: {

        type: mongoose.Schema.Types.ObjectId , 

		ref: 'User'

    },

     to: {

        type: mongoose.Schema.Types.ObjectId , 

		 ref: 'User'

    },

	message: {

        type: String,

		default:""

    },

	image: {

        type: String,

		default:""		

    },	

	read_status: {

        type: String,

		default:"0"     //0-unread, 1-unread

    },

    roomId:{

        type: mongoose.Schema.Types.ObjectId , 

		ref: 'rooms'

    }},{

        timestamps:true

    }	

);



module.exports = mongoose.model('message', messageSchema);