# easy-js
This is a simple JS application reusable components that can be use for front-end development. This is still on BETA.

THE USAGE 

#ajax(OBJECT)
	ez.ajax({
		url: <REQUEST URL API>
		method: <GET|POST>,
		dataRequest: <JSON|FORMDATA - OPTIONAL> 
		result: function(res){
		}
	});


#htmlMapper(JSON OBJECT)
	ez.htmlMapper(<JSON OBJECT>);


#xmlParser(OBJECT)
	ez.xmlParser({
		document: <XML DOCUMENT>,
		nodes: <TARGETED ELEMENTS>
		complete: function(res){
			var result = res;
			//return as json object
		}
	})


#jsonScanner(JSON_OBJECT, CALLBACK_FUNCTION)
	ez.jsonScanner(<JSON>, function(res){
		var result = res;
		// the callback function will normalize the JSON tree in one dimension
	});


#addEvent(OBJECT_ELEMENT, EVENT_TYPE, CALLBACK)
	ez.addEvent(element, 'click', function(e){
		//do something abou the element
	});


#formToJson
	<form onsubmit="return ez.formToJSON(this)">
		....
	</form>

#dom(MULTIPLE_DOMS)
	ez.dom('#elem1', '.elem2', 'elem3', '.elem4 #elem5')