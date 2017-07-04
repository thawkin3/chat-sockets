var app = angular.module('ChatSockets', ['ngRoute', 'ngSanitize', 'ui.bootstrap']);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			redirectTo: '/main',
			access: {restricted: false}
		})
		.when('/main', {
			controller: 'mainController',
			templateUrl:'javascripts/app/views/main.html',
			access: {restricted: true}
		})
		.when('/enterChatroom', {
			controller: 'enterChatroomController',
			templateUrl:'javascripts/app/views/enterChatroom.html',
			access: {restricted: false}
		})
		.otherwise({ 
			redirectTo: '/main',
			access: {restricted: false}
		});
});

app.run(function($rootScope, $location, $window, $route) {

    // AUTHENTICATION
	$rootScope.$on('$routeChangeStart', function (event, next, current) {
	    if (typeof next.access != 'undefined' && next.access.restricted && !$rootScope.fields.username) {
			$location.path('/enterChatroom');
			$route.reload();
		}
    });

    // ROOT SCOPE FIELDS
    $rootScope.fields = {
    	username: ""
    };

});