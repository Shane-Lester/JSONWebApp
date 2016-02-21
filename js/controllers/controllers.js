// controllers.js

angular.module('JSONApp')

//listing all of the items of JSON and carries data through for new items
.controller('DataViewController',['$scope','Items','$state',function($scope, Items, $state){
	$scope.newItem="";
	$scope.department=Items.entries;

	//addNew called when Add new item button pressed and has added item.new to the scope
	$scope.addNew = function(){
		if($scope.newItem.trim().length < 1){
			$state.go('app.home');
		}
		else{
			Items.createNew($scope.newItem);
			$scope.newItem = "";
			}
		}

	//add the JSON to the scope to display it
	$scope.json = Items.entries;

	$scope.download = function(){
		 var a=Items.download();
		 $('#target').html(a);

			};

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

	if(!$stateParams.id){
		$scope.id = Items.entries.admin.length;

		$scope.copy ={title: "",
					data:[]};
		$scope.copy.title = Items.getNew();

	}
	else{
		//we know there is an id so put it on the scope as $scope.id
		$scope.id = $stateParams.id
		//use this to access the Items service and get the object from the array
		$scope.object = Items.entries.admin[$scope.id];
		//$scope.object has a data attribute which has an array key holding the details
		//let's create a deep copied duplicate of the array only to work on
		$scope.copy = [];
		$scope.copy=_.clone( $scope.object.data);
		$scope.copy.title = $scope.object.title;
	}

	$scope.cancel = function(){
		// angular.copy($scope.object, $scope.object);
		//remove the hashKey object
		$scope.hack = {}
		angular.copy($scope.object, $scope.hack);
		angular.copy($scope.hack, $scope.object);
		$state.go('app.home');
	}
	$scope.save = function(){

		$scope.copy.forEach(function(item){

			for(key in item){
				if (item[key]=="undefined"){
					item[key] =="";
				}
			};
		});
		angular.copy($scope.copy,$scope.object.data);
		$state.go('app.home');
	}

		$scope.addSection = function(){

		$scope.copy.push({"heading":""});
		$scope.copy.push({"subheading":""});
		$scope.copy.push({"info1":""});
		$scope.copy.push({"info2":""});
		$scope.copy.push({"item":"<hr>"});
	}


}])

.filter('prettyJSON', function () {
    function prettyPrintJson(json) {
      return JSON ? JSON.stringify(json, null, '  ') : 'your browser doesnt support JSON so cant pretty print';
    }
    return prettyPrintJson;
});