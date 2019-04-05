//var User = require("./../models/user");
//var User_roles = require("./../models/user_roles");
var Store = require("./../models/store_details");
//var Store_categories = require("./../models/hostel_categories");
var Hostel= require("./../models/hostel_details");
//var Hostel_categories = require("./../models/hostel_categories");
var Mess = require("./../models/mess_details");

var Product = require("./../models/product_detail");
var Categories = require("./../models/categories");
//var Mess_categories = require("./../models/mess_categories");
//var Offers = require("./../models/Offers");
var Subscription_plan = require("./../models/subscription_plan");

exports.global_search = (req, res, next) => {
    // var perPage = 10
    // var page = req.body.page || 1
    // console.log("heyyyyyyyyyyyy");
    var char = req.body.name;
    var data = [];
    if(req.body.name && req.body.longitude == "" && req.body.latitude == "" && req.body.distance == ""){

      Store.find( { "status":1,"name": {$regex:  char , $options: 'i'}})
        .select()
        .exec()
        .then(docs => {
          docs.map(doc => {
            data.push(data1=doc);
          })
        })
        Hostel.find({ "status":1,"name": {$regex:  char , $options: 'i'}})
        .select()
        .exec()
        .then(docs => {
          docs.map(doc => {
            data.push(data1=doc);
          })
        })
        Mess.find({ "status":1,"name": {$regex:  char , $options: 'i'}})
        .select()
        .exec()
        .then(docs => {
          docs.map(doc => {
            data.push(data1=doc);
          })
          res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
        })
        .catch(function (error) {
      validations.checkExceptionType(error, function (error) {
      res.status(error.status).json(error);
          });
      });
  
      
}
else if(req.body.name && req.body.longitude  && req.body.latitude  && req.body.distance ){

  Store.find({ "status":1,"name": {$regex:  char , $options: 'i'}, loc: { $geoWithin: { $centerSphere: [ [ req.body.longitude, req.body.latitude ], req.body.distance/3963.2 ] } }
})
    .select()
    .exec()
    .then(docs => {
      //console.log('1');
      docs.map(doc => {
        data.push(data1=doc);
      })
      //console.log(data);
    })
    Hostel.find({ "status":1,"name": {$regex:  char , $options: 'i'}, loc: { $geoWithin: { $centerSphere: [ [ req.body.longitude, req.body.latitude ], req.body.distance/3963.2 ] } }
  })
    .select()
    .exec()
    .then(docs => {
      docs.map(doc => {
        data.push(data1=doc);
      })
    })
    Mess.find({ "status":1,"name": {$regex:  char , $options: 'i'}, loc: { $geoWithin: { $centerSphere: [ [ req.body.longitude, req.body.latitude ], req.body.distance/3963.2 ] } }
  })
    .select()
    .exec()
    .then(docs => {
      docs.map(doc => {
        data.push(data1=doc);
      })
      res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
    })
    .catch(function (error) {
  validations.checkExceptionType(error, function (error) {
  res.status(error.status).json(error);
      });
  });

  
}

else{
  var data = [];
  Mess.aggregate(
      [ { $sample: { size: 10 } } ]
   )
    .exec()
    .then(docs => {
      docs.map(doc => {
        data.push(data1=doc);
      })
    })
    Store.aggregate(
      [ { $sample: { size: 10 } } ]
   )
    .exec()
    .then(docs => {
      docs.map(doc => {
        data.push(data1=doc);
      })
    })
    Hostel.aggregate(
      [ { $sample: { size: 10 } } ]
   )
    .exec()
    .then(docs => {
      docs.map(doc => {
        data.push(data1=doc);
      })
      //console.log(data);
      res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data))
    })
    .catch(function (error) {
  validations.checkExceptionType(error, function (error) {
  res.status(error.status).json(error);
      });
  });

};

  };

  // Mess.find({ "status":1,"name": {$regex:  char , $options: 'i'}, loc: { $geoWithin: { $centerSphere: [ [ req.body.longitude, req.body.latitude ], req.body.distance/3963.2 ] } }
  //          })
 
  exports.product_search = (req, res, next) => {
    var char = req.body.name;
    Product.find( { "status":1,"name": {$regex: char , $options: 'i'},"store_id":req.body.store_id})
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
  };

  exports.store_search = (req, res, next) => {
    var char = req.body.name;
    Store.find( { "status":1,"name": {$regex: char , $options: 'i'}})
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
  };

  exports.hostel_search = (req, res, next) => {
    var char = req.body.name;
    Hostel.find( { "status":1,"name": {$regex:  char , $options: 'i'}})
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
  };

  exports.mess_search = (req, res, next) => {
    var char = req.body.name;
    Mess.find( { "status":1,"name": {$regex:  char , $options: 'i'}})
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
  };

  exports.store_detail = (req, res, next) => {
    var id = req.body.id;
    Store.find( { "_id":id})
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
  };

  exports.hostel_detail = (req, res, next) => {
    var id = req.body.id;
    Hostel.find( { "_id":id})
      .select()
      .exec()
      .then(docs => {
      return detail = docs
      })
      Subscription_plan.find( { "hostel_or_mess_id":id})
      .select()
      .exec()
      .then(docs => {
           detail.map(doc => {
            return details = doc
          })
        res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, {
          details,
          subscriptions : docs
        }))
      })
      .catch(function (error) {
    validations.checkExceptionType(error, function (error) {
    res.status(error.status).json(error);
        });
    });
  };

  exports.mess_detail = (req, res, next) => {
    var id = req.body.id;
    Mess.find( { "_id":id})
      .select()
      .exec()
      .then(docs => {
        return detail = docs
      })
      Subscription_plan.find( { "hostel_or_mess_id":id})
      .select()
      .exec()
      .then(docs => {
        detail.map(doc => {
         return details = doc
       })
     res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, {
       details,
       subscriptions : docs
     }))
   })
      .catch(function (error) {
    validations.checkExceptionType(error, function (error) {
    res.status(error.status).json(error);
        });
    });
  };

  exports.product_detail = (req, res, next) => {
    var id = req.body.id;
    Product.find( { "_id":id})
      .select()
      .exec()
      .then(docs => {
        docs.map(doc => {
          return details = doc
        })
     res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, details
     ))
   })
      .catch(function (error) {
    validations.checkExceptionType(error, function (error) {
    res.status(error.status).json(error);
        });
    });
  };

  exports.categories = (req, res, next) => {
    var type = req.body.type;
    if(type == 'All'){
      Categories.find({ })
      .select()
      .exec()
      .then(docs => {
        
     res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, docs
     ))
   })
      .catch(function (error) {
    validations.checkExceptionType(error, function (error) {
    res.status(error.status).json(error);
        });
    });
    }
    else{
      Categories.find({"type":type})
      .select()
      .exec()
      .then(docs => {
        
     res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, docs
     ))
   })
      .catch(function (error) {
    validations.checkExceptionType(error, function (error) {
    res.status(error.status).json(error);
        });
    });
    }
    
  };