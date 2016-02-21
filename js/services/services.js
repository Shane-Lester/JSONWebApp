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
				{"subheading": "Otology"},
				{"info1": "Secretary- Julie"},
				{"info2": "Ex 1111"},
				{"item":"</hr>"},
				{"heading":"Mr Black"},
				{"subheading": "Rhinology"},
				{"info1": "Secretary- Anne"},
				{"info2": "Ex 1234"},
				{"item":"</hr>"}

			]},
			{"title":"SAS Doctors",
			"data":[]},
			{"title":"Rota",
			"data":[]}

		]};


	service.createNew =function(title){
		//passes the title in from the scope to be then used by the edit controller
		newTitle = title;
		var newItem = {"title":title,
			"data":[]};

		service.entries.admin.push(newItem);
		};	

	service.getNew =function(){
		//return title to the edit controller
			return newTitle;
				};

	service.move = function(index, direction){
		var moveItem ={};
		//if direction is -1 move up in array +1 move down- gives an array so take object 0
		
		moveItem = service.entries.admin.splice(index,1)[0];

		service.entries.admin.splice(index+direction,0,moveItem);
	}

	service.save = function(newObject, index){

		if(index == service.entries.length){
			service.entries.admin.push(newObject);
		}
		else{
			//need to add the objects
			//service.entries.admin[index] is the correct place
			service.entries.admin[index] = newObject;
		}

	};





	service.remove = function(index){
		service.entries.admin.splice(index,1);
	}

	service.download= function(){
		//from http://stackoverflow.com/questions/16329293/save-json-string-to-client-pc-using-html5-api
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