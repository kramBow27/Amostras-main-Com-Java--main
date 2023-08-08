define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'EditarGeralChamados', 'ordemServicoId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $http, ChamadosService, OrdensServicoService) {

            $scope.ordemServicoDetalhes = {};
            $scope.tipoIntegracaoSistema = 1;

            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            $scope.dadosOs = OrdensServicoService.getDados();

            ChamadosService.consultarChamadosOrdemServico($scope.dadosOs.ordemServicoId)
                .then(function (response) {
                    $scope.ordemServicoDetalhes.chamados = response.data;
                    $scope.tipoIntegracaoSistema = response.data[0].tipoIntegracaoSistema;
                })

            $scope.$parent.tabActive = 1;

        });
});
