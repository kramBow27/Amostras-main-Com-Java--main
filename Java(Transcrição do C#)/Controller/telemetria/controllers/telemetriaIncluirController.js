define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('Telemetria', 'Incluir');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $state, $stateParams, $injector, $rootScope, ngNotify, TelemetriaService) {
            var errorService = $injector.get("coreService");
            var modelService = $injector.get(controller.serviceName);

            $scope.item = {};

            var onResponseErrorListener = $rootScope.$on("responseError", function (event, responseErrors) {
                $scope.remoteErrors = responseErrors;
            });

            $scope.gravar = function () {
                TelemetriaService.postOcorrencia($scope.item)
                    .then(function (response) {
                        ngNotify.set('Registro incluído com sucesso', 'success');
                        $state.go('telemetria.detalhes', { ocorrenciaTelemetriaId: response.data.setorAbastecimentoId });
                    });
            }

            $scope.cancelar = function () {
                history.back();
            }

            $scope.campoValido = function (campo) {
                if (!campo) return false;
                return campo.$invalid && !campo.$pristine;
            };

            $scope.validar = function (item) {
                if ((item.logradouroId == null || item.logradouroId == "")
                    && (item.bairroId == null || item.bairroId == "")
                    && (item.zonaAbastecimentoId == null || item.zonaAbastecimentoId == "")
                    && (item.centroReservacaoId == null || item.centroReservacaoId == "")) {
                    return true;
                }
            }

            $scope.$on("$destroy", onResponseErrorListener);
        });
});
