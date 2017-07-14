(function() {

	var enterChatroomController = function ($scope, $routeParams, $rootScope, $http, $location, socket) {

		// CLEAR USERNAME IN THE EVENT OF A BACK BUTTON
		$rootScope.fields.username = "";

		// VALIDATE USERNAME AND MOVE TO CHATROOM
		$scope.showErrorMessage = false;
		$scope.joinChatroom = function () {
			if (typeof $rootScope.fields.username != "undefined" 
				&& $rootScope.fields.username.trim() != ""
				&& $rootScope.fields.username.length > 2
				&& /^[a-zA-Z0-9]/.test($rootScope.fields.username)) {
				$location.path("/main");
			} else {
				$scope.showErrorMessage = true;
			}
		}

		// JQUERY
		$("#username").focus();

	};

	enterChatroomController.$inject = ['$scope', '$routeParams', '$rootScope', '$http', '$location', 'socket'];

	angular.module('ChatSockets')
	    .controller('enterChatroomController', enterChatroomController);

}());