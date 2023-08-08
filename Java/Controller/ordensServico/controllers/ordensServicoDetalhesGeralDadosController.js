define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'DetalhesGeralDados', 'ordemServicoId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $state, $injector, $http, ChamadosService, OrdensServicoService) {
            $scope.ordemServicoDetalhes = {};

            $scope.dadosOs = OrdensServicoService.getDados();

            ChamadosService.consultarOrdemServicoCompleta($scope.dadosOs.ordemServicoId)
                .then(function (response) {
                    $scope.ordemServicoDetalhes.detalhesOs = response.data;
                })

            $scope.$parent.tabActive = 1;

        });
});
