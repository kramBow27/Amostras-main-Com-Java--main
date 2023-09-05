define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'DetalhesGeralEventos', 'ordemServicoId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $http, ChamadosService, OrdensServicoService) {

            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            $scope.ordemServicoDetalhes = {};

            $scope.dadosOs = OrdensServicoService.getDados();

            ChamadosService.consultarEventosOrdemServico($scope.dadosOs.ordemServicoId)
                .then(function (response) {
                    $scope.ordemServicoDetalhes.eventos = response.data;
                })

            $scope.tipoEventoClasse = function (status) {
                if (status == "Cancelado") {
                    return "danger";
                }
                else if (status == "Aberto") {
                    return "warning"
                }
                else if (status == "Em Execução") {
                    return "success"
                };
            };

            $scope.$parent.tabActive = 3;

        });
});
