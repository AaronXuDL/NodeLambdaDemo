console.log('Loading function\n');

var soap = require('soap');
var json2xml = require('json2xml');

var options = {
	attributesKey: 'calledMethod' //replace attributes with own-name
	};

var url = "http://ec2-23-20-100-8.compute-1.amazonaws.com:8080/axis2/services/SimpleStockQuoteService?wsdl";

var args = {
				//"ns:request": { // sometime, you may need to add name space ahead to prevent name conflicts
				"request": {
					"symbol":"IBM-Sample"
				}
			};

exports.handler = function(event, context, callback) {

	try {
		//soap.createClient(url, options, function(err, client){
		soap.createClient(url, function(err, client){

		
			//console.log(client.describe()); // get methods list from the service

			client.SimpleStockQuoteService.SimpleStockQuoteServiceHttpSoap11Endpoint.getQuote(args, function(err, result){
				if (err) throw err;
				
				if (event.format == 'xml') {
					var resultXML = json2xml(result);
					console.log('\nXML format:\n');
					console.log(resultXML); // response here is XML format
					
					context.callbackWaitsForEmptyEventLoop = false;
					console.log('\n');
					callback(null, resultXML); 	// output as XML format
				}
				
				if (event.format == 'json' || ( event.format != 'raw'  && event.format != 'xml')) {
					// Old way (Node.js runtime v0.10.42)
					// context.done(null, 'Success message');

					console.log('\nJSON format:\n');
					console.log(result); // result here is JSON format
					//console.log(result.return.attributes); // test JSON format


					// New way (Node.js runtime v4.3).
					context.callbackWaitsForEmptyEventLoop = false;
					console.log('\n');
					callback(null, result);			// output as JSON format
				}
			});

			if (event.format == 'raw') {
				client.on('response', function(res){
					console.log('\nRAW format:\n');
					console.log(res); // response here is SOAP format
					
					context.callbackWaitsForEmptyEventLoop = false;
					console.log('\n');
					callback(null, res);		// output as SOAP/RAW format
					})
			}
		});
	} catch(e){
		console.log("Error:" +e);
	}

};

console.log('function to the end');