const mongoose = require("mongoose");
const User = require("./../models/user");
const Store = require("./../models/store_details");
const Orders = require("./../models/orders");
const Store_cat = require("./../models/store_categories");
const Delivery = require("./../models/delivery_options");
const Product = require("./../models/product_detail");
const Categories = require("./../models/categories");
const Hostel = require("./../models/hostel_details");
const Mess = require("./../models/mess_details");
const Subscriptions = require("./../models/subscription_plan");
const Product_qty = require("./../models/product_quantity");

var moment = require("moment");
var base64 = require("base-64");
var utf8 = require("utf8");

function encode(data) {
  var bytes = utf8.encode(data);
  var encoded = base64.encode(bytes);
  return encoded;
}

exports.dashboard = function(req, res, next) {
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    console.log("hieee");
    return res.render("admin_panel/dashboard.ejs", {
      msg: "",
      data: {}
    });
  } else {
    res.redirect("/admin-panel");
  }
};

exports.getallusers = function(req, res, next) {
  var perPage = 15;
  var page = req.query.page || 1;
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    User.find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(function(err, result) {
        User.count().exec(function(err, count) {
          if (err) return next(err);
          res.render("admin_panel/users.ejs", {
            data: result,
            current: page,
            pages: Math.ceil(count / perPage)
          });
        });
      });
  } else {
    res.redirect("admin_panel/admin_login.ejs");
  }
};

exports.view_user = function(req, res, next) {
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    console.log(req.query.id);
    User.find({ _id: req.query.id })
      .select()
      .exec()
      .then(result => {
        if (result && result.length > 0) {
          return res.render("admin_panel/view_user.ejs", {
            data: result
          });
        } else {
          return res.render("admin_panel/users.ejs", {
            msg: "No Data Found",
            data: {}
          });
        }
      })
      .catch(err => {
        res.status(customConfig.internalServerErrorCode).json({
          error: err
        });
      });
  } else {
    res.redirect("admin_panel/admin_login.ejs");
  }
};

exports.view_add_user = function(req, res, next) {
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    return res.render("admin_panel/add_user.ejs", {
      msg: "",
      data: {}
    });
  } else {
    res.redirect("admin_panel/admin_login.ejs");
  }
};

exports.add_user = function(req, res, next) {
  // console.log('we are here');
  //console.log(req.body)
  //console.log(req.files)
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    User.find({ email: req.body.email })
      .exec()
      .then(data => {
        if (data.length >= 1) {
          return res.render("admin_panel/add_user", {
            msg: "Email Already Exist"
          });
        } else {
          if (req.files && req.files.image) {
            var ImageFile = req.files.image;
            var image = Date.now() + "pic_" + ImageFile.name;
            ImageFile.mv("./public/uploads/" + image, function(err) {
              //upload file
              if (err) throw err;
            });
          }
          //console.log(req.body);
          var password1 = encode(req.body.password);
          //console.log(password1);
          let dataToAdd = {
            email: req.body.email,
            password: password1,
            name: req.body.name,
            contact_no: req.body.contact,
            //profileimage: "http://13.233.88.225:3000/uploads/" + image,
            address_line: req.body.address,
            city: req.body.address,
            district: req.body.district,
            state: req.body.state,
            pincode: req.body.pincode,
            status: req.body.radios
          };
          //console.log(dataToAdd);
          if (image)
            dataToAdd.profileimage =
              "http://13.233.88.225:3000/uploads/" + image;
          var user = new User(dataToAdd);
          console.log(dataToAdd);
          user
            .save()
            .then(function(result) {
              if (result) {
                console.log(result);
                return res.redirect("/dashboard/user");
              }
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                error: err
              });
            });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(customConfig.internalServerErrorCode).json({
          error: err
        });
      });
  } else {
    res.redirect("/admin-panel");
  }
};

exports.change_status = function(req, res, next) {
  //console.log('eeeeeeee');
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    //console.log(req.query.id);
    //console.log(req.query.status);
    User.findOneAndUpdate(
      { _id: req.query.id },
      { status: req.query.status },
      { new: true }
    )
      .exec()
      .then(function(result) {
        if (result) {
          return res.redirect("/dashboard/user");
        }
      })
      .catch(err => {
        res.status(customConfig.internalServerErrorCode).json({
          error: err
        });
      });
  } else {
    res.redirect("/admin-panel");
  }
};

exports.user_sort = function(req, res, next) {
  var perPage = 4;
  var page = req.query.page || 1;
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    User.find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(function(err, result) {
        User.count().exec(function(err, count) {
          if (err) return next(err);
          res.render("admin_panel/users.ejs", {
            data: result,
            current: page,
            pages: Math.ceil(count / perPage)
          });
        });
      });
  } else {
    res.redirect("admin_panel/admin_login.ejs");
  }
};

exports.date_sort = function(req, res, next) {
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    User.find()
      .select()
      .sort({ createdAt: -1 })
      .exec()
      .then(result => {
        if (result && result.length > 0) {
          return res.render("admin_panel/users.ejs", {
            data: result
          });
        } else {
          return res.render("admin_panel/users.ejs", {
            msg: "No Data Found",
            data: {}
          });
        }
      })
      .catch(err => {
        res.status(customConfig.internalServerErrorCode).json({
          error: err
        });
      });
  } else {
    res.redirect("/admin-panel");
  }
};

exports.update_user = (req, res, next) => {
  console.log("eeeeeeeeeeeeee");
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    console.log("eeeeeeeeeeeeee");
    console.log(req.query.id);
    if (req.files && req.files.image) {
      var ImageFile = req.files.image;
      var image = Date.now() + "pic_" + ImageFile.name;
      ImageFile.mv("./public/uploads/" + image, function(err) {
        //upload file
        if (err) throw err;
      });
    }
    var _id = req.query.id;

    var password1 = encode(req.body.password);
    if (req.files.image) {
      var x = {
        name: req.body.name,
        password: password1,
        profileimage: "http://13.233.88.225:3000/uploads/" + image,
        contact_no: req.body.contact,
        pincode: req.body.pincode,
        state: req.body.state,
        address_line: req.body.address,
        city: req.body.city,
        district: req.body.district
      };
    } else {
      var x = {
        name: req.body.name,
        password: password1,
        contact_no: req.body.contact_no,
        pincode: req.body.pincode,
        state: req.body.state,
        address_line: req.body.address,
        city: req.body.city,
        district: req.body.district
      };
    }
    User.findOneAndUpdate({ _id: _id }, { $set: x }, { new: true })
      .exec()
      .then(function(result) {
        if (result) {
          return res.redirect("/dashboard/user");
        }
      })
      .catch(err => {
        res.status(customConfig.internalServerErrorCode).json({
          error: err
        });
      });
  } else {
    res.redirect("/admin-panel");
  }
};

