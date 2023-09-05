define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'Externas');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope,
            $injector,
            $state,
            $stateParams,
            $anchorScroll,
            $location,
            $http,
            localStorageService,
            ngNotify,
            errorsValidationService,
            OrdensServicoService,
            fileDownloadService,
            ChamadosService,
            fileDownloadServiceWeb) {

            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            $scope.item = {};
            $scope.tipoRecursoId = $stateParams.tipoRecursoId;
            $scope.passoAtivo = 1;
            $scope.dados = [];
            $scope.ordemServicoCancelamento = {};
            $scope.idsOrdensServicos = [];
            $scope.ordemServicoExecucao = {};
            $scope.ordensServicoCanceladasOuExecutadas = [];
            $scope.eventosEmExecucao = [];
            $scope.ordemServicoDetalhes = {};
            $scope.dtInstance = {};
            $scope.tipoIntegracaoSistema = 1;

            var ordensServicoId = [];
            var documentosSelecionados = [];

            var ordensServicoSelecionadas = [];

            OrdensServicoService.getDadosCamposGeracao($scope.tipoRecursoId)
                .then(function (response) {
                    $scope.modelPassosCamposGeracao = response.data;
                })

            // Gerencia a troca de abas ativas.
            $scope.ativarAba = function (passo) {
                $scope.passoAtivo = passo.passoId
            }

            $scope.pesquisarOrdemServico = function () {
                var model = {
                    tipoRecursoId: $scope.tipoRecursoId,
                    dadosCampos: []
                }

                for (var i = 0; i < $scope.modelPassosCamposGeracao.length; i++) {
                    for (var j = 0; j < $scope.modelPassosCamposGeracao[i].campos.length; j++) {
                        var id = $scope.modelPassosCamposGeracao[i].campos[j].campoId;
                        var dados = $scope.modelPassosCamposGeracao[i].campos[j].valor;

                        model.dadosCampos.push({
                            id: id,
                            dados: dados
                        })
                    }
                }

                OrdensServicoService.postOrdensServicoParaManutencao(model)
                    .then(function (response) {
                        $scope.ordensServico = response.data;
                        $scope.tipoIntegracaoSistema = response.data[0].tipoIntegracaoSistema;
                        if ($scope.ordensServico.length == '0') {
                            ngNotify.set('Registro não localizado!', 'error');
                        }
                    })
            }

            $scope.ordensServicoSelecionadas = ordensServicoSelecionadas;

            $scope.verificarOrdemServicoSelecionada = function (ordemServico) {
                for (var n = 0; n < $scope.ordensServicoSelecionadas.length; n++) {
                    if ($scope.ordensServicoSelecionadas[n] == ordemServico) {
                        return true;
                    }
                }
            }

            $scope.selecionarOrdemServico = function (ordemServico) {
                if ($scope.verificarOrdemServicoSelecionada(ordemServico)) {
                    $scope.ordensServicoSelecionadas.splice($scope.ordensServicoSelecionadas.indexOf(ordemServico), 1);

                    if (ordemServico.statusOs == 'Executada' || ordemServico.statusOs == 'Cancelada') {
                        $scope.ordensServicoCanceladasOuExecutadas.splice($scope.ordensServicoCanceladasOuExecutadas.indexOf(ordemServico), 1);
                    }

                    if (ordemServico.dataExecucaoEvento != null || ordemServico.dataCancelamentoEvento != null) {
                        $scope.eventosEmExecucao.splice($scope.eventosEmExecucao.indexOf(ordemServico), 1);
                    }
                }
                else {
                    $scope.ordensServicoSelecionadas.push(ordemServico);

                    if (ordemServico.statusOs == 'Executada' || ordemServico.statusOs == 'Cancelada') {
                        $scope.ordensServicoCanceladasOuExecutadas.push(ordemServico);
                    }

                    if (ordemServico.dataExecucaoEvento != null || ordemServico.dataCancelamentoEvento != null) {
                        $scope.eventosEmExecucao.push(ordemServico);
                    }
                }
            }

            $scope.modalChamados = function (ordemServico) {
                ChamadosService.consultarChamadosOrdemServico(ordemServico.ordemServicoId)
                    .then(function (response) {
                        $scope.ordemServicoDetalhes.chamados = response.data;
                        $scope.tipoIntegracaoSistema = response.data[0].tipoIntegracaoSistema;

                        $("#modalConsultaChamados").modal();
                    })
            }

            $scope.selecionarTodasOrdensServico = function (ordensServico) {
                ordensServico.forEach(function (ordemServico) {
                    if (!$scope.verificarOrdemServicoSelecionada(ordemServico)) {
                        $scope.ordensServicoSelecionadas.push(ordemServico);
                        $scope.ordensServicoCanceladasOuExecutadas.push(ordemServico);
                        $scope.eventosEmExecucao.push(ordemServico);
                    }
                })
            }

            $scope.limparTodasOrdensServico = function (ordensServico) {
                ordensServico.forEach(function (ordemServico) {
                    if ($scope.verificarOrdemServicoSelecionada(ordemServico)) {
                        $scope.ordensServicoSelecionadas.splice($scope.ordensServicoSelecionadas.indexOf(ordemServico), 1)
                        $scope.ordensServicoCanceladasOuExecutadas.splice($scope.ordensServicoCanceladasOuExecutadas.indexOf(ordemServico), 1)
                        $scope.eventosEmExecucao.splice($scope.eventosEmExecucao.indexOf(ordemServico), 1)
                    }
                })
            }

            $scope.confirmarCancelamentoModal = function (ordensServicoSelecionadas) {
                $("#modalCancelamentoOrdemServico").modal();
                $scope.ordensServicoSelecionadas = ordensServicoSelecionadas;
            }

            $scope.executarCancelamentoOS = function () {
                $scope.ordensServicoSelecionadas.forEach(function (os) {
                    $scope.idsOrdensServicos.push(os.ordemServicoId);
                })

                var model = {
                    ListaOrdensServico: $scope.idsOrdensServicos,
                    ocorrenciaId: $scope.ordemServicoCancelamento.ocorrenciaId,
                    observacao: $scope.ordemServicoCancelamento.observacao
                }

                OrdensServicoService.postCancelarOrdensServico(model)
                    .then(function (response) {
                        if (response.data) {
                            ngNotify.set(response.data, "success");
                        }
                        $("#modalCancelamentoOrdemServico").modal("hide");
                        $scope.ordemServicoCancelamento = {};
                        $scope.pesquisarOrdemServico();
                        $scope.ordensServicoSelecionadas = [];
                    })
            }

            $scope.confirmarExecucaoModal = function (ordensServicoSelecionadas) {
                $("#modalExecucaoOrdemServico").modal();
                $scope.ordensServicoSelecionadas = ordensServicoSelecionadas;
            }

            $scope.executarOS = function () {
                $scope.ordensServicoSelecionadas.forEach(function (os) {
                    $scope.idsOrdensServicos.push(os.ordemServicoId);
                })

                var model = {
                    listaOrdensServico: $scope.idsOrdensServicos,
                    dataInicioExecucao: $scope.ordemServicoExecucao.dataInicioExecucao,
                    dataTerminoExecucao: $scope.ordemServicoExecucao.dataTerminoExecucao,
                    observacao: $scope.ordemServicoExecucao.observacao
                }

                OrdensServicoService.postExecutarOrdensServico(model)
                    .then(function (response) {
                        if (response.data) {
                            ngNotify.set(response.data, "success");
                        }
                        $("#modalExecucaoOrdemServico").modal("hide");
                        $scope.ordemServicoExecucao = {};
                        $scope.pesquisarOrdemServico();
                        $scope.ordensServicoSelecionadas = [];
                    })

            }

            $scope.imprimirDocumentos = function () {
                var rota = "Api/OrdensServico/ListaDocumentos?";

                $scope.ordensServicoSelecionadas.forEach(function (os) {
                    rota = rota + 'ordensServicoId=' + os.ordemServicoId + '&';
                })

                fileDownloadService.get(rota, "ListaDocumentosOS", "pdf");
            }

            $scope.verificaStatusPagamentoOs = function (item) {

                console.log(item);

                if (item == "CCD") {
                    return "";
                }
                if (item == "CGP") {
                    return "GA";
                }
                if (item == "CGO") {
                    return "GP";
                }
                if (item == "CGC") {
                    return "GC";
                }
            }

            $scope.imprimirGrid = function () {
                var model = {
                    tipoRecursoId: $scope.tipoRecursoId,
                    dadosCampos: []
                };

                for (var i = 0; i < $scope.modelPassosCamposGeracao.length; i++) {
                    for (var j = 0; j < $scope.modelPassosCamposGeracao[i].campos.length; j++) {
                        var id = $scope.modelPassosCamposGeracao[i].campos[j].campoId;
                        var dados = $scope.modelPassosCamposGeracao[i].campos[j].valor;

                        model.dadosCampos.push({
                            id: id,
                            dados: dados
                        })
                    }
                };

                console.log(model);
                $http.post('Api/ManutencaoOrdensServico/ImprimirPesquisaOs', model)
                    .then(function (response) {
                        var file = {
                            arquivo: response.data.file,
                            nomeArquivo: "Pesquisa Consulta",
                            mimeType: "application/pdf"
                        };

                        console.log(file);

                        OrdensServicoService.imprimirDocumento(file)
                            .then(function (response) {
                                console.log(response);
                                fileDownloadServiceWeb.processarDownload(response, response.data.file);
                            })

                    })

            }

        });
});