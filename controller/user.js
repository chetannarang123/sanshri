var mongoose = require("mongoose");
/** requiring models */
var User = require("./../models/user");
var User_roles = require("./../models/user_roles");
var User_subscription = require("./../models/user_subscription");
var Complaints = require("./../models/complaints");
var jwt = require("jsonwebtoken");
var _ = require("lodash");
let date = require("date-and-time");
const nodemailer = require("nodemailer");
const Insta = require("instamojo-nodejs");
const url = require("url");
var Cart = require("./../models/cart");
var Orders = require("./../models/orders");
var Product = require("./../models/product_detail");
var base64 = require("base-64");
var utf8 = require("utf8");

/* base 68 and utf8 for passowrd encryptiom */

function encode(data) {
  var bytes = utf8.encode(data);
  var encoded = base64.encode(bytes);
  return encoded;
}
function decode(data) {
  var bytes = base64.decode(data);
  var text = utf8.decode(bytes);
  return text;
}

/**
 * login module.
 * @module login module
 */

/** user can signup. */

/**
 * Represents a book.
 * @export
 * @param {email} email - The email of user.
 * @param {password} password - password of user.
 */

exports.signup = (req, res, next) => {
  console.log("hieeeeeeee");
  var email = req.body.email;
  var otp_data = _.random(1000, 9999).toString();
  let now = new Date();
  let expiry_date = date.addMinutes(now, 5);
  /** validations check that parameter name is proper or not*/
  validations
    .checkParameter(req.body.email, "email")
    .then(function(data) {
      return validations.checkParameter(req.body.password, "password");
    })
    .then(function(data) {
      return validations.checkParameter(req.body.name, "name");
    })
    .then(function(data) {
      return validations.checkParameter(req.body.contact_no, "contact_no");
    })
    .then(data => {
      /** find the email if email exixst it will through error else it will go forward */
      User.find({ email: req.body.email })
        .exec()
        .then(data => {
          if (data.length >= 1) {
            return res.status(customConfig.jsonConflictCode).json(
              jsonResponses.response(6, null, {
                message:
                  "Email address already exists! Please try again with another email address."
              })
            );
          } else {
            /** password is encoded and all the data is saved in const User  */
            var password = encode(req.body.password);

            const user = new User({
              email: req.body.email,
              password: password,
              name: req.body.name,
              contact_no: req.body.contact_no,
              status: 0,
              otp: otp_data,
              expiry_date: expiry_date

              // device_id: req.body.device_id,
              // notification_id: req.body.notification_id,
              // platform: req.body.platform
            });
            user
              .save()
              /** after save result is consoled */
              .then(result => {
                console.log(result);
                var otp1 = result.otp;
                var transporter = nodemailer.createTransport({
                  service: "gmail",
                  auth: {
                    user: "chetan.narang@ultivic.com",
                    pass: "Chetan@ULT!V!C"
                  }
                });
                var mailOptions = {
                  from: "developer.chetan@gmail.com",
                  to: email,
                  subject: "Signup Successfull",
                  text:
                    "Hi " +
                    email +
                    "\n\n" +
                    "your otp to change password is " +
                    otp1 +
                    "\n\n" +
                    "Thanks"
                };
                transporter.sendMail(mailOptions, function(error, info) {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log("Email sent: " + info.response);
                  }
                });
                // return res.status(200).json(jsonResponses.response('1', "Otp sent to your registered email", { otp: result.otp, expiry_date: expiry_date }));

                const user_roles = new User_roles({
                  user_id: result._id,
                  role_id: 2
                });
                user_roles.save();

                /** response should be of json format */
                res.status(customConfig.jsonSuccessCode).json(
                  jsonResponses.response(1, null, {
                    message: "user created",
                    email: result.email,
                    name: result.name,
                    contact_no: result.contact_no,
                    id: result._id,
                    otp: result.otp,
                    expiry_date: expiry_date
                    // device_id: result.device_id,
                    // notification_id: result.notification_id,
                    // platform: result.platform
                  })
                );
              })
              .catch(err => {
                console.log(err);
                res.status(customConfig.internalServerErrorCode).json({
                  error: err
                });
              });
          }
        });
    })
    .catch(function(error) {
      console.log(error);
      validations.checkExceptionType(error, function(error) {
        res.status(error.status).json(error);
      });
    });
};

