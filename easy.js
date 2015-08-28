/*
Author: Jhan Mateo
Email: jhanxtreme@gmail.com
Github: https://github.com/jhanxtreme
Description:
	!!! BETA MODE
	Mini Javascript Application that contains reusable components:

	USAGE 

	****** AJAX ******
	- ajax(OBJECT)
		ez.ajax({
			url: <REQUEST URL API>
			method: <GET|POST>,
			dataRequest: <JSON|FORMDATA - OPTIONAL> 
			result: function(res){
			}
		});


	****** HTMLMAPPER ******
	- htmlMapper(JSON OBJECT)
		ez.htmlMapper(<JSON OBJECT>);


	****** XMLPARSER ******
	- xmlParser(OBJECT)

		ez.xmlParser({
			document: <XML DOCUMENT>,
			nodes: <TARGETED ELEMENTS>
			complete: function(res){
				var result = res;
				//return as json object
			}
		})


	****** JSON SCANNER ******
	- jsonScanner(<JSON OBJECT>, <CALLBACK FUNCTION>)

		ez.jsonScanner(<JSON>, function(res){
			var result = res;
			// the callback function will normalize the JSON tree in one dimension
		});


	****** ADDEVENT ******
	- addEvent(<OBJECT ELEMENT>, <EVENT TYPE>, <CALLBACK>)

		ez.addEvent(element, 'click', function(e){
			//do something abou the element
		});


	****** FROM TO JSON ******
	- formToJson
		
		<form onsubmit="return ez.formToJSON(this)">
			....
		</form>

	****** DOMINATOR ******
	-dom(MULTIPLE_DOMS)
	ez.dom('#elem1', '.elem2', 'elem3', '.elem4 #elem5')



*/

'use strict';

/************************************************
	AJAX REQUEST
************************************************/
JX_APP.prototype.ajax = function(obj, cb){
	var xhr;

	function _getXMLHttpRequest(){
		try{
			return new XMLHttpRequest();
		}catch(e){
			try{
				return new ActivetXObject('Microsoft.XMLHTTP');
			}catch(e){
				try{
					return ActiveXObject( 'Msxml2.XMLHTTP.6.0' );
				}catch(e){
					try{
						return ActiveXObject( 'Msxml2.XMLHTTP.3.0' );
					}catch(e){
						try{
							return ActiveXObject( 'Msxml2.XMLHTTP' );
						}catch(e){
							throw new "Your current browser does not support XMLHttpRequest";
						}
					}
				}
			}
		}
	}

	function _readyState(obj){
		var method = obj.method.toLowerCase();
		if(method!=='get' && method!=='post'){
			throw new "Invalid method call for AJAX";
		}
		if(obj.url===undefined){
			throw new "Invalid request URL for AJAX";
		}
		if(typeof obj.async!=='boolean'){
			throw new "Invalid asynchronous value for AJAX";
		}
		if(typeof obj.result!=='function' || obj.result===undefined){
			throw new "Missing callback function";
		}
		xhr.onreadystatechange = function(){
			if(xhr.readyState===4){
				obj.result({
					statusCode: xhr.status,
					statusText: xhr.statusText,
					responseText: xhr.responseText,
					response: xhr.response
				});
			}
		}
		xhr.open(obj.method, obj.url, obj.async);
		if(obj.dataRequest!==undefined && obj.dataRequest.length>0){
			xhr.send(obj.dataRequest);
		}else{
			xhr.send();
		}
	}

	xhr = _getXMLHttpRequest();

	_readyState(obj);

}//end ajax



