(function () {
    'use strict';

    angular
        .module('app')
        .controller('AdminVehiclesController', AdminVehiclesController);

    AdminVehiclesController.$inject = ['UserService', '$rootScope', '$scope', '$uibModal', 'ResourcesSetService', 'ResourcesService', 'SweetAlert', '$filter'];


    function AdminVehiclesController(UserService, $rootScope, $scope, $uibModal, ResourcesSetService, ResourcesService, SweetAlert, $filter) {
        var vm = $scope;
        vm.openModalVehiclesCreate = openModalVehiclesCreate;
        vm.openModalVehiclesEdit = openModalVehiclesEdit;
        vm.openModalVehiclesDelete = openModalVehiclesDelete;
        vm.formatDate = formatDate;
        vm.dateToday = new Date();
        initController();
        function initController() {
            getMarcas();
            getModelos();
            getVehiculosByEmpresa();
        }

        $rootScope.$on("refreshListVehicles", function (evt, data) {
            getVehiculosByEmpresa();
        });
   
        function getVehiculosByEmpresa() {
            $scope.vehicles = [];
            $scope.filtroVehicles = [];
            $scope.currentPage = 1;
            $scope.numPerPage = 10;
            $scope.inicializar = function () {
                ResourcesService.GetVehiculosByEmpresa($rootScope.globals.currentUser.userData.EmpresaId)
                    .then(function (response) {
                        if (response) {
                            $scope.vehicles = response;
                            $rootScope.vehicles = response;          //por las dudas que lo use en otro lado                          
                            $scope.hacerPagineo($scope.vehicles);
                            $scope.totalVehicles = $scope.vehicles.length;
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
                $scope.filtroVehicles = arreglo.slice(principio, fin);
            };

            $scope.buscar = function (busqueda) {
                var buscados = $filter('filter')($scope.vehicles, function (item) {
                    return (item.MarcaNombre.toLowerCase().indexOf(busqueda.toLowerCase()) != -1);
                });
                $scope.totalVehicles = buscados.length;
                $scope.hacerPagineo(buscados);
            };

            $scope.$watch('currentPage', function () {
                $scope.hacerPagineo($scope.vehicles);
            });
        }

        function getMarcas() {
            ResourcesService.GetMarcas()
                .then(function (response) {
                    if (response) {
                        $rootScope.brands = response;
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
        function getModelos() {
            ResourcesService.GetModelos()
                .then(function (response) {
                    if (response) {
                        $rootScope.allModels = response;
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
        vm.updateModelsByBrand = function (brand) {
            ResourcesService.GetModelosByMarca(brand.Id)
                .then(function (response) {
                    if (response) {
                        $rootScope.models = response;
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
        function formatDate(date) {
            var dateOut = date.replace(/([A-Za-z)(\\/])/g, "");
            return dateOut;
        };
        function openModalVehiclesCreate() {
            var vehicleCreate = {};
            vehicleCreate.create = true;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'partials/admin-vehicles/modal-vehicles-create.view.html',
                controller: 'ModalVehiclesController',
                size: 'lg',
                windowClass: 'show',
                backdrop: 'static',
                resolve: {
                    vehicle: function () {
                        return vehicleCreate;
                    }
                }
            });
        }
        function openModalVehiclesEdit(vehicleEdit) {
            vehicleEdit.edit = true;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'partials/admin-vehicles/modal-vehicles-edit.view.html',
                controller: 'ModalVehiclesController',
                size: 'lg',
                windowClass: 'show',
                backdrop: 'static',
                resolve: {
                    vehicle: function () {
                        return vehicleEdit;
                    }
                }
            });
        }
        function openModalVehiclesDelete(vehicleDelete) {
            vehicleDelete.delete = true;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'partials/admin-vehicles/modal-vehicles-delete.view.html',
                controller: 'ModalVehiclesController',
                size: 'lg',
                windowClass: 'show',
                backdrop: 'static',
                resolve: {
                    vehicle: function () {
                        return vehicleDelete;
                    }
                }
            });
        }

    }


})();