/** login function */
exports.login = (req, res, next) => {
  /** validations check that parameter name is proper or not*/
  validations
    .checkParameter(req.body.email, "email")
    .then(function(data) {
      return validations.checkParameter(req.body.password, "Password");
    })
    .then(function(data) {
      /** find the email from the database if email dosent exist is shows error otherwise go forward */
      User.find({ email: req.body.email })
        .exec()
        .then(function(data) {
          if (data.length < 1) {
            return res.status(customConfig.jsonSuccessCode).json(
              jsonResponses.response(403, null, {
                message: "Email is not registered with us"
              })
            );
          } else if (data[0].status == "0") {
            return res.status(customConfig.jsonSuccessCode).json(
              jsonResponses.response(3, null, {
                message: "Your Email address is not verified, Please Verify! "
              })
            );
          } else {
            /** password is decoded here and checked if it is not right it shows error otherwise go forward*/
            var password = data[0].password;
            var password1 = decode(password);
            if (password1 != req.body.password) {
              return res.status(customConfig.jsonSuccessCode).json(
                jsonResponses.response(403, null, {
                  message: "Password Dosen't Match"
                })
              );
            } else {
              /** jwt token is generated here */
              const token = jwt.sign(
                {
                  email: data[0].email,
                  Id: data[0]._id
                },
                "secret"
              );
              /** if all goes well it will print json response*/
              return res.status(customConfig.jsonSuccessCode).json(
                jsonResponses.response(1, null, {
                  message: "Auth successful",
                  token: token,
                  email: data[0].email,
                  name: data[0].name,
                  contact_no: data[0].contact_no,
                  id: data[0]._id
                })
              );
            }
          }
        })
        .catch(function(error) {
          console.log(error);
          validations.checkExceptionType(error, function(error) {
            res.status(error.status).json(error);
          });
        });
    })
    .catch(function(error) {
      console.log(error);
      validations.checkExceptionType(error, function(error) {
        res.status(error.status).json(error);
      });
    });
};

/** forgot password */
exports.forgot_password = (req, res, next) => {
  // console.log("heyyyyyyyyyyy forgot password")
  // process.exit(1);
  //var user_id = req.authenticateUser;
  var email = req.body.email;
  var otp_data = _.random(1000, 9999).toString();
  let now = new Date();
  let expiry_date = date.addMinutes(now, 5);

  // console.log(current_date)
  // console.log(expiry_date)
  validations
    .checkParameter(email, "email")
    .then(function(data) {
      User.findOneAndUpdate(
        { email: email },
        { $set: { otp: otp_data, expiry_date: expiry_date } },
        { new: true }
      )
        .exec()
        .then(function(result) {
          console.log(result);
          if (result) {
            var otp1 = result.otp;
            var transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "chetan.narang@ultivic.com",
                pass: "Chetan@ULT!V!C"
              }
            });

            var mailOptions = {
              from: "developer.chetan@gmail.com",
              to: email,
              subject: "Signup Successfull",
              text:
                "Hi " +
                email +
                "\n\n" +
                "your otp to change password is " +
                otp1 +
                "\n\n" +
                "Thanks"
            };
            transporter.sendMail(mailOptions, function(error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log("Email sent: " + info.response);
              }
            });
            return res
              .status(200)
              .json(
                jsonResponses.response(
                  "1",
                  "Otp sent to your registered email",
                  { otp: result.otp, expiry_date: expiry_date }
                )
              );
          } else {
            return res
              .status(200)
              .json(
                jsonResponses.response(
                  "0",
                  "Email is not registered with us!",
                  null
                )
              );
          }
        });
    })
    .catch(err => {
      return res.status(500).json(jsonResponses.response(0, err.message, null));
    });
};