/************************************************
	HTML MAPPER
************************************************/
JX_APP.prototype.htmlMapper = function(data){
	if(typeof data!=='object'){
		throw new "Data error";
	}

	function _setDOMElementValue(name, value){
		if(arguments.length==0){
			return false;
		}

		function __getDOMElement(name){
			if(document.getElementById(name)!==null && document.getElementById(name)!==undefined){
				return document.getElementById(name);
			}else if(document.getElementsByClassName(name).length>0){
				return document.getElementsByClassName(name);
			}else if(document.getElementsByTagName(name).length>0){
				return document.getElementsByTagName(name);
			}else{
				return false;
			}
		}

		function __setElementValue(obj){
			if(obj.innerText!==undefined){
				obj.innerText = value.toString();
			}else if(obj.innerHTML!==undefined){
				obj.innerHTML = value.toString();
			}else if(obj.text!==undefined){
				obj.text = value.toString();
			}else if(obj.textContent!==undefined){
				obj.textContent = value.toString();
			}else{
				return false;
			}
		}

		if(__getDOMElement(name)!==false){
			if(__getDOMElement(name).length>0){
				for(var i=0, n=__getDOMElement(name).length; i<n; i++){
					__setElementValue(__getDOMElement(name)[i]);
				}
			}else{
				__setElementValue(__getDOMElement(name));
			}
		}

	}

	function _jsonScanner(data){
		var obj = obj || {};
		if(Object.prototype.toString.call(data)==='[object Object]'){
			for(var i in data){
				if(typeof data[i]==='object'){
					_jsonScanner(data[i]);
				}else{
					_setDOMElementValue(i, data[i]);
				}
			}
		}else if(Object.prototype.toString.call(data)==='[object Array]'){
			for(var i=0, n=data.length; i<n; i++){
				if(typeof data[i]==='object'){
					_jsonScanner(data[i]);
				}else{
					_setDOMElementValue(i, data[i]);
				}
			}
		}else{}	
	}
	
	_jsonScanner(data);
}

/************************************************
	XML PARSER
************************************************/
JX_APP.prototype.xmlParser = function(obj){
	var xmlDoc, jsonData = jsonData || {};

	function _getXMLDOM(xmldoc){
		var xml, parser;
		if(typeof xmldoc==='object'){
			xml = xmldoc;
		}else{
			try{
				xml = new DOMParser().parseFromString(xmldoc, 'application/xml');
			}catch(e){
				try{
					xml = new ActiveXObject('Microsoft.XMLDOM');
					xml.async =  false;
					xml.loadXML(xmldoc);
				}catch(e){
					xml = null;
				}
			}
		}
		return xml;
	}

	function _xml2Json(){
		var data = data || {};

		function _getNodeValue(childNode){
			var text = null;
			if(childNode.nodeType===1){
				if(childNode.text!==undefined){
					text = childNode.text;
				}else if(childNode.innerHTML!==undefined){
					text = childNode.innerHTML;
				}else if(childNode.textContent!==undefined){
					text = childNode.textContent;
				}else if(XMLSerializer){
					text = new XMLSerializer().serializeToString(childNode);
				}else{
					text = null;
				}
			}
			return text;
		}

		function __xmlScanner(nodes){
			var data = data || [], temp_obj = {};

			/** returns an array of object of the node's attributes **/
			function ___getAttributes(node){
				var attr = [];
				for(var k=0, o=node.attributes.length; k<o; k++){
					attr.push({
						'name'	: node.attributes[k],
						'value' : node.attributes[k].value
					})
				}
				return attr;
			}

			for(var i=0, n=nodes.length; i<n; i++){

				if(nodes[i].childNodes.length>1){

					for(var j=0, m=nodes[i].childNodes.length; j<m; j++){

						/** set temporary object **/
						if(j===0){ temp_obj = {};}

						if(nodes[i].childNodes[j].nodeType===1){

							/** nodes with children **/
							if(nodes[i].childNodes[j].childNodes.length>1){
								temp_obj[nodes[i].childNodes[j].nodeName] = __xmlScanner(nodes[i].getElementsByTagName(nodes[i].childNodes[j].nodeName));
							}else{
								if(nodes[i].getElementsByTagName(nodes[i].childNodes[j].nodeName).length>1){
									temp_obj[nodes[i].childNodes[j].nodeName] = __xmlScanner(nodes[i].getElementsByTagName(nodes[i].childNodes[j].nodeName));
								}else{
									temp_obj[nodes[i].childNodes[j].nodeName] = {
										'value' : _getNodeValue(nodes[i].childNodes[j]),
										'@attributes': ___getAttributes(nodes[i].childNodes[j])
									};
								}
							}
						}

					}
					data.push(temp_obj);

				}else{
					data.push({
						'value' : _getNodeValue(nodes[i]),
						'@attributes': ___getAttributes(nodes[i])
					});
				}

			}
			return data;
		}

		for(var i=0, n=obj.nodes.length; i<n; i++){
			if(data[obj.nodes[i]]===undefined){
				data[obj.nodes[i]] = [];
			}
			data[obj.nodes[i]] = __xmlScanner(xmlDoc.getElementsByTagName(obj.nodes[i]));
		}
		return data; 
	}


	xmlDoc = _getXMLDOM(obj.document);


	obj.complete({
		result: _xml2Json()
	});
	
}

