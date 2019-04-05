const mongoose= require("mongoose");
const Admin = require("./../models/adminuser");
const User = require("./../models/user");
var base64 = require('base-64');
var utf8 = require('utf8');
let cookieParser = require('cookie-parser'); 



exports.adminLogin = function (req, res, next) {
    console.log('hieeeee12333')
var email = req.body.email;
var password = req.body.password;
    var type     = req.body.type;
console.log(req.body.email);
Admin.findOne({"email":email}).then(function(result){
  console.log(result);
	   if(result){
       var email1 = result.email;
	      var password1 = result.password;
          if(email1 != email ){
		     return res.json({
                             error:"1"
                         });
		  }
          else if(password != password1)	{
		     return res.json({
                             error:"2"
                         });
		  }
  	        else{
		         return res.cookie("auth",{type:0,password:result.password},{ maxAge: 9000000, httpOnly: true }).json({success:"3",type:"admin",auth:'admin'});
		    }
    }else{
           return res.json({
                 error:"5"
        });
       }
	}).catch(err=>{
console.log(err)
	    return res.json({
                             error:"4"
                         });
	})
}




function encode(data)
{
var bytes = utf8.encode(data);
var encoded = base64.encode(bytes);
   return encoded;
}

 function decode(data)
{
var bytes = base64.decode(data);
var text = utf8.decode(bytes);
return text;
}

