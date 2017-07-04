// angular.module('ChatSockets').factory('socket', function ($rootScope) {
//   var socket = io.connect();
//   return {
//     on: function (eventName, callback) {
//       socket.on(eventName, function () {  
//         var args = arguments;
//         $rootScope.$apply(function () {
//           callback.apply(socket, args);
//         });
//       });
//     },
//     emit: function (eventName, data, callback) {
//       socket.emit(eventName, data, function () {
//         var args = arguments;
//         $rootScope.$apply(function () {
//           if (callback) {
//             callback.apply(socket, args);
//           }
//         });
//       })
//     }
//   };
// });
(function() {

	var socket = function ($rootScope) {

		var socket = io.connect();
		return {
			on: function (eventName, callback) {
				socket.on(eventName, function () {  
					var args = arguments;
					$rootScope.$apply(function () {
						callback.apply(socket, args);
					});
				});
			},
			emit: function (eventName, data, callback) {
				socket.emit(eventName, data, function () {
					var args = arguments;
					$rootScope.$apply(function () {
						if (callback) {
							callback.apply(socket, args);
						}
					});
				});
			},
			helloWorld: function () {
				console.log("hello world from my socket service");
			}
		};

	};

	socket.$inject = ['$rootScope'];

	angular.module('ChatSockets')
	    .factory('socket', socket);

}());