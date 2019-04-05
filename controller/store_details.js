var User = require("./../models/user");
var User_roles = require("./../models/user_roles");
var Store_details = require("./../models/store_details");
var Store_categories = require("./../models/store_categories");
//var Offers = require("./../models/Offers");

exports.store_details = (req, res, next) => {
    if (req.files && req.files.image) {
        var ImageFile = req.files.image;
        var image = Date.now() + 'pic_' + ImageFile.name;
        ImageFile.mv("./public/uploads/" + image, function (err) {
            //upload file
            if (err)
                throw err;
        });
    }
    User.find({ email: req.body.owner_email })
            .exec()
            .then(data => {
                if (data.length >= 1) {
                   var owner_user_id = data[0]._id;
                
    // var nearestDriver = findNearestDriver(pickUpLongitude, pickUpLatitude); // find 1 driver 
    // sendRequestToTheDrivers(nearestDriver);
              const store_details = new Store_details({
                  email: req.body.email,
                  name: req.body.name,
                  description: req.body.description,
                  cost: req.body.cost,
                  offer: req.body.offer,
                  time : req.body.time,
                  image: "http://13.233.88.225:3000/uploads/" + image,
                  contact_no : req.body.contact_no,
                  address_line : req.body.address_line,
                  city:req.body.city,
                  state:req.body.state,
                  pincode:req.body.pincode,
                  owner_user_id:req.body.owner_email,
                  store_cat_id:req.body.store_cat_id,
                  delivery_id:req.body.delivery_id,
                  offer_id:req.body.offer_id,
                  status:1,

                  loc : { type: "Point", coordinates: [ req.body.longitude, req.body.latitude ] }
              });
              store_details.save()
                  .then(result => {
                      console.log(result);
                      res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null,
                          {
                              message: "added successfully",
                          }));
                  })
                  .catch(err => {
                      console.log(err);
                      res.status(customConfig.internalServerErrorCode).json({
                          error: err
                      });
                  });
                }
                else{
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null,
                        {
                            message: "enter owner email",
                        }));
                }
  }).catch(err => {
    console.log(err);
    res.status(customConfig.internalServerErrorCode).json({
        error: err
    });
});
};
  

exports.show_all_stores = (req, res, next) => {
    Store_details.where('status').equals(1)
        .select()
        .exec()
        .then(docs => {
            console.log(docs)
            res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, docs))
        })
        .catch(function (error) {
            validations.checkExceptionType(error, function (error) {
                res.status(error.status).json(error);
            });
        });
};
 


