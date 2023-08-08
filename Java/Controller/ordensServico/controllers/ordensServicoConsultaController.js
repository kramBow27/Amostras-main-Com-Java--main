define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'Consulta', 'tipoBusca');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $http, $state, $stateParams, OrdensServicoService, errorsValidationService) {

            // --- Declaração de variáveis básicas

            // Variável de campos de busca.
            $scope.camposBuscaOs = {};

            // Parâmetro que define o tipo de consulta (via URL).
            $scope.tipoConsulta = $stateParams.tipoConsulta;


            // --- Obtenção de dados

            // Define o tipo de consulta para mostrar na interface. Caso seja necessário, realiza consultas secundárias à API para obteção de alguns dados.
            switch ($scope.tipoConsulta) {

                // Busca por número da OS.
                case "1":
                    $scope.tipoConsultaTexto = "por Número";

                    OrdensServicoService.verificarDataAtualServer()
                    .then(function (response) {
                        var dataAtual = new Date(response.data);
                        
                        $scope.camposBuscaOs.anoOrdemServico = dataAtual.getFullYear();
                    })

                    break;
            }

            // Executa a busca pela Ordem de Serviço.
            $scope.consultarOrdemServico = function () {
                switch ($scope.tipoConsulta) {

                    // Busca por número da OS.
                    case "1":
                        OrdensServicoService.consultarExistenciaOrdemServico($scope.camposBuscaOs.ordemServico, $scope.camposBuscaOs.anoOrdemServico)
                            .then(function (response) {
                                $state.go("ordensServico.editar.geral.chamados", { ordemServicoId: response.data });
                            }, function (error) {
                                $scope.formErrors = errorsValidationService.parseErrors(error.data);
                            });
                        break;
                }
            }

        });
});