/** api to delete multiple employee **/
exports.multiple_delete_users = (req, res, next) => {
  console.log("eeeeeeeee");
  //console.log(req.body.user_id);
  var arr = req.body.user_id;
  //var arr=ids1.split(",");
  console.log(arr);
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    User.remove({ _id: { $in: arr } })
      .exec()
      .then(result => {
        if (result) {
          return res.redirect("/dashboard/user");
        }
      })
      .catch(err => {
        res.status(customConfig.internalServerErrorCode).json({
          error: err
        });
      });
  } else {
    res.redirect("/admin-panel");
  }
};
//**************************************************************** Stores starts here *****************************************
exports.getallstores = function(req, res, next) {
  var perPage = 10;
  var page = req.query.page || 1;
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    Store.find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(function(err, result) {
        Store.count().exec(function(err, count) {
          if (err) return next(err);
          res.render("admin_panel/stores.ejs", {
            data: result,
            current: page,
            pages: Math.ceil(count / perPage)
          });
        });
      });
  } else {
    res.redirect("/admin-panel");
  }
};

exports.view_store = function (req, res, next) {
    if (req.cookies.auth && req.cookies.auth.type == 0) {
        console.log(req.query.id);
        Store.find({ _id: req.query.id })
            .select()
            .exec()
            .then(result => {
                if (result && result.length > 0) {

                  Categories.find({type:"Store"})
                        .select()
                        .exec()
                        .then(docs => {
                          console.log(docs)
                            if (docs && docs.length > 0) {

                              Categories.find({ _id: result[0].store_cat_id })
                                    .select()
                                    .exec()
                                    .then(docs1 => {
                                      console.log(docs1)
                                        Delivery.find()
                                            .select()
                                            .exec()
                                            .then(docs2 => {
                                              console.log(docs2)

Delivery.find({ _id: result[0].delivery_id })
                                    .select()
                                    .exec()
                                    .then(docs3 => {
                                      console.log(docs3)

                                                return res.render("admin_panel/view_store.ejs", {
                                                    data: result,
                                                    data1: docs,
                                                    data2: docs1,
                                                    data3: docs2,
                                                    data4 : docs3
                                                });

                                            });

                                            });
                                    });
                            }
                        });
                } else {
                    return res.render("admin_panel/stores.ejs", {
                        msg: "No Data Found",
                        data: {}
                    });
                }
            })
            .catch(err => {
                res.status(customConfig.internalServerErrorCode).json({
                    error: err
                });
            });
    } else {
        res.redirect("/admin-panel");
    }
};

exports.view_add_store = function (req, res, next) {
    console.log('hieeee')
    if (req.cookies.auth && req.cookies.auth.type == 0) {
      Categories.find({type:"Store"})
        .select()
        .exec()
        .then(docs1 => {
console.log(docs1)
            Delivery.find()
                .select()
                .exec()
                .then(docs2 => {
                    console.log(docs2)
                    return res.render("admin_panel/add_store.ejs", {
                       
                        data2: docs1,
                        data3: docs2,
                        
                    });

                
                });
        });
    }
    else {
        res.redirect('/admin-panel');
    }
}

exports.add_store = (req, res, next) => {

    if (req.cookies.auth && req.cookies.auth.type == 0) {
        
        console.log(req.body)
    if (req.files && req.files.image) {
        var ImageFile = req.files.image;
        var image = Date.now() + 'pic_' + ImageFile.name;
        ImageFile.mv("./public/uploads/" + image, function (err) {
            //upload file
            if (err)
                throw err;
        });
    }
    User.find({ email: req.body.owner_user_id })
            .exec()
            .then(data => {
                if (data.length >= 1) {
              const store = new Store({
                email: req.body.email,
                name: req.body.name,
                description: req.body.description,
                cost: req.body.cost,
                offer: req.body.offer,
                time : req.body.time,
                image: "http://13.233.88.225:3000/uploads/" + image,
                contact_no : req.body.contact,
                address_line : req.body.address_line,
                city:req.body.city,
                state:req.body.state,
                pincode:req.body.pincode,
                owner_user_id:req.body.owner_user_id,
                store_cat_id:req.body.store_cat_id,
                delivery_id:req.body.delivery_id,
                status:1,
                type : 'store',
                loc : {  coordinates: req.body.coordinates ,type: "Point"}
              });
              store.save()
                  .then(result => {
                    if (result) {
                        console.log(result);
                        return res.redirect("/dashboard/stores");
                      }
                  })
                  .catch(err => {
                      console.log(err);
                      res.status(customConfig.internalServerErrorCode).json({
                          error: err
                      });
                  });
                }
  }).catch(err => {
    console.log(err);
    res.status(customConfig.internalServerErrorCode).json({
        error: err
    });
});
    } else {
        res.redirect("/admin-panel");
      }
};



exports.change_store_status = function(req, res, next) {
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    Store.findOneAndUpdate(
      { _id: req.query.id },
      { status: req.query.status },
      { new: true }
    )
      .exec()
      .then(function(result) {
        if (result) {
          return res.redirect("/dashboard/stores");
        }
      })
      .catch(err => {
        res.status(customConfig.internalServerErrorCode).json({
          error: err
        });
      });
  } else {
    res.redirect("/admin-panel");
  }
};

