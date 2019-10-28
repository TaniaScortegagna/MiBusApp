(function () {
    'use strict';

    angular
        .module('app')
        .controller('ModalBusStopController', ModalBusStopController);

        ModalBusStopController.$inject = ['$uibModalInstance', 'busStop', '$scope','$rootScope','ResourcesSetService','SweetAlert','ResourcesUpdateService','ResourcesDeleteService'];


    function ModalBusStopController($uibModalInstance, busStop, $scope,$rootScope,ResourcesSetService,SweetAlert,ResourcesUpdateService,ResourcesDeleteService) {
    var vm = $scope;
    
    getLocation(); 

    var marker;
    function onMapClick(e) {
        if(marker){
            vm.mymap.removeLayer(marker);
            marker = new L.Marker(e.latlng, {draggable:true});
            vm.mymap.addLayer(marker);
            marker.bindPopup("Nueva parada").openPopup();
        }
        else{
            marker = new L.Marker(e.latlng, {draggable:true});
            vm.mymap.addLayer(marker);
            marker.bindPopup("Nueva parada").openPopup();
        }
    };
    function loadMap(paramLat,paramLon){
        vm.mymap = L.map('mapid', {
            minZoom: 14
        }).setView([paramLat,paramLon], 13);            
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(vm.mymap);
       vm.mymap.on('click', onMapClick);
       vm.popup = L.popup();
    }
    function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(loadAreaCicle);
        } 
        else {
          alert("Geolocation is not supported by this browser.");
          return false;
        }
      }
      
      function loadAreaCicle(position) {
          loadMap(position.coords.latitude,position.coords.longitude);
          var circle = L.circle([position.coords.latitude,position.coords.longitude], {
              color: null,
              fillColor: '#f03',
              fillOpacity: 0.3,
              radius: 200
          }).addTo(vm.mymap);
      }
    vm.okBusStopCreate = function () {
        $uibModalInstance.close();
    };  
    vm.cancelBusStopsModal = function () {
        $uibModalInstance.close();
    };  
    if(busStop.edit){
        vm.busStopEdit = {};
        vm.busStopEdit.name = busStop.Nombre;
        vm.busStopEdit.description = busStop.Descripcion;
    }
    if(busStop.delete){
        vm.idBusStop = busStop.Id;
        vm.busStopDelete = busStop;
    }
    
    vm.setBusStops = function(busStopCreate) {
        vm.dataLoading = true;
        var data ={
            Nombre: busStopCreate.name,
            Descripcion: busStopCreate.description,
            EmpresaId:  $rootScope.globals.currentUser.userData.EmpresaId
        }
        ResourcesSetService.SetParada(data)
            .then(function (response) {
                if (response.Estado == 0){
                    SweetAlert.swal ({
                        type: "success", 
                        title: "La operacion se ha realizado con exito",
                        text: "El item ha sido creado",
                        confirmButtonAriaLabel: 'Ok',
                    },
                    function(isConfirm) {
                    if (isConfirm) {
                        vm.dataLoading = false;
                        $rootScope.$emit("refreshListBusStops","ok");
                        $uibModalInstance.close();
                    } 
                    });               
                    return;
                } 
                else {
                    vm.dataLoading = false;
                    SweetAlert.swal ({
                        type: "error", 
                        title: "Error",
                        text: "Error al crear el item",
                        confirmButtonAriaLabel: 'Ok',
                    });
                }
            })
            .catch(function(error){
                vm.dataLoading = false;
                SweetAlert.swal ({
                    type: "error", 
                    title: "Error",
                    text: error,
                    confirmButtonAriaLabel: 'Ok',
                });
            });
     }
    function clearRegister(){
        vm.user=null;
    }
    vm.updateBusStops = function(busStopEdit){
        vm.dataLoading = true;
        var data ={
            Nombre: busStopEdit.name,
            Descripcion: busStopEdit.description,
            EmpresaId:  $rootScope.globals.currentUser.userData.EmpresaId,
            Id: busStop.Id
        }
        ResourcesUpdateService.UpdateParada(data)
            .then(function (response) {
                if (response.Estado == 0){
                    SweetAlert.swal ({
                        type: "success", 
                        title: "La operacion se ha realizado con exito",
                        text: "El item ha sido creado",
                        confirmButtonAriaLabel: 'Ok',
                    },
                    function(isConfirm) {
                    if (isConfirm) {
                        vm.dataLoading = false;
                        $rootScope.$emit("refreshListBusStop","ok");
                        $uibModalInstance.close();
                    } 
                    });               
                    return;
                } 
                else {
                    vm.dataLoading = false;
                    SweetAlert.swal ({
                        type: "error", 
                        title: "Error",
                        text: "Error al crear el item",
                        confirmButtonAriaLabel: 'Ok',
                    });
                }
            })
            .catch(function(error){
                vm.dataLoading = false;
                SweetAlert.swal ({
                    type: "error", 
                    title: "Error",
                    text: error,
                    confirmButtonAriaLabel: 'Ok',
                });
            });
    }
    vm.deleteBusStops = function(busStopDelete){
        vm.dataLoading = true;
        ResourcesDeleteService.Parada(vm.idBusStop)
        .then(function (response) {
            if (response.Estado == 0){
                SweetAlert.swal ({
                    type: "success", 
                    title: "La operacion se ha realizado con exito",
                    text: "El item ha sido eliminado",
                    confirmButtonAriaLabel: 'Ok',
                },
                function(isConfirm) {
                if (isConfirm) {
                    vm.dataLoading = false;
                    $rootScope.$emit("refreshListBusStop","ok");
                    $uibModalInstance.close();
                } 
                });               
                return;                
            } 
            else {
                vm.dataLoading = false;
                SweetAlert.swal ({
                    type: "error", 
                    title: "Error",
                    text: "Error al eliminar",
                    confirmButtonAriaLabel: 'Ok',
                });
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
    }


}

})();
