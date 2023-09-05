define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'Editar', 'ordemServicoId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $state, ngNotify, fileDownloadService, OrdensServicoService, dadosOs) {
            
            // --- Declaração de variáveis básicas

            // Aba selecionada inicial.
            $scope.abaAtiva = 1;

            // Prepara o objeto de ações adicionais da página para o menu ações.
            $scope.acoesAdicionais = {
                itens: [
                    { descricao: "Imprimir O.S.", link: "#modalImpressaoOrdemServico", toggle: "modal" },
                    { descricao: "Imprimir O.S. Executada", link: "#modalImpressaoOrdemServicoExecutada", toggle: "modal" },
                    { descricao: "Imprimir Fotos do Evento", link: "#modalImpressaoDocumentosOrdemServico", toggle: "modal" }
                ]
            };

            // Busca os dados da OS, consultados durante o Resolve da rota, e os deposita numa variável.
            OrdensServicoService.setDados(dadosOs.data);
            $scope.ordemServicoDetalhes = dadosOs.data;


            // --- Obtenção de dados

            // Se houver uma ligação atrelada a OS, busca os dados da mesma.
            //if ($scope.ordemServicoDetalhes.cdc) {
            //    OrdensServicoService.consultaLigacao($scope.ordemServicoDetalhes.cdc)
            //        .then(function (response) {
            //            $scope.dadosLigacao = response.data;
            //        })
            //}


            // --- Funções e operações pós obtenção de dados.

            // Imprime ordem de serviço
            $scope.gerarOrdemServico = function () {
                fileDownloadService.get('Api/OrdensServico/' + $scope.ordemServicoDetalhes.ordemServicoId + '/Impressao', "OrdemServico" + $scope.ordemServicoDetalhes.ordemServicoId, "pdf");
            }

            // Imprime ordem de serviço Executada
            $scope.gerarOrdemServicoExecutada = function () {
                fileDownloadService.get('Api/OrdensServico/' + $scope.ordemServicoDetalhes.ordemServicoId + '/Impressao?ordemServicoId=' + $scope.ordemServicoDetalhes.ordemServicoId + '&executada=true', "OrdemServico", "pdf");
            }

            // Imprime os documentos da ordem de serviço
            $scope.imprimirDocumentosOrdemServico = function (ordemServicoId) {
                fileDownloadService.get('Api/OrdensServico/Documentos?ordemServicoId=' + $scope.ordemServicoDetalhes.ordemServicoId, "DocumentosOS", "pdf");
            }

        });
});
