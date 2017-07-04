(function() {

	var mainController = function ($scope, $routeParams, $rootScope, $http, $location, socket) {

		// INITIALIZE THE CHATS ARRAY
		$scope.chats = [];

		// SOCKET EVENTS
		socket.emit('userJoinedChatroom', {
			username: "Chatroom",
			message: $rootScope.fields.username + " has joined the chatroom"
		});

		socket.on('userJoinedChatroom', function (data) {
		  $scope.chats.push(data);
		});

		socket.on('receiveMessage', function (data) {
		  $scope.chats.push(data);
		});

		

		// POST CHAT MESSAGE FROM INPUT BOX
		$scope.postChatMessage = function () {
			if ($scope.chatMessage != "" && typeof $scope.chatMessage != "undefined") {
				socket.emit('sendMessage', {
					username: $rootScope.fields.username,
					message: $scope.chatMessage
				});
				$scope.chatMessage = "";
			}
		}

	};

	mainController.$inject = ['$scope', '$routeParams', '$rootScope', '$http', '$location', 'socket'];

	angular.module('ChatSockets')
	    .controller('mainController', mainController);

}());