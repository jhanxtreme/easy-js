# easy-js
This is a simple JS application reusable components that can be use for front-end development. This is still on BETA.

#THE USAGE 

# AJAX REQUEST
## ajax(OBJECT)
	JX_APP.ajax({
		url: <REQUEST URL API>
		method: <GET|POST>,
		dataRequest: <JSON|FORMDATA - OPTIONAL> 
		result: function(res){
		}
	});


# HTMLMAPPER 
## htmlMapper(JSON OBJECT)
	JX_APP.htmlMapper(<JSON OBJECT>);


# XMLPARSER 
## xmlParser(OBJECT)

	JX_APP.xmlParser({
		document: <XML DOCUMENT>,
		nodes: <TARGETED ELEMENTS>
		complete: function(res){
			var result = res;
			//return as json object
		}
	})


# JSON SCANNER 
## jsonScanner(<JSON OBJECT>, <CALLBACK FUNCTION>)

	JX_APP.jsonScanner(<JSON>, function(res){
		var result = res;
		// the callback function will normalize the JSON tree in one dimension
	});


# ADDEVENT 
## addEvent(<OBJECT ELEMENT>, <EVENT TYPE>, <CALLBACK>)

	JX_APP.addEvent(element, 'click', function(e){
		//do something abou the element
	});


# FROM TO JSON 
## formToJson
	
	<form onsubmit="return JX_APP.formToJSON(this)">
		....
	</form>