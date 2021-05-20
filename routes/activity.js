exports.getToken = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    res.setHeader('Acces-Control-Allow-Origin','*');
    //res.setHeader('Acces-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    //res.setHeader('Acces-Contorl-Allow-Methods','Content-Type','Authorization');
    //res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
    res.send(200, 'Publish1');
    console.log('Published1');
};