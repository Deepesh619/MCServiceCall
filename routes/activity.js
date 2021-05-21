var parseString = require('xml2js').parseString;
const fetch = require("node-fetch");
var http = require('https');

// SOAP Details 
var soapHeaders = {           
    'Content-Type': 'text/xml',
    'SOAPAction' : 'Retrieve'
  }
const soapURL = "https://mcllzpmqql69yd9kvcz1n-mj1fqy.soap.marketingcloudapis.com/Service.asmx";
var soapPayloadPrefix = '<?xml version="1.0" encoding="UTF-8"?>'+
    '<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" '+ 'xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"> '+
     '  <s:Header>'+
    '<fueloauth>'; 
    
    var soapPayloadSuffix  = '</fueloauth>' +
     '  </s:Header> ' +
    '<s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"> ' +
       '<RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI"> ' +
       '   <RetrieveRequest> ' +
        '     <ObjectType>DataExtension</ObjectType> ' +
        '  <Properties>Name</Properties> ' +
        '   <Properties>CustomerKey</Properties> ' +
          '</RetrieveRequest> ' +
      ' </RetrieveRequestMsg> ' +
    '</s:Body> ' +
    '</s:Envelope>';

  // Auth Details
  var authHeaders = {
    'Content-Type': 'application/json'
  };
  var authData = {
    "grant_type": "client_credentials",
    "client_id": "1ye7xpmi31xwlu7xotjkauyv",
    "client_secret":"Z3bAfZPzvGM05d7cu05RVTmx"
  };
var postMethod='POST';
const authURL = "https://mcllzpmqql69yd9kvcz1n-mj1fqy.auth.marketingcloudapis.com/v2/token";
var myDEListKey = [];
var myDEListValue = []; 
var myDEList = {}; 

exports.getDEList = function (req, res) {
    performRequest(authHeaders, postMethod, JSON.stringify(authData),authURL, function(data) {
        var parsedData = JSON.parse(data);
      var accesstoken = parsedData.access_token;
      var soapPayload = soapPayloadPrefix + accesstoken + soapPayloadSuffix ;
      performRequest(soapHeaders, postMethod, soapPayload,soapURL, function(data) {
          parseString(data, function (err, result) {              
              //console.log((result));             
              var x = result['soap:Envelope']['soap:Body'][0].RetrieveResponseMsg[0].Results;
              var length = Object.keys(x).length;
              console.log(JSON.stringify(length));
              for(var j = 0 ; j< length;j++){
                  myDEListKey.push(x[j].CustomerKey[0]);
                  myDEListValue.push(x[j].Name[0]);
                  myDEList[myDEListKey[j]] = myDEListValue[j];
               // console.log(x[j].Name + '\n');
              }
              console.log(myDEList);
              res.setHeader('Access-Control-Allow-Origin','http://localhost:3000');
              res.send(200, myDEList);
              console.log('Published1');
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