/************************************************
	XML PARSER
************************************************/
JX_APP.prototype.jsonScanner = function(json, cb){
	try {
		if(typeof json==='object' && Object.prototype.toString.call(json)==='[object Object]'){
			var obj = json;
		}else{
			var obj = JSON.parse(json);
		}
	}catch(e){
		throw new "Invalid JSON format or string";
		return false;
	}

	var result = result || {};

	function __scanner(obj){

		//when object contains another object
		if(Object.prototype.toString.call(obj)==='[object Object]'){
			for(var item in obj){
				if(typeof obj[item]==='object' && obj[item]!==null){
					__scanner(obj[item]);
				}else{
					//when object is null
					if(obj[item]===null){
						cb(JSON.parse('{ "'+item+'" : null}'));

					//when object is not null
					}else{
						cb(JSON.parse('{ "'+item+'" : "'+ obj[item] + '"}'));
					}
				}
			}

		//object contains array of object
		}else if(Object.prototype.toString.call(obj)==='[object Array]'){
			if(obj.length>0){
				for(var i=0, n=obj.length; i<n; i++){
					if(typeof obj[i]==='object'){
						__scanner(obj[i]);
					}else{
						// array 
						// sample Object :["red", "green", "blue"]
						cb(JSON.parse('{ "'+i+'" : "'+ obj[i] + '"}'));
					}	
				}
			}
		}else{
			cb(obj)
		}
		
	}

	__scanner(obj);
}

/************************************************
	XML PARSER
************************************************/
JX_APP.prototype.addEvent = function(obj, type, cb){
	/*
	* obj = DOM element
	* type = event (change,click, etc.... )
	* cb = callback
	*/
	if(window.addEventListener){
		console.log('addEven tListener is used');
		obj.addEventListener(type, cb, false);
	}else{
		console.log('attachEvent is used');
		obj.attachEvent('on'+type, cb, false);
	}
}


