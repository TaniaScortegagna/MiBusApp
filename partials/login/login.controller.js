(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService','SweetAlert','UserService','$rootScope'];
    function LoginController($location, AuthenticationService,SweetAlert,UserService,$rootScope) {
        var vm = this;
        vm.login = function() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.user)
            .then(function (response) {
                if (response.token.length > 10){                                       
                    UserService.GetById(response.id)
                    .then(function (response) {
                        $rootScope.user = response.data;
                        AuthenticationService.SetCredentials( $rootScope.user, response.token);                        
                        if(response.data.RolId == 1){
                            $location.path('/');
                        }   
                        if(response.data.RolId == 2){
                            $location.path('/driver-home');
                        }  
                        if(response.data.RolId == 3){
                            $location.path('/admin-home');
                        }
                        if(response.data.RolId == 4){
                            $location.path('/SUadmin-home');
                        }    
                    })
                    .catch(function(error){
                        SweetAlert.swal ({
                            type: "error", 
                            title: "Error",
                            text: error,
                            confirmButtonAriaLabel: 'Ok',
                        });
                        vm.dataLoading = false;
                    });         
                } else {
                    SweetAlert.swal ({
                        type: "warning", 
                        title: "Verifique los datos",
                        text: "Usuario y/o clave erronea",
                        confirmButtonAriaLabel: 'Ok',
                    });
                    vm.dataLoading = false;
                }
            })
            .catch(function(error){
                SweetAlert.swal ({
                    type: "error", 
                    title: "Error",
                    text: error,
                    confirmButtonAriaLabel: 'Ok',
                });
                vm.dataLoading = false;
            });
        };
    }

})();