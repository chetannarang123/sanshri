var Product_detail = require("./../models/product_detail");
var Product_categories = require("./../models/product_categories");
var Product_quantity = require("./../models/product_quantity");


exports.product_details = (req, res, next) => {
    if (req.files && req.files.image) {
        var ImageFile = req.files.image;
        var image = Date.now() + 'pic_' + ImageFile.name;
        ImageFile.mv("./public/uploads/" + image, function (err) {
            //upload file
            if (err)
                throw err;
        });
    }
              const product_detail = new Product_detail({
                  name: req.body.name,
                  description: req.body.description,
                  cost: req.body.cost,
                  offer: req.body.offer,
                  image: "http://13.233.88.225:3000/uploads/" + image,
                  selling_price : req.body.selling_price,
                  product_cat_id:req.body.product_cat_id,
                  store_id:req.body.store_id,
                  delivery_id:req.body.delivery_id,
                  status:1
              });
              product_detail.save()
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
        

};
  
exports.show_all_products = (req, res, next) => {
    Product_detail.find({"store_id" : req.body.store_id,"status" : 1})
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

exports.product_quantity = (req, res, next) => {
    const product_quantity = new Product_quantity({
        product_id: req.body.product_id,
        quantity: req.body.quantity,
    });
    product_quantity.save()
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


};