(function() {

	var enterChatroomController = function ($scope, $routeParams, $rootScope, $http, $location, socket) {

		// VALIDATE USERNAME AND MOVE TO CHATROOM
		$scope.joinChatroom = function () {
			console.log($rootScope.fields.username);
			if (typeof $rootScope.fields.username != "undefined" && $rootScope.fields.username.trim() != "") {
				$location.path("/main");
			}
		}

		// JQUERY
		$("#username").focus();

	};

	enterChatroomController.$inject = ['$scope', '$routeParams', '$rootScope', '$http', '$location', 'socket'];

	angular.module('ChatSockets')
	    .controller('enterChatroomController', enterChatroomController);

}());