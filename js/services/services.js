// services.js
angular.module('JSONApp')
.factory('Items',function(){
	var service = {};
	var newTitle = "";

	service.entries= {"admin":
	[
			{"title":"Consultants",
			"data":[
				{"heading":"Mr White"},
				{"subheading": "Assassin"},
				{"info1": "Uses knives"},
				{"info2": "Vicious"}
			]},
			{"title":"SAS Doctors",
			"data":[]},
			{"title":"Rota",
			"data":[]}

		]};


		// consider creating a single object from the form and then pushing each element into the array on saving
		// --**this may  be necessary when loading in from external JSON
		//--** as there may be missing elements and we may need to validate them against their keys
		// on reloading we need to retrieve the last 3 objects in the array and then translate them back into the object

	service.save = function(newObject, index){
		// console.log("object is " + newObject);

		if(index == service.entries.length){
			// console.log('this is a new item so we will push it');
			// console.log(newObject);
			service.entries.admin.push(newObject);
			// console.log(newObject);
		}
		else{
			// console.log("We will replace the item");
			//need to add the objects
			//service.entries.admin[index] is the correct place
			//we need to add an object with data as a key and an array filled with objects
			service.entries.admin[index] = newObject;
		}

	};

	service.createNew =function(title){
		//passes the title in from the scope to be then used by the edit controller
		newTitle = title;
		// console.log ("service function createNew for :" +newTitle);
	}

	service.getNew =function(){
		return newTitle;
	}

	service.remove = function(index){
		service.entries.admin.splice(index,1);
	}

	service.move = function(index, direction){
		var moveItem ={};
		// console.log(index);
		//if direction is -1 move up in array +1 move down- gives an array so take object 0
		
		moveItem =service.entries.admin.splice(index,1)[0];
		// console.log(moveItem);

		service.entries.admin.splice(index+direction,0,moveItem);
	}

	service.download= function(){
		//from http://stackoverflow.com/questions/16329293/save-json-string-to-client-pc-using-html5-api
		// console.log('service.download function');
		var data = service.entries;
		var json = JSON.stringify(data);
		var blob = new Blob([json], {type: "application/json"});
		var url  = URL.createObjectURL(blob);

		var a = document.createElement('a');
		a.download    = "department.json";
		a.href        = url;
		a.textContent = "Download department.json";
		
		return a;

	}


	return service;
})