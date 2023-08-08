define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'EditarGeralEditarEventoTarefas', 'ordemServicoId');

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
                                                     RegistroEventoService,
                                                     OrdensServicoService,
                                                     EventosService,
                                                     dadosAbasComplementaresEvento,
                                                     FileUploader) {

          // --- Declaração de variáveis básicas

          $scope.dadosAbasComplementaresEvento = dadosAbasComplementaresEvento.data;

          var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

          $scope.dtOptions = dtOptionsBuilder
              .newOptions()
              .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

          // Variável que conterá os campos da geração de campos. Precisa ser inicializada para o bom funcionamento da diretiva.
          $scope.ordemServicoDetalhes = {};

          // Obtém os dados da Ordem de Serviço, gravados no serviço.
          $scope.dadosOs = OrdensServicoService.getDados();

          // Variável que indica a aba ativa nos campos gerados.
          $scope.passoAtivo;

          $scope.eventoId = $stateParams.eventoId;
          $scope.funcionarioId = "";

          // Variável que será usada para obter os campos a serem gerados. O model da chamada é esse objeto.
          var modelDadosCamposGeracao = {
              tipoServicoId: null,
              ordemServicoId: $scope.dadosOs.ordemServicoId,
              eventoId: $scope.eventoId,
          }

          // Indica qual aba da rota pai está ativa.
          $scope.$parent.tabActive = 2;

          // Inicializa objeto de status de evento.
          $scope.statusEvento = {};

          var ObterListaComplementarEvento = function (listaId) {
              EventosService.getObterListaComplementarEvento($scope.eventoId, listaId)
               .then(function (response) {
                   if (listaId == 8) {
                       $scope.dadosAbasComplementaresEvento.tarefas = response.data;
                   }
               });
          }

          $scope.modalConfirmacao = function (tarefa) {
              if (tarefa.tarefaId == 1) {
                  OrdensServicoService.getObterDadosEventoCorteLigacao($scope.eventoId)
                  .then(function (response) {
                      if (response) {
                          $scope.dadosCorte = response.data;
                      }
                  })
                  $("#modalConfirmaTarefaCorte").modal();
              }
              else if (tarefa.tarefaId == 2) {
                  OrdensServicoService.getObterDadosEventoReligacaoLigacao($scope.eventoId)
                    .then(function (response) {
                        if (response) {
                            $scope.dadosReligacao = response.data;
                        }
                    })
                  $("#modalConfirmaTarefaReligacao").modal();
              }
              else if (tarefa.tarefaId == 3) {
                  OrdensServicoService.getObterDadosEventoTrocaHidrometro($scope.eventoId)
                    .then(function (response) {
                        if (response) {
                            $scope.dadosTrocaHidrometro = response.data;
                        }
                    })
                  $("#modalConfirmaTrocaHidrometro").modal();
              }
              else if (tarefa.tarefaId == 4) {
                  OrdensServicoService.getObterDadosEventoLacreLigacao($scope.eventoId)
                      .then(function (response) {
                          if (response) {
                              $scope.dadosLacre = response.data;
                          }
                      })
                  $("#modalConfirmaTarefaLacre").modal();
              }
              else if (tarefa.tarefaId == 5) {
                  OrdensServicoService.getObterDadosEventoInstalacaoLigacao($scope.eventoId)
                      .then(function (response) {
                          if (response) {
                              $scope.dadosInstalacao = response.data;
                          }
                      })
                  $("#modalConfirmaTarefaInstalacao").modal();
              }
              else if (tarefa.tarefaId == 6) {
                  OrdensServicoService.getObterDadosEventoInstalacaoEsgoto($scope.eventoId)
                      .then(function (response) {
                          if (response) {
                              $scope.dadosInstalacaoEsgoto = response.data;
                          }
                      })
                  $("#modalConfirmaTarefaInstalacaoEsgoto").modal();
              }
              else if (tarefa.tarefaId == 9) {
                  OrdensServicoService.getObterDadosEventoAlteracaoDocumentoStm($scope.eventoId)
                      .then(function (response) {
                          $scope.dadosAlteracaoDocumento = response.data;
                      })
                  $("#modalConfirmaTarefaDocumento").modal();
              }
              else if (tarefa.tarefaId == 10) {
                  OrdensServicoService.getObterDadosEventoEnderecoEntregaStm($scope.eventoId)
                    .then(function (response) {
                        $scope.dadosAlteracaoEnderecoEntrega = response.data;
                    })
                  $("#modalConfirmaTarefaEndereco").modal();
              }
              else if (tarefa.tarefaId == 11) {
                  OrdensServicoService.getObterDadosEventoAlteracaoSituacaoHidrometro($scope.eventoId)
                    .then(function (response) {
                        $scope.dadosAlteracaoSituacaoHidrometro = response.data;
                    })
                  $("#modalConfirmaTarefaAlteracaoSituacaoHidrometro").modal();
              }
              else if (tarefa.tarefaId == 14) {
                  OrdensServicoService.getObterDadosEventoHistoricoEncerramento($scope.eventoId)
                    .then(function (response) {
                        $scope.dadosHistoricoEncerramento = response.data;
                    })
                  $("#modalHistoricoEncerramento").modal();
              }
              else if (tarefa.tarefaId == 16) {
                  OrdensServicoService.getObterDadosEventoHistoricoVistoria($scope.eventoId)
                    .then(function (response) {
                        $scope.dadosHistoricoVistoria = response.data;
                    })
                  $("#modalHistoricoVistoria").modal();
              }
              else if (tarefa.tarefaId == 17) {
                  OrdensServicoService.getObterDadosEventoExclusaoLigacao($scope.eventoId)
                      .then(function (response) {
                          $scope.dadosLigacao = response.data;
                      })
                  $("#modalConfirmaTarefaExclusaoLigacao").modal();
              }
              else if (tarefa.tarefaId == 18) {
                  OrdensServicoService.getObterDadosEventoRetirarRetencaoContas($scope.eventoId)
                      .then(function (response) {
                          $scope.dadosRetirarRetencao = response.data;
                      })
                  $("#modalConfirmaTarefaRetirarRetencaoContas").modal();
              }
              else if (tarefa.tarefaId == 20) {
                  OrdensServicoService.getObterDadosEventoAtualizaLacreLigacao($scope.eventoId)
                    .then(function (response) {
                        if (response) {
                            $scope.dadosAtualizaLacre = response.data;
                        }
                    })
                  $("#modalConfirmaTarefaAtualizaLacre").modal();
              }
              else if (tarefa.tarefaId == 23) {
                  OrdensServicoService.getObterDadosNovoUsuarioLigacao($scope.eventoId)
                      .then(function (response) {
                          if (response) {
                              $scope.dadosIncluirUsuarioLigacao = response.data;
                          }
                      })
                  $("#modalIncluirUsuarioLigacao").modal();
              }
              $scope.dados = tarefa;
          }

          $scope.confirmarTarefa = function (tarefa) {

              var model = {
                  eventoTarefaId: tarefa.eventoTarefaId,
                  eventoId: tarefa.eventoId,
                  tarefaId: tarefa.tarefaId
              }

              EventosService.postExecutarTarefa(model)
              .then(function (response) {
                  if (response.data) {
                      ngNotify.set(response.data.message, "success");
                  }
                  $("#modalConfirmaTarefaEndereco").modal("hide");
                  $("#modalConfirmaTarefaDocumento").modal("hide");

                  ObterListaComplementarEvento(8);
              })
          }

          $scope.cortarLigacao = function (dadosCorte) {

              var model = {
                  eventoTarefaId: $scope.dados.eventoTarefaId,
                  cdc: dadosCorte.cdc,
                  tipoCorteId: dadosCorte.tipoCorteId,
                  dataCorte: dadosCorte.dataCorte,
                  leituraCorte: dadosCorte.leituraCorte,
                  responsavelCorte: dadosCorte.responsavelCorte,
                  situacaoAguaId: dadosCorte.situacaoAguaId,
                  dataLacre1: dadosCorte.dataLacre1,
                  numeroLacre1: dadosCorte.numeroLacre1,
                  corLacre: dadosCorte.corLacre,
                  dataLacre2: dadosCorte.dataLacre2,
                  numeroLacre2: dadosCorte.numeroLacre2,
                  tipoLacreId: dadosCorte.tipoLacreId,
                  observacao: dadosCorte.observacao
              };

              OrdensServicoService.postCortarLigacao(model)
              .then(function (response) {
                  ngNotify.set(response.data, "success");
                  $("#modalConfirmaTarefaCorte").modal("hide");
                  $scope.dadosCorte = {};
                  ObterListaComplementarEvento(8);
              })
          }

          $scope.religarLigacao = function (dadosReligacao) {
              var model = {
                  eventoTarefaId: $scope.dados.eventoTarefaId,
                  cdc: dadosReligacao.cdc,
                  dataReligacao: dadosReligacao.dataReligacao,
                  leituraReligacao: dadosReligacao.leituraReligacao,
                  responsavelReligacao: dadosReligacao.responsavelReligacao,
                  situacaoAguaId: dadosReligacao.situacaoAguaId,
                  dataLacre1: dadosReligacao.dataLacre1,
                  numeroLacre1: dadosReligacao.numeroLacre1,
                  dataLacre2: dadosReligacao.dataLacre2,
                  numeroLacre2: dadosReligacao.numeroLacre2,
                  tipoLacreId: dadosReligacao.tipoLacreId,
                  corLacre: dadosReligacao.corLacre,
                  observacao: dadosReligacao.observacao
              };

              OrdensServicoService.postReligarLigacao(model)
              .then(function (response) {
                  $("#modalConfirmaTarefaReligacao").modal("hide");
                  ngNotify.set(response.data, "success");
                  $scope.dadosReligacao = {};
                  ObterListaComplementarEvento(8);
              })
          }

          $scope.lacrarLigacao = function (dadosLacre) {
              var model = {
                  eventoTarefaId: $scope.dados.eventoTarefaId,
                  cdc: dadosLacre.cdc,
                  dataLacre1: dadosLacre.dataLacre1,
                  numeroLacre1: dadosLacre.numeroLacre1,
                  dataLacre2: dadosLacre.dataLacre2,
                  numeroLacre2: dadosLacre.numeroLacre2,
                  tipoLacreId: dadosLacre.tipoLacreId,
                  corLacre: dadosLacre.corLacre
              }

              OrdensServicoService.postLacrarLigacao(model)
              .then(function (response) {
                  $("#modalConfirmaTarefaLacre").modal("hide");
                  ngNotify.set(response.data, "success");
                  $scope.dadosLacre = {};
                  ObterListaComplementarEvento(8);
              })
          }

          $scope.instalarHidrometro = function (dadosInstalacao) {
              var model = {
                  eventoTarefaId: $scope.dados.eventoTarefaId,
                  cdc: dadosInstalacao.cdc,
                  dataInstalacao: dadosInstalacao.dataInstalacao,
                  hidrometroInstalado: dadosInstalacao.hidrometroInstalado,
                  situacaoHidrometroId: dadosInstalacao.situacaoHidrometroId,
                  categoriaId: dadosInstalacao.categoriaId,
                  atividadeId: dadosInstalacao.atividadeId,
                  tipoLigacaoId: dadosInstalacao.tipoLigacaoId,
                  leituraInicial: dadosInstalacao.leituraInicial
              }

              OrdensServicoService.postInstalarHidrometro(model)
              .then(function (response) {
                  $("#modalConfirmaTarefaInstalacao").modal("hide");
                  ngNotify.set(response.data, "success");
                  $scope.dadosInstalacao = {};
                  ObterListaComplementarEvento(8);
              })
          }

          $scope.excluirLigacao = function (dadosLigacao) {
              var model = {
                  eventoTarefaId: $scope.dados.eventoTarefaId,
                  cdc: dadosLigacao.cdc
              }

              OrdensServicoService.postExcluirLigacao(model)
                .then(function (response) {
                    $("#modalConfirmaTarefaExclusaoLigacao").modal("hide");
                    ngNotify.set(response.data, "success");
                    $scope.dadosLigacao = {};
                    ObterListaComplementarEvento(8);
                })
          }

          $scope.instalarEsgoto = function (dadosInstalacaoEsgoto) {
              var model = {
                  eventoTarefaId: $scope.dados.eventoTarefaId,
                  cdc: dadosInstalacaoEsgoto.cdc,
                  situacaoEsgotoId: dadosInstalacaoEsgoto.situacaoEsgotoId,
                  dataInstalacao: dadosInstalacaoEsgoto.dataInstalacao
              }

              OrdensServicoService.postInstalarEsgoto(model)
              .then(function (response) {
                  $("#modalConfirmaTarefaInstalacaoEsgoto").modal("hide");
                  ngNotify.set(response.data, "success");
                  $scope.dadosInstalacaoEsgoto = {};
                  ObterListaComplementarEvento(8);
              })
          }

          $scope.alterarSituacaoHidrometro = function (dadosAlteracaoSituacaoHidrometro) {
              var model = {
                  eventoTarefaId: $scope.dados.eventoTarefaId,
                  cdc: dadosAlteracaoSituacaoHidrometro.cdc,
                  situacaoHidrometroId: dadosAlteracaoSituacaoHidrometro.situacaoHidrometroId
              }

              OrdensServicoService.postAlterarSituacaoHidrometro(model)
                  .then(function (response) {
                      $("#modalConfirmaTarefaAlteracaoSituacaoHidrometro").modal("hide");
                      ngNotify.set(response.data, "success");
                      $scope.dadosAlteracaoSituacaoHidrometro = {};
                      ObterListaComplementarEvento(8);
                  })
          }

          $scope.gerarHistoricoEncerramento = function (dadosGeracaoHistoricoEncerramento) {
              var model = {
                  eventoTarefaId: $scope.dados.eventoTarefaId,
                  cdc: dadosGeracaoHistoricoEncerramento.cdc,
                  historico: dadosGeracaoHistoricoEncerramento.historico
              }

              OrdensServicoService.postGerarHistoricoEncerramento(model)
              .then(function (response) {
                  $("#modalHistoricoEncerramento").modal("hide");
                  ngNotify.set(response.dados, "success");
                  $scope.dadosHistoricoEncerramento = {};
                  ObterListaComplementarEvento(8);
              })
          }

          $scope.gerarHistoricoVistoria = function (dadosGeracaoHistoricoVistoria) {
              var model = {
                  eventoTarefaId: $scope.dados.eventoTarefaId,
                  cdc: dadosGeracaoHistoricoVistoria.cdc,
                  historico: dadosGeracaoHistoricoVistoria.historico
              }

              OrdensServicoService.postGerarHistoricoVistoria(model)
              .then(function (response) {
                  $("#modalHistoricoVistoria").modal("hide");
                  ngNotify.set(response.data, "success");
                  $scope.dadosHistoricoVistoria = {};
                  ObterListaComplementarEvento(8);
              })
          }

          $scope.retirarRetencao = function (dadosRetirarRetencao) {
              var model = {
                  eventoTarefaId: $scope.dados.eventoTarefaId,
                  cdc: dadosRetirarRetencao.cdc,
                  contasRetidas: dadosRetirarRetencao.contasRetidas
              }

              OrdensServicoService.postRetirarRetencaoContas(model)
                .then(function (response) {
                    $("#modalConfirmaTarefaRetirarRetencaoContas").modal("hide");
                    ngNotify.set(response.data, "success");
                    $scope.dadosRetirarRetencao = {};
                    ObterListaComplementarEvento(8);
                })
          }

          $scope.atualizarLacreLigacao = function (dadosLacre) {
              var model = {
                  eventoTarefaId: $scope.dados.eventoTarefaId,
                  cdc: dadosLacre.cdc,
                  dataLacre1: dadosLacre.dataLacre1,
                  numeroLacre1: dadosLacre.numeroLacre1,
                  dataLacre2: dadosLacre.dataLacre2,
                  numeroLacre2: dadosLacre.numeroLacre2,
                  tipoLacreId: dadosLacre.tipoLacreId,
                  corLacre: dadosLacre.corLacre
              }

              OrdensServicoService.postAtualizarLacreLigacao(model)
              .then(function (response) {
                  $("#modalConfirmaTarefaAtualizaLacre").modal("hide");
                  ngNotify.set(response.data, "success");
                  $scope.dadosAtualizaLacre = {};
                  ObterListaComplementarEvento(8);
              })
          }

          $scope.trocarHidrometro = function (dadosHidrometro) {
              var model = {
                  eventoTarefaId: $scope.dados.eventoTarefaId,
                  cdc: dadosHidrometro.cdc,
                  hidrometroAtual: dadosHidrometro.hidrometroAtual,
                  hidrometroAnterior: dadosHidrometro.hidrometroAnterior, 
                  leiHidrAtual: dadosHidrometro.leiHidrAtual,
                  dataNovaLacre: dadosHidrometro.dataNovaLacre,
                  dataNovaLacre2: dadosHidrometro.dataNovaLacre2,
                  nroNovoLacre: dadosHidrometro.nroNovoLacre,
                  nroNovoLacre2: dadosHidrometro.nroNovoLacre2,
                  observacao: dadosHidrometro.observacao,
                  motivoId: dadosHidrometro.motivoId,
                  dataTroca: dadosHidrometro.dataTroca,
                  responsavel: dadosHidrometro.responsavel
              }

              OrdensServicoService.postTrocarHidrometro(model)
              .then(function (response) {
                  $("#modalConfirmaTrocaHidrometro").modal("hide");
                  ngNotify.set(response.data, "success");
                  $scope.dadosTrocaHidrometro = {};
                  ObterListaComplementarEvento(8);
              })
          }
      }
    )
})