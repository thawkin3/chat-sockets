var app = angular.module('ChatSockets', ['ngRoute', 'ngSanitize', 'ui.bootstrap']);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			redirectTo: '/main',
			access: { restricted: false }
		})
		.when('/main', {
			controller: 'mainController',
			templateUrl:'javascripts/app/views/main.html',
			access: { restricted: true }
		})
		.when('/enterChatroom', {
			controller: 'enterChatroomController',
			templateUrl:'javascripts/app/views/enterChatroom.html',
			access: { restricted: false }
		})
		.otherwise({ 
			redirectTo: '/main',
			access: { restricted: false }
		});
});

app.run(function($rootScope, $location, $window, $route, socket) {
    // AUTHENTICATION
	$rootScope.$on('$routeChangeStart', function (event, next, current) {
	    if (typeof next.access !== 'undefined' && next.access.restricted && !$rootScope.fields.username) {
			$location.path('/enterChatroom');
			$route.reload();
		} 
    });

	// SOCKET.IO EVENT FOR LEAVING CHATROOM
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
		if (typeof current !== 'undefined'
			&& current.loadedTemplateUrl
			&& typeof previous !== 'undefined' 
			&& previous.loadedTemplateUrl
			&& current.loadedTemplateUrl.indexOf('enterChatroom.html') != -1
			&& previous.loadedTemplateUrl.indexOf('main.html') != -1) {
			socket.emit('userLeftChatroom', {
				username: 'Chatroom',
				message: $rootScope.fields.username + ' has left the chatroom',
				nameColor: '#606060',
			});
		}
    });

    // ROOT SCOPE FIELDS
    $rootScope.fields = {
    	username: '',
    };
});
