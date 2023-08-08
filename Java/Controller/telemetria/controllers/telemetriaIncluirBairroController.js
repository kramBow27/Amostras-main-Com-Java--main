define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('Telemetria', 'IncluirBairro', 'ocorrenciaTelemetriaId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $state, $stateParams, $injector, TelemetriaService, ngNotify) {
            var modelService = $injector.get(controller.serviceName);
            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            // Configura a tabela
            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            $scope.item = {};

            $scope.item.setorAbastecimentoId = $stateParams.ocorrenciaTelemetriaId;

            $scope.gravar = function () {
                TelemetriaService.postBairro($scope.item)
                    .then(function (response) {
                        ngNotify.set('Registro incluído com sucesso', 'success');
                        $state.go('telemetria.detalhes', { ocorrenciaTelemetriaId: $scope.item.setorAbastecimentoId });
                    });
            }

            $scope.verificaInputZona = function (centroId) {
                if (centroId == null) {
                    $scope.item.zonaAbastecimentoId = null
                };
            };

            $scope.cancelar = function () {
                $state.go('telemetria.detalhes', { ocorrenciaTelemetriaId: $scope.item.setorAbastecimentoId });
            }
        });
});