exports.store_sort = function(req, res, next) {
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    Store.find()
      .select()
      .sort({ name: -1 })
      .exec()
      .then(result => {
        if (result && result.length > 0) {
          return res.render("admin_panel/stores.ejs", {
            data: result
          });
        } else {
          return res.render("admin_panel/stores.ejs", {
            msg: "No Data Found",
            data: {}
          });
        }
      })
      .catch(err => {
        res.status(customConfig.internalServerErrorCode).json({
          error: err
        });
      });
  } else {
    res.redirect("/admin-panel");
  }
};

exports.store_date_sort = function(req, res, next) {
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    Stores.find()
      .select()
      .sort({ createdAt: -1 })
      .exec()
      .then(result => {
        if (result && result.length > 0) {
          return res.render("admin_panel/stores.ejs", {
            data: result
          });
        } else {
          return res.render("admin_panel/stores.ejs", {
            msg: "No Data Found",
            data: {}
          });
        }
      })
      .catch(err => {
        res.status(customConfig.internalServerErrorCode).json({
          error: err
        });
      });
  } else {
    res.redirect("/admin-panel");
  }
};

exports.update_store = (req, res, next) => {
    console.log('eeeeeeeeeeeeee');
    if (req.cookies.auth && req.cookies.auth.type == 0) {
        console.log(req.body);
        console.log(req.files)
        console.log(req.query.id);
    if (req.files && req.files.image) {
        var ImageFile = req.files.image;
        var image = Date.now() + 'pic_' + ImageFile.name;
        ImageFile.mv("./public/uploads/" + image, function (err) {
            //upload file
            if (err)
                throw err;
        });
    }
    var _id = req.query.id;

    if (req.files.image) {

        var x = {email: req.body.email,
        name: req.body.name,
        description: req.body.description,
        cost: req.body.cost,
        offer: req.body.offer,
        time : req.body.time,
        image: "http://13.233.88.225:3000/uploads/" + image,
        contact_no : req.body.contact,
        address_line : req.body.address_line,
        city:req.body.city,
        state:req.body.state,
        pincode:req.body.pincode,
        owner_user_id:req.body.owner_user_id,
        store_cat_id:req.body.store_cat_id,
        delivery_id:req.body.delivery_id,
        loc : { type: "Point", coordinates: req.body.coordinates }
        }
    } else {
        var x = {email: req.body.email,
            name: req.body.name,
            description: req.body.description,
            cost: req.body.cost,
            offer: req.body.offer,
            time : req.body.time,
            //image: "http://localhost:3000/uploads/" + image,
            contact_no : req.body.contact,
            address_line : req.body.address_line,
            city:req.body.city,
            state:req.body.state,
            pincode:req.body.pincode,
            owner_user_id:req.body.owner_user_id,
            store_cat_id:req.body.store_cat_id,
            delivery_id:req.body.delivery_id,
            loc : {  coordinates: req.body.coordinates ,type: "Point"}
            }
    }
    Store.findOneAndUpdate({ _id: _id }, { $set: x }, { new: true, })
        .exec()
        .then(function (result) {
            if (result) {
                return res.redirect("/dashboard/stores");
            }
        }).catch(err => {
            res.status(customConfig.internalServerErrorCode).json({
                error: err
            });
        })
    }
        else {
            res.redirect('/admin-panel');
        }
}

// /** api to delete multiple employee **/
exports.multiple_delete_stores = (req, res, next) => {
    console.log('eeeeeeeee');
    //console.log(req.body.user_id);
    var arr = req.body.user_id;
      //var arr=ids1.split(",");
      console.log(arr)
    if(req.cookies.auth && req.cookies.auth.type == 0){
          Store.remove({ _id:{'$in':arr}})
            .exec()
            .then(result => {
          if (result) {
              return res.redirect("/dashboard/stores");
          }
      }).catch(err => {
         res.status(customConfig.internalServerErrorCode).json({
             error: err
         });
   })
}
   else {
    res.redirect('/admin-panel');
  }
  }

//************************************************************************************products starts here *********************************/

exports.getallproducts = function(req, res, next) {
  console.log("heelloo")
  var perPage = 10;
  var page = req.query.page || 1;
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    Product.find({"store_id":req.query.id})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(function(err, result) {
        console.log(result)
        Product.count().exec(function(err, count) {
          if (err) return next(err);
          res.render("admin_panel/products.ejs", {
            data: result,
            current: page,
            pages: Math.ceil(count / perPage),
            id:req.query.id
          });
        });
      });
  } else {
    res.redirect("/admin-panel");
  }
};

exports.change_product_status = function(req, res, next) {
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    Product.findOneAndUpdate(
      { _id: req.query.id },
      { status: req.query.status },
      { new: true }
    )
      .exec()
      .then(function(result) {
        if (result) {
          return res.redirect('back');
        }
      })
      .catch(err => {
        res.status(customConfig.internalServerErrorCode).json({
          error: err
        });
      });
  } else {
    res.redirect("/admin-panel");
  }
};

exports.view_product = function(req, res, next) {
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    console.log(req.query.id);
    Product.find({ _id: req.query.id })
      .select()
      .exec()
      .then(result => {
        if (result && result.length > 0) {
          
          return res.render("admin_panel/view_product.ejs", {
            data: result,
            
          });
        

        } else {
          return res.render("admin_panel/view_product.ejs", {
            msg: "No Data Found",
            data: {}
          });
        }
      })
      .catch(err => {
        res.status(customConfig.internalServerErrorCode).json({
          error: err
        });
      });
  } else {
    res.redirect("/admin-panel");
  }
};

