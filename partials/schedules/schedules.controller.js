(function () {
    'use strict';

    angular
        .module('app')
        .controller('SchedulesController', SchedulesController);

        SchedulesController.$inject = ['UserService', '$location','$rootScope'];
    function SchedulesController(UserService,$location ,$rootScope) {
        var vm = this;

        vm.user = null;
        vm.allUsers = [];
        vm.deleteUser = deleteUser;

        initController();

        function initController() {
            //loadCurrentUser();
           // loadAllUsers();
        }

        function loadCurrentUser() {

        }

      /*  function loadAllUsers() {
            UserService.GetAll()
                .then(function (users) {
                    vm.allUsers = users;
                });
        }
*/

        function deleteUser(id) {
                    
        }
    }

})();