/** verify otp */
exports.verify_otp = (req, res, next) => {
  var otp = req.body.otp;
  var email = req.body.email;

  User.find({ email: email })
    .exec()
    .then(function(result) {
      console.log(result);
      if (result.length > 0) {
        var otp1 = result[0].otp;
        if (otp == otp1) {
          var xdate = new Date(result[0].expiry_date);
          console.log(xdate);
          var cdate = new Date();
          console.log(cdate);
          if (xdate >= cdate) {
            console.log("valid");
            User.findOneAndUpdate(
              { email: email },
              { $set: { status: 1 } },
              { new: true }
            )
              .exec()
              .then(function(result) {
                console.log(result);
                if (result) {
                  res
                    .status(200)
                    .json(jsonResponses.response(1, "OTP is Valid", null));
                }
              });
          } else {
            console.log("expired");
            res
              .status(200)
              .json(jsonResponses.response(3, "OTP Is Expired", null));
          }
        } else {
          return res
            .status(200)
            .json(jsonResponses.response(3, "otp not matched!", null));
        }
      } else {
        return res
          .status(200)
          .json(
            jsonResponses.response(3, "You are not registered with us!", null)
          );
      }
    })
    .catch(err => {
      return res.status(500).json(jsonResponses.response(0, err.message, null));
    });
};

/** update password */
exports.update_password = (req, res, next) => {
  console.log(req.body);
  console.log("+++++++++++++++++++++++++++");
  var new_password = req.body.new_password;
  var confirm_password = req.body.confirm_password;
  var old_password = req.body.old_password;

  if (new_password != confirm_password) {
    return res.status(customConfig.jsonSuccessCode).json(
      jsonResponses.response(403, null, {
        message: "Password and Confirm password does not matched"
      })
    );
  } else {
    User.find({ _id: req.authenticateUser })
      .exec()
      .then(function(data) {
        var password = data[0].password;
        var password1 = decode(password);
        if (password1 != old_password) {
          return res.status(customConfig.jsonSuccessCode).json(
            jsonResponses.response(403, null, {
              message: "old Password Dosen't Match"
            })
          );
        } else {
          var password1 = encode(new_password.toString());
          User.findOneAndUpdate(
            { _id: req.authenticateUser },
            { $set: { password: password1 } },
            { new: true }
          )
            .exec()
            .then(function(result) {
              if (result) {
                return res
                  .status(200)
                  .json(
                    jsonResponses.response(
                      1,
                      "password change Successfully",
                      ""
                    )
                  );
              } else {
                return res
                  .status(422)
                  .json(jsonResponses.response(3, "Something Went Wrong", ""));
              }
            })
            .catch(err => {
              return res
                .status(500)
                .json(jsonResponses.response(0, err.message, null));
            });
        }
      });
  }
};

exports.edit_profile = (req, res, next) => {
  var _id = req.body._id;
  if (req.files && req.files.image) {
    var ImageFile = req.files.image;
    var image = Date.now() + "pic_" + ImageFile.name;
    ImageFile.mv("./public/uploads/" + image, function(err) {
      //upload file
      if (err) throw err;
    });
    var data = {
      name: req.body.name,
      profileimage: "http://13.233.88.225:3000/uploads/" + image,
      contact_no: req.body.contact_no,
      pincode: req.body.pincode,
      state: req.body.state,
      address_line: req.body.address_line,
      city: req.body.city,
      district: req.body.district
    };
  } else {
    var data = {
      name: req.body.name,
      contact_no: req.body.contact_no,
      pincode: req.body.pincode,
      state: req.body.state,
      address_line: req.body.address_line,
      city: req.body.city,
      district: req.body.district
    };
  }
  User.findOneAndUpdate({ _id: _id }, { $set: data }, { new: true })
    .exec()
    .then(function(result) {
      if (result) {
        return res
          .status(200)
          .json(jsonResponses.response(1, "user_updated_successfully", result));
      } else {
        return res
          .status(422)
          .json(jsonResponses.response(3, "Something Went Wrong", ""));
      }
    })
    .catch(err => {
      res.status(customConfig.internalServerErrorCode).json({
        error: err
      });
    });
};

