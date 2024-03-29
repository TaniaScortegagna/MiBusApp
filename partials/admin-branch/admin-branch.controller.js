(function () {
    'use strict';

    angular
        .module('app')
        .controller('AdminBranchController', AdminBranchController);

        AdminBranchController.$inject = ['UserService', '$rootScope', '$scope','$uibModal','ResourcesSetService','ResourcesService','SweetAlert','$filter'];


    function AdminBranchController(UserService, $rootScope, $scope,$uibModal,ResourcesSetService,ResourcesService,SweetAlert,$filter) {
        var vm = $scope;     
        vm.openModalBranchCreate = openModalBranchCreate;
        vm.openModalBranchEdit = openModalBranchEdit;
        vm.openModalBranchDelete = openModalBranchDelete;    
        vm.formatDate = formatDate;
        vm.dateToday = new Date();
        
        initController();        
        function initController(){
            getRamalesByEmpresa();
        }

        $rootScope.$on("refreshListBranch", function(evt,data){ 
            getRamalesByEmpresa();
        });

        function formatDate(date){
            var dateOut = date.replace(/([A-Za-z)(\\/])/g, "");
            return dateOut;
        };
        function openModalBranchCreate(){
            var ramalCreate = {};
            ramalCreate.create = true;
            ramalCreate.edit =false;
            ramalCreate.delete = false;
            var modalInstance = $uibModal.open({
                animation:true,
                templateUrl: 'partials/admin-branch/modal-branch-create.view.html',
                controller: 'ModalBranchController',
                size: 'lg',
                windowClass: 'show',
                backdrop: 'static',
                resolve: {
                  ramal: function () {
                    return ramalCreate;
                  }
                }
              });
        }
        function openModalBranchEdit(ramalEdit){
            ramalEdit.edit=true;
            var modalInstance = $uibModal.open({
                animation:true,
                templateUrl: 'partials/admin-branch/modal-branch-edit.view.html',
                controller: 'ModalBranchController',
                size: 'lg',
                windowClass: 'show',
                backdrop: 'static',
                resolve: {
                  ramal: function () {
                    return ramalEdit;
                  }
                }
              });
        }
        function openModalBranchDelete(ramalDelete){
            ramalDelete.delete = true;
            var modalInstance = $uibModal.open({
                animation:true,
                templateUrl: 'partials/admin-branch/modal-branch-delete.view.html',
                controller: 'ModalBranchController',
                size: 'lg',
                windowClass: 'show',
                backdrop: 'static',
                resolve: {
                  ramal: function () {
                    return ramalDelete;
                  }
                }
              });
        }
     
        function getRamalesByEmpresa() {
            $scope.ramales = []; 
            $scope.filtroRamales = [];
            $scope.currentPage = 1;
            $scope.numPerPage = 10;
            $scope.inicializar = function () {
                ResourcesService.GetRamalesByEmpresa( $rootScope.globals.currentUser.userData.EmpresaId)
                .then(function (response) {
                        if (response) {
                            if (response) {
                                $scope.ramales = response;
                                $rootScope.ramales = response;          //por las dudas que lo use en otro lado
                                $scope.hacerPagineo($scope.ramales);
                                $scope.totalRamales = $scope.ramales.length;
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
                $scope.filtroRamales = arreglo.slice(principio, fin); 
            };

            $scope.buscar = function (busqueda) {
                var buscados = $filter('filter')($scope.ramales, function (item) {
                    return (item.Nombre.toLowerCase().indexOf(busqueda.toLowerCase()) != -1); 
                });
                $scope.totalRamales = buscados.length;
                $scope.hacerPagineo(buscados);
            };

            $scope.$watch('currentPage', function () {
                $scope.hacerPagineo($scope.ramales);
            });
        }

}


})();