/************************************************
	FORM TO JSON / OBJECT
************************************************/
JX_APP.prototype.formToJSON = function(form){

	if('form'!==form.nodeName.toLowerCase() && 1!==form.nodeType){
		console.log('Form error');
		return false;
	}

	var json_data = {}, new_arr_obj=null, index=null, key=null, input_name=null, new_obj=null;

	for(var i=0,n=form.length; i<n; i++){

		if(form[i].type!=='submit' || form[i].nodeName.toLowerCase()!=='fieldset' || form[i].nodeName.toLowerCase()!=='reset'){
			
			if(
				(form[i]!==undefined && form[i]!==null) &&
				(form[i].type==='checkbox' && form[i].checked) ||
				(form[i].type==='radio' && form[i].checked) ||
				(form[i].type==='text' && form[i].value.length>0) ||
				(form[i].type==='range' && form[i].value.length>0) ||
				(form[i].type==='select-one' && form[i].options[form[i].selectedIndex].value.length>0) ||
				(form[i].type==='select-multiple' && form[i].selectedOptions.length>0) ||
				(form[i].type==='textarea' && form[i].value.length>0) ||
				(form[i].type==='number' && form[i].value.length>0) ||
				(form[i].type==='date' && form[i].value.length>0) ||
				(form[i].type==='color' && form[i].value.length>0) ||
				(form[i].type==='month' && form[i].value.length>0) ||
				(form[i].type==='week' && form[i].value.length>0) ||
				(form[i].type==='time' && form[i].value.length>0) ||
				(form[i].type==='datetime' && form[i].value.length>0) ||
				(form[i].type==='datetime-local' && form[i].value.length>0) ||
				(form[i].type==='email' && form[i].value.length>0) ||
				(form[i].type==='search' && form[i].value.length>0) ||
				(form[i].type==='tel' && form[i].value.length>0) ||
				(form[i].type==='url' && form[i].value.length>0) ||
				(form[i].type==='image' && form[i].value.length>0) ||
				(form[i].type==='file' && form[i].value.length>0)
			){

				/*get the name of the current input*/
				input_name = form[i].name;
				
				/*array/object*/
				if(input_name.match(/\[.*\]/g)){

					if(input_name.match(/\[.+\]/g)){

						/*array object,  Object[][name]*/
						if(input_name.match(/\[.+\]/g)[0].match(/\[[0-9]\]/)!==null){

							new_arr_obj = input_name.replace(/\[.+\]/g,''); //get object name
							index = input_name.match(/[0-9]/g)[0]; //get index group
							key = input_name.match(/\[.+\]/g)[0].replace(/(\[|\]|[0-9])/g,'');
						
							/*create an array in an object*/
							if(typeof json_data[new_arr_obj]==='undefined'){
							 	json_data[new_arr_obj] = [];
							}

							/*create an object inside array*/
							if(typeof json_data[new_arr_obj][index]==='undefined'){
								json_data[new_arr_obj][index] = {};
							}

							json_data[new_arr_obj][index][key] = form[i].value;

						}else if(input_name.match(/\[.+\]/g)!==null){
							//to object
							//Object[name]

							/*get object name*/
							new_obj = input_name.replace(/\[.+\]/g,'');

							/*set new object*/
							if(typeof json_data[new_obj]==='undefined'){
								json_data[new_obj] = {};
							}
							/*assign a key name*/
							key = input_name.match(/\[.+\]/g)[0].replace(/(\[|\])/g,'');

							/*set key and form value*/
							json_data[new_obj][key] = form[i].value;
						}else{}
					}else{		

						/*to array, Object[]*/
						key = input_name.replace(/\[.*\]/g, '');

						if(form[i].type==='select-multiple'){
							for(var j=0, m=form[i].selectedOptions.length; j<m; j++){
								if(form[i].selectedOptions[j].value.length>0){
									if(typeof json_data[key]==='undefined'){
										json_data[key] = [];
									}
									json_data[key].push(form[i].selectedOptions[j].value);
								}
							}
							
						}else{
							if(typeof json_data[key]==='undefined'){
								json_data[key] = [];
							}
							json_data[key].push(form[i].value);
						}
						
					}	
				}else{
					/*basic info*/
					key = form[i].name.replace(/\[.*\]/g, '');
					json_data[key] = form[i].value;

				}
			}
		}
	}//endfor

	console.log("Result: ",json_data);
	return false;
}

/************************************************
	DOMINATOR
************************************************/
JX_APP.prototype.dom = function(){
	var elems = elems || [];
	function _getDOM(qry){
		if(document.getElementById(qry)!==null){
			return document.getElementById(qry);
		}else if(document.getElementsByClassName(qry).length>0){
			return document.getElementsByClassName(qry);
		}else if(document.querySelectorAll(qry).length>0){
			return document.querySelectorAll(qry);
		}else if(document.querySelector(qry)!==undefined){
			return document.querySelector(qry);
		}else{
			return null;
		}
	}
	for(var i=0, n=arguments.length; i<n; i++){
		elems.push(_getDOM(arguments[i]));
	}
	return elems;
}



function JX_APP(){}
var ez = new JX_APP();