const Conversation = require('./../models/conversation');
const  Message = require('./../models/message');
const   User = require('./../models/user');

exports.getConversations = function (req, res, next) {
    // Only return one message from each conversation to display as snippet
    Conversation.find({ participants: req.authenticateUser })
        .select('_id')
        .exec(function (err, conversations) {
            if (err) {
                res.send({ error: err });
                return next(err);
            }

            // Set up empty array to hold conversations + most recent message
            let fullConversations = [];
            conversations.forEach(function (conversation) {
                Message.find({ 'conversationId': conversation._id })
                    .sort('-createdAt')
                    .limit(1)
                    .populate({
                        path: "author",
                        select: "name"
                    })
                    .exec(function (err, message) {
                        if (err) {
                            res.send({ error: err });
                            return next(err);
                        }
                        fullConversations.push(message);
                        if (fullConversations.length === conversations.length) {
                            return res.status(200).json({ conversations: fullConversations });
                        }
                    });
            });
        });
}
exports.getConversation = function (req, res, next) {
    Message.find({ conversationId: req.params.conversationId })
        .select('createdAt body author')
        .sort('-createdAt')
        .populate({
            path: 'author',
            select: 'name'
        })
        .exec(function (err, messages) {
            if (err) {
                res.send({ error: err });
                return next(err);
            }

            res.status(200).json({ conversation: messages });
        });
}


exports.newConversation = function (req, res, next) {
    if (!req.params.recipient) {
        res.status(422).send({ error: 'Please choose a valid recipient for your message.' });
        return next();
    }

    if (!req.body.composedMessage) {
        res.status(422).send({ error: 'Please enter a message.' });
        return next();
    }

    const conversation = new Conversation({
        participants: [req.authenticateUser, req.params.recipient]
    });

    conversation.save(function (err, newConversation) {
        if (err) {
            res.send({ error: err });
            return next(err);
        }

        var message = new Message({
            conversationId: newConversation._id,
            body: req.body.composedMessage,
            author: req.authenticateUser
        });
        message.save()
        /** after save result is consoled */
        .then(result => {
            console.log(result);
            /** response should be of json format */
            res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, result 
            ));  
        })


    });
}
exports.sendReply = function(req, res, next) {  
    console.log('byeeee')
    
    const reply = new Message({
      conversationId: req.params.conversationId,
      body: req.body.composedMessage,
      author: req.authenticateUser
    });
  
    reply.save(function(err, sentReply) {
      if (err) {
        res.send({ error: err });
        return next(err);
      }
  
      res.status(200).json({ message: 'Reply successfully sent!' });
      return(next);
    });
  }