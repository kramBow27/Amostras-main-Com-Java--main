define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'Detalhes', 'ordemServicoId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $stateParams, $injector, OrdensServicoService, fileDownloadService, dadosOs, ChamadosService, ngNotify) {
            
            $scope.ordemServicoDetalhes = {};

            $scope.cancelarOs = {};

            $scope.abaAtiva = 1;

            $scope.ordemServicoCancelamento = {};

            OrdensServicoService.setDados(dadosOs.data);
            $scope.ordemServicoDetalhes.dadosOs = dadosOs.data;

            //if ($scope.ordemServicoDetalhes.dadosOs.cdc) {
            //    OrdensServicoService.consultaLigacao($scope.ordemServicoDetalhes.dadosOs.cdc)
            //        .then(function (response) {
            //            $scope.dadosLigacao = response.data;
            //        })
            // }

            $scope.acoesAdicionais = {
                itens: [
                    { descricao: "Imprimir O.S.", link: "#modalImpressaoOrdemServico", toggle: "modal" },
                    { descricao: "Imprimir O.S. Executada", link: "#modalImpressaoOrdemServicoExecutada", toggle: "modal" },
                    { descricao: "Imprimir Fotos do Evento", link: "#modalImpressaoDocumentosOrdemServico", toggle: "modal" }
                ]
            };
           
            // Determina uma classe para destaque na tabela.
            $scope.statusOsClasse = function (status) {
                if (status == "Aberta") {
                    return "yellow";
                } else if (status == "Em Execução") {
                    return "green";
                } else if (status == "Cancelada") {
                    return "red";
                } else {
                    return "blue";
                }
            };

            $scope.gerarOrdemServico = function (ordemServicoId) {
                window.open('impressao.html#/ordemservico/' + $scope.ordemServicoDetalhes.dadosOs.ordemServicoId, '_blank');
            };

            $scope.imprimirDocumentosOrdemServico = function (ordemServicoId) {
                fileDownloadService.get('Api/OrdensServico/Documentos?ordemServicoId=' + $scope.ordemServicoDetalhes.dadosOs.ordemServicoId, "DocumentosOS", "pdf");
            };

            $scope.abrirModalCancelamentoOs = function () {
               $('#modalCancelamentoOrdemServico').modal('show');
            };

            $scope.executarCancelamentoOS = function () {
                var model = {
                    ordemServicoId: $scope.ordemServicoDetalhes.dadosOs.ordemServicoId,
                    ocorrenciaId: $scope.ordemServicoCancelamento.ocorrenciaId,
                    observacao: $scope.ordemServicoCancelamento.observacao
                };

                ChamadosService
                    .cancelarOrdemServico(model)
                    .then(function (response) {
                        ngNotify.set(response.data, "success")
                        $scope.cancelarOs = {};
                        ChamadosService.consultarOrdemServico($stateParams.ordemServicoId)
                        .then(function (response) {
                            OrdensServicoService.setDados(response.data);
                            $scope.ordemServicoDetalhes.dadosOs = response.data;
                        })
                    });
            };

            $scope.limparDadosCancelamentoOS = function () {
                $scope.cancelarOs = {};
            };

        });
});
