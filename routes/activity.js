var parseString = require('xml2js').parseString;
const fetch = require("node-fetch");
var http = require('https');

// SOAP Details 
var soapHeaders = {           
    'Content-Type': 'text/xml',
    'SOAPAction' : 'Retrieve'
  }
const soapURL = process.env.soapURL;
var soapPayloadText1 = '<?xml version="1.0" encoding="UTF-8"?>'+
    '<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" '+ 'xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"> '+
     '  <s:Header>'+
    '<fueloauth>'; 
    
    var soapPayloadText2  = '</fueloauth>' +
     '  </s:Header> ' +
    '<s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> ' +
       '<RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI"> ' +
       '   <RetrieveRequest> <ObjectType> ' ;
     var DEObjectType =  'DataExtension';
     var DEFieldObjectType =  'DataExtensionField';
     var soapPayloadText3  =  ' </ObjectType> <Properties>Name</Properties> ' +
        '   <Properties>CustomerKey</Properties> ' ;

     var soapPayloadText4 =  '</RetrieveRequest> ' +
      ' </RetrieveRequestMsg> ' +
    '</s:Body> ' +
    '</s:Envelope>';

  // Auth Details
  var authHeaders = {
    'Content-Type': 'application/json'
  };
  var authData = {
    "grant_type": "client_credentials",
    "client_id": process.env.clientId,
  "client_secret":process.env.clientSecret
  };
var postMethod='POST';
const authURL = process.env.authURL;
var myDEListKey = [];
var myDEListValue = []; 
var colListValue = []; 
var myDEList = {}; 

exports.getDEList = function (req, res) {
    performRequest(authHeaders, postMethod, JSON.stringify(authData),authURL, function(data) {
        var parsedData = JSON.parse(data);
      var accesstoken = parsedData.access_token;
      var soapPayload = soapPayloadText1 + accesstoken + soapPayloadText2 + DEObjectType + soapPayloadText3 + soapPayloadText4;
      performRequest(soapHeaders, postMethod, soapPayload,soapURL, function(data) {
          parseString(data, function (err, result) {              
              //console.log((result));             
              var x = result['soap:Envelope']['soap:Body'][0].RetrieveResponseMsg[0].Results;
              var length = Object.keys(x).length;
            //  console.log(JSON.stringify(length));
              for(var j = 0 ; j< length;j++){
                  myDEListKey.push(x[j].CustomerKey[0]);
                  myDEListValue.push(x[j].Name[0]);
                  myDEList[myDEListKey[j]] = myDEListValue[j];
               // console.log(x[j].Name + '\n');
              }
             // console.log(myDEList);
              res.setHeader('Access-Control-Allow-Origin',process.env.whiteListedURL);
              res.send(200, myDEList);
              console.log('Published');
             });
        });
    });    
};

exports.getColumnList = function (req, res) {
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    var DEName = JSON.parse(body).DEName;
    performRequest(authHeaders, postMethod, JSON.stringify(authData),authURL, function(data) {
      var parsedData = JSON.parse(data);
    var accesstoken = parsedData.access_token;
    var filter = ' <Filter xsi:type="SimpleFilterPart"> '+
    '<Property>DataExtension.CustomerKey</Property> '+
    '<SimpleOperator>equals</SimpleOperator>' +
    '<Value>'+ DEName +'</Value></Filter>';
 
    var soapPayload = soapPayloadText1 + accesstoken + soapPayloadText2 + DEFieldObjectType + soapPayloadText3 + filter + soapPayloadText4;
    console.log('Payload is : ' + soapPayload);
    performRequest(soapHeaders, postMethod, soapPayload,soapURL, function(data) {
        parseString(data, function (err, result) {              
            console.log((result));             
            var x = result['soap:Envelope']['soap:Body'][0].RetrieveResponseMsg[0].Results;
            var length = Object.keys(x).length;
          //  console.log(JSON.stringify(length));
            for(var j = 0 ; j< length;j++){
                colListValue.push(x[j].Name[0]);
             // console.log(x[j].Name + '\n');
            }
           // console.log(myDEList);
            res.setHeader('Access-Control-Allow-Origin',process.env.whiteListedURL);
            res.send(200, colListValue);
            console.log('Published');
           });
      });
  });
   
  });
    
};


function  performRequest(headers, method, data,url, success) {
    var dataString = data;
    
    var options = {
     method: method,
      headers: headers
    };
  
    var req = http.request(url,options, function(res) {
      res.setEncoding('utf-8');
  
      var responseString = '';
  
      res.on('data', function(data) {
        responseString += data;
      });
  
      res.on('end', function() {
        success(responseString);
      });
    });
    req.write(dataString);
    req.end();
  }


