define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'DetalhesGeralChamados', 'ordemServicoId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $http, ChamadosService, OrdensServicoService) {

            $scope.ordemServicoDetalhes = {};

            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            $scope.dadosOs = OrdensServicoService.getDados();

            ChamadosService.consultarChamadosOrdemServico($scope.dadosOs.ordemServicoId)
                .then(function (response) {
                    $scope.ordemServicoDetalhes.chamados = response.data;
                })

            $scope.$parent.tabActive = 2;

        });
});
