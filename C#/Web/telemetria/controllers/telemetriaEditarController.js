define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('Telemetria', 'Editar', 'ocorrenciaTelemetriaId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $state, $stateParams, $injector, $rootScope, ngNotify, TelemetriaService) {
            var errorService = $injector.get("coreService");
            var modelService = $injector.get(controller.serviceName);

            $scope.item = {};

            var onResponseErrorListener = $rootScope.$on("responseError", function (event, responseErrors) {
                $scope.remoteErrors = responseErrors;
            });

            TelemetriaService.obterOcorrencia($stateParams.ocorrenciaTelemetriaId)
                           .then(function (response) {
                               $scope.item = response.data;
                           },
                           function (error) {
                               ngNotify.set('Registro não encontrado', 'error');
                               $scope.remoteErrors = errorService.parseErrors(error);
                           });

            $scope.gravar = function () {
                TelemetriaService.editarOcorrencia($scope.item)
                    .then(function (response) {
                        ngNotify.set('Registro atualizado com sucesso', 'success');
                        $state.go('telemetria.detalhes', { ocorrenciaTelemetriaId: $stateParams.ocorrenciaTelemetriaId });
                    });
            };

            $scope.campoValido = function (campo) {
                if (!campo) return false;
                return campo.$invalid && !campo.$pristine;
            };

            $scope.cancelar = function () {
                history.back();
            };

            $scope.validar = function (item) {
                if ((item.logradouroId == null || item.logradouroId == "")
                    && (item.bairroId == null || item.bairroId == "")
                    && (item.centroReservacaoId == null || item.centroReservacaoId == "")) {
                    return true;
                }
            }
            $scope.verificaInputZona = function (centroId) {
                if (centroId == null) {
                    $scope.item.zonaAbastecimentoId = null
                };
            }
            $scope.$on("$destroy", onResponseErrorListener);
        });
});