exports.update_product = (req, res, next) => {
  console.log('eeeeeeeeeeeeee');
  if (req.cookies.auth && req.cookies.auth.type == 0) {
      //console.log(req.body);
      //console.log(req.files)
      //console.log(req.query.id);
  if (req.files && req.files.image) {
      var ImageFile = req.files.image;
      var image = Date.now() + 'pic_' + ImageFile.name;
      ImageFile.mv("./public/uploads/" + image, function (err) {
          //upload file
          if (err)
              throw err;
      });
  }
  var _id = req.query.id;

  if (req.files.image) {

      var x = { name: req.body.name,
        description: req.body.description,
        cost: req.body.cost,
        offer: req.body.offer,
        image: "http://13.233.88.225:3000/uploads/" + image,
        //selling_price : req.body.selling_price,
        //product_cat_id:req.body.product_cat_id,
        //store_id:req.body.store_id,
        //delivery_id:req.body.delivery_id,
        product_quantity: req.body.quantity,
        status:1
      }
  } else {
      var x = { name: req.body.name,
        description: req.body.description,
        cost: req.body.cost,
        offer: req.body.offer,
        //image: "http://13.233.88.225:3000/uploads/" + image,
        //selling_price : req.body.selling_price,
        //product_cat_id:req.body.product_cat_id,
        //store_id:req.body.store_id,
        //delivery_id:req.body.delivery_id,
        product_quantity: req.body.quantity,
        status:1
          }
  }
  Product.findOneAndUpdate({ _id: _id }, { $set: x }, { new: true, })
      .exec()
      .then(function (result) {
        console.log(result.store_id)
          if (result) {
            
              return res.redirect('/dashboard/products?id='+result.store_id);
          }
      }).catch(err => {
          res.status(customConfig.internalServerErrorCode).json({
              error: err
          });
      })
  }
      else {
          res.redirect('/admin-panel');
      }
}

exports.view_add_product = function(req, res, next) {
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    return res.render("admin_panel/add_product.ejs", {
      msg: "",
      data: {}
    });
  } else {
    res.redirect("admin-panel");
  }
};

exports.add_product = (req, res, next) => {

  if (req.cookies.auth && req.cookies.auth.type == 0) {
      
      console.log(req.body.txtUrl)
      var id = req.body.txtUrl;
      var id1 = id.slice(56, 81);
console.log(id1)
//       var string = "this is a string";
// var length = 7;
// var trimmedString = string.substring(0, length);

      //console.log(id1)
  if (req.files && req.files.image) {
      var ImageFile = req.files.image;
      var image = Date.now() + 'pic_' + ImageFile.name;
      ImageFile.mv("./public/uploads/" + image, function (err) {
          //upload file
          if (err)
              throw err;
      });
  }
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    cost: req.body.cost,
    offer: req.body.offer,
    image: "http://13.233.88.225:3000/uploads/" + image,
    //selling_price : req.body.selling_price,
    //product_cat_id:req.body.product_cat_id,
    store_id:id1,
    product_quantity: req.body.quantity,
    //delivery_id:req.body.delivery_id,
    status:1
});
product.save()
                .then(result => {
                  if (result) {
                      console.log(result);
                      return res.redirect('/dashboard/products?id='+result.store_id);
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(customConfig.internalServerErrorCode).json({
                        error: err
                    });
                });
              }

   else {
      res.redirect("/admin-panel");
    }
};

exports.multiple_delete_products = (req, res, next) => {
  console.log('eeeeeeeee');
  //console.log(req.body.user_id);
  var arr = req.body.user_id;
    //var arr=ids1.split(",");
    console.log(arr)
  if(req.cookies.auth && req.cookies.auth.type == 0){
        Product.remove({ _id:{'$in':arr}})
          .exec()
          .then(result => {
        if (result) {
            return res.redirect('back');
        }
    }).catch(err => {
       res.status(customConfig.internalServerErrorCode).json({
           error: err
       });
 })
}
 else {
  res.redirect('/admin-panel');
}
}

//************************************************************************************categories starts here *********************************/
exports.getallcategories = function(req, res, next) {
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    Categories.find()
      .select()
      .exec(function(err, result) {
          res.render("admin_panel/categories.ejs", {
            data: result,
          });
        });
  } else {
    res.redirect("/admin-panel");
  }
};


exports.view_add_categories = function(req, res, next) {
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    return res.render("admin_panel/add_categories.ejs", {
      msg: "",
      data: {}
    });
  } else {
    res.redirect("admin-panel");
  }
};

exports.add_categories = (req, res, next) => {
console.log(req.body);
  if (req.cookies.auth && req.cookies.auth.type == 0) {

  const categories = new Categories({
    name:req.body.name,
    type:req.body.type
});
categories.save()
                .then(result => {
                  if (result) {
                      console.log(result);
                      return res.redirect('/dashboard/categories');
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(customConfig.internalServerErrorCode).json({
                        error: err
                    });
                });
              }

   else {
      res.redirect("/admin-panel");
    }
};

exports.multiple_delete_categories = (req, res, next) => {
  console.log('eeeeeeeee');
  //console.log(req.body.user_id);
  var arr = req.body.user_id;
    //var arr=ids1.split(",");
    console.log(arr)
  if(req.cookies.auth && req.cookies.auth.type == 0){
        Categories.remove({ _id:{'$in':arr}})
          .exec()
          .then(result => {
        if (result) {
            return res.redirect("/dashboard/categories");
        }
    }).catch(err => {
       res.status(customConfig.internalServerErrorCode).json({
           error: err
       });
 })
}
 else {
  res.redirect('/admin-panel');
}
}

exports.update_categories = (req, res, next) => {
  console.log('eeeeeeeeeeeeee');
  if (req.cookies.auth && req.cookies.auth.type == 0) {
     
  var _id = req.query.id;


      var x = { 
        name: req.body.name,
        type:req.body.type
        
      }

  Categories.findOneAndUpdate({ _id: _id }, { $set: x }, { new: true, })
      .exec()
      .then(function (result) {
        console.log(result)
          if (result) {
            
              return res.redirect('/dashboard/categories');
          }
      }).catch(err => {
          res.status(customConfig.internalServerErrorCode).json({
              error: err
          });
      })
  }
      else {
          res.redirect('/admin-panel');
      }
}

exports.view_categories = function(req, res, next) {
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    console.log(req.query.id);
    Categories.find({ _id: req.query.id })
      .select()
      .exec()
      .then(result => {
        if (result && result.length > 0) {
          
          return res.render("admin_panel/view_categories.ejs", {
            data: result,
            
          });
        

        } else {
          return res.render("admin_panel/view_categories.ejs", {
            msg: "No Data Found",
            data: {}
          });
        }
      })
      .catch(err => {
        res.status(customConfig.internalServerErrorCode).json({
          error: err
        });
      });
  } else {
    res.redirect("/admin-panel");
  }
};

