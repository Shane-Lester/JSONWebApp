angular.module('JSONApp',['ui.router']);

angular.module('JSONApp')
.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/home');

	$stateProvider
	.state('app',{
		abstract: true,
		templateUrl:"views/app.html"
	})

	.state('app.home',{
		url: "/home",
		templateUrl: "views/home.html",
		controller: "DataViewController",
		cache: false
	})

	.state('app.new',{
		url:"/new",
		templateUrl: "views/new.html",
		controller: "DataEditController",
		cache:false

	})

	.state('app.edit',{
		url:"/edit/:id",
		templateUrl: "views/new.html",
		controller: "DataEditController",
		cache: false

	})

	;



});