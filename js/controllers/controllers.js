// controllers.js

angular.module('JSONApp')

//listing all of the items of JSON and carries data through for new items
.controller('DataViewController',['$scope','Items','$state',function($scope, Items, $state){
	$scope.newItem="";
	// console.log('In DataViewController');
	$scope.department=Items.entries;

	//addNew called when Add new item button pressed and has added item.new to the scope
	$scope.addNew = function(){
		// console.log('addNew function');
		if($scope.newItem.trim().length < 1){
			// console.log('no title added');
			$state.go('app.home');
		}
		else{
			// console.log("newTitle is" + $scope.newItem);
			Items.createNew($scope.newItem);
			$state.go('app.new');
			}
		}

		//add the JSON to the scope to display it
	$scope.json = Items.entries;

	$scope.download = function(){
		 var a=Items.download();
		 $('#target').html(a);

			};

	$scope.remove = function(index){
		// console.log(Items.entries.admin[index]);
		Items.remove(index);
	}

}])

//edit or create an item for JSON
.controller('DataEditController',['$scope', '$stateParams', 'Items', '$state',function($scope, $stateParams, Items, $state){
	$scope.newItem="";
	$scope.item={};

	if(!$stateParams.id){
		$scope.id = Items.entries.admin.length;

		$scope.editting ={title: "",
					data:[]};
		$scope.editting.title = Items.getNew();

	}
	else{
		//we know there is an id so put it on the scope as $scope.id
		$scope.id = $stateParams.id
		//use this to access the Items service and get the object from the array
		// $scope.object = Items.entries.admin[$scope.id];
		$scope.object ={};
		angular.copy(Items.entries.admin[$scope.id], $scope.object);
		//$scope.object has a data attribute which has an array key holding the details
		//let's create a deep copied duplicate of the array only to work on
		$scope.copy = [];
		$scope.copy=_.clone( $scope.object.data);
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