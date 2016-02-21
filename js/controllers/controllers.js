// controllers.js

angular.module('JSONApp')

//listing all of the items of JSON and carries data through for new items
.controller('DataViewController',['$scope','Items','$state',function($scope, Items, $state){
	$scope.newItem="";
	console.log($state.current.name);
	if($state.current.name=="app.home"){
		// console.log('department');
		$scope.department=Items.entries;
			}
	else{
		$scope.department = Items.clinicalEntries;
		// console.log('clinical');
		}
	//add the JSON to the scope to display it
	$scope.json =  $scope.department;

	//Call the download function
	$scope.download = function(){
	 var a=Items.download();
	 $('#target').html(a);

		};

	//addNew called when Add new item button pressed and has added item.new to the scope
	$scope.addNew = function(){
		if($scope.newItem.trim().length < 1){
			$state.go('app.home');
		}
		else{
			//pass the new item title to the service to then send it out to the edit controller
			Items.createNew($scope.newItem);
			$scope.newItem = "";
			}
		}



	//manage the menu items

	$scope.remove = function(index){
		Items.remove(index);
	}

	$scope.moveUp = function(index){
		Items.move(index,-1);
	}

	$scope.moveDown = function(index){
		Items.move(index,+1);
	}




}])

//edit or create an item for JSON
.controller('DataEditController',['$scope', '$stateParams', 'Items', '$state',function($scope, $stateParams, Items, $state){
	$scope.newItem="";
	$scope.item={};
	var state ='';
	var home ='';

	if($state.current.name == "app.edit"){
		$scope.sourceData = Items.entries;
		home ='app.home';
		state = 'department';

	}
	else{
		$scope.sourceData = Items.clinicalEntries;
		state = 'clinical';
		home = 'app.homeClin';
	}

	if(!$stateParams.id){
		//if no id then we are creating a new data item- this shouldn't happen any more as we create a title then edit
		$scope.id = $scope.sourceData.admin.length;

		$scope.copy ={title: "",
					data:[]}; 
		$scope.copy.title = Items.getNew();

	}
	else{
		//we know there is an id so put it on the scope as $scope.id
		$scope.id = $stateParams.id
		//use this to access the Items service and get the object from the array - it references the array in the scope
		$scope.object = angular.copy( $scope.sourceData.admin[$scope.id]);
		//$scope.object is an object and has a data attribute which has an array holding the objects with the details
		//let's create a deep copied duplicate of the array only to work on
		$scope.copy = [];
		_.extend($scope.copy, $scope.object);
		$scope.copy.title = $scope.object.title;
	}

	$scope.cancel = function(){
		// angular.copy($scope.object, $scope.object);
		//remove the hashKey object
		$scope.hack = {}
		angular.copy($scope.object, $scope.hack);
		angular.copy($scope.hack, $scope.object);
		$state.go(home);
	}
	$scope.save = function(){

		$scope.copy.data.forEach(function(item){

			for(key in item){
				if (item[key]=="undefined"){
					item[key] =="";
				}
			};
		});
		$scope.sourceData.admin[$scope.id].data = angular.copy($scope.copy.data);
		$state.go(home);
	}

	$scope.addSection = function(){

		$scope.copy.data.push({"heading":""});
		$scope.copy.data.push({"subheading":""});
		$scope.copy.data.push({"info1":""});
		$scope.copy.data.push({"info2":""});
		$scope.copy.data.push({"item":"<hr>"});
	}


}])


.filter('prettyJSON', function () {
    function prettyPrintJson(json) {
      return JSON ? JSON.stringify(json, null, '  ') : 'your browser doesnt support JSON so cant pretty print';
    }
    return prettyPrintJson;
});