(function() {
	var enterChatroomController = function($scope, $routeParams, $rootScope, $http, $location, socket) {
		// CLEAR USERNAME IN THE EVENT OF A BACK BUTTON
		$rootScope.fields.username = '';

		// VALIDATE USERNAME AND MOVE TO CHATROOM
		$scope.showErrorMessage = false;
		$scope.showUsernameTaken = false;
		$scope.joinChatroom = function() {
			if (typeof $rootScope.fields.username !== 'undefined' 
				&& $rootScope.fields.username.trim() !== ''
				&& $rootScope.fields.username.length > 2
				&& $rootScope.fields.username.length < 21
				&& /^[a-zA-Z0-9]+$/.test($rootScope.fields.username)) {
				$scope.requestUsername();
			} else {
				$scope.showErrorMessage = true;
			}
		}

		$scope.hideUsernameTakenMessage = function() {
			if ($scope.showUsernameTaken) {
				$scope.showUsernameTaken = false;
			}
		}

		// SOCKET EVENTS
		$scope.requestUsername = function() {
			socket.emit('requestingUsername', {
				requestedUsername: $rootScope.fields.username,
			});
		}

		socket.on('usernameAvailability', function(data) {
			console.log('usernameAvailability socket event');
			if (data.isAvailable) {
				$location.path('/main');
			} else {
				$scope.showUsernameTaken = true;
			}
		});

		// JQUERY
		$('#username').focus();
	};

	enterChatroomController.$inject = ['$scope', '$routeParams', '$rootScope', '$http', '$location', 'socket'];

	angular.module('ChatSockets')
	    .controller('enterChatroomController', enterChatroomController);
}());
