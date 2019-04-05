
var Subscription_plan = require("./../models/subscription_plan");


exports.add_subscription = (req, res, next) => {
    const subscription_plan = new Subscription_plan({
        description: req.body.description,
        title :req.body.title,
        cost :req.body.cost,
        time_interval :req.body.time_interval,
        hostel_or_mess_id :req.body.hostel_or_mess_id,
        status:1
    });
    subscription_plan.save()
        .then(result => {
            console.log(result);
            res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null,
                
                    result
                ));
        })
        .catch(err => {
            console.log(err);
            res.status(customConfig.internalServerErrorCode).json({
                error: err
            });
        });
};

// exports.show_subscription = (req, res, next) => {
//     var id = req.body.id;
//     Subscription_plan.find( { "hostel_or_mess_id":id})
//       .select()
//       .exec()
//       .then(docs => {
//         res.status(customConfig.jsonSuccessCode).json(jsonResponses.response(1, null, docs))
//       })
//       .catch(function (error) {
//     validations.checkExceptionType(error, function (error) {
//     res.status(error.status).json(error);
//         });
//     });
//   };