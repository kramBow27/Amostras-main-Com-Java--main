define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('Telemetria', 'Bairro', 'bairroId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $state, $stateParams, $injector, TelemetriaService, ngNotify) {
            var modelService = $injector.get(controller.serviceName);
            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            // Configura a tabela
            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            $scope.bairroId = $stateParams.bairroId;
            $scope.ocorrenciaTelemetriaId = $stateParams.ocorrenciaTelemetriaId;

            TelemetriaService.obterBairro($stateParams.bairroId)
                .then(function (response) {
                    $scope.item = response.data;
                },
                function (error) {
                    ngNotify.set('Registro não encontrado', 'error');
                    $scope.remoteErrors = errorService.parseErrors(error);
                    $state.go(controller.moduleName + '.lista');
                });

            $scope.excluir = function (response) {
                TelemetriaService.excluir($scope.bairroId)
                   .then(function (response) {
                       ngNotify.set('Registro excluído com sucesso', 'success');
                       $state.go('telemetria.detalhes', { ocorrenciaTelemetriaId: $scope.item.setorAbastecimentoId});
                   });
            };

            $scope.cancelar = function () {
                $state.go('telemetria.detalhes', { ocorrenciaTelemetriaId: $scope.item.setorAbastecimentoId });
            }
        });
});