//*************************************************************************hostel start here****************************************************** */
exports.getallhostel= function(req, res, next) {
  var perPage = 10;
  var page = req.query.page || 1;
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    Hostel.find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(function(err, result) {
        Store.count().exec(function(err, count) {
          if (err) return next(err);
          res.render("admin_panel/hostel.ejs", {
            data: result,
            current: page,
            pages: Math.ceil(count / perPage)
          });
        });
      });
  } else {
    res.redirect("/admin-panel");
  }
};

exports.view_hostel = function (req, res, next) {
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    //console.log(req.query.id);
    Hostel.find({ _id: req.query.id })
      .select()
      .exec()
      .then(result => {
        if (result && result.length > 0) {

          Categories.find({type : 'Hostel'})
            .select()
            .exec()
            .then(docs2 => {

              Categories.find({ _id: result[0].hostel_cat_id })
                .select()
                .exec()
                .then(docs3 => {


                  return res.render("admin_panel/view_hostel.ejs", {
                    data: result,
                    data1: docs2,
                    data2: docs3
                    
                  });

                });

            })
            
            
      }
    })
      .catch(err => {
        res.status(customConfig.internalServerErrorCode).json({
          error: err
        });
      });
  } else {
    res.redirect("/admin-panel");
  }
};

exports.view_add_hostel = function (req, res, next) {
    console.log('hieeee')
    if (req.cookies.auth && req.cookies.auth.type == 0) {

      Categories.find({type:"Hostel"})
        .select()
        .exec()
        .then(docs1 => {
console.log(docs1)
                    return res.render("admin_panel/add_hostel.ejs", {
                       
                        data2: docs1,
                        //data3: docs2,
                        
                    

                
                });
        });
    }
    else {
        res.redirect('/admin-panel');
    }
}

exports.add_hostel = (req, res, next) => {

    if (req.cookies.auth && req.cookies.auth.type == 0) {
        
        console.log(req.body)
    if (req.files && req.files.image) {
        var ImageFile = req.files.image;
        var image = Date.now() + 'pic_' + ImageFile.name;
        ImageFile.mv("./public/uploads/" + image, function (err) {
            //upload file
            if (err)
                throw err;
        });
    }
    User.find({ email: req.body.owner_user_id })
            .exec()
            .then(data => {
                if (data.length >= 1) {
              const hostel = new Hostel({
                email: req.body.email,
                name: req.body.name,
                description: req.body.description,
                cost: req.body.cost,
                offer: req.body.offer,
                //time : req.body.time,
                image: "http://13.233.88.225:3000/uploads/" + image,
                contact_no : req.body.contact,
                address_line : req.body.address_line,
                city:req.body.city,
                state:req.body.state,
                pincode:req.body.pincode,
                owner_user_id:req.body.owner_user_id,
                hostel_cat_id:req.body.hostel_cat_id,
                //delivery_id:req.body.delivery_id,
                status:1,
                type : 'hostel',
                loc : {  coordinates: req.body.coordinates ,type: "Point"}
              });
              hostel.save()
                  .then(result => {
                    if (result) {
                        console.log(result);
                        return res.redirect("/dashboard/hostel");
                      }
                  })
                  .catch(err => {
                      console.log(err);
                      res.status(customConfig.internalServerErrorCode).json({
                          error: err
                      });
                  });
                }
  }).catch(err => {
    console.log(err);
    res.status(customConfig.internalServerErrorCode).json({
        error: err
    });
});
    } else {
        res.redirect("/admin-panel");
      }
};



exports.change_hostel_status = function(req, res, next) {
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    Hostel.findOneAndUpdate(
      { _id: req.query.id },
      { status: req.query.status },
      { new: true }
    )
      .exec()
      .then(function(result) {
        if (result) {
          return res.redirect("/dashboard/hostel");
        }
      })
      .catch(err => {
        res.status(customConfig.internalServerErrorCode).json({
          error: err
        });
      });
  } else {
    res.redirect("/admin-panel");
  }
};

exports.update_hostel = (req, res, next) => {
    console.log('eeeeeeeeeeeeee');
    if (req.cookies.auth && req.cookies.auth.type == 0) {
        console.log(req.body);
        console.log(req.files)
        console.log(req.query.id);
    if (req.files && req.files.image) {
        var ImageFile = req.files.image;
        var image = Date.now() + 'pic_' + ImageFile.name;
        ImageFile.mv("./public/uploads/" + image, function (err) {
            //upload file
            if (err)
                throw err;
        });
    }
    var _id = req.query.id;

    if (req.files.image) {

        var x = {email: req.body.email,
        name: req.body.name,
        description: req.body.description,
        cost: req.body.cost,
        offer: req.body.offer,
        time : req.body.time,
        image: "http://13.233.88.225:3000/uploads/" + image,
        contact_no : req.body.contact,
        address_line : req.body.address_line,
        city:req.body.city,
        state:req.body.state,
        pincode:req.body.pincode,
        owner_user_id:req.body.owner_user_id,
        hostel_cat_id:req.body.hostel_cat_id,
        loc : { type: "Point", coordinates: req.body.coordinates }
        }
    } else {
        var x = {email: req.body.email,
            name: req.body.name,
            description: req.body.description,
            cost: req.body.cost,
            offer: req.body.offer,
            time : req.body.time,
            //image: "http://localhost:3000/uploads/" + image,
            contact_no : req.body.contact,
            address_line : req.body.address_line,
            city:req.body.city,
            state:req.body.state,
            pincode:req.body.pincode,
            owner_user_id:req.body.owner_user_id,
            hostel_cat_id:req.body.hostel_cat_id,
            loc : {  coordinates: req.body.coordinates ,type: "Point"}
            }
    }
    Hostel.findOneAndUpdate({ _id: _id }, { $set: x }, { new: true, })
        .exec()
        .then(function (result) {
            if (result) {
                return res.redirect("/dashboard/hostel");
            }
        }).catch(err => {
            res.status(customConfig.internalServerErrorCode).json({
                error: err
            });
        })
    }
        else {
            res.redirect('/admin-panel');
        }
}

