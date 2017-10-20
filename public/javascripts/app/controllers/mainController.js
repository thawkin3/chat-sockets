(function() {

	var mainController = function ($scope, $routeParams, $rootScope, $timeout, socket, $http) {

		// NON-SCOPE VARIABLES
		var API_KEY = "SnSMGkB2QB99JaRPzgM8koLYmSfUsRoB";

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
			scrollDown();
		});

		socket.on('userJoinedChatroom', function (data) {
			$scope.chats.push(data);
			scrollDown();
		});

		socket.on('receiveMessage', function (data) {
			$scope.chats.push(data);
			scrollDown();
		});

		socket.on('userDisconnected', function (data) {
			$scope.chats.push(data);
			scrollDown();
		});

		socket.on('someoneIsTyping', function (data) {
			$('#typingMessages').text(data.username + " is typing...");
		});

		socket.on('someoneIsNotTyping', function (data) {
			$('#typingMessages').text("");
		});

		// LET OTHER USERS KNOW YOU'RE TYPING
		$scope.typingHandler = function () {
			socket.emit('iAmTyping', {
				username: $rootScope.fields.username
			});

			$timeout(function () {
				socket.emit('iAmNotTyping', {
					username: $rootScope.fields.username
				});
			}, 2000);
		}

		// POST CHAT MESSAGE FROM INPUT BOX
		$scope.postChatMessage = function () {
			if ($scope.chatMessage != "" && typeof $scope.chatMessage != "undefined") {
				
				// GIPHY INTEGRATION
				if ((/^\/giphy [a-zA-Z0-9]+/).test($scope.chatMessage)) {
					var searchQuery = $scope.chatMessage.split("/giphy ")[1];
					var url = 'https://api.giphy.com/v1/gifs/search?q=' + searchQuery + '&api_key=' + API_KEY + '&limit=1';
					
					$http.get(url).then(giphySuccess, giphyFail);
				// NORMAL TEXT
				} else {
					socket.emit('sendMessage', {
						username: $rootScope.fields.username,
						message: $scope.chatMessage,
						nameColor: $scope.nameColor
					});
					$scope.chatMessage = "";
				}
			}
		}

		// GIPHY SUCCESS FUNCTION
		function giphySuccess (data) {
			var searchText = "<div><i>" + $scope.chatMessage + "</i></div>";
			var gifToSend = "<img src='" + data.data.data[0].images.fixed_height_small.url + "' width='200' />";
			socket.emit('sendMessage', {
				username: $rootScope.fields.username,
				message: searchText + gifToSend,
				nameColor: $scope.nameColor
			});
			$scope.chatMessage = "";
		}

		// GIPHY FAIL FUNCTION
		function giphyFail (data) {
			var searchText = "<div><i>" + $scope.chatMessage + "</i></div>";
			var gifToSend = "<img src='https://media.giphy.com/media/3ohzdYJK1wAdPWVk88/giphy.gif' width='200' />";
			socket.emit('sendMessage', {
				username: $rootScope.fields.username,
				message: searchText + gifToSend,
				nameColor: $scope.nameColor
			});
			$scope.chatMessage = "";
		}

		// JQUERY...
		$("#chatMessage").focus();
		function scrollDown () {
			$timeout(function () {
				if ($("#chatroom").length > 0) {
					$("#chatroom").scrollTop($("#chatroom")[0].scrollHeight);
				}
			}, 200);
		}

	};

	mainController.$inject = ['$scope', '$routeParams', '$rootScope', '$timeout', 'socket', '$http'];

	angular.module('ChatSockets')
	    .controller('mainController', mainController);

}());