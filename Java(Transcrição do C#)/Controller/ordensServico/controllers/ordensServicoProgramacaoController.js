define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'Programacao');

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
            fileDownloadServiceWeb,
            ChamadosService) {

            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withOption('order', [])
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            $scope.item = {};
            $scope.tipoRecursoId = $stateParams.tipoRecursoId;
            $scope.passoAtivo = 1;
            $scope.dados = [];
            $scope.idsOrdensServicos = [];
            $scope.eventosEmExecucao = [];
            $scope.dtInstance = {};
            $scope.dtInstanceEmExecucao = {};
            $scope.dadosProgramacaoOs = {};
            $scope.dadosProgramacaoColetorOs = {};
            $scope.tipoIntegracaoSistema = 1;
            $scope.utilizaColetor = false;
            $scope.utilizaImpressaoOsLista = false;
            $scope.ordemServicoDetalhes = {};
            $scope.tipoIntegracaoSistema = {};
            $scope.utilizaGeo = false;
            $scope.imprimeMapa = false;
            $scope.modelProgrmacao = {};

            $scope.descricaoLegendaVerde = {};
            $scope.descricaoLegendaAmarela = {};
            $scope.descricaoLegendaVermelha = {};
            $scope.descricaoLegendaBranca = {};

            var ordensServicoId = [];
            var documentosSelecionados = [];

            var ordensServicoSelecionadas = [];

            OrdensServicoService.getDadosCamposGeracao($scope.tipoRecursoId)
                .then(function (response) {
                    $scope.modelPassosCamposGeracao = response.data;
                })

            OrdensServicoService.obterFlagGEO()
                .then(function (response) {
                    $scope.utilizaGeo = response.data;
                })

            // Gerencia a troca de abas ativas.
            $scope.ativarAba = function (passo) {
                $scope.passoAtivo = passo.passoId
            }

            $scope.pesquisarOrdemServico = function () {
                $scope.ordensServicoSelecionadas = [];

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

                OrdensServicoService.postOrdensServicoParaProgramacao(model)
                    .then(function (response) {
                        $scope.ordensServico = response.data;

                            $scope.tipoIntegracaoSistema = response.data[0].tipoIntegracaoSistema;
                            $scope.utilizaColetor = response.data[0].utilizaColetor;
                            $scope.utilizaImpressaoOsLista = response.data[0].utilizaImpressaoOsLista;

                            $scope.descricaoLegendaVerde = response.data[0].descricaoLegendaVerde;
                            $scope.descricaoLegendaAmarela = response.data[0].descricaoLegendaAmarela;
                            $scope.descricaoLegendaVermelha = response.data[0].descricaoLegendaVermelha;
                            $scope.descricaoLegendaBranca = response.data[0].descricaoLegendaBranca;

                    })

                OrdensServicoService.postOrdensServicoEmExecucao(model)
                    .then(function (response) {
                            $scope.ordensServicoEmExecucao = response.data;
                            $scope.tipoIntegracaoSistema = response.data[0].tipoIntegracaoSistema;
                            $scope.utilizaImpressaoOsLista = response.data[0].utilizaImpressaoOsLista;
                    })
            }

            $scope.consultarChamados = function (ordemServico) {
                ChamadosService.consultarChamadosOrdemServico(ordemServico.ordemServicoId)
                    .then(function (response) {
                        $scope.ordemServicoDetalhes.chamados = response.data;
                        $scope.tipoIntegracaoSistema = response.data[0].tipoIntegracaoSistema;

                        $("#modalConsultaChamados").modal();
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
                }
                else {
                    $scope.ordensServicoSelecionadas.push(ordemServico);
                }
            }

            $scope.selecionarTodasOrdensServico = function (ordensServico) {

                ordensServico.forEach(function (ordemServico) {
                    if (!$scope.verificarOrdemServicoSelecionada(ordemServico)) {
                        $scope.ordensServicoSelecionadas.push(ordemServico);
                    }
                })
            }

            $scope.limparTodasOrdensServico = function (ordensServico) {
                ordensServico.forEach(function (ordemServico) {
                    if ($scope.verificarOrdemServicoSelecionada(ordemServico)) {
                        $scope.ordensServicoSelecionadas.splice($scope.ordensServicoSelecionadas.indexOf(ordemServico), 1)
                    }
                })
            }

            $scope.confirmarCancelamentoModal = function (ordensServicoSelecionadas) {
                $("#modalCancelamentoOrdemServico").modal();
                $scope.ordensServicoSelecionadas = ordensServicoSelecionadas;
            }

            $scope.modalProgramar = function (ordensServicoSelecionadas) {
                $scope.dadosProgramacaoOs.manterAgendamento = true;
                $scope.dadosProgramacaoOs.manterDpto = true;
                $scope.dadosProgramacaoOs.manterEquipe = true;
                $scope.dadosProgramacaoOs.periodoAgendamento = '';
                $scope.dadosProgramacaoOs.dataAgendamento = '';
                $scope.dadosProgramacaoOs.equipeId = '';
                $scope.dadosProgramacaoOs.centroCustoId = '';

                $("#modalProgramarOrdemServico").modal();
                $scope.ordensServicoSelecionadas = ordensServicoSelecionadas;
            }

            $scope.$watch("dadosProgramacaoOs.manterAgendamento", function (newValue) {
                if (!newValue) {
                    return;
                }

                if (newValue) {
                    $scope.dadosProgramacaoOs.dataAgendamento = '';
                    $scope.dadosProgramacaoOs.periodo = '';
                }
            })

            $scope.$watch("dadosProgramacaoOs.manterEquipe", function (newValue) {
                if (!newValue) {
                    return;
                }

                if (newValue) {
                    $scope.dadosProgramacaoOs.equipeId = '';
                }
            })

            $scope.$watch("dadosProgramacaoOs.manterDpto", function (newValue) {
                if (!newValue) {
                    return;
                }

                if (newValue) {
                    $scope.dadosProgramacaoOs.centroCustoId = '';
                }
            })

            $scope.programarOs = function (dadosProgramacaoOs) {
                var model = {
                    eventosId: [],
                    manterDpto: dadosProgramacaoOs.manterDpto,
                    manterEquipe: dadosProgramacaoOs.manterEquipe,
                    manterAgendamento: dadosProgramacaoOs.manterAgendamento,
                    centroCustoId: dadosProgramacaoOs.centroCustoId,
                    equipeId: dadosProgramacaoOs.equipeId,
                    dataAgendamento: dadosProgramacaoOs.dataAgendamento,
                    periodoAgendamento: dadosProgramacaoOs.periodoAgendamento
                }

                $scope.ordensServicoSelecionadas.forEach(function (ordemServico) {
                    model.eventosId.push(ordemServico.eventoid);
                })

                OrdensServicoService.postProgramarOs(model)
                    .then(function (response) {
                        ngNotify.set(response.data.message, 'success');
                        $scope.pesquisarOrdemServico();
                        $("#modalProgramarOrdemServico").modal("hide");
                        $scope.ordensServicoSelecionadas = [];
                    })
            }

            $scope.modalProgramarColetor = function (ordensServicoSelecionadas) {
                $scope.dadosProgramacaoColetorOs.centroCustoId = '';
                $scope.dadosProgramacaoColetorOs.equipeId = '';
                $scope.dadosProgramacaoColetorOs.tipoProgramacao = '';

                $("#modalProgramarColetorOrdemServico").modal();
                $scope.ordensServicoSelecionadas = ordensServicoSelecionadas;
            }

            $scope.$watch("dadosProgramacaoColetorOs.tipoProgramacao", function (newValue) {
                if (newValue || newValue == null) {
                    $scope.dadosProgramacaoColetorOs.centroCustoId = '';
                    $scope.dadosProgramacaoColetorOs.equipeId = '';
                }
            })

            $scope.programarColetorOs = function (dadosProgramacaoColetorOs) {

                var model = {
                    eventosId: [],
                    centroCustoId: dadosProgramacaoColetorOs.centroCustoId,
                    equipeId: dadosProgramacaoColetorOs.equipeId,
                    tipoProgramacao: dadosProgramacaoColetorOs.tipoProgramacao,
                    tipoOs: 1
                }

                $scope.ordensServicoSelecionadas.forEach(function (ordemServico) {
                    model.eventosId.push(ordemServico.eventoid);
                })

                OrdensServicoService.postProgramarColetorOs(model)
                    .then(function (response) {
                        ngNotify.set(response.data.message, 'success');
                        $scope.pesquisarOrdemServico();
                        $("#modalProgramarOrdemServico").modal("hide");
                        $scope.ordensServicoSelecionadas = [];
                    })
            }
            $scope.chamarModalImpressao = function () {
                if ($scope.utilizaGeo.utilizaGeo == true) {
                    $("#modalConfirmaGeo").modal("show");
                }
                else {
                    $scope.imprimirDocumentos();
                }
            }
            $scope.verificaMapa = function (id) {
                if (id == 1) {
                    $scope.imprimeMapa = true;
                    $scope.imprimirDocumentos();
                    console.log($scope.imprimeMapa);

                }
                else {
                    $scope.imprimeMapa = false;
                    $scope.imprimirDocumentos();
                    console.log($scope.imprimeMapa);
                }
            }
            $scope.modelProgrmacao.eventoId = [];
            $scope.imprimirDocumentos = function () {
                var ordenacao = this.dtInstance.DataTable.order()[0];

                var rota = "Api/OrdensServico/ListaOrdensServicoProgramacao";
                $scope.ordensServicoSelecionadas.forEach(function (os) {
                    $scope.modelProgrmacao.eventoId.push(os.eventoid);
                })

                if (ordenacao != undefined) {
                    $scope.modelProgrmacao.campo = ordenacao[0];
                    $scope.modelProgrmacao.direcao = ordenacao[1];
                }
                else {
 
                    $scope.modelProgrmacao.campo = -1;
                    $scope.modelProgrmacao.direcao = undefined;
                }
                $scope.modelProgrmacao.tipoRecursoId = $scope.tipoRecursoId;
                $scope.modelProgrmacao.exibeMapa = $scope.imprimeMapa;

                $http.post(rota, $scope.modelProgrmacao).then(function (response) {
                    var file = {
                        arquivo: response.data.file,
                        nomeArquivo: "ListaDocumentosOS",
                        mimeType: "application/pdf"
                    };
                    OrdensServicoService.imprimirDocumento(file)
                        .then(function (response) {
                            console.log(response);
                            fileDownloadServiceWeb.processarDownload(response, response.data.file);
                        })
                });
                $scope.modelProgrmacao = {}
                $scope.modelProgrmacao.eventoId = [];
                $("#modalConfirmaImpressao").modal();

            }

            $scope.imprimirListaDocumentos = function () {

                var ordenacao = this.dtInstance.DataTable.order()[0];

                var rota = "Api/OrdensServico/EmListaOrdensServicoProgramacao?";

                $scope.ordensServicoSelecionadas.forEach(function (os) {
                    rota = rota + 'eventosId=' + os.eventoid + '&';
                })

                if (ordenacao != undefined) {
                    rota = rota + 'campo=' + ordenacao[0] + '&direcao=' + ordenacao[1];
                }
                else {
                    rota = rota + 'campo=-1&direcao=undefined';
                }

                fileDownloadService.get(rota, "ListaDocumentosOS", "pdf");
                $("#modalConfirmaImpressao").modal();
            }

            $scope.confirmarImpressaoProgramacaoOs = function () {
                var eventosId = [];
                var rota = "Api/ManutencaoOrdensServico/ConfirmarImpressaoOrdensServicoProgramacao?";

                $scope.ordensServicoSelecionadas.forEach(function (os) {
                    eventosId.push(os.eventoid);
                })

                OrdensServicoService.postConfirmarImpressaoOsProgramacao(eventosId)
                    .then(function (response) {
                        $scope.pesquisarOrdemServico();
                        $scope.ordensServicoSelecionadas = [];
                    })
            }

            $scope.calculaCargaHoraria = function () {
                var resultado = 0;

                $scope.ordensServicoSelecionadas.forEach(function (ordemServicoSelecionada) {
                    resultado = resultado + ordemServicoSelecionada.cargaHoraria;
                })

                return resultado.toFixed(2);
            }

            $scope.verificaStatusPagamentoOs = function (item) {
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
                $http.post('Api/ManutencaoOrdensServico/ImprimirPesquisaProgramacao', model)
                    .then(function (response) {
                        var file = {
                            arquivo: response.data.file,
                            nomeArquivo: "Pesquisa Programação",
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

            {
                $http.get("Api/Mapa/MapaGeo")
                    .then(function (response) {
                        $scope.flagMostraMapaGeo = response.data.utilizaGeo;
                    })
            }
        });
});