// // /** api to delete multiple employee **/
exports.multiple_delete_hostel = (req, res, next) => {
    console.log('eeeeeeeee');
    //console.log(req.body.user_id);
    var arr = req.body.user_id;
      //var arr=ids1.split(",");
      console.log(arr)
    if(req.cookies.auth && req.cookies.auth.type == 0){
          Hostel.remove({ _id:{'$in':arr}})
            .exec()
            .then(result => {
          if (result) {
              return res.redirect("/dashboard/hostel");
          }
      }).catch(err => {
         res.status(customConfig.internalServerErrorCode).json({
             error: err
         });
   })
}
   else {
    res.redirect('/admin-panel');
  }
  }

  
//*************************************************************************hostel subscriptions start here****************************************************** */
exports.getallhostel_subscriptions = function(req, res, next) {

  if (req.cookies.auth && req.cookies.auth.type == 0) {
    Subscriptions.find({"hostel_or_mess_id":req.query.id})
      .select()
      .exec(function(err, result) {
          res.render("admin_panel/hostel_subscription.ejs", {
            data: result,
            id:req.query.id
        });
      });
  } else {
    res.redirect("/admin-panel");
  }
};

exports.change_hostel_status_subscriptions = function(req, res, next) {
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    Subscriptions.findOneAndUpdate(
      { _id: req.query.id },
      { status: req.query.status },
      { new: true }
    )
      .exec()
      .then(function(result) {
        if (result) {
          return res.redirect('back');
        }
      })
      .catch(err => {
        res.status(customConfig.internalServerErrorCode).json({
          error: err
        });
      });
  } else {
    res.redirect("/admin-panel");
  }
};

exports.view_hostel_subscriptions = function(req, res, next) {
  
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    console.log(req.query.id);
    Subscriptions.find({ "_id": req.query.id })
      .select()
      .exec()
      .then(result => {
        if (result && result.length > 0) {
          console.log('hieee')
          console.log(result)
          return res.render("admin_panel/view_hostel_sub.ejs", {
            data: result,
            
          });
        

        } else {
          console.log('byeee')
          return res.render("admin_panel/view_hostel_sub.ejs", {
            msg: "No Data Found",
            data: {}
          });
        }
      })
      .catch(err => {
        res.status(customConfig.internalServerErrorCode).json({
          error: err
        });
      });
  } else {
    res.redirect("/admin-panel");
  }
};

exports.update_hostel_subscriptions = (req, res, next) => {
  console.log('eeeeeeeeeeeeee');
  if (req.cookies.auth && req.cookies.auth.type == 0) {

  var _id = req.query.id;



      var x = { title: req.body.title,
        description: req.body.description,
        cost: req.body.cost,
        offer: req.body.offer,
        time_interval: req.body.time_interval
      }
  
      Subscriptions.findOneAndUpdate({ _id: _id }, { $set: x }, { new: true, })
      .exec()
      .then(function (result) {
        console.log(result.hostel_or_mess_id)
          if (result) {
            
              return res.redirect('/dashboard/hostel_subscriptions?id='+result.hostel_or_mess_id);
          }
      }).catch(err => {
          res.status(customConfig.internalServerErrorCode).json({
              error: err
          });
      })
  }
      else {
          res.redirect('/admin-panel');
      }
}

exports.view_add_hostel_subscriptions = function(req, res, next) {
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    return res.render("admin_panel/add_hostel_sub.ejs", {
      msg: "",
      data: {}
    });
  } else {
    res.redirect("admin-panel");
  }
};

exports.add_hostel_subscriptions = (req, res, next) => {

  if (req.cookies.auth && req.cookies.auth.type == 0) {
      
      //console.log(req.body)
      var id = req.body.txtUrl;
      var id1 = id.slice(69, 94);

//       var string = "this is a string";
// var length = 7;
// var trimmedString = string.substring(0, length);

      console.log(id1)
 
  const subscriptions = new Subscriptions({
    title: req.body.title,
    description: req.body.description,
    cost: req.body.cost,
    offer: req.body.offer,
    hostel_or_mess_id:id1,
    time_interval: req.body.time_interval,
    status:1
});
subscriptions.save()
                .then(result => {
                  if (result) {
                      console.log(result);
                      return res.redirect('/dashboard/hostel_subscriptions?id='+result.hostel_or_mess_id);
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(customConfig.internalServerErrorCode).json({
                        error: err
                    });
                });
               }

   else {
      res.redirect("/admin-panel");
    }
};

exports.multiple_delete_hostel_subscriptions = (req, res, next) => {
  console.log('eeeeeeeee');
  //console.log(req.body.user_id);
  var arr = req.body.user_id;
    //var arr=ids1.split(",");
    console.log(arr)
  if(req.cookies.auth && req.cookies.auth.type == 0){
    Subscriptions.remove({ _id:{'$in':arr}})
          .exec()
          .then(result => {
        if (result) {
            return res.redirect('back');
        }
    }).catch(err => {
       res.status(customConfig.internalServerErrorCode).json({
           error: err
       });
 })
}
 else {
  res.redirect('/admin-panel');
}
}

/*************************************************************************mess start here****************************************************** */
exports.getallmess= function(req, res, next) {
  var perPage = 10;
  var page = req.query.page || 1;
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    Mess.find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(function(err, result) {
        Mess.count().exec(function(err, count) {
          if (err) return next(err);
          res.render("admin_panel/mess.ejs", {
            data: result,
            current: page,
            pages: Math.ceil(count / perPage)
          });
        });
      });
  } else {
    res.redirect("/admin-panel");
  }
};

