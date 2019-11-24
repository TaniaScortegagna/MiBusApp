(function () {
    'use strict';

    angular
        .module('app')
        .controller('UserHistoryController', UserHistoryController);

        UserHistoryController.$inject = ['UserService','$location', '$rootScope','$scope','ResourcesService','SweetAlert'];
    function UserHistoryController(UserService,$location, $rootScope,$scope,ResourcesService,SweetAlert) {
        var vm = $scope;

        initController();
        $rootScope.stopTimer();
        function initController() {
           getHistorial();
        }
        vm.formatDate = function(date){
            var dateOut = date.replace(/([A-Za-z)(\\/])/g, "");
            return dateOut;
        };
        function getHistorial(){
            ResourcesService.GetHistorial($rootScope.globals.currentUser.userData.Id)
            .then(function (response) {
                if (response){
                   $rootScope.records = response;          
                } 
            })
            .catch(function(error){
                SweetAlert.swal ({
                    type: "error", 
                    title: "Error",
                    text: error,
                    confirmButtonAriaLabel: 'Ok',
                });
            });
         }
    }

})();