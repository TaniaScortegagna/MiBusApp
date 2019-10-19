(function () {
    'use strict';

    angular
        .module('app')
        .factory('ResourcesService', ResourcesService);

        ResourcesService.$inject = ['$http','$q', '$cookies', '$rootScope', '$timeout'];
    function ResourcesService($http,$q ,$cookies, $rootScope, $timeout) {
        var service = {};

        service.GetTiposDNI = GetTiposDNI;
        service.GetEmpresas = GetEmpresas;
        service.GetRamalesByEmpresa = GetRamalesByEmpresa;
        service.GetRecorridosByRamal = GetRecorridosByRamal;
        service.GetHorariosByRecorrido = GetHorariosByRecorrido;
        service.GetParadasByRecorrido = GetParadasByRecorrido;
        service.GetParadas = GetParadas;

        return service;

        function GetTiposDNI() {

            var deferred = $q.defer();
            var urlGetTiposDNI ='http://www.mellevas.com.ar/api/tiposdni/getTiposDni';       
        
            var req = {
                method: 'GET',
                url: urlGetTiposDNI,
                headers: {
                  'Content-Type': 'application/json; charset=utf-8'
                }
            }
               
            $http(req)
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(error){
                    deferred.reject("Error al cargar los tipos de dni");
                });
                return deferred.promise;
        }
        function GetEmpresas() {
            var deferred = $q.defer();
            var urlGetEmpresas ='http://www.mellevas.com.ar/api/empresas/getEmpresas';       

            var req = {
                method: 'GET',
                url: urlGetEmpresas,
                headers: {
                  'Content-Type': 'application/json; charset=utf-8'
                }
            }       

            $http(req)
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(error){
                    deferred.reject("Error al cargar las empresas");
                });
                return deferred.promise;
        }
        function GetRamalesByEmpresa(empresaID) {
            var deferred = $q.defer();
            var urlGetRamales ='http://www.mellevas.com.ar/api/ramales/GetRamalesxEmpresa?empresaid=' + empresaID + '&token=' + 2019;//$rootScope.globals.currentUser.token;       
            var req = {
                method: 'GET',
                url: urlGetRamales,
                headers: {
                  'Content-Type': 'application/json; charset=utf-8'
                }
               }       
            $http(req)
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(error){
                    deferred.reject("Error al cargar los ramales");
                });
                return deferred.promise;
        }
        function GetRecorridosByRamal(ramalID) {
            var deferred = $q.defer();
            var urlGetRecorridos ='http://www.mellevas.com.ar/api/recorridos/GetRecorridosxRamal?ramalid=' + ramalID + '&token=' + 2019;//$rootScope.globals.currentUser.token;       
            
            var req = {
                method: 'GET',
                url: urlGetRecorridos,
                headers: {
                  'Content-Type': 'application/json; charset=utf-8'
                }
               }     
            
            $http(req)
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(error){
                    deferred.reject("Error al cargar los recorridos");
                });
                return deferred.promise;
        }
        function GetHorariosByRecorrido(recorridoID) {
            var deferred = $q.defer();
            var urlGetJson ='scripts/jsonData/horariosByRecorrido.json';       
        /*
            var req = {
                method: 'GET',
                url: urlGetTiposDNI,
                headers: {
                  'Content-Type': 'application/json; charset=utf-8'
                }
               }
        */       
            $http.get(urlGetJson)
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(error){
                    deferred.reject("Error al cargar los horarios");
                });
                return deferred.promise;
        }
        function GetParadasByRecorrido(recorridoID) {
            var deferred = $q.defer();
            var urlGetParadas ='https://www.mellevas.com.ar/api/paradas/GetParadasxRecorrido?recorridoid=' + recorridoID + '&token=' + 2019;//$rootScope.globals.currentUser.token;       
            
            var req = {
                method: 'GET',
                url: urlGetParadas,
                headers: {
                  'Content-Type': 'application/json; charset=utf-8'
                }
               }     
            
            $http(req)
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(error){
                    deferred.reject("Error al cargar las paradas");
                });
                return deferred.promise;
        }
        function GetParadas(){
            var deferred = $q.defer();
            var urlGetParadas ='https://www.mellevas.com.ar/api/paradas/getParadas?token=' + 2019;//$rootScope.globals.currentUser.token;       
        
            var req = {
                method: 'GET',
                url: urlGetParadas,
                headers: {
                  'Content-Type': 'application/json; charset=utf-8'
                }
            }
               
            $http(req)
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(error){
                    deferred.reject("Error al cargar las paradas");
                });
                return deferred.promise;
        }

    }

})();