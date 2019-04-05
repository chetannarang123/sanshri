var User = require("./../models/user");
var User_roles = require("./../models/user_roles");
var Hostel_details = require("./../models/hostel_details");
var Hostel_categories = require("./../models/hostel_categories");


exports.hostel_details = (req, res, next) => {
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
                }
    // var nearestDriver = findNearestDriver(pickUpLongitude, pickUpLatitude); // find 1 driver 
    // sendRequestToTheDrivers(nearestDriver);
              const hostel_details = new Hostel_details({
                  email: req.body.email,
                  name: req.body.name,
                  description: req.body.description,
                  cost: req.body.cost,
                  offer: req.body.offer,
                  address_line:req.body.address_line,
                  image: "http://13.233.88.225:3000/uploads/" + image,
                  contact_no : req.body.contact_no,
                  city:req.body.city,
                  state:req.body.state,
                  pincode:req.body.pincode,
                  owner_user_id:owner_user_id,
                  hostel_cat_id:req.body.hostel_cat_id,
                  status:1,
                  loc : { type: "Point", coordinates: [ req.body.longitude, req.body.latitude ] }
              });
              hostel_details.save()
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
        
  });
};
  
exports.show_all_hostels = (req, res, next) => {
    Hostel_details.where('status').equals(1)
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
 

exports.show_filtered_hostel = (req, res, next) => {
    var arr1 = req.body.hostel_cat_id
    if(req.body.name && req.body.longitude == "" && req.body.latitude == "" && arr1.length == 0){
        var char = req.body.name;
        console.log(char)
        console.log('hieeeeee');
        Hostel_details.find( { "status":1,"name": {$regex:  char , $options: 'i'}})
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
 else if(req.body.longitude && arr1.length != 0 && req.body.name ) {
    var arr = req.body.hostel_cat_id;
    var char = req.body.name;
    Hostel_details.find( { "status":1,
                "$and": [ {loc: { $geoWithin: { $centerSphere: [ [ req.body.longitude, req.body.latitude ], req.body.distance/3963.2 ] } }},
                    {
                        "hostel_cat_id":{'$in':arr}
                },
                {
                    "name": {$regex:  char , $options: 'i'}
                    }
            
            ]})
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
    var arr = req.body.hostel_cat_id;
    var char = req.body.name;
    Hostel_details.find( { "status":1,
                "$and": [
                    {
                        "hostel_cat_id":{'$in':arr}
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

else if(req.body.longitude && req.body.name ) {
    Hostel_details.find( { "status":1,
    "$and": [ {loc: { $geoWithin: { $centerSphere: [ [ req.body.longitude, req.body.latitude ], req.body.distance/3963.2 ] } }},
    {
        "name": {$regex:  char , $options: 'i'}
        }

]})
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
    Hostel_details.find( { "status":1,loc: { $geoWithin: { $centerSphere: [ [ req.body.longitude, req.body.latitude ], req.body.distance/3963.2 ] }}})
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
    var arr = req.body.hostel_cat_id;
    Hostel_details.find( { "status":1,"hostel_cat_id":{'$in':arr}})
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
else if (arr1.length == 0){
    Hostel_details.where('status').equals(1)
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