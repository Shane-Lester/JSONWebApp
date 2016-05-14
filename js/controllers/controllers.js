// controllers.js

angular.module('JSONApp')

  // listing all of the items of JSON and carries data through for new items
  .controller('DataViewController', ['$scope', 'Items', '$state', '$http', function ($scope, Items, $state, $http) {
    $scope.newItem = ''
    var state = ''
    var home = ''
    var suffix = '.json'
    $scope.success = ''
    $scope.specialty = 'ent'

    $scope.showContent = function ($fileContent) {
      var data = JSON.parse($fileContent)
      if (data[state]) {
        console.log('valid JSON')
        $scope.success = 'Successfully loaded'
        console.log(data)
        if (state == 'department') {
          Items.setEntries(data)
        } else {
          Items.setClinEntries(data)
        }
        $state.go($state.current, {}, {
          reload: true
        })
      } else {
        console.log('no key')
        $scope.success = 'Failed- file ' + state + suffix + ' not found'
      }
      $scope.content = $fileContent
    }

    if ($state.current.name == 'app.home') {
      // console.log('department')
      $scope.format = Items.entries
      home = 'app.home'
      state = 'department'
      $scope.address = Items.deptAddress
    } else {
      $scope.format = Items.clinicalEntries
      // console.log('clinical')
      home = 'app.homeClin'
      state = 'clinical'
      $scope.address = Items.clinAddress
    }
    // add the JSON to the scope to display it
    $scope.json = $scope.format

    // Call the download function
    $scope.download = function () {
      var a = Items.download(state)
      $('#target').html(a)
    }

    // addNew called when Add new item button pressed and has added item.new to the scope
    $scope.addNew = function () {
      if ($scope.newItem.trim().length < 1) {
        $state.go(home)
      } else {
        // pass the new item title to the service to then send it out to the edit controller
        Items.createNew($scope.newItem, state)
        $scope.newItem = ''
      }
    }

    $scope.addNewImage = function () {
      if ($scope.newImageItem.trim().length < 1) {
        $state.go(home)
      } else {
        Items.createNewImage($scope.newImageItem, state)
        $scope.newImageItem = ''
      }
    }

    // manage the menu items

    $scope.remove = function (index) {
      Items.remove(index, state)
    }

    $scope.moveUp = function (index) {
      Items.move(index, state, -1)
    }

    $scope.moveDown = function (index) {
      Items.move(index, state, +1)
    }

    $scope.loadData = function () {
      $('#loadingButton').html('LOADING')
      var address = 'http://www.' + $scope.address + '/' + $scope.specialty
      if (state == 'department') {
        address += '/docs/department.json'
      }
      if (state == 'clinical') {
        address += '/docs/clinical.json'
      }
      $http.get(address)
        .then(function (res) {
          // http://www.lesterweb.co.uk/docs/department.json
          $('#loadingButton').html('SUCCESS!')
          if (state == 'department') {
            Items.setEntries(res.data, $scope.address)
          } else {
            // console.log(res.data)
            Items.setClinEntries(res.data, $scope.address)
          }
          $state.go($state.current, {}, {
            reload: true
          })
        },
          function (err) {
            $('#loadingButton').html('Failed to load data!')
            $state.go($state.current, {}, {
              reload: true
            })
          })
    }
  }])

  // edit or create an item for JSON
  .controller('DataEditController', ['$scope', '$stateParams', 'Items', '$state', function ($scope, $stateParams, Items, $state) {
    $scope.newItem = ''
    $scope.item = {}
    var state = ''
    var home = ''

    if ($state.current.name == 'app.edit') {
      $scope.sourceData = Items.entries
      home = 'app.home'
      state = 'department'
    } else {
      $scope.sourceData = Items.clinicalEntries
      state = 'clinical'
      home = 'app.homeClin'
    }

    if (!$stateParams.id) {
      // if no id then we are creating a new data item- this shouldn't happen any more as we create a title then edit
      if (state == 'department') {
        $scope.id = $scope.sourceData.department.length

        $scope.copy = {
          title: '',
          data: []
        }
        $scope.copy.title = Items.getNew()
      } else {
        $scope.id = $scope.sourceData.clinical.length

        $scope.copy = {}
        $scope.copy.title = Items.getNew()
      }
    } else {
      // we know there is an id so put it on the scope as $scope.id
      $scope.id = $stateParams.id
      // use this to access the Items service and get the object from the array - it references the array in the scope
      if (state == 'department') {
        $scope.object = angular.copy($scope.sourceData.department[$scope.id])

        // $scope.object is an object and has a data attribute which has an array holding the objects with the details
        // let's create a deep copied duplicate of the array only to work on
        $scope.copy = []
        _.extend($scope.copy, $scope.object)
        $scope.copy.title = $scope.object.title
        if($scope.copy.data[0].image){
          console.log('an image file')
          $scope.isAnImage = true;
        }
      } else {
        $scope.object = angular.copy($scope.sourceData.clinical[$scope.id])
        // console.log($scope.object)

        // $scope.object is an object - make a deep copy to work on

        $scope.copy = {}
        _.extend($scope.copy, $scope.object)
        $scope.copy.title = $scope.object.title
      // console.log($scope.copy)
      if($scope.copy.image){
        console.log('an image file')
        $scope.isAnImage = true;
      }
      }

    }

    $scope.cancel = function () {
      // angular.copy($scope.object, $scope.object)
      // remove the hashKey object
      $scope.hack = {}
      angular.copy($scope.object, $scope.hack)
      angular.copy($scope.hack, $scope.object)
      $state.go(home)
    }

    $scope.save = function () {
      if (state == 'department') {
        $scope.copy.data.forEach(function (item) {
          for (key in item) {
            if (item[key] == 'undefined') {
              item[key] == ''
            }
          }
        })

        $scope.sourceData.department[$scope.id].data = angular.copy($scope.copy.data)
        $scope.sourceData.department[$scope.id].title = angular.copy($scope.copy.title)
      } else {
        // console.log($scope.copy)
        $scope.sourceData.clinical[$scope.id] = angular.copy($scope.copy)
        $scope.sourceData.clinical[$scope.id].title = angular.copy($scope.copy.title)
      }
      $state.go(home)
    }

    $scope.saveImage = function () {
      console.log('saving the image')
      if (state == 'department') {
        console.log('save Image department')
        $scope.sourceData.department[$scope.id].data = angular.copy($scope.copy.data)
        $scope.sourceData.department[$scope.id].title = angular.copy($scope.copy.title)
        $scope.sourceData.department[$scope.id].src = angular.copy($scope.copy.src)

      // department saving
      // $scope.copy.data[2] should hold the src array
      } else {
        // clinical data saving - need to copy the data item by item into the array
        // $scope.sourceData points to the array in memory in the Items service
        console.log('clinical data')
        console.log($scope.copy.src)

        $scope.sourceData.clinical[$scope.id].title = angular.copy($scope.copy.title)
        $scope.sourceData.clinical[$scope.id].image = angular.copy($scope.copy.image)

        $scope.sourceData.clinical[$scope.id].src = angular.copy($scope.copy.src)
      }
      $state.go(home)
    }

    $scope.addImageSection = function () {
      if (state == 'clinical') {
        $scope.copy.src.push('')
      } else {
        $scope.copy.data[1].src.push('')
      }
    }

    $scope.addSection = function () {
      $scope.copy.data.push({
        'title': ''
      })
      $scope.copy.data.push({
        'subtitle': ''
      })

      $scope.copy.data.push({
        'heading': ''
      })

      $scope.copy.data.push({
        'info1': ''
      })
      $scope.copy.data.push({
        'info2': ''
      })
      $scope.copy.data.push({
        'item': '<hr>'
      })
    }
  }])

  .filter('prettyJSON', function () {
    function prettyPrintJson (json) {
      return JSON ? JSON.stringify(json, null, '  ') : 'your browser doesnt support JSON so cant pretty print'
    }
    return prettyPrintJson
  })
  // https://veamospues.wordpress.com/2014/01/27/reading-files-with-angularjs/
  .directive('onReadFile', function ($parse) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, element, attrs) {
        var fn = $parse(attrs.onReadFile)

        element.on('change', function (onChangeEvent) {
          var reader = new FileReader()

          reader.onload = function (onLoadEvent) {
            // console.log('onload')
            scope.$apply(function () {
              fn(scope, {$fileContent: onLoadEvent.target.result})
            })
          }

          reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0])
        })
      }
    }
  })

  // from http://stackoverflow.com/questions/16388562/angularjs-force-uppercase-in-textbox
  .directive('lowercased', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function (input) {
          return input ? input.toLowerCase() : ''
        })
        element.css('text-transform', 'lowercase')
      }
    }
  })
