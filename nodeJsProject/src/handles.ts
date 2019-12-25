import express = require('express');
const router = express.Router();

router.get("/", function (req : any, res : any)  {res.render('Generic.ejs')});

router.get("/hello/:name", function (req : any, res : any)
{ 
  var TextLilian = "4th year sudent at the ECE, Lilian Delaplace is motivated to discover and learn the wonders of the web !";
  var NameList = ["Lilian", "Arnaud", "Jacob", "Jake", "Jack", "James", "John" ];

  if (NameList.indexOf(req.params.name) > -1)
  {
    if (req.params.name == "Lilian"){                
      res.send("<h1> Welcome back Lilian !</h1> <h2> " + TextLilian + "</h2>");
    }
    else{
      res.render('hello.ejs',{name: req.params.name});
    }
  }else 

    res.send("<h1> Your name isn't on the list !</h1>");
});

module.exports = router;