exports.get_profile = (req, res, next) => {
  var id = req.body.id;
  User.find({ _id: req.authenticateUser })
    .select()
    .exec()
    .then(docs => {
      if (docs.length < 1) {
        return res.status(customConfig.jsonSuccessCode).json(
          jsonResponses.response(4, null, {
            message: "No Profile Exist."
          })
        );
      } else {
        docs.map(doc => {
          return (docs = doc);
        });
        res
          .status(customConfig.jsonSuccessCode)
          .json(jsonResponses.response(1, null, docs));
      }
    })
    .catch(function(error) {
      validations.checkExceptionType(error, function(error) {
        res.status(error.status).json(error);
      });
    });
};

exports.resetPassword = (req, res) => {
  validations
    .checkParameter(req.body.newPassword, "newPassword")
    .then(() => {
      return validations.checkParameter(req.body.email, "email");
    })
    .then(() => {
      var text = req.body.newPassword;
      var email = req.body.email;
      var bytes = utf8.encode(text);
      var encoded = base64.encode(bytes);
      return User.findOneAndUpdate(
        { email: email },
        { $set: { password: encoded } },
        { new: true }
      ).exec();
    })
    .then(data => {
      console.log(data);
      if (data == null) {
        return res
          .status(500)
          .json(jsonResponses.response(0, "Invalid email", null));
      } else
        res
          .status(200)
          .json(jsonResponses.response(1, "Password changed succesfully", {}));
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(jsonResponses.response(0, err.message, null));
    });
};

/** login function */
exports.social_login = (req, res, next) => {
  /** validations check that parameter name is proper or not*/
  validations
    .checkParameter(req.body.email, "email")
    .then(function(data) {
      return validations.checkParameter(req.body.socialid, "socialid");
    })
    .then(function(data) {
      return validations.checkParameter(req.body.name, "name");
    })
    .then(function(data) {
      /** find the email from the database if email dosent exist is shows error otherwise go forward */
      User.find({ socialid: req.body.socialid })
        .exec()
        .then(function(data) {
          console.log(data);
          if (data.length < 1) {
            console.log("hieee");
            var user = new User({
              socialid: req.body.socialid,
              type: req.body.type,
              name: req.body.name,
              email: req.body.email,
              status: 1
            });
            user
              .save()
              /** after save result is consoled */
              .then(result => {
                console.log(result);
                const user_roles = new User_roles({
                  user_id: result._id,
                  role_id: 2
                });
                user_roles.save();

                const token = jwt.sign(
                  {
                    email: result.email,
                    Id: result._id
                  },
                  "secret"
                );
                /** response should be of json format */
                res.status(customConfig.jsonSuccessCode).json(
                  jsonResponses.response(1, null, {
                    message: "user created",
                    token: token,
                    email: result.email,
                    name: result.name,
                    socialid: result.socialid,
                    id: result._id
                  })
                );
              });
          } else {
            /** jwt token is generated here */
            const token = jwt.sign(
              {
                email: data[0].email,
                Id: data[0]._id
              },
              "secret"
            );
            /** if all goes well it will print json response*/
            return res.status(customConfig.jsonSuccessCode).json(
              jsonResponses.response(1, null, {
                message: "Auth successful",
                token: token,
                email: data[0].email,
                name: data[0].name,
                social_id: data[0].social_id,
                id: data[0]._id
              })
            );
          }
        })
        .catch(function(error) {
          console.log(error);
          validations.checkExceptionType(error, function(error) {
            res.status(error.status).json(error);
          });
        });
    })
    .catch(function(error) {
      console.log(error);
      validations.checkExceptionType(error, function(error) {
        res.status(error.status).json(error);
      });
    });
};

