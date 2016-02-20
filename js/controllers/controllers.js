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

	$scope.moveUp = function(index){
		//if second argument -1 move it up in the array
		Items.move(index,-1);
	}

	$scope.moveDown = function(index){
		//if second argument +1 move it down in the array
		Items.move(index,+1);
	}

}])

//edit or create an item for JSON
.controller('DataEditController',['$scope', '$stateParams', 'Items', '$state',function($scope, $stateParams, Items, $state){
	$scope.newItem="";
	$scope.item={};

	if(!$stateParams.id){
		$scope.info1 = Items.entries.admin.length;
		// console.log('making new item');

		//each entry is added to a the admin property of the array of objects
		//each entry is an object with a title property and a data property
		//title is either submitted from the editted item or created from the
		//$scope.new.item object
		//the data is an array
		$scope.editting ={title: "",
					data:[]};
		$scope.editting.title = Items.getNew();

	}
	else{
		//we know there is an id so put it on the scope
		$scope.id = $stateParams.id
		//use this to access the Items service and get the object from the array
		$scope.object = Items.entries.admin[$scope.id];
		// console.log($scope.object);
		// if the data array is not empty, read the elements and apply them to the scope
		console.log($scope.object.data.length);
		if($scope.object.data.length >0){

			if($scope.object.data[0].heading){
				$scope.item.heading = $scope.object.data[0].heading;
			}
			if($scope.object.data[1].subheading){
				$scope.item.subheading = $scope.object.data[1].subheading;
			}
			if($scope.object.data[2].info1){
				$scope.item.info1 = $scope.object.data[2].info1;
				}
		}
		$scope.editting = $scope.object;
	}
	// console.log($scope.editting.title);
	$scope.save = function(){
		//send the item in the array- we will replace this with the new object
		//send the object through
		// console.log($scope.editting);
		// console.log($scope.item);

		$scope.editting.data =[]; 
		//only push the data items if they are there
		//otherwise push a dash- to keep it consistent
		if(!$scope.item.heading){
			$scope.item.heading = "-";
			}

		if(!$scope.item.subheading){
			$scope.item.subheading = "-";
			}
		if(!$scope.item.info1){
			$scope.item.info1 = "-";
			}
		$scope.editting.data.push({heading:$scope.item.heading});
		$scope.editting.data.push({subheading:$scope.item.subheading});
		$scope.editting.data.push({info1:$scope.item.info1});

		// console.log($scope.editting);

		Items.save($scope.editting, $scope.id);
		$state.go('app.home');
	}

}])

.filter('prettyJSON', function () {
    function prettyPrintJson(json) {
      return JSON ? JSON.stringify(json, null, '  ') : 'your browser doesnt support JSON so cant pretty print';
    }
    return prettyPrintJson;
});