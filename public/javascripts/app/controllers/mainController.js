(function() {

	var mainController = function ($scope, $routeParams, $rootScope, $timeout, socket) {

		// INITIALIZE THE CHATS ARRAY
		$scope.chats = [];

		// YOUR USERNAME COLOR (WILL GET ASSIGNED TO YOU LATER)
		$scope.nameColor = "#000000";
		$scope.chatroomMessageColor = "#606060";

		// SOCKET EVENTS
		socket.emit('userJoinedChatroom', {
			username: "Chatroom",
			message: $rootScope.fields.username + " has joined the chatroom",
			nameColor: $scope.chatroomMessageColor
		});

		socket.on('colorAssignment', function (data) {
			$scope.nameColor = data;
		});

		socket.on('youJoinedChatroom', function (data) {
			$scope.nameColor
			for (var i = 0; i < data.length; i++) {
				$scope.chats.push(data[i]);
			}
		});

		socket.on('userJoinedChatroom', function (data) {
			$scope.chats.push(data);
		});

		socket.on('receiveMessage', function (data) {
			$scope.chats.push(data);
		});

		socket.on('userDisconnected', function (data) {
			$scope.chats.push(data);
		});

		// POST CHAT MESSAGE FROM INPUT BOX
		$scope.postChatMessage = function () {
			if ($scope.chatMessage != "" && typeof $scope.chatMessage != "undefined") {
				socket.emit('sendMessage', {
					username: $rootScope.fields.username,
					message: $scope.chatMessage,
					nameColor: $scope.nameColor
				});
				$scope.chatMessage = "";
			}
		}

		// JQUERY...
		$("#chatMessage").focus();
		$timeout(function () {
			$("#chatroom").scrollTop($("#chatroom")[0].scrollHeight);
		}, 200);

	};

	mainController.$inject = ['$scope', '$routeParams', '$rootScope', '$timeout', 'socket'];

	angular.module('ChatSockets')
	    .controller('mainController', mainController);

}());