exports.user_deactivate = (req, res, next) => {
  console.log(req.authenticateUser);
  User.findOneAndUpdate(
    { _id: req.authenticateUser },
    { $set: { status: 0 } },
    { new: true }
  )
    .exec()
    .then(function(result) {
      console.log(result);
      return res.status(customConfig.jsonSuccessCode).json(
        jsonResponses.response(1, null, {
          message: "deactivated successfully"
          //   name: result.name,
          //   _id: result._id
        })
      );
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_subscription = (req, res, next) => {
  const user_subscription = new User_subscription({
    user_id: req.authenticateUser,
    subscription_id: req.body.subscription_id,
    status: 1
  });
  user_subscription
    .save()
    .then(result => {
      console.log(result);
      res.status(customConfig.jsonSuccessCode).json(
        jsonResponses.response(
          1,
          null,

          result
        )
      );
    })
    .catch(err => {
      console.log(err);
      res.status(customConfig.internalServerErrorCode).json({
        error: err
      });
    });
};

exports.register_complaint = (req, res, next) => {
  console.log(req.authenticateUser);
  User.find({ _id: req.authenticateUser })
    .exec()
    .then(data => {
      const complaints = new Complaints({
        reason: req.body.reason,
        comments: req.body.comments,
        user_id: req.authenticateUser,
        subscription_id: req.body.subscription_id
      });
      complaints.save().then(result => {
        res.status(customConfig.jsonSuccessCode).json(
          jsonResponses.response(1, null, {
            message: "Complaint Registered",
            id: result._id
          })
        );
      });
    })
    .catch(function(error) {
      console.log(error);
      validations.checkExceptionType(error, function(error) {
        res.status(error.status).json(error);
      });
    });
};

exports.show_all_subscriptions = (req, res, next) => {
  User_subscription.find({ user_id: req.authenticateUser })
    .exec()
    .then(docs => {
      console.log(docs);
      res
        .status(customConfig.jsonSuccessCode)
        .json(jsonResponses.response(1, null, docs));
    })
    .catch(function(error) {
      validations.checkExceptionType(error, function(error) {
        res.status(error.status).json(error);
      });
    });
};

exports.payment = (req, res, next) => {
  var cart_quantity;
  var flag;
  Cart.find({ user_id: req.authenticateUser })
    .select()
    .exec()
    .then(async function(data) {
      for (var i = 0; i < data.length; i++) {
        cart_quantity = data[i].quantity;

        await Product.find({ _id: data[i].product_id })
          .select()
          .exec()
          .then(function(result) {
            console.log(result[0].product_quantity);
            console.log(cart_quantity);

            if (result[0].product_quantity > cart_quantity) {
              console.log("hieeeee");
              flag = 1;
            } else {
              console.log('byeee')
              flag = 0;
            }
          });

        if (flag === 0) {
          break;
        }
      }

      console.log(flag);
      if (flag == 1) {
        Insta.setKeys(
          "test_62da4a74e3dd1ee5101665fe6b0",
          "test_43bd1f873093587c062543c1222"
        );

        User.find({ _id: req.authenticateUser })
          .exec()
          .then(docs => {
            console.log(docs[0].name);

            var data = new Insta.PaymentData();
            Insta.isSandboxMode(true);
            data.purpose = "sanshri payment";
            data.amount = req.body.amount;
            data.buyer_name = docs[0].name;
            data.redirect_url = `http://13.233.88.225:3000/user/payment_done?user_id=${
              req.authenticateUser
            }`;
            data.email = docs[0].email;
            data.phone = docs[0].contact_no;
            data.send_email = false;
            data.webhook = "http://www.example.com/webhook/";
            data.send_sms = false;
            data.allow_repeated_payments = false;

            Insta.createPayment(data, function(error, response) {
              if (error) {
                // some error
              } else {
                var data = JSON.parse(response);
                res
                  .status(customConfig.jsonSuccessCode)
                  .json(jsonResponses.response(1, null, data));
              }
            });
          })
          .catch(function(error) {
            validations.checkExceptionType(error, function(error) {
              res.status(error.status).json(error);
            });
          });
      } else {
        res.status(customConfig.jsonSuccessCode).json(
          jsonResponses.response(1, null, {
            message: "Quantity not available"
          })
        );
      }

      //res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data));
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.payment_done = function(req, res, next) {
  var cart_quantity;
  //var product_id;
  //console.log(req.url);
  let url_parts = url.parse(req.url, true),
    responseData = url_parts.query;

  if (responseData.payment_id) {
    //console.log(responseData);
    let userId = responseData.user_id;
    //console.log(userId);

    //Save the info that user has purchased the bid.
    const data = {};
    data.payment_id = responseData.payment_id;

    User.findOneAndUpdate({ _id: userId }, { $set: data }, { new: true })
      .exec()
      .then(function(result) {
        //console.log(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });

    Cart.find({ user_id: userId })
      .select()
      .exec()
      .then(function(data) {
        for (var i = 0; i < data.length; i++) {
          //console.log(data[i].product_id);
          cart_quantity = data[i].quantity;
          product_id = data[i].product_id;
          const orders = new Orders({
            quantity: data[i].quantity,
            user_id: data[i].user_id,
            product_id: data[i].product_id,
            payment_id: responseData.payment_id
          });
          orders
            .save()
            .then(result => {
              console.log(result);

              Cart.deleteOne({ user_id: userId })
                .exec()
                .then(result => {
                  console.log(result);
                })
                .catch(err => {
                  res.status(customConfig.internalServerErrorCode).json({
                    error: err
                  });
                });
            })
            .catch(err => {
              console.log(err);
              res.status(customConfig.internalServerErrorCode).json({
                error: err
              });
            });

            Product.find({ _id: data[i].product_id, })
            .exec()
            .then(function(result) {
            console.log(result[0]._id)
            var quantity_left = (result[0].product_quantity - cart_quantity)
             //console.log(result[0].product_quantity)
            const data1 = {};
            data1.product_quantity = quantity_left;
            console.log(data1.product_quantity)
              Product.findOneAndUpdate({ _id: result[0]._id }, { $set: data1 }, { new: true })
              .exec()
              .then(function(result) {

                console.log(result);

              })
              
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                error: err
              });
            });
         
        }

        //res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, data));
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });

    // Redirect the user to payment complete page.
    return res.redirect("http://13.233.88.225:3000/thankyou.html");
  }
};

exports.order_history = (req, res, next) => {
  Orders.aggregate([
    { $match: { user_id: req.authenticateUser } },
    {
      $lookup: {
        from: "product_details",
        localField: "product_id",
        foreignField: "_id",
        as: "product"
      }
    }
  ])
    .exec()
    .then(docs => {
      res
        .status(customConfig.jsonSuccessCode)
        .json(jsonResponses.response(1, null, docs));
    })
    .catch(function(error) {
      validations.checkExceptionType(error, function(error) {
        res.status(error.status).json(error);
      });
    });
};

// {
//   "_id" : ObjectId("5c87ba34a2a41a083435b85f"),
// "quantity" : "4",
// "user_id" : "5c820457752c7c27bc111e0c",
// "product_id" : ObjectId("5c9e21f7b7036328384adbb8"),
// "createdAt" : ISODate("2019-03-12T13:55:00.793Z"),
// "updatedAt" : ISODate("2019-03-12T13:55:00.793Z"),
// "__v" : 0
// }

// {
//   "_id" : ObjectId("5c87be7ff6852b0658de422f"),
// "quantity" : "4",
// "user_id" : "5c820457752c7c27bc111e0c",
// "product_id" : ObjectId("5ca4452b4e48b2315012b007"),
// "createdAt" : ISODate("2019-03-12T14:13:19.287Z"),
// "updatedAt" : ISODate("2019-03-12T14:13:19.287Z"),
// "__v" : 0
// }
