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
		$scope.id = Items.entries.admin.length;

		$scope.editting ={title: "",
					data:[]};
		$scope.editting.title = Items.getNew();

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
		// if the data array is not empty, read the elements and apply them to the scope of the form to edit them
		// if($scope.object.data.length >0){

		// 	if($scope.object.data[0].heading){
		// 		$scope.item.heading = $scope.object.data[0].heading;
		// 	}
		// 	if($scope.object.data[1].subheading){
		// 		$scope.item.subheading = $scope.object.data[1].subheading;
		// 	}
		// 	if($scope.object.data[2].info1){
		// 		$scope.item.info1 = $scope.object.data[2].info1;
		// 		}
		// 	if($scope.object.data[3].info2){
		// 	$scope.item.info2 = $scope.object.data[3].info2;
		// 		}
		// }
		// $scope.editting = $scope.object;
	}
	// console.log($scope.editting.title);
	$scope.save = function(){


		// $scope.editting.data =[]; 
		// //only push the data items if they are there
		// //otherwise push a dash- to keep it consistent
		// if(!$scope.item.heading){
		// 	$scope.item.heading = "-";
		// 	}

		// if(!$scope.item.subheading){
		// 	$scope.item.subheading = "-";
		// 	}
		// if(!$scope.item.info1){
		// 	$scope.item.info1 = "-";
		// 	}
		// if(!$scope.item.info2){
		// 	$scope.item.info2 = "-";
		// 	}
		// $scope.editting.data.push({heading:$scope.item.heading});
		// $scope.editting.data.push({subheading:$scope.item.subheading});
		// $scope.editting.data.push({info1:$scope.item.info1});
		// $scope.editting.data.push({info2:$scope.item.info2});

		// // console.log($scope.editting);

		// Items.save($scope.editting, $scope.id);
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

}])

.filter('prettyJSON', function () {
    function prettyPrintJson(json) {
      return JSON ? JSON.stringify(json, null, '  ') : 'your browser doesnt support JSON so cant pretty print';
    }
    return prettyPrintJson;
});