module.exports = {
    serverHandle : function (req, res) {

    const url = require('url')
    const qs = require('querystring')   
    
    const route = url.parse(req.url)
    const path = route.pathname
    const params = qs.parse(route.query)

    var TextLilian = "4th year sudent at the ECE, Lilian Delaplace is motivated to discover and learn the wonders of the web !"
    var NameList = ["Lilian", "Arnaud", "Jacob", "Jake", "Jack", "James", "John" ]

    res.writeHead(200, {'Content-Type': 'text/plain'});

    if (path === '/hello' && 'name' in params) 
    {
      if (NameList.indexOf(params['name']) > -1)
      {
        if (params['name'] == "Lilian")
            res.end("Small Resume :\n" + TextLilian);
        else
          res.end("hello " + params['name']);
      }
      else
        res.end("ERROR 404");
    } 
    
    else {
      if (path === '/' in params)
        res.end('The serveur use the function /hello by entering "/hello?name=[yourname]" . \n Please enjoy yourselves !');
      else
        res.end("ERROR 404");
    }  
  }
}