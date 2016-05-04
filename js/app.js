angular.module('JSONApp',['ui.router']);

angular.module('JSONApp')
.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/home');

	$stateProvider
	.state('app',{
		abstract: true,
		templateUrl:"views/app.html"
	})

	.state('app.help',{
		url:"/help",
		templateUrl:"views/help.html"

	})

	.state('app.home',{
		url: "/home",
		templateUrl: "views/home.html",
		controller: "DataViewController"
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

	.state('app.homeClin',{
		url: "/homeClin",
		templateUrl: "views/homeClin.html",
		controller: "DataViewController",
		cache: false
	})

	.state('app.editClin',{
		url:"/editClin/:id",
		templateUrl: "views/newClin.html",
		controller: "DataEditController",
		cache: false

	})

})

.run(function(){
	//lifted from http://stackoverflow.com/questions/24514717/bootstrap-navbar-active-state-not-working
	$(".nav a ")

	$(".nav a").on("click", function(){
		   $(".nav").find(".active").removeClass("active");
		   $(this).parent().addClass("active");
});
})