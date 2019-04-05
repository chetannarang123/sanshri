var mongoose = require('mongoose');
//----FETCH CHAT LIST------------------
exports.chatList = (req, res) => {
    var userId = req.authenticateUser;
    var pageNum = 1, limitNum = 10;
    if (req.body.page && req.body.page != 0) {
        pageNum = parseInt(req.body.page);
    }
    if (req.body.limit && req.body.limit != 0) {
        limitNum = parseInt(req.body.limit);
    }
    var startNum = (pageNum - 1) * limitNum;
    var finalResponse = [];
    ROOMS.find({ $or: [{ user_id1: mongoose.mongo.ObjectId(userId) }, { user_id2: mongoose.mongo.ObjectId(userId) }] }).skip(startNum).limit(limitNum)
        .populate("user_id1", "email _id face_letter profile_pic").populate("user_id2", "email _id face_letter")
        .then(async data => {
            var i = 0;
            for (var room_id of data) {
                var responseObj = {};
                await message.findOne({ roomId: room_id._id }).sort({ createdAt: -1 }).then(async data1 => {
                    responseObj.roomId = room_id._id;
                    if (room_id.user_id1._id != req.authenticateUser)
                        responseObj.chatWith = room_id.user_id1
                    else
                        responseObj.chatWith = room_id.user_id2
                    responseObj.recentMessage = data1;
                    responseObj.chatWith.profile_pic = URL.image_url + responseObj.chatWith.profile_pic;
                    await getUnreadMessagesCount(room_id._id, req.authenticateUser)
                        .then(count => {
                            responseObj.unreadCount = count;
                            finalResponse[i] = responseObj
                        }).catch(err => {
                            console.log(err);
                        })
                    i++;
                }).catch(err => {
                    console.log(err);
                })
            }
            return res.json(jsonResponses.response(1, "Success", finalResponse))
        }).catch(err => {
            console.log(err);
        })
}


//CHAT STARTS HERE-------------------------------------------
function chat(req, callback) {
    console.log("byeee")
    validations.checkParameter(req.from, "from").then(() => {
        return validations.checkParameter(req.to, "to");
    }).then(() => {
        return validations.checkObjectDefined(req.roomId);
    }).then(data => {
        if (!data) {
            throw new Error("Please Send roomId Parameter");
        } else {
            return validations.checkObjectDefined(req.message);
        }
    })
    // .then(data => {
    //     if (!data) {
    //         throw new Error("Please Send image Parameter");
    //     } else {
    //         return validations.checkObjectDefined(req.message);
    //     }
    // })
    .then(data => {
        if (!data) {
            throw new Error("Please Send message Parameter");
        } else {
            if (req.roomId != "") {
                const Message = new message({
                    _id: new mongoose.Types.ObjectId(),
                    from: req.from,
                    to: req.to,
                    message: req.message,
                    //image: req.image,
                    roomId: req.roomId
                });
                return Message.save();
            } else {
                const room = new ROOMS({
                    _id: mongoose.Types.ObjectId(),
                    user_id1: req.from,
                    user_id2: req.to
                });
                return room.save().then(newRoom => {
                    const Message = new message({
                        _id: new mongoose.Types.ObjectId(),
                        from: req.from,
                        to: req.to,
                        message: req.message,
                        //image: req.image,
                        roomId: newRoom._id
                    });
                    return Message.save();
                }).catch(err => {
                    console.log(err);
                    callback(jsonResponses.response(0, err.message, null), null);
                    //io.sockets.emit('responseFromServer', jsonResponses.response(1, err.message, null));
                });
            }
        }
    }).then(result => {
        if (result) {
            //console.log(result);
            return callback(null, jsonResponses.response(1, "Messsage sent", result));
        } else {
            return callback(jsonResponses.response(0, err.message, null), null);
        }
    }).catch(err => {
        console.log(err);
        callback(jsonResponses.response(0, err.message, null), null);
    });
}
exports.chat = chat;

function online_enable(req, callback) {
    var userId = req._id;
    console.log("======>", Boolean(req.is_online));
    if (Boolean(req.is_online == req.is_online)) {
        console.log("true11111111")
        USER.findOneAndUpdate({ _id: userId }, { $set: { is_online: req.is_online } }, { new: true })
            .exec()
            .then(function (result) {
                console.log(result)
            }).catch(err => {
                console.log(err);
                callback(jsonResponses.response(0, err.message, null), null);

            });
    }

}
exports.online_enable = online_enable;


function getUnreadMessagesCount(roomId, userId) {
    console.log(roomId)
    console.log(userId)
    return new Promise(function (resolve, reject) {
        message.countDocuments({ $and: [{ roomId: roomId }, { to: userId }, { read_status: "0" }] }).exec()
            .then(data => {
                resolve(data);
            }).catch(err => {
                reject(jsonResponses.response(0, err.message, null));
            })
    });
}

// {"methodName":"chat",
// "from":"5c81158111e99120400adb4b","to":"5c8202db091638258c6373c1","roomId":"5c8a508e7b4102273847f706","message":"hello"}