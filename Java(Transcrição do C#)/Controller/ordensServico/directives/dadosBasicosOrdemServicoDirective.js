define(function () {
    var dadosBasicosOrdemServico = function ($http, $injector, $state, $compile, $templateCache, ngNotify, OrdensServicoService, ChamadosService, fileDownloadService, EventosService) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: function (scope, element) {

                // --- Declaração de variáveis básicas
                var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

                scope.dtOptions = dtOptionsBuilder
                    .newOptions()
                    .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

                scope.dadosOrdemServico = OrdensServicoService.getDados();

                ChamadosService.consultarChamadosOrdemServico(scope.dadosOrdemServico.ordemServicoId)
                    .then(function (response) {
                        scope.chamados = response.data;
                        if (scope.chamados[0].cdc) {
                            OrdensServicoService.getOsAbertoLigacao(scope.chamados[0].cdc, scope.dadosOrdemServico.ordemServicoId)
                                .then(function (response) {
                                    scope.osAbertasLigacao = response.data;
                                })
                        }
                        else {
                            scope.osAbertasLigacao = null;
                        }
                    })

                scope.cancelarOs = {};
                scope.servicos = {};
                // Aba selecionada inicial.
                scope.abaAtivaDetalhesOs = 1;

                scope.ordemServicoCancelamento = {};
                // --- Funções e operações pós obtenção de dados.

                // Consulta novamente os dados da Ordem de Serviço, usado quando as informações são atualizadas.
                var atualizarDadosOrdemServico = function () {
                    OrdensServicoService.consultarEdicaoOrdemServico(scope.dadosOrdemServico.ordemServicoId)
                        .then(function (response) {
                            scope.dadosOrdemServico = response.data;
                            OrdensServicoService.setDados(response.data);
                        })
                }

                // Determina uma classe para destaque na tabela.
                scope.statusOsClasse = function (status) {
                    if (status == 1) {
                        return "yellow";
                    } else if (status == 2) {
                        return "green";
                    } else if (status == 4) {
                        return "yellow-casablanca";
                    } else if (status == 5) {
                        return "red";
                    } else {
                        return "blue";
                    }
                }

                // Pede a confirmação do cancelamento da OS e os dados necessários para executar a operação.
                scope.abrirModalCancelamentoOs = function () {
                    $('#modalCancelamentoOrdemServico').modal('show');
                }

                // Executa o cancelamento da OS.
                scope.cancelarOrdemServico = function () {
                    var model = {
                        ordemServicoId: scope.dadosOrdemServico.ordemServicoId,
                        ocorrenciaId: scope.ordemServicoCancelamento.ocorrenciaId,
                        observacao: scope.ordemServicoCancelamento.observacao
                    }
                    OrdensServicoService.cancelarOrdemServico(model)
                        .then(function (response) {
                            ngNotify.set(response.data, "success")
                            scope.cancelarOs = {};
                            atualizarDadosOrdemServico();
                        })
                }
                //Lancar Servicos
                OrdensServicoService.getServicos(scope.dadosOrdemServico.ordemServicoId).then(function (response) {
                    scope.servicos = response.data
                })

                // Encerra a Ordem de Serviço.
                scope.encerrarOrdemServico = function () {
                    var model = {
                        ordemServicoId: scope.dadosOrdemServico.ordemServicoId,
                        prioridadeChamado: scope.dadosOrdemServico.prioridadeChamado,
                        tipoChamadoId: scope.dadosOrdemServico.tipoChamadoId,
                        reFuncionarioIdEncarregado: scope.dadosOrdemServico.reFuncionarioIdEncarregado,
                        debitarDe: scope.dadosOrdemServico.debitarDe,
                        areaManutencaoId: scope.dadosOrdemServico.areaManutencaoId,
                        terceiroId: scope.dadosOrdemServico.terceiroId,
                        lancaServico: 1
                    }
                    OrdensServicoService.encerrarOrdemServico(model)
                        .then(function (response) {
                            atualizarDadosOrdemServico();
                            ngNotify.set(response.data, "success");
                        })

                }

                // Reativar a Ordem de Serviço.
                scope.reativarOrdemServico = function () {
                    var model = {
                        ordemServicoId: scope.dadosOrdemServico.ordemServicoId,
                        prioridadeChamado: scope.dadosOrdemServico.prioridadeChamado,
                        tipoChamadoId: scope.dadosOrdemServico.tipoChamadoId,
                        reFuncionarioIdEncarregado: scope.dadosOrdemServico.reFuncionarioIdEncarregado,
                        debitarDe: scope.dadosOrdemServico.debitarDe,
                        areaManutencaoId: scope.dadosOrdemServico.areaManutencaoId,
                        terceiroId: scope.dadosOrdemServico.terceiroId
                    }

                    OrdensServicoService.reativarOrdemServico(model)
                        .then(function (response) {
                            atualizarDadosOrdemServico();
                            ngNotify.set(response.data, "success");
                        })
                }

                // Função ativada pelo clique do botão voltar. Decide a qual rota ele deve ir.
                scope.clickBotaoVoltar = function () {
                    switch ($state.current.name) {

                        case "ordensServico.editar.geral.chamados":
                        case "ordensServico.editar.geral.eventos":
                        case "ordensServico.editar.geral.historico":
                        case "ordensServico.editar.geral.documentos":
                            $state.go("ordensServico.consulta", { tipoConsulta: 1 });
                            break;

                        case "ordensServico.editar.geral.editarChamado":
                            $state.go("ordensServico.editar.geral.chamados", { ordemServicoId: scope.dadosOrdemServico.ordemServicoId });
                            break;

                        case "ordensServico.editar.geral.editarEvento":
                        case "ordensServico.editar.geral.novoEvento":
                            $state.go("ordensServico.editar.geral.eventos", { ordemServicoId: scope.dadosOrdemServico.ordemServicoId });
                            break;

                        default:
                            $state.go("painel.geral");

                    }
                }

                // Função que gerencia se os campos editáveis da OS devem estar habilitados ou desabilitados.
                scope.desabilitarCamposOS = function () {
                    if (scope.dadosOrdemServico.statusId == 1 || scope.dadosOrdemServico.statusId == 2) {
                        return false;
                    }

                    return true;
                }

                // Função que gerencia se o botão de cancelamento de O.S. deve estar habilitado ou desabilitado.
                scope.desabilitarCancelarOS = function () {
                    if (scope.dadosOrdemServico.statusId == 1) {
                        return false;
                    }

                    return true;
                }

                // Função que gerencia se o botão de atualização de O.S. deve estar habilitado ou desabilitado.
                scope.desabilitarAtualizarOS = function () {
                    if (scope.dadosOrdemServico.statusId == 3 || scope.dadosOrdemServico.statusId == 4 || scope.dadosOrdemServico.statusId == 5) {
                        return true;
                    }

                    return false;
                }

                // Função que gerencia se o botão de bloquear O.S. deve estar habilitado ou desabilitado.
                scope.desabilitarBloquearOS = function () {
                    if (scope.dadosOrdemServico.statusId == 4 || scope.dadosOrdemServico.statusId == 3) {
                        return true;
                    }

                    if (scope.dadosOrdemServico.statusId == 5) {
                        return true;
                    }

                    return false;
                }

                // Função que gerencia se o botão de desbloquear O.S. deve estar habilitado ou desabilitado.
                scope.desabilitarDesbloquearOS = function () {
                    if (scope.dadosOrdemServico.statusId != 4) {
                        return true;
                    }

                    if (scope.dadosOrdemServico.statusId == 5) {
                        return true;
                    }

                    return false;
                }

                // Função que gerencia se o botão de reativar O.S. deve estar habilitado ou desabilitado.
                scope.desabilitarReativarOS = function () {
                    if (scope.dadosOrdemServico.statusId == 3 || scope.dadosOrdemServico.statusId == 5) {
                        return false;
                    }

                    return true;
                }

                // Função que gerencia se o botão de encerrar O.S. deve estar habilitado ou desabilitado.
                scope.desabilitarEncerrarOS = function () {
                    if (scope.dadosOrdemServico.statusId == 4) {
                        return true;
                    }

                    return false;
                }

                //Carta Retorno por Ordem de Serviço
                scope.abrirModalCartaRetornoOs = function () {
                    $('#modalImpressaoCartaRetornoOrdemServico').modal('show');
                };

                scope.imprimirCartaRetornoOs = function () {
                    fileDownloadService.get('Api/OrdensServico/' + scope.dadosOrdemServico.ordemServicoId + '/ImpressaoRetornoOS', "CartaRetornoOS", "pdf")
                };
                EventosService.getExibeCartaRetorno(3030007).then(function (response) {
                    scope.exibeCartaRetorno = response.data;
                });

                // Abrir modal de atualização de OS.
                scope.abrirModalAtualizarOS = function () {
                    $("#modalAtualizacaoOrdemServico").modal("show");
                }

                // Abrir modal de bloqueio de OS.
                scope.abrirModalBloquearOS = function () {
                    $("#modalBloqueioOrdemServico").modal("show");
                }

                // Abrir modal de desbloqueio de OS.
                scope.abrirModalDesbloquearOS = function () {
                    $("#modalDesbloqueioOrdemServico").modal("show");
                }

                // Abrir modal de encerramento de OS.
                scope.abrirModalEncerrarOS = function () {
                    $("#modalEncerramentoOrdemServico").modal("show");

                }

                // Abrir modal de reativação de OS.
                scope.abrirModalReativarOS = function () {
                    $("#modalReativacaoOrdemServico").modal("show");
                }

                // Abrir modal de cancelamento de OS.
                scope.abrirModalCancelamentoOS = function () {
                    scope.ordemServicoCancelamento = {
                        ordemServicoId: scope.dadosOrdemServico.ordemServicoId
                    }

                    $("#modalCancelamentoOrdemServico").modal("show");
                }

                // Salva as atualizações na OS.
                scope.executarAtualizacaoOS = function () {
                    var model = gerarModelAtualizacaoDadosOS();

                    OrdensServicoService.editarOrdemServico(model)
                        .then(function (response) {
                            //atualizarDadosOrdemServico();
                            ngNotify.set(response.data, "success");

                            setTimeout(function () {
                                window.location.reload();
                            }, 1000);

                        })
                }

                scope.executarBloqueioOS = function () {
                    var model = gerarModelAtualizacaoDadosOS();

                    OrdensServicoService.bloquearOrdemServico(model)
                        .then(function (response) {
                            //atualizarDadosOrdemServico();
                            ngNotify.set(response.data, "success");

                            setTimeout(function () {
                                window.location.reload();
                            }, 1000);

                        })
                }

                scope.executarDesbloqueioOS = function () {
                    var model = gerarModelAtualizacaoDadosOS();

                    OrdensServicoService.desbloquearOrdemServico(model)
                        .then(function (response) {
                            //atualizarDadosOrdemServico();
                            ngNotify.set(response.data, "success");

                            setTimeout(function () {
                                window.location.reload();
                            }, 1000);

                        })
                }
                
                //Cobrar Servico
                scope.CobrarServico = function () {
                    var model = {
                        ordemServicoId: scope.dadosOrdemServico.ordemServicoId,
                        prioridadeChamado: scope.dadosOrdemServico.prioridadeChamado,
                        tipoChamadoId: scope.dadosOrdemServico.tipoChamadoId,
                        reEncarregado: scope.dadosOrdemServico.reEncarregado,
                        debitarDe: scope.dadosOrdemServico.debitarDe,
                        areaManutencaoId: scope.dadosOrdemServico.areaManutencaoId,
                        terceiroId: scope.dadosOrdemServico.terceiroId,
                        lancaServico: 2

                    }
                    OrdensServicoService.lancarServicos(model)
                        .then(function (response) {
                            //atualizarDadosOrdemServico();
                            ngNotify.set(response.data, "success");
                           
                        })

                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);

                }
                scope.NaoCobrar = function () {
                    var model = {
                        ordemServicoId: scope.dadosOrdemServico.ordemServicoId,
                        prioridadeChamado: scope.dadosOrdemServico.prioridadeChamado,
                        tipoChamadoId: scope.dadosOrdemServico.tipoChamadoId,
                        reEncarregado: scope.dadosOrdemServico.reEncarregado,
                        debitarDe: scope.dadosOrdemServico.debitarDe,
                        areaManutencaoId: scope.dadosOrdemServico.areaManutencaoId,
                        terceiroId: scope.dadosOrdemServico.terceiroId,
                        lancaServico: 1

                    }
                    OrdensServicoService.lancarServicos(model)
                        .then(function (response) {
                            //atualizarDadosOrdemServico();
                            ngNotify.set(response.data, "success");

                        })

                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);

                }
                //Encerrar O.S.
                scope.executarEncerramentoOS = function () {
                    var model = gerarModelAtualizacaoDadosOS();
                    OrdensServicoService.encerrarOrdemServico(model)
                        .then(function (response) {
                            ngNotify.set(response.data, "success");
                            if (scope.servicos.exibe) {
                                atualizarDadosOrdemServico();
                                $("#modalLancarServico").modal("show")
                            }
                            else {

                                setTimeout(function () {
                                    window.location.reload();
                                }, 1000);

                            }
                            
                        })
                }

                scope.executarReativacaoOS = function () {
                    var model = gerarModelAtualizacaoDadosOS();

                    OrdensServicoService.reativarOrdemServico(model)
                        .then(function (response) {
                            //atualizarDadosOrdemServico();
                            ngNotify.set(response.data, "success");

                            setTimeout(function () {
                                window.location.reload();
                            }, 1000);

                        })
                }

                var gerarModelAtualizacaoDadosOS = function () {
                    var model = {
                        ordemServicoId: scope.dadosOrdemServico.ordemServicoId,
                        prioridadeChamado: scope.dadosOrdemServico.prioridadeChamado,
                        tipoChamadoId: scope.dadosOrdemServico.tipoChamadoId,
                        reEncarregado: scope.dadosOrdemServico.reEncarregado,
                        debitarDe: scope.dadosOrdemServico.debitarDe,
                        areaManutencaoId: scope.dadosOrdemServico.areaManutencaoId,
                        terceiroId: scope.dadosOrdemServico.terceiroId,
                        lancaServico: 1

                    }

                    return model;
                }

                scope.executarCancelamentoOS = function () {
                    var model = gerarModelAtualizacaoDadosOS();
                    OrdensServicoService.cancelarOrdemServico(scope.ordemServicoCancelamento)
                        .then(function (response) {
                            //atualizarDadosOrdemServico();
                            ngNotify.set(response.data, "success");

                            setTimeout(function () {
                                window.location.reload();
                            }, 1000);

                        })
                }

                // Pegando o HTML do template manualmente e recompilando (por causa das diretivas dentro dele, é necessário recompilar tudo).
                $http.get("app/modules/ordensServico/views/dadosBasicosOrdemServico.html", { cache: $templateCache }).success(function (html) {
                    element.replaceWith($compile(html)(scope));
                });

                // --- Recepção de Eventos

                // Recarrega as informações da ordem de serviço.
                scope.$on('AtualizacaoEventosOS', function (event, args) {
                    atualizarDadosOrdemServico();
                });
            }
        };
    };

    return dadosBasicosOrdemServico;
});