exports.view_mess = function (req, res, next) {
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    //console.log(req.query.id);
    Mess.find({ _id: req.query.id })
      .select()
      .exec()
      .then(result => {
        if (result && result.length > 0) {
          Categories.find({type:"Mess"})
          .select()
          .exec()
          .then(docs => {
            console.log(docs)
              if (docs && docs.length > 0) {

                Categories.find({ _id: result[0].mess_cat_id })
                      .select()
                      .exec()
                      .then(docs1 => {
                        console.log(docs1)
                          Delivery.find()
                              .select()
                              .exec()
                              .then(docs2 => {
                                console.log(docs2)

Delivery.find({ _id: result[0].delivery_id })
                      .select()
                      .exec()
                      .then(docs3 => {
                        console.log(docs3)

                                  return res.render("admin_panel/view_mess.ejs", {
                                      data: result,
                                      data1: docs,
                                      data2: docs1,
                                      data3: docs2,
                                      data4 : docs3
                                  });

                              });

                              });
                      });
              }
          });
  } else {
      return res.render("admin_panel/mess.ejs", {
          msg: "No Data Found",
          data: {}
      });
  }
})
.catch(err => {
  res.status(customConfig.internalServerErrorCode).json({
      error: err
  });
});
} else {
res.redirect("/admin-panel");
}
};

exports.view_add_mess = function (req, res, next) {
    console.log('hieeee')
    if (req.cookies.auth && req.cookies.auth.type == 0) {

      Categories.find({type:"Mess"})
        .select()
        .exec()
        .then(docs1 => {
console.log(docs1)
Delivery.find()
.select()
.exec()
.then(docs2 => {
    console.log(docs2)
    return res.render("admin_panel/add_mess.ejs", {
       
        data2: docs1,
        data3: docs2,
        
    });

                
                });
        });
    }
    else {
        res.redirect('/admin-panel');
    }
}

exports.add_mess = (req, res, next) => {

    if (req.cookies.auth && req.cookies.auth.type == 0) {
        
        console.log(req.body)
    if (req.files && req.files.image) {
        var ImageFile = req.files.image;
        var image = Date.now() + 'pic_' + ImageFile.name;
        ImageFile.mv("./public/uploads/" + image, function (err) {
            //upload file
            if (err)
                throw err;
        });
    }
    User.find({ email: req.body.owner_user_id })
            .exec()
            .then(data => {
                if (data.length >= 1) {
              const mess = new Mess({
                email: req.body.email,
                name: req.body.name,
                description: req.body.description,
                cost: req.body.cost,
                offer: req.body.offer,
                //time : req.body.time,
                image: "http://13.233.88.225:3000/uploads/" + image,
                contact_no : req.body.contact,
                address_line : req.body.address_line,
                city:req.body.city,
                state:req.body.state,
                pincode:req.body.pincode,
                owner_user_id:req.body.owner_user_id,
                mess_cat_id:req.body.mess_cat_id,
                delivery_id:req.body.delivery_id,
                status:1,
                type : 'mess',
                loc : {  coordinates: req.body.coordinates ,type: "Point"}
              });
              mess.save()
                  .then(result => {
                    if (result) {
                        console.log(result);
                        return res.redirect("/dashboard/mess");
                      }
                  })
                  .catch(err => {
                      console.log(err);
                      res.status(customConfig.internalServerErrorCode).json({
                          error: err
                      });
                  });
                }
  }).catch(err => {
    console.log(err);
    res.status(customConfig.internalServerErrorCode).json({
        error: err
    });
});
    } else {
        res.redirect("/admin-panel");
      }
};



exports.change_mess_status = function(req, res, next) {
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    Mess.findOneAndUpdate(
      { _id: req.query.id },
      { status: req.query.status },
      { new: true }
    )
      .exec()
      .then(function(result) {
        if (result) {
          return res.redirect("/dashboard/mess");
        }
      })
      .catch(err => {
        res.status(customConfig.internalServerErrorCode).json({
          error: err
        });
      });
  } else {
    res.redirect("/admin-panel");
  }
};

exports.update_mess= (req, res, next) => {
    console.log('eeeeeeeeeeeeee');
    if (req.cookies.auth && req.cookies.auth.type == 0) {
        console.log(req.body);
        console.log(req.files)
        console.log(req.query.id);
    if (req.files && req.files.image) {
        var ImageFile = req.files.image;
        var image = Date.now() + 'pic_' + ImageFile.name;
        ImageFile.mv("./public/uploads/" + image, function (err) {
            //upload file
            if (err)
                throw err;
        });
    }
    var _id = req.query.id;

    if (req.files.image) {

        var x = {email: req.body.email,
        name: req.body.name,
        description: req.body.description,
        cost: req.body.cost,
        offer: req.body.offer,
        time : req.body.time,
        image: "http://13.233.88.225:3000/uploads/" + image,
        contact_no : req.body.contact,
        address_line : req.body.address_line,
        city:req.body.city,
        state:req.body.state,
        pincode:req.body.pincode,
        owner_user_id:req.body.owner_user_id,
        mess_cat_id:req.body.mess_cat_id,
        delivery_id:req.body.delivery_id,
        loc : { type: "Point", coordinates: req.body.coordinates }
        }
    } else {
        var x = {email: req.body.email,
            name: req.body.name,
            description: req.body.description,
            cost: req.body.cost,
            offer: req.body.offer,
            time : req.body.time,
            //image: "http://localhost:3000/uploads/" + image,
            contact_no : req.body.contact,
            address_line : req.body.address_line,
            city:req.body.city,
            state:req.body.state,
            pincode:req.body.pincode,
            owner_user_id:req.body.owner_user_id,
            mess_cat_id:req.body.mess_cat_id,
            delivery_id:req.body.delivery_id,
            loc : {  coordinates: req.body.coordinates ,type: "Point"}
            }
    }
    Mess.findOneAndUpdate({ _id: _id }, { $set: x }, { new: true, })
        .exec()
        .then(function (result) {
            if (result) {
                return res.redirect("/dashboard/mess");
            }
        }).catch(err => {
            res.status(customConfig.internalServerErrorCode).json({
                error: err
            });
        })
    }
        else {
            res.redirect('/admin-panel');
        }
}

