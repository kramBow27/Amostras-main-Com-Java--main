define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('ListaOpcoesColetor', 'Incluir');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $state, $stateParams, $injector, $rootScope, ngNotify, ListaOpcoesColetorService) {
            var errorService = $injector.get("coreService");
            var modelService = $injector.get(controller.serviceName);

            $scope.item = {};

            var onResponseErrorListener = $rootScope.$on("responseError", function (event, responseErrors) {
                $scope.remoteErrors = responseErrors;
            });

            $scope.gravar = function () {
                ListaOpcoesColetorService.criar($scope.item)
                    .then(function (response) {
                        ngNotify.set('Registro incluído com sucesso', 'success');
                        console.log(response);
                        $state.go('opcoesListaColetor.incluir', { id: response.data.listaOpcaoColetorId });
                    });
            }

            $scope.cancelar = function () {
                history.back();
            }

            $scope.campoValido = function (campo) {
                if (!campo) return false;
                return campo.$invalid && !campo.$pristine;
            };


            $scope.$on("$destroy", onResponseErrorListener);
        });
});
