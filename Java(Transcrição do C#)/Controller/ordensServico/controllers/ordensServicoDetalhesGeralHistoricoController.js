define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'DetalhesGeralHistorico', 'ordemServicoId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $http, ChamadosService, OrdensServicoService) {

            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            $scope.ordemServicoDetalhes = {};

            $scope.dadosOs = OrdensServicoService.getDados();

            ChamadosService.consultarHistoricoOrdemServico($scope.dadosOs.ordemServicoId)
                .then(function (response) {
                    $scope.ordemServicoDetalhes.historico = response.data;
                })

            $scope.$parent.tabActive = 4;

        });
});
