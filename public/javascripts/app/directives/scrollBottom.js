angular.module('ChatSockets').directive("scrollBottom", ['$timeout', function ($timeout) {
    return {
        link: function (scope, element, attr) {
            var id = $("#" + attr.scrollBottom);
            $(element).on("submit", function () {
                $timeout(function () {
                	id.scrollTop(id[0].scrollHeight);
                }, 200);
            });
        }
    }
}]);