// // /** api to delete multiple employee **/
exports.multiple_delete_mess = (req, res, next) => {
    console.log('eeeeeeeee');
    //console.log(req.body.user_id);
    var arr = req.body.user_id;
      //var arr=ids1.split(",");
      console.log(arr)
    if(req.cookies.auth && req.cookies.auth.type == 0){
          Mess.remove({ _id:{'$in':arr}})
            .exec()
            .then(result => {
          if (result) {
              return res.redirect("/dashboard/mess");
          }
      }).catch(err => {
         res.status(customConfig.internalServerErrorCode).json({
             error: err
         });
   })
}
   else {
    res.redirect('/admin-panel');
  }
  }

//*************************************************************************mess subscriptions start here****************************************************** */
exports.getallmess_subscriptions = function(req, res, next) {

  if (req.cookies.auth && req.cookies.auth.type == 0) {
    Subscriptions.find({"hostel_or_mess_id":req.query.id})
      .select()
      .exec(function(err, result) {
          res.render("admin_panel/mess_subscription.ejs", {
            data: result,
            id:req.query.id
        });
      });
  } else {
    res.redirect("/admin-panel");
  }
};

exports.change_mess_status_subscriptions = function(req, res, next) {
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    Subscriptions.findOneAndUpdate(
      { _id: req.query.id },
      { status: req.query.status },
      { new: true }
    )
      .exec()
      .then(function(result) {
        if (result) {
          return res.redirect('back');
        }
      })
      .catch(err => {
        res.status(customConfig.internalServerErrorCode).json({
          error: err
        });
      });
  } else {
    res.redirect("/admin-panel");
  }
};

exports.view_mess_subscriptions = function(req, res, next) {
  
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    console.log(req.query.id);
    Subscriptions.find({ "_id": req.query.id })
      .select()
      .exec()
      .then(result => {
        if (result && result.length > 0) {
          console.log('hieee')
          console.log(result)
          return res.render("admin_panel/view_mess_sub.ejs", {
            data: result,
            
          });
        

        } else {
          console.log('byeee')
          return res.render("admin_panel/view_mess_sub.ejs", {
            msg: "No Data Found",
            data: {}
          });
        }
      })
      .catch(err => {
        res.status(customConfig.internalServerErrorCode).json({
          error: err
        });
      });
  } else {
    res.redirect("/admin-panel");
  }
};

exports.update_mess_subscriptions = (req, res, next) => {
  console.log('eeeeeeeeeeeeee');
  if (req.cookies.auth && req.cookies.auth.type == 0) {

  var _id = req.query.id;



      var x = { title: req.body.title,
        description: req.body.description,
        cost: req.body.cost,
        offer: req.body.offer,
        time_interval: req.body.time_interval
      }
  
      Subscriptions.findOneAndUpdate({ _id: _id }, { $set: x }, { new: true, })
      .exec()
      .then(function (result) {
        console.log(result.hostel_or_mess_id)
          if (result) {
            
              return res.redirect('/dashboard/mess_subscriptions?id='+result.hostel_or_mess_id);
          }
      }).catch(err => {
          res.status(customConfig.internalServerErrorCode).json({
              error: err
          });
      })
  }
      else {
          res.redirect('/admin-panel');
      }
}

exports.view_add_mess_subscriptions = function(req, res, next) {
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    return res.render("admin_panel/add_mess_sub.ejs", {
      msg: "",
      data: {}
    });
  } else {
    res.redirect("admin-panel");
  }
};

exports.add_mess_subscriptions = (req, res, next) => {

  if (req.cookies.auth && req.cookies.auth.type == 0) {
      
      //console.log(req.body)
      var id = req.body.txtUrl;
      var id1 = id.slice(67, 92);

//       var string = "this is a string";
// var length = 7;
// var trimmedString = string.substring(0, length);

      console.log(id1)
 
  const subscriptions = new Subscriptions({
    title: req.body.title,
    description: req.body.description,
    cost: req.body.cost,
    offer: req.body.offer,
    hostel_or_mess_id:id1,
    time_interval: req.body.time_interval,
    status:1
});
subscriptions.save()
                .then(result => {
                  if (result) {
                      console.log(result);
                      return res.redirect('/dashboard/mess_subscriptions?id='+result.hostel_or_mess_id);
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(customConfig.internalServerErrorCode).json({
                        error: err
                    });
                });
                }

   else {
      res.redirect("/admin-panel");
    }
};

exports.multiple_delete_mess_subscriptions = (req, res, next) => {
  console.log('eeeeeeeee');
  //console.log(req.body.user_id);
  var arr = req.body.user_id;
    //var arr=ids1.split(",");
    console.log(arr)
  if(req.cookies.auth && req.cookies.auth.type == 0){
    Subscriptions.remove({ _id:{'$in':arr}})
          .exec()
          .then(result => {
        if (result) {
            return res.redirect('back');
        }
    }).catch(err => {
       res.status(customConfig.internalServerErrorCode).json({
           error: err
       });
 })
}
 else {
  res.redirect('/admin-panel');
}
}

//********************************************************orders start here********************************************** */

exports.getallorders = function(req, res, next) {
  var perPage = 15;
  var page = req.query.page || 1;
  if (req.cookies.auth && req.cookies.auth.type == 0) {
    Orders.aggregate([
      {
        $lookup: {
          from: "product_details",
          localField: "product_id",
          foreignField: "_id",
          as: "product"
        }
      }
    ])
    .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(function(err, result) {
        //console.log(result[0].product[0].name)
        Orders.count().exec(function(err, count) {
          if (err) return next(err);
          console.log(result)
          res.render("admin_panel/orders.ejs", {
            data: result,
            current: page,
            pages: Math.ceil(count / perPage)
          });
        });
      });
  } else {
    res.redirect("/admin-panel");
   }
};


exports.order_details = function (req, res, next) {

  if (req.cookies.auth && req.cookies.auth.type == 0) {
   
var id = mongoose.Types.ObjectId(req.query.id);
   
    console.log(id)
    Orders.aggregate([
      { $match : {_id : id } },
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
    .then(result => {
      console.log(result)
      res.render("admin_panel/order_details.ejs", {
        data: result,
      });
    })
  } else {
    res.redirect("/admin-panel");
   }
};