exports.show_filtered_stores = (req, res, next) => {
    var arr1 = req.body.store_cat_id
    console.log(arr1);
    if(arr1.length == 0)
    {

      console.log("array empty");
    }
    if(req.body.name && req.body.longitude == "" && req.body.latitude == "" && arr1.length == 0 && req.body.delivery_id == "" ){
        var char = req.body.name;
        console.log(char)
        console.log('hieeeeee');
        Store_details.find( { "status":1,"name": {$regex:  char , $options: 'i'}})
       .select()
       .exec()
       .then(docs => {
         res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, docs))
       })
       .catch(function (error) {
     validations.checkExceptionType(error, function (error) {
     res.status(error.status).json(error);
         });
     });
 }
   else if(req.body.longitude && arr1.length != 0 && req.body.delivery_id && req.body.name){
    var arr = req.body.store_cat_id;
    var char = req.body.name;
            Store_details.find( { "status":1,
                "$and": [ {loc: { $geoWithin: { $centerSphere: [ [ req.body.longitude, req.body.latitude ], req.body.distance/3963.2 ] } }},
                    {
                        "store_cat_id":{'$in':arr}
                }, {
                    "delivery_id": req.body.delivery_id
                }
                ,{
                    "name": {$regex:  char , $options: 'i'}
                    }]})
              .exec()
              .then(data => {
                  if (data.length >= 1) {
                    console.log(data)
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
                  }
                  else{
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
                  }
                })
        .catch(function (error) {
            validations.checkExceptionType(error, function (error) {
                res.status(error.status).json(error);
            });
        });
}
else if(req.body.longitude && arr1.length != 0 && req.body.name) {
    var arr = req.body.store_cat_id;
    var char = req.body.name;
    Store_details.find( { "status":1,
                "$and": [ {loc: { $geoWithin: { $centerSphere: [ [ req.body.longitude, req.body.latitude ], req.body.distance/3963.2 ] } }},
                    {
                        "store_cat_id":{'$in':arr}
                }
                ,{
                    "name": {$regex:  char , $options: 'i'}
                    }]})
              .exec()
              .then(data => {
                  if (data.length >= 1) {
                    console.log(data)
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
                  }
                  else{
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
                  }
                })
        .catch(function (error) {
            validations.checkExceptionType(error, function (error) {
                res.status(error.status).json(error);
            });
        });
}
else if(req.body.longitude && req.body.delivery_id && req.body.name) {
    var char = req.body.name;
    Store_details.find( { "status":1,
                "$and": [ {loc: { $geoWithin: { $centerSphere: [ [ req.body.longitude, req.body.latitude ], req.body.distance/3963.2 ] } }},
                    {
                        "delivery_id": req.body.delivery_id
                }
                ,{
                    "name": {$regex:  char , $options: 'i'}
                    }]})
              .exec()
              .then(data => {
                  if (data.length >= 1) {
                    console.log(data)
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
                  }
                  else{
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
                  }
                })
        .catch(function (error) {
            validations.checkExceptionType(error, function (error) {
                res.status(error.status).json(error);
            });
        });
}
else if( arr1.length != 0 && req.body.name) {
    var arr = req.body.store_cat_id;
    console.log(arr)
    var char = req.body.name;
    Store_details.find( { "status":1,
                "$and": [
                    {
                        "store_cat_id":{'$in':arr}
                }
                ,{
                    "name": {$regex:  char , $options: 'i'}
                    }]})
              .exec()
              .then(data => {
                  if (data.length >= 1) {
                    console.log(data)
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
                  }
                  else{
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
                  }
                })
        .catch(function (error) {
            validations.checkExceptionType(error, function (error) {
                res.status(error.status).json(error);
            });
        });
}
else if(req.body.delivery_id && req.body.name) {
    var char = req.body.name;
    Store_details.find( { "status":1,
                "$and": [
                    {
                        "delivery_id": req.body.delivery_id
                }
                ,{
                    "name": {$regex:  char , $options: 'i'}
                    }]})
              .exec()
              .then(data => {
                  if (data.length >= 1) {
                    console.log(data)
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
                  }
                  else{
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
                  }
                })
        .catch(function (error) {
            validations.checkExceptionType(error, function (error) {
                res.status(error.status).json(error);
            });
        });
}
else if(req.body.longitude && req.body.name) {
    var char = req.body.name;
    Store_details.find( { "status":1,
    "$and": [ {loc: { $geoWithin: { $centerSphere: [ [ req.body.longitude, req.body.latitude ], req.body.distance/3963.2 ] } }},

    {
        "name": {$regex:  char , $options: 'i'}
        }]})
              .exec()
              .then(data => {
                  if (data.length >= 1) {
                    console.log(data)
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
                  }
                  else{
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
                  }
                })
        .catch(function (error) {
            validations.checkExceptionType(error, function (error) {
                res.status(error.status).json(error);
            });
        });
}
else if(req.body.longitude && req.body.delivery_id) {
    
    Store_details.find( { "status":1,
    "$and": [ {loc: { $geoWithin: { $centerSphere: [ [ req.body.longitude, req.body.latitude ], req.body.distance/3963.2 ] } }},

    {
        "delivery_id": req.body.delivery_id
        }]})
              .exec()
              .then(data => {
                  if (data.length >= 1) {
                    console.log(data)
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
                  }
                  else{
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
                  }
                })
        .catch(function (error) {
            validations.checkExceptionType(error, function (error) {
                res.status(error.status).json(error);
            });
        });
}
else if(arr1.length != 0 && req.body.delivery_id) {
    var arr = req.body.store_cat_id;
    
    Store_details.find( { "status":1,
    "$and": [ {"store_cat_id":{'$in':arr}},

    {
        "delivery_id": req.body.delivery_id
        }]})
              .exec()
              .then(data => {
                  if (data.length >= 1) {
                    console.log(data)
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
                  }
                  else{
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
                  }
                })
        .catch(function (error) {
            validations.checkExceptionType(error, function (error) {
                res.status(error.status).json(error);
            });
        });
}
else if(req.body.longitude && arr1.length != 0) {
    var arr = req.body.store_cat_id;
    Store_details.find( { "status":1,
    "$and": [ {loc: { $geoWithin: { $centerSphere: [ [ req.body.longitude, req.body.latitude ], req.body.distance/3963.2 ] } }},

    {
        "store_cat_id":{'$in':arr}
        }]})
              .exec()
              .then(data => {
                  if (data.length >= 1) {
                    console.log(data)
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
                  }
                  else{
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
                  }
                })
        .catch(function (error) {
            validations.checkExceptionType(error, function (error) {
                res.status(error.status).json(error);
            });
        });
}
else if(req.body.longitude) {
    Store_details.find( { "status":1,loc: { $geoWithin: { $centerSphere: [ [ req.body.longitude, req.body.latitude ], req.body.distance/3963.2 ] }}})
              .exec()
              .then(data => {
                  if (data.length >= 1) {
                    console.log(data)
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
                  }
                  else{
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
                  }
                })
        .catch(function (error) {
            validations.checkExceptionType(error, function (error) {
                res.status(error.status).json(error);
            });
        });
}
else if(arr1.length != 0) {
    var arr = req.body.store_cat_id;
    console.log(arr)
    //Subscriptions.remove({ _id:{'$in':arr}})
    Store_details.find( { "status":1,"store_cat_id":{'$in':arr}})
              .exec()
              .then(data => {
                  if (data.length >= 1) {
                    console.log(data)
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
                  }
                  else{
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
                  }
                })
        .catch(function (error) {
            validations.checkExceptionType(error, function (error) {
                res.status(error.status).json(error);
            });
        });
}
else if(req.body.delivery_id) {
    Store_details.find( { "status":1,"delivery_id":req.body.delivery_id})
              .exec()
              .then(data => {
                  if (data.length >= 1) {
                    console.log(data)
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
                  }
                  else{
                    res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
                  }
                })
        .catch(function (error) {
            validations.checkExceptionType(error, function (error) {
                res.status(error.status).json(error);
            });
        });
}
else if(arr1.length == 0) {
    console.log('hieeeeee')
    Store_details.where('status').equals(1)
    .select()
    .exec()
    .then(docs => {
        console.log(docs)
        res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, docs))
    })
    .catch(function (error) {
        validations.checkExceptionType(error, function (error) {
            res.status(error.status).json(error);
        });
    });
}
};