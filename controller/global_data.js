var Product_detail = require("./../models/product_detail");
var Mess_detail = require("./../models/mess_details");
var Store_detail = require("./../models/store_details");
var Hostel_detail = require("./../models/hostel_details");

exports.random_data = (req, res, next) => {
    var data = [];
    Mess_detail.aggregate(
        [ { $sample: { size: 10 } } ]
     )
      .exec()
      .then(docs => {
        docs.map(doc => {
          data.push(data1=doc);
        })
      })
      Store_detail.aggregate(
        [ { $sample: { size: 10 } } ]
     )
      .exec()
      .then(docs => {
        docs.map(doc => {
          data.push(data1=doc);
        })
      })
      Hostel_detail.aggregate(
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
