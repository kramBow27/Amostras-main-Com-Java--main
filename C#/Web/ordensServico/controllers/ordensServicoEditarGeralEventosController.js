define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'EditarGeralEventos', 'ordemServicoId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $http, ChamadosService, OrdensServicoService, ngNotify) {

            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withOption('order', [])
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
            
            $scope.desabilitarNovoEvento = function () {
                if ($scope.dadosOs.statusId == 3 || $scope.dadosOs.statusId == 4 || $scope.dadosOs.statusId == 5) {
                    return true;
                }
                return false;
            }

            $scope.operar = function (eventoId, operacao) {
                ChamadosService.getExecutarManutencaoCronograma(eventoId, operacao)
                    .then(function (response) {
                        ngNotify.set(response.data, 'success');
                        ChamadosService.consultarEventosOrdemServico($scope.dadosOs.ordemServicoId)
                            .then(function (response) {
                                $scope.ordemServicoDetalhes.eventos = response.data;
                            })
                    })
            }

            $scope.$parent.tabActive = 2;

        });
});
