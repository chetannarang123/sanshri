var Product_detail = require("./../models/product_detail");
var Cart = require("./../models/cart");
exports.add_to_cart = (req, res, next) => {

    const cart = new Cart({
        quantity: req.body.quantity,
        user_id: req.body.user_id,
        product_id: req.body.product_id
    });
    cart.save()
        .then(result => {
            console.log(result);
            res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null,
                {
                    message: "added successfully",
                    result
                }));
        })
        .catch(err => {
            console.log(err);
            res.status(customConfig.internalServerErrorCode).json({
                error: err
            });
        });


};

exports.my_cart = (req, res, next) => {
    var id = req.body.user_id;
   
    Cart.aggregate([
        { $match : { user_id : id } },
        {
          $lookup:
            {
            from: "product_details",
            localField: "product_id",
            foreignField: "_id",
              as: "product"
            }
       }
     ])
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

exports.remove_product = (req, res, next) => {

    var id = req.body._id;
    
    Cart.deleteOne({ _id: id})
            .exec()
            .then(result => {
              console.log(result)
          if (result.length >= 1 ) {

            res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, {
                message: "Item Removed Successfully",
              
              }))
          }
          else{
            res.status(customConfig.jsonNoContentFoundCode).json(jsonResponses.response(5, null, {
              message: "no item found",
            
            }))
          }

      }).catch(err => {
         res.status(customConfig.internalServerErrorCode).json({
             error: err
         });
   })
  
  
  }

// exports.store_detail = (req, res, next) => {
//     var id = req.body.id;
//     Store.find({ "_id": id })
//         .select()
//         .exec()
//         .then(docs => {
//             res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, docs))
//         })
//         .catch(function (error) {
//             validations.checkExceptionType(error, function (error) {
//                 res.status(error.status).json(error);
//             });
//         });
// };

