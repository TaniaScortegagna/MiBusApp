(function () {
    'use strict';

    angular
        .module('app')
        .controller('SchedulesController', SchedulesController);

        SchedulesController.$inject = ['UserService', '$location','$rootScope','$scope','ResourcesService','$filter'];
    function SchedulesController(UserService, $location,$rootScope,$scope,ResourcesService,$filter) {
        var vm = $scope;
        vm.updateRamalByEmpresa = updateRamalByEmpresa;
        vm.updateRecorridosByRamal = updateRecorridosByRamal;
        vm.updateViajesByRecorrido = updateViajesByRecorrido;
        vm.buy = buy;
        initController();

        function initController() {
            if($rootScope.backSchedules){
                vm.loadComboBranchsRoutes= true;
                vm.empresa = $rootScope.paramsBuy.empresa;
                updateRamalByEmpresa($rootScope.paramsBuy.empresa.Id);
                updateRecorridosByRamal($rootScope.paramsBuy.ramal.Id);   
                updateViajesByRecorrido($rootScope.paramsBuy.recorrido.Id);
                return;
            }
            vm.loadComboBranchsRoutes= false;
            vm.menssageEmpresa = false;
            if(!$rootScope.empresas){
                ResourcesService.GetEmpresas()
                .then(function (response) {
                    if (response){
                        $rootScope.empresas = response;      
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
        function buy(journey) {
            var paramsBuy= {};
            paramsBuy.recorrido = vm.recorrido;
            paramsBuy.empresa = vm.empresa;
            paramsBuy.ramal = vm.ramal;
            paramsBuy.journey = journey;
            $rootScope.paramsBuy = {};
            $rootScope.paramsBuy = paramsBuy; 
            $location.path('/buy');
        }
        function updateRamalByEmpresa(empresaId){
            if(empresaId != undefined){
                $rootScope.ramales = null;
                ResourcesService.GetRamalesByEmpresa(empresaId)
                .then(function (response) {
                    if (response){
                        vm.ramales = response;  
                        if($rootScope.backSchedules){
                          vm.ramal = $rootScope.paramsBuy.ramal;  
                        }                        
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
                vm.schedulesOk = false;
            }
        }
        function updateRecorridosByRamal(ramalId){
            if (ramalId != undefined) {
                $rootScope.recorridos = null;
                ResourcesService.GetRecorridosByEmpresaRamal(ramalId,vm.empresa.Id)
                .then(function (response) {
                    if (response){
                        vm.recorridos = response;      
                        if($rootScope.backSchedules){
                            vm.recorrido = $rootScope.paramsBuy.recorrido;  
                          }
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
        function updateViajesByRecorrido(recorridoId){
            $rootScope.journeys = null;
            if (recorridoId != undefined) {
                ResourcesService.GetViajesByRecorrido(recorridoId,vm.empresa.Id)
                .then(function (response) {
                    if (response){
                        vm.journeys = response;  
                        vm.schedulesOk = true;    
                    } 
                })
                .catch(function(error){
                    SweetAlert.swal ({
                        type: "error", 
                        title: "Error",
                        text: error,
                        confirmButtonAriaLabel: 'Ok',
                    });
                    vm.schedulesOk = false;
                });   
            }
        }
        vm.loadBranchsRoutes = function(empresa){
            vm.empresa = empresa;
            vm.loadComboBranchsRoutes = true;
            vm.updateRamalByEmpresa(empresa.Id);

        }
        vm.backLoadEmpresas = function (){
            vm.loadComboBranchsRoutes = false;
            vm.recorridos = null;
            vm.horarios=null;
            vm.ramales=null;
            vm.ramal=null;
            vm.menssageEmpresa = false;
            $rootScope.paramsBuy = null;
            $rootScope.backSchedules= null;
        }
        
    }

})();