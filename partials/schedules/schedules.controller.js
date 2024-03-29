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
        vm.today = new Date();
        initController();
        $rootScope.stopTimer();
        function initController() {
            vm.disabledDays = true;
            if(!vm.days){
                getDays();
            }
            if($rootScope.backSchedules){
                vm.loadComboBranchsRoutes= true;
                vm.disabledDays = false;
                vm.paramsBuy = angular.copy($rootScope.paramsBuy);
                $rootScope.paramsBuy = null;
                vm.empresa = vm.paramsBuy.empresa;
                updateRamalByEmpresa(vm.paramsBuy.empresa.Id);
                return;
            }
            vm.loadComboBranchsRoutes= false;
            vm.menssageEmpresa = false;
            $scope.empresas = []; 
            $scope.filtroEmpresas = [];
            $scope.currentPage = 1;
            $scope.numPerPage = 5;
            $scope.inicializar = function () {
                ResourcesService.GetEmpresas()
                    .then(function (response) {
                        if (response) {
                            if (response) {
                                $scope.empresas = response;
                                $rootScope.empresas = response;      
                                $scope.hacerPagineo($scope.empresas);
                                $scope.totalEmpresas = $scope.empresas.length;
                            }

                        }
                    })
                    .catch(function (error) {
                        SweetAlert.swal({
                            type: "error",
                            title: "Error",
                            text: error,
                            confirmButtonAriaLabel: 'Ok',
                        });
                    });
            };
            $scope.inicializar();

            $scope.hacerPagineo = function (arreglo) {
                var principio = (($scope.currentPage - 1) * $scope.numPerPage); 
                var fin = principio + $scope.numPerPage; 
                $scope.filtroEmpresas = arreglo.slice(principio, fin);  
            };

            $scope.buscar = function (busqueda) {
                var buscados = $filter('filter')($scope.empresas, function (empresa) {
                    return (empresa.Nombre.toLowerCase().indexOf(busqueda.toLowerCase()) != -1); 
                });
                $scope.totalEmpresas = buscados.length;
                $scope.hacerPagineo(buscados);
            };

            $scope.$watch('currentPage', function () {
                $scope.hacerPagineo($scope.empresas);
            });
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
            vm.journeysCopy = null;
            $scope.journeys = null;
            vm.day=null;
            vm.filtroJourneys = null;
            vm.ramales = null;
            vm.recorrido = null;
            vm.disabledDays = true;
            if(empresaId != undefined){                
                ResourcesService.GetRamalesByEmpresa(empresaId)
                .then(function (response) {
                    if (response){
                        vm.ramales = response;  
                        if($rootScope.backSchedules){
                            if( $filter('filter')(vm.ramales, {Id:  vm.paramsBuy.ramal.Id}).length > 0){
                                vm.ramal = vm.paramsBuy.ramal;  
                                vm.disabledDays = false;
                                updateRecorridosByRamal(vm.ramal.Id);
                                return;
                            } 
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
            vm.journeysCopy = null;
            $scope.journeys = null;
            vm.filtroJourneys = null;
            vm.day=null;
            vm.recorridos = null;
            vm.disabledDays = true;
            if (ramalId != undefined) {
                ResourcesService.GetRecorridosByEmpresaRamal(ramalId,vm.empresa.Id)
                .then(function (response) {
                    if (response){
                        vm.recorridos = response;    
                        if($rootScope.backSchedules){
                            if( $filter('filter')(vm.recorridos, {Id:  vm.paramsBuy.recorrido.Id}).length > 0){
                                vm.recorrido = vm.paramsBuy.recorrido;  
                                vm.disabledDays = false;
                                updateViajesByRecorrido(vm.recorrido.Id);
                                return;
                            }                            
                        }
                        vm.disabledDays = true;
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
            vm.journeysCopy = null;
            $scope.filtroJourneys = null;
            vm.journeys = null;
            vm.day=null;
            vm.disabledDays = true;
            if (recorridoId != undefined) {
                $scope.journeys = []; 
                    ResourcesService.GetViajesByRecorrido(recorridoId,vm.empresa.Id)
                    .then(function (response) {
                            if (response) {
                                if (response) {
                                    vm.journeys = response;  
                                    vm.journeysCopy = angular.copy(vm.journeys);  
                                    $scope.filtroJourneys = response;
                                    vm.disabledDays = false;
                                    vm.schedulesOk = true;   
                            
                                }
    
                            }
                        })
                        .catch(function (error) {
                            SweetAlert.swal({
                                type: "error",
                                title: "Error",
                                text: error,
                                confirmButtonAriaLabel: 'Ok',
                            });
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
            vm.filtroEmpresas = $rootScope.empresas;
        }
        vm.formatDate = function(date){
            if(date){
                var dateOut = date.replace(/([A-Za-z)(\\/])/g, "");
                return dateOut;
            }
            else{
                return $filter('date')(new Date, 'dd-MM-yyyy');
            }

        };
        function getDays(){
            ResourcesService.GetDias()
            .then(function (response) {
                if (response){                  
                   $rootScope.days = response;     
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
        };
        vm.filterByDayJourney = function(day){
            if(day != undefined){
                $scope.filtroJourneys = $filter('filter')(vm.journeysCopy, {DiaNombre:  day.Nombre});
            }
            else{
                $scope.filtroJourneys = vm.journeysCopy;
            }
        }
    }

})();