define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'EditarGeralEditarEvento', 'ordemServicoId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope,
            $injector,
            $state,
            $stateParams,
            $anchorScroll,
            $location,
            $http,
            $filter,
            localStorageService,
            ngNotify,
            errorsValidationService,
            RegistroEventoService,
            OrdensServicoService,
            EventosService,
            dadosAbasComplementaresEvento,
            FileUploader,
            fileDownloadService) {

            // --- Declaração de variáveis básicas

            $scope.dadosAbasComplementaresEvento = dadosAbasComplementaresEvento.data
            $scope.novaLigacao = {};
            $scope.chamadoId = $stateParams.chamadoId;
            $scope.campos = {};

            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withOption('order', [])
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            // Variável que conterá os campos da geração de campos. Precisa ser inicializada para o bom funcionamento da diretiva.
            $scope.ordemServicoDetalhes = {};

            // Obtém os dados da Ordem de Serviço, gravados no serviço.
            $scope.dadosOs = OrdensServicoService.getDados();

            // Variável que indica a aba ativa nos campos gerados.
            $scope.passoAtivo;

            $scope.eventoId = $stateParams.eventoId;

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

            // Inicialização da variável de combo de materiais.
            $scope.listaMateriaisCombo = [];


            // Inicialização da variável de combo de funcionarios.
            $scope.listaFuncionariosCombo = [];

            // Inicialização da variável de combo de servicos.
            $scope.listaTipoServicosCombo = [];

            // Inicialização da variável de combo de artigos.
            $scope.listaArtigosCombo = [];

            // Inicialização da variável de combo de tipo registro.
            $scope.listaTipoRegistroCombo = [];

            // Inicialização da variável de combo de logradouro.
            $scope.listaLogradourosCombo = [];

            // Inicialização da variável de combo de funcao.
            $scope.listaFuncoesCombo = [];

            var listaChavesEquipamentos = [];

            var servicosSelecionados = [];

            $scope.servicosSelecionados = servicosSelecionados;

            $scope.idsServicos = [];

            /*iniciliazacoes de variaveis de mao de obra*/

            // Inicialização da variável de inclusão de funcionario
            $scope.inclusaoMaoDeObra = {};

            // Inicialização da variável de edicao de funcionario
            $scope.edicaoMaoDeObra = {};

            // Inicialização da variável de edicao de funcionario
            $scope.exclusaoMaoDeObra = {};

            /*iniciliazacoes de variaveis de servico*/

            // Inicialização da variável de inclusão de servico.
            $scope.inclusaoServico = {};

            // Inicialização da variável de edicao de servico
            $scope.edicaoServico = {};

            // Inicialização da variável de edicao de servico
            $scope.exclusaoServico = {};

            /*iniciliazacoes de variaveis de artigo*/

            // Inicialização da variável de inclusão de artigo.
            $scope.inclusaoArtigo = {};

            // Inicialização da variável de edicao de artigo
            $scope.edicaoArtigo = {};

            // Inicialização da variável de edicao de artigo
            $scope.exclusaoArtigo = {};

            /*iniciliazacoes de variaveis de manobra*/

            // Inicialização da variável de inclusão de artigo.
            $scope.inclusaoManobra = {};

            // Inicialização da variável de edicao de artigo
            $scope.edicaoManobra = {};

            // Inicialização da variável de edicao de artigo
            $scope.exclusaoManobra = {};

            /*iniciliazacoes de variaveis de funcao*/

            // Inicialização da variável de inclusão de funcao.
            $scope.inclusaoFuncao = {};

            // Inicialização da variável de edicao de funcao
            $scope.edicaoFuncao = {};

            // Inicialização da variável de edicao de funcao
            $scope.exclusaoFuncao = {};

            //Inicializa a variável de permissão de evento.
            $scope.permissaoEvento = {};

            // Inicializa objeto de status de evento.
            $scope.optionsGaleriaImagens = {
                base64: true,
                width: 200,
                height: 200
            };

            $scope.imagensEvento = [];

            $scope.dadosAbasComplementaresEvento.fotos.forEach(function (dadosFoto) {
                $scope.imagensEvento.push(dadosFoto.documento);
            })

            $scope.dadosAbasComplementaresEvento.tarefas.forEach(function (tarefa) {
                $scope.tarefa = tarefa;
            })

            $scope.pessoaSelecionada = null;

            $scope.dadosProgramacaoColetorOs = {};

            // --- Obtenção de dados.

            // Função que agrupa a obtenção de dados do evento para reaproveitamento.
            var obterDadosEdicaoEvento = function () {
                // Obtém o ID do serviço, usado para mostrar o tipo de serviço do evento.
                EventosService.getTipoServicoIdEvento($scope.eventoId)
                    .then(function (response) {
                        $scope.tipoServicoId = response.data.toString();
                    })

                // Obtém o ID do serviço, usado para mostrar o tipo de serviço do evento.
                EventosService.getStatusEvento($scope.eventoId)
                    .then(function (response) {
                        $scope.statusEvento = response.data;
                    })

                // Obtém os dados dos campos e abas a serem gerados.
                RegistroEventoService.getDadosCamposGeracao(modelDadosCamposGeracao)
                    .then(function (response) {
                        $scope.modelPassosCamposGeracao = response.data;
                    })

                // Obtém as permissões de alteração do evento.
                EventosService.getPermissaoEvento($scope.eventoId)
                    .then(function (response) {
                        $scope.permissaoEvento = response.data;
                    })
            }
            //Carta Retorno
            $scope.imprimirCartaRetorno = function () {
                fileDownloadService.get('Api/OrdensServico/' + $scope.eventoId + '/ImpressaoCartaRetorno', "CartaRetorno", "pdf")
            }
            EventosService.getExibeCartaRetorno(3030006).then(function (response) {
                $scope.exibeCartaRetorno = response.data;
            });

            // Função que obtém as abas ativas para o cliente, e também já redireciona para a primeira aba disponível.
            // ------------ IMPLEMENTAR

            obterDadosEdicaoEvento();

            // --- Funções e operações pós obtenção de dados.

            // Gerencia a troca de abas ativas.
            $scope.ativarAba = function (passo) {
                $scope.passoAtivo = passo.passoId
            }

            $scope.calcularTotalHorasMaoObra = function (quantidadeHoras, preco) {
                return quantidadeHoras * preco;
            }

            $scope.calcularTotalValorHorasServico = function (valorServico, qtdhoras) {
                return valorServico * qtdhoras;
            }

            $scope.defineClassePortletStatusEvento = function () {
                if ($scope.statusEvento.statusId == 1) {
                    return "yellow";
                } else if ($scope.statusEvento.statusId == 2) {
                    return "green";
                } else if ($scope.statusEvento.statusId == 4) {
                    return "red";
                } else if ($scope.statusEvento.statusId == 5) {
                    return "grey-cascade";
                } else {
                    return "blue";
                }
            }

            $scope.executarAtualizacaoEvento = function () {
                $scope.errosFormularioEdicaoEvento = null;

                var model = {
                    ordemServicoId: $scope.dadosOs.ordemServicoId,
                    eventoId: $scope.eventoId,
                    dadosEvento: []
                }

                $scope.modelPassosCamposGeracao.forEach(function (passoCampos) {
                    passoCampos.campos.forEach(function (campo) {
                        model.dadosEvento.push({
                            id: campo.campoId,
                            dados: campo.valor,
                            tipoServicoId: $scope.tipoServicoId
                        })
                    })
                })

                RegistroEventoService.putDadosCamposGeracao(model)
                    .then(function (response) {
                        $scope.$emit('AtualizacaoEventosOS');
                        obterDadosEdicaoEvento();
                        ngNotify.set(response.data, "success")
                    }, function (error) {
                        $scope.errosFormularioEdicaoEvento = errorsValidationService.parseErrors(error.data);
                        $location.hash('edicaoEventoForm');
                        $anchorScroll();
                    })
            }

            $scope.verificarFormularioInvalido = function (form) {
                if (!form || form.$invalid || !$scope.modelPassosCamposGeracao) {
                    return true;
                }
                return false;
            }

            $scope.desabilitarAtualizarEvento = function () {
                if ($scope.dadosOs.statusId == 3 || $scope.dadosOs.statusId == 4 || $scope.dadosOs.statusId == 5) {
                    return true;
                }

                if (!$scope.permissaoEvento.eventoHabilitado) {
                    return true;
                }
                return false;
            }

            $scope.verificaTipoOrdemServico = function () {
                //Interna
                // Não exibir as abas de Artigos e Manobra
                if ($scope.dadosOs.centroCustoId != null) {
                    return false;
                }
                // Externa
                else {
                    return true;
                }
                return false;
            }

            $scope.abaMateriais = function () {
                $state.go("ordensServico.editar.geral.editarEvento.materiais", { ordemServicoId: $scope.dadosOs.ordemServicoId, eventoId: $scope.eventoId })
                $scope.passoAtivoAbasFixas = 1;
            }
            $scope.abaMateriais();

            $scope.abaEquipamentos = function () {
                $state.go("ordensServico.editar.geral.editarEvento.equipamentos", { ordemServicoId: $scope.dadosOs.ordemServicoId, eventoId: $scope.eventoId })
                $scope.passoAtivoAbasFixas = 2;
            }

            $scope.abaMaoDeObra = function () {
                $state.go("ordensServico.editar.geral.editarEvento.maoDeObra", { ordemServicoId: $scope.dadosOs.ordemServicoId, eventoId: $scope.eventoId })
                $scope.passoAtivoAbasFixas = 3;
            }

            $scope.abaServicos = function () {
                $state.go("ordensServico.editar.geral.editarEvento.servicos", { ordemServicoId: $scope.dadosOs.ordemServicoId, eventoId: $scope.eventoId })
                $scope.passoAtivoAbasFixas = 4;
            }

            $scope.abaArtigos = function () {
                $state.go("ordensServico.editar.geral.editarEvento.artigos", { ordemServicoId: $scope.dadosOs.ordemServicoId, eventoId: $scope.eventoId })
                $scope.passoAtivoAbasFixas = 5;
            }

            $scope.abaManobraDescarga = function () {
                $state.go("ordensServico.editar.geral.editarEvento.manobraDescarga", { ordemServicoId: $scope.dadosOs.ordemServicoId, eventoId: $scope.eventoId })
                $scope.passoAtivoAbasFixas = 6;
            }

            $scope.abaInformacoesAdicionais = function () {
                $state.go("ordensServico.editar.geral.editarEvento.informacoesAdicionais", { ordemServicoId: $scope.dadosOs.ordemServicoId, eventoId: $scope.eventoId })
                $scope.passoAtivoAbasFixas = 7;
            }

            $scope.abaTarefas = function () {
                $state.go("ordensServico.editar.geral.editarEvento.tarefas", { ordemServicoId: $scope.dadosOs.ordemServicoId, eventoId: $scope.eventoId })
                $scope.passoAtivoAbasFixas = 8;
            }

            $scope.abaFotos = function () {
                $state.go("ordensServico.editar.geral.editarEvento.fotos", { ordemServicoId: $scope.dadosOs.ordemServicoId, eventoId: $scope.eventoId })
                $scope.passoAtivoAbasFixas = 9;
            }

            $scope.abaFuncoes = function () {
                $state.go("ordensServico.editar.geral.editarEvento.funcoes", { ordemServicoId: $scope.dadosOs.ordemServicoId, eventoId: $scope.eventoId })
                $scope.passoAtivoAbasFixas = 10;
            }

            $scope.abaDocumentos = function () {
                $state.go("ordensServico.editar.geral.editarEvento.documentos", { ordemServicoId: $scope.dadosOs.ordemServicoId, eventoId: $scope.eventoId })
                $scope.passoAtivoAbasFixas = 11;
            }

            $scope.abaAndamentos = function () {
                $state.go("ordensServico.editar.geral.editarEvento.andamentos", { ordemServicoId: $scope.dadosOs.ordemServicoId, eventoId: $scope.eventoId })
                $scope.passoAtivoAbasFixas = 13;
            }

            $scope.abaValas = function () {
                $state.go("ordensServico.editar.geral.editarEvento.vala", { ordemServicoId: $scope.dadosOs.ordemServicoId, eventoId: $scope.eventoId })
                $scope.passoAtivoAbasFixas = 12;
            }

            $scope.desabilitarNovoEvento = function () {
                if ($scope.dadosOs.statusId == 3 || $scope.dadosOs.statusId == 4 || $scope.dadosOs.statusId == 5) {
                    return true;
                }
                return false;
            }

            var ObterListaComplementarEvento = function (listaId) {
                EventosService.getObterListaComplementarEvento($scope.eventoId, listaId)
                    .then(function (response) {
                        
                        if (listaId == 1) {
                            $scope.listaMateriaisEvento = response.data;
                        }
                        if (listaId == 2) {
                            $scope.listaEquipamentosEvento = response.data;
                        }
                        if (listaId == 3) {
                            $scope.dadosAbasComplementaresEvento.maodeObra = response.data;
                        }
                        if (listaId == 4) {
                            $scope.dadosAbasComplementaresEvento.servicos = response.data;
                        }
                        if (listaId == 8) {
                            $scope.dadosAbasComplementaresEvento.tarefas = response.data;
                        }
                        if (listaId == 11) {
                            $scope.dadosAbasComplementaresEvento.vala = response.data;
                        }
                        if (listaId == 12) {
                            $scope.dadosAbasComplementaresEvento.observacoes = response.data;
                        }
                        if (listaId == 13) {
                            $scope.dadosAbasComplementaresEvento.andamentos = response.data;
                        }
                       
                       
                    });
            }

            $scope.modalConfirmacao = function (tarefa) {
                if (tarefa.tarefaId == 1) {
                    OrdensServicoService.getObterDadosEventoCorteLigacao($scope.eventoId)
                        .then(function (response) {
                            if (response) {
                                $scope.dadosCorte = response.data;
                                $scope.dataCorte = $filter('date')($scope.dadosCorte.dataCorte, "dd/MM/yyyy");
                            }
                        })
                    $("#modalConfirmaTarefaCorte").modal();
                }
                else if (tarefa.tarefaId == 2) {
                    OrdensServicoService.getObterDadosEventoReligacaoLigacao($scope.eventoId)
                        .then(function (response) {
                            if (response) {
                                $scope.dadosReligacao = response.data;
                                $scope.dataReligacao = $filter('date')($scope.dadosReligacao.dataReligacao, "dd/MM/yyyy");
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
                else if (tarefa.tarefaId == 7) {
                    OrdensServicoService.getObterDadosAlteracaoCadastral($scope.eventoId)
                        .then(function (response) {
                            if (response) {
                                $scope.dadosAlteracaoCadastral = response.data;
                            }
                        })

                    $scope.$watch('dadosAlteracaoCadastral.logradouroId', function (newValue) {
                        if (!newValue) {
                            return;
                        }

                        OrdensServicoService.PesquisaBairrosLogradouro(newValue)
                            .then(function (response) {
                                if (response.data.length == 1) {
                                    $scope.dadosAlteracaoCadastral.bairroId = response.data[0].bairroId;
                                }
                            })

                        OrdensServicoService.PesquisaCepsCodigoLogradouro(newValue)
                            .then(function (response) {
                                if (response.data.length == 1) {
                                    $scope.dadosAlteracaoCadastral.cepId = response.data[0].cepId;
                                }
                            })
                    })

                    $scope.$watch('dadosAlteracaoCadastral.logradouroEntregaId', function (newValue) {
                        if (!newValue) {
                            return;
                        }

                        OrdensServicoService.PesquisaBairrosLogradouro(newValue)
                            .then(function (response) {
                                if (response.data.length == 1) {
                                    $scope.dadosAlteracaoCadastral.bairroEntregaId = response.data[0].bairroId;
                                }
                            })

                        OrdensServicoService.PesquisaCepsCodigoLogradouro(newValue)
                            .then(function (response) {
                                if (response.data.length == 1) {
                                    $scope.dadosAlteracaoCadastral.cepEntregaId = response.data[0].cepId;
                                }
                            })
                    })

                    $scope.$watch('dadosAlteracaoCadastral.logradouroCorrespondenciaId', function (newValue) {
                        if (!newValue) {
                            return;
                        }

                        OrdensServicoService.PesquisaBairrosLogradouro(newValue)
                            .then(function (response) {
                                if (response.data.length == 1) {
                                    $scope.dadosAlteracaoCadastral.bairroCorrespondenciaId = response.data[0].bairroId;
                                }
                            })

                        OrdensServicoService.PesquisaCepsCodigoLogradouro(newValue)
                            .then(function (response) {
                                if (response.data.length == 1) {
                                    $scope.dadosAlteracaoCadastral.cepCorrespondenciaId = response.data[0].cepId;
                                }
                            })
                    })

                    $scope.logradouroCorrespondencia = 'digitarEnderecoCorrespondencia';
                    $scope.logradouroEntrega = 'digitarEnderecoEntrega';
                    $scope.errosModalConfirmaTarefaAlteracao = undefined;
                    $("#modalConfirmaTarefaAlteracaoCadastral").modal();
                    $scope.passoAtivoAbasAlteracaoCadastral = 1;
                }
                else if (tarefa.tarefaId == 8) {
                    $scope.dadosNovaLigacao = {};
                    $scope.novaLigacaoForm.$setPristine();

                    OrdensServicoService.getObterDadosEventoNovaLigacao($scope.eventoId)
                        .then(function (response) {
                            $scope.dadosNovaLigacao = response.data;
                            $scope.dadosNovaLigacao.eventoId = $scope.eventoId;
                            $scope.dadosNovaLigacao.ordemServicoId = $scope.dadosOs.ordemServicoId;
                            $scope.dadosNovaLigacao.eventoTarefaId = $scope.dados.eventoTarefaId;
                            if ($scope.dadosNovaLigacao.listaPessoas.length == 1) {
                                $scope.pessoaSelecionada = $scope.dadosNovaLigacao.listaPessoas[0];
                                $scope.dadosNovaLigacao.pessoaFisJurId = $scope.dadosNovaLigacao.listaPessoas[0].pessoaId;
                            }
                            console.log($scope.dadosNovaLigacao.listaPessoas.length);
                        })
                    $("#modalConfirmaTarefaCriacaoNovaLigacao").modal();
                    $scope.passoAtivoAbasNovaLigacao = 1;
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
                else if (tarefa.tarefaId == 13) {
                    OrdensServicoService.getObterDadosEventoCobrancaServico($scope.eventoId)
                        .then(function (response) {
                            $scope.dadosCobrancaServicos = response.data;
                        })
                    $("#modalConfirmaCobrancaServico").modal();
                }
                else if (tarefa.tarefaId == 14) {
                    OrdensServicoService.getObterDadosEventoHistoricoEncerramento($scope.eventoId)
                        .then(function (response) {
                            $scope.dadosHistoricoEncerramento = response.data;
                        })
                    $("#modalHistoricoEncerramento").modal();
                }
                else if (tarefa.tarefaId == 15) {
                    OrdensServicoService.getObterDadosEventoTrocaTitularidade($scope.eventoId)
                        .then(function (response) {
                            $scope.dadosTrocaTitularidade = response.data;
                            var responsaveisSelecionados = [];
                            $scope.responsaveisSelecionados = responsaveisSelecionados;

                            $scope.verificarResponsavelSelecionado = function (responsavel) {
                                for (var n = 0; n < $scope.responsaveisSelecionados.length; n++) {
                                    if ($scope.responsaveisSelecionados[n] == responsavel) {
                                        return true;
                                    }
                                }
                            }

                            $scope.selecionarResponsavel = function (responsavel) {
                                if ($scope.verificarResponsavelSelecionado(responsavel)) {
                                    $scope.responsaveisSelecionados.splice($scope.responsaveisSelecionados.indexOf(responsavel), 1);
                                }
                                else {
                                    $scope.responsaveisSelecionados.push(responsavel);
                                }
                            }

                            $scope.selecionarTodasOrdensServico = function (responsaveis) {
                                responsaveis.forEach(function (responsavel) {
                                    if (!$scope.verificarResponsavelSelecionado(responsavel)) {
                                        $scope.responsaveisSelecionados.push(responsavel);
                                    }
                                })
                            }

                            $scope.limparTodasOrdensServico = function (responsaveis) {
                                responsaveis.forEach(function (ordemServico) {
                                    if ($scope.verificarResponsavelSelecionado(ordemServico)) {
                                        $scope.responsaveisSelecionados.splice($scope.responsaveisSelecionados.indexOf(ordemServico), 1)
                                    }
                                })
                            }

                            OrdensServicoService.getCadPessoas()
                                .then(function (response) {
                                    $scope.cadPessoas = response.data;
                                })

                        })
                    $("#modalConfirmaTarefaTrocaTitularidade").modal();
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
                else if (tarefa.tarefaId == 19) {
                    OrdensServicoService.obterDadosEventoIncluirLigacaoImobiliaria($scope.eventoId)
                        .then(function (response) {
                            $scope.dadosIncluirLigacaoImobiliaria = response.data;
                            $("#modalConfirmaTarefaLigacaoImobiliaria").modal();
                        })
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
                else if (tarefa.tarefaId == 21) {
                    OrdensServicoService.getObterDadosInativacaoLigacao($scope.eventoId)
                        .then(function (response) {
                            if (response) {
                                $scope.dadosLigacao = response.data;
                            }
                        })
                    $("#modalConfirmaTarefaInativacaoLigacao").modal();
                }
                else if (tarefa.tarefaId == 22) {
                    OrdensServicoService.obterDadosEventoExcluirLigacaoImobiliaria($scope.eventoId)
                        .then(function (response) {
                            if (response) {
                                $scope.dadosExcluirLigacaoImobiliaria = response.data;
                            }
                        })
                    $("#modalConfirmaTarefaExcluirLigacaoImobiliaria").modal();
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
                else if (tarefa.tarefaId == 24) {
                    OrdensServicoService.getObterDadosEventoServicosLancados($scope.eventoId)
                        .then(function (response) {
                            $scope.dadosServicosLancados = response.data;
                        })
                    $("#modalBloqueiaServicosLancados").modal();
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
                    hidrometroColocado: dadosHidrometro.hidrometroColocado,
                    hidrometroRetirado: dadosHidrometro.hidrometroRetirado,
                    leituraHidrColocado: dadosHidrometro.leituraHidrColocado,
                    LeituraHidrRet: dadosHidrometro.leituraHidrRet,
                    dataNovaLacre: dadosHidrometro.dataNovaLacre,
                    nroNovoLacre: dadosHidrometro.nroNovoLacre,
                    observacao: dadosHidrometro.observacao,
                    motivoId: dadosHidrometro.motivoId,
                    dataTroca: dadosHidrometro.dataTroca,
                    responsavel: dadosHidrometro.responsavel,
                    situacaoHidrometroColocadoId: dadosHidrometro.situacaoHidrometroColocadoId,
                    situacaoHidrometroRetId: dadosHidrometro.situacaoHidrometroRetId,
                    referencia: dadosHidrometro.referencia,
                    ultimaLeitura: dadosHidrometro.ultimaLeitura
                }

                OrdensServicoService.postTrocarHidrometro(model)
                    .then(function (response) {
                        $("#modalConfirmaTrocaHidrometro").modal("hide");
                        ngNotify.set(response.data, "success");
                        $scope.dadosTrocaHidrometro = {};
                        ObterListaComplementarEvento(8);
                    })
            }

            $scope.cobrarServico = function (dadosServicos) {

                var model = {
                    cdc: dadosServicos.cdc,
                    ordemServicoId: $scope.dadosOs.ordemServicoId,
                    eventoTarefaId: $scope.dados.eventoTarefaId,
                    qtdParcelasTodos: 1,
                    qtdParcelasMaterial: 1,
                    qtdParcelasMaoDeObra: 1,
                    qtdParcelasEquipamento: 1,
                    qtdParcelasVala: 1,
                    qtdParcelasAgrupaMaterialEquipamento: 1,
                    qtdParcelasAgrupaMaterialMaoDeObra: 1,
                    qtdParcelasAgrupaEquipamentoMaoDeObra: 1,
                    referencia: dadosServicos.referencia,
                    listaServicos: [],
                    listaChavesServicos: [],
                    listaChavesEquipamentos: [],
                    listaChavesMateriais: [],
                    listaChavesMaoDeObras: [],
                    listaChavesValas: [],
                    listaCdc: []
                }

                dadosServicos.listaCobrancaServico.forEach(function (servico) {

                    if (servico.indicadorCobrancaServico == 0) {
                        model.qtdParcelasTodos = servico.qtdParcelas;
                    }
                    if (servico.indicadorCobrancaServico == 1) {
                        model.qtdParcelasMaterial = servico.qtdParcelas;
                    }
                    if (servico.indicadorCobrancaServico == 2) {
                        model.qtdParcelasMaoDeObra = servico.qtdParcelas;
                    }
                    if (servico.indicadorCobrancaServico == 3) {
                        model.qtdParcelasEquipamento = servico.qtdParcelas;
                    }
                    if (servico.indicadorCobrancaServico == 4) {
                        model.qtdParcelasAgrupaMaterialEquipamento = servico.qtdParcelas;
                    }
                    if (servico.indicadorCobrancaServico == 5) {
                        model.qtdParcelasAgrupaMaterialMaoDeObra = servico.qtdParcelas;
                    }
                    if (servico.indicadorCobrancaServico == 6) {
                        model.qtdParcelasAgrupaEquipamentoMaoDeObra = servico.qtdParcelas;
                    }
                    if (servico.indicadorCobrancaServico == 7) {
                        model.qtdParcelasVala = servico.qtdParcelas;
                    }
                    model.listaServicos.push(servico);
                })

                dadosServicos.listaChavesEquipamentos.forEach(function (chave) {
                    model.listaChavesEquipamentos.push(chave);
                })
                dadosServicos.listaChavesMateriais.forEach(function (chave) {
                    model.listaChavesMateriais.push(chave);
                })
                dadosServicos.listaChavesServicos.forEach(function (chave) {
                    model.listaChavesServicos.push(chave);
                })
                dadosServicos.listaChavesMaoDeObras.forEach(function (chave) {
                    model.listaChavesMaoDeObras.push(chave);
                })
                dadosServicos.listaChavesValas.forEach(function (chave) {
                    model.listaChavesValas.push(chave);
                })

                OrdensServicoService.postCobrarServico(model)
                    .then(function (response) {
                        $("#modalConfirmaCobrancaServico").modal("hide");
                        ngNotify.set(response.data, "success");
                        $scope.dadosCobrancaServicos = {};

                        ObterListaComplementarEvento(1);
                        ObterListaComplementarEvento(2);
                        ObterListaComplementarEvento(3);
                        ObterListaComplementarEvento(4);
                        ObterListaComplementarEvento(8);
                        ObterListaComplementarEvento(11);
                    })
            }

            $scope.cadastrarLigacao = function (dadosNovaLigacao) {

                OrdensServicoService.postIncluirNovaLigacao(dadosNovaLigacao)
                    .then(function (response) {
                        if (response.data.statusCode == 200) {
                            ngNotify.set(response.data.message, "success")
                        }
                        else {
                            ngNotify.set(response.data.message, "error")
                        }
                        $("#modalConfirmaTarefaCriacaoNovaLigacao").modal('hide');
                        $scope.dadosNovaLigacao = {};
                        ObterListaComplementarEvento(8);
                    })
            }

            $scope.inativarLigacao = function (dadosLigacao) {
                var model = {
                    eventoTarefaId: $scope.dados.eventoTarefaId,
                    cdc: dadosLigacao.cdc,
                }

                OrdensServicoService.postInativarLigacao(model)
                    .then(function (response) {
                        $("#modalConfirmaTarefaInativacaoLigacao").modal("hide");
                        ngNotify.set(response.data, "success");
                        $scope.dadosLigacao = {};
                        ObterListaComplementarEvento(8);
                    })
            }

            $scope.alterarCadastro = function (dadosAlteracaoCadastral) {
                dadosAlteracaoCadastral.ordemServicoId = $scope.dadosOs.ordemServicoId;
                dadosAlteracaoCadastral.eventoId = $scope.dados.eventoId;
                dadosAlteracaoCadastral.eventoTarefaId = $scope.dados.eventoTarefaId;

                OrdensServicoService.postAtualizarCadastro(dadosAlteracaoCadastral)
                    .then(function (response) {

                        if (response.data.statusCode == 200) {
                            ngNotify.set(response.data.message, "success")
                        }
                        else {
                            ngNotify.set(response.data.message, "error")
                        }
                        $("#modalConfirmaTarefaAlteracaoCadastral").modal('hide');
                        $scope.dadosAlteracaoCadastral = {};
                        ObterListaComplementarEvento(8);
                        $scope.errosModalConfirmaTarefaAlteracao = undefined;
                    }, function (error) {
                        ngNotify.set(error.data.exceptionMessage, "error")
                        $scope.errosModalConfirmaTarefaAlteracao = error.data.exceptionMessage;
                    })

            }

            $scope.criarResponsavel = function (dadosTrocaTitularidade) {
                var model = {
                    eventoTarefaId: $scope.dados.eventoTarefaId,
                    cdc: dadosTrocaTitularidade.ligacaoId,
                    nome: dadosTrocaTitularidade.nome,
                    rg: dadosTrocaTitularidade.rg,
                    cpf: dadosTrocaTitularidade.cpf,
                    nomeMae: dadosTrocaTitularidade.nomeMae,
                    dataNascimento: dadosTrocaTitularidade.dataNascimento,
                    email: dadosTrocaTitularidade.email,
                    inicioResponsabilidade: dadosTrocaTitularidade.inicioResponsabilidade,
                    tipo: dadosTrocaTitularidade.tipo,
                    tipoResponsavelId: dadosTrocaTitularidade.tipoResponsavelId,
                    celular: dadosTrocaTitularidade.celular,
                    inicioReferenciaDebito: dadosTrocaTitularidade.inicioReferenciaDebito,
                    telefone: dadosTrocaTitularidade.telefone,
                    flagResponsavelImovel: dadosTrocaTitularidade.flagResponsavelImovel,
                    responsaveisLigacao: [],
                    responsaveis: []
                }

                $scope.dadosTrocaTitularidade.responsaveisLigacao.forEach(function (responsavel) {
                    model.responsaveis.push(responsavel);
                });

                OrdensServicoService.postCriarResponsavel(model)
                    .then(function (response) {
                        if (response.data.status == 200) {
                            ngNotify.set(response.data.mensagem, "success")
                            $("#modalConfirmaTarefaTrocaTitularidade").modal('hide');
                            $scope.dadosTrocaTitularidade = {};
                            ObterListaComplementarEvento(8);
                        }
                        else {
                            ngNotify.set(response.data.mensagem, "error")
                        }
                    })
            }

            $scope.atualizarResponsavel = function (dadosTrocaTitularidade) {
                var model = {
                    eventoTarefaId: $scope.dados.eventoTarefaId,
                    cdc: dadosTrocaTitularidade.ligacaoId,
                    responsaveisId: [],
                    nome: dadosTrocaTitularidade.nome,
                    rg: dadosTrocaTitularidade.rg,
                    cpf: dadosTrocaTitularidade.cpf,
                    nomeMae: dadosTrocaTitularidade.nomeMae,
                    dataNascimento: dadosTrocaTitularidade.dataNascimento,
                    telefone: dadosTrocaTitularidade.telefone,
                    celular: dadosTrocaTitularidade.celular,
                    email: dadosTrocaTitularidade.email,
                    tipo: dadosTrocaTitularidade.tipo,
                    tipoResponsavelId: dadosTrocaTitularidade.tipoResponsavelId,
                    inicioResponsabilidade: dadosTrocaTitularidade.inicioResponsabilidade,
                    inicioReferenciaDebito: dadosTrocaTitularidade.inicioReferenciaDebito,
                    flagResponsavelImovel: dadosTrocaTitularidade.flagResponsavelImovel,
                    imovelId: 0,
                    responsaveisLigacao: [],
                    responsaveis: []
                }

                $scope.responsaveisSelecionados.forEach(function (responsavel) {
                    model.responsaveisId.push(responsavel.responsavelId);

                    if (responsavel.imovelId > 0) {
                        model.imovelId = responsavel.imovelId
                    }
                });

                $scope.responsaveisSelecionados.forEach(function (responsavel) {
                    model.responsaveisLigacao.push(responsavel);
                });

                $scope.dadosTrocaTitularidade.responsaveisLigacao.forEach(function (responsavel) {
                    model.responsaveis.push(responsavel);
                });

                OrdensServicoService.postAtualizarResponsaveis(model)
                    .then(function (response) {
                        if (response.data.status == 200) {
                            ngNotify.set(response.data.mensagem, "success")
                            $("#modalConfirmaTarefaTrocaTitularidade").modal('hide');
                            $scope.dadosTrocaTitularidade = {};
                            ObterListaComplementarEvento(8);
                        }
                        else {
                            ngNotify.set(response.data.mensagem, "error")
                        }
                    });
            }

            $scope.incluirLigacaoImobiliaria = function (dadosIncluirLigacaoImobiliaria) {

                dadosIncluirLigacaoImobiliaria.eventoTarefaId = $scope.dados.eventoTarefaId;

                OrdensServicoService.incluirLigacaoImobiliaria(dadosIncluirLigacaoImobiliaria)
                    .then(function (response) {
                        ngNotify.set(response.data.mensagem, "success");
                        $scope.dadosIncluirLigacaoImobiliaria = {};
                        $("#modalConfirmaTarefaLigacaoImobiliaria").modal('hide');
                        ObterListaComplementarEvento(8);
                    })
            }

            $scope.excluirLigacaoImobiliaria = function (dadosExcluirLigacaoImobiliaria) {

                dadosExcluirLigacaoImobiliaria.eventoTarefaId = $scope.dados.eventoTarefaId;

                OrdensServicoService.excluirLigacaoImobiliaria(dadosExcluirLigacaoImobiliaria)
                    .then(function (response) {
                        ngNotify.set(response.data.mensagem, "success");
                        $scope.dadosExcluirLigacaoImobiliaria = {};
                        $("#modalConfirmaTarefaExcluirLigacaoImobiliaria").modal('hide');
                        ObterListaComplementarEvento(8);
                    })
            }

            $scope.incluirUsuarioLigacao = function (dadosIncluirUsuarioLigacao) {
                dadosIncluirUsuarioLigacao.eventoId = $scope.eventoId
                dadosIncluirUsuarioLigacao.eventoTarefaId = $scope.dados.eventoTarefaId
                OrdensServicoService.incluirUsuarioLigacao(dadosIncluirUsuarioLigacao)
                    .then(function (response) {
                        ngNotify.set(response.data.mensaegem, "sucess");
                        $("#modalIncluirUsuarioLigacao").modal('hide');
                        ObterListaComplementarEvento(8);
                    })

            }

            $scope.bloquearServicosLancados = function (dadosServicosLancados) {

                $scope.servicosSelecionados.forEach(function (chave) {
                    $scope.idsServicos.push(chave.servicoId);
                })

                var model = {
                    cdc: $scope.dadosServicosLancados.cdc,
                    eventoTarefaId: $scope.dados.eventoTarefaId,
                    ordemServicoId: $scope.dadosOs.ordemServicoId,
                    listaChavesServicos: $scope.idsServicos
                }

                OrdensServicoService.postBloquearServicosLancados(model)
                    .then(function (response) {
                        $("#modalBloqueiaServicosLancados").modal("hide");
                        ngNotify.set(response.dados, "success");
                        $scope.dadosServicosLancados = {};
                        ObterListaComplementarEvento(8);
                    })
            }

            $scope.verificarTipoMoeda = function (servico) {
                if (servico.tipoMoeda == "I") return 4;
                return 2;
            }

            $scope.abrirModalSelecionarLogradouroEntrega = function () {
                $("#selecionarLogradouroEntrega").modal("show");
            }

            $scope.abrirModalSelecionarLogradouroCorrespondencia = function () {
                $("#selecionarLogradouroCorrespondencia").modal("show");
            }

            $scope.abrirModalSelecionarBairroEntrega = function () {
                $("#selecionarBairroEntrega").modal("show");
            }

            $scope.abrirModalSelecionarBairroCorrespondencia = function () {
                $("#selecionarBairroCorrespondencia ").modal("show");
            }

            $scope.selecionarLogradouroEntrega = function () {
                OrdensServicoService.obterDescricaoEnderecoEntregaSelecionado($scope.dadosAlteracaoCadastral.logradouroEntregaId)
                    .then(function (response) {
                        var descricaoEndereco = "";

                        if (response.data.abreviacao) {
                            descricaoEndereco += response.data.abreviacao + " ";
                        }

                        if (response.data.titulo) {
                            descricaoEndereco += response.data.titulo + " ";
                        }

                        descricaoEndereco += response.data.nome

                        $scope.dadosAlteracaoCadastral.descricaoLogradouroEntrega = descricaoEndereco;

                        $("#selecionarLogradouroEntrega").modal("hide");
                    })
            }

            $scope.selecionarLogradouroCorrespondencia = function () {
                OrdensServicoService.obterDescricaoEnderecoEntregaSelecionado($scope.dadosAlteracaoCadastral.logradouroCorrespondenciaId)
                    .then(function (response) {
                        var descricaoEndereco = "";

                        if (response.data.abreviacao) {
                            descricaoEndereco += response.data.abreviacao + " ";
                        }

                        if (response.data.titulo) {
                            descricaoEndereco += response.data.titulo + " ";
                        }

                        descricaoEndereco += response.data.nome

                        $scope.dadosAlteracaoCadastral.descricaoLogradouroCorrespondencia = descricaoEndereco;

                        $("#selecionarLogradouroCorrespondencia").modal("hide");
                    })
            }

            $scope.selecionarBairroEntrega = function () {
                OrdensServicoService.obterDescricaoBairroEntregaSelecionado($scope.dadosAlteracaoCadastral.bairroEntregaId)
                    .then(function (response) {
                        $scope.dadosAlteracaoCadastral.descricaoBairroEntrega = response.data.descricao;

                        $("#selecionarBairroEntrega").modal("hide");
                    })
            }

            $scope.selecionarBairroCorrespondencia = function () {
                OrdensServicoService.obterDescricaoBairroEntregaSelecionado($scope.dadosAlteracaoCadastral.bairroCorrespondenciaId)
                    .then(function (response) {
                        $scope.dadosAlteracaoCadastral.descricaoBairroCorrespondencia = response.data.descricao;

                        $("#selecionarBairroEntrega").modal("hide");
                    })
            }

            $scope.buscarEnderecoEntrega = function (cdc) {
                OrdensServicoService.obterEnderecoEntrega(cdc)
                    .then(function (response) {
                        $scope.dadosAlteracaoCadastral.logradouroEntregaId = response.data.logradouroId;
                        $scope.dadosAlteracaoCadastral.descricaoLogradouroEntrega = response.data.logradouro.nome;
                        $scope.dadosAlteracaoCadastral.descricaoBairroEntrega = response.data.bairro.descricao;
                        $scope.dadosAlteracaoCadastral.numeroEntrega = response.data.numero;
                        $scope.dadosAlteracaoCadastral.complementoEntrega = response.data.complemento;
                        $scope.dadosAlteracaoCadastral.bairroEntregaId = response.data.bairroId;
                        $scope.dadosAlteracaoCadastral.cepEntrega = response.data.cepId;
                        $scope.dadosAlteracaoCadastral.municipioEntrega = response.data.municipioEntrega;
                        $scope.dadosAlteracaoCadastral.ufEntrega = response.data.estadoEntrega;
                        $scope.dadosAlteracaoCadastral.inscricaoEntrega = response.data.inscricaoEntrega;
                    })
            }

            $scope.buscarEnderecoCorrespondencia = function (cdc) {
                OrdensServicoService.obterEnderecoEntrega(cdc)
                    .then(function (response) {
                        $scope.dadosAlteracaoCadastral.logradouroCorrespondenciaId = response.data.logradouroId;
                        $scope.dadosAlteracaoCadastral.descricaoLogradouroCorrespondencia = response.data.logradouro.nome;
                        $scope.dadosAlteracaoCadastral.descricaoBairroCorrespondencia = response.data.bairro.descricao;
                        $scope.dadosAlteracaoCadastral.numeroCorrespondencia = response.data.numero;
                        $scope.dadosAlteracaoCadastral.complementoCorrespondencia = response.data.complemento;
                        $scope.dadosAlteracaoCadastral.bairroCorrespondenciaId = response.data.bairroId;
                        $scope.dadosAlteracaoCadastral.cepCorrespondencia = response.data.cepId;
                        $scope.dadosAlteracaoCadastral.municipioCorrespondencia = response.data.municipioCorrespondencia;
                        $scope.dadosAlteracaoCadastral.ufCorrespondencia = response.data.estadoCorrespondencia;
                        $scope.dadosAlteracaoCadastral.inscricaoEntrega = response.data.inscricaoEntrega;
                    })
            }

            $scope.modalInclusaoObservacao = function () {
                $scope.dadosObservacao = {};
                $("#modalIncluiObservacao").modal();
            }

            $scope.modalEdicaoObservacao = function (dadosObservacao) {
                $scope.dadosObservacao = angular.copy(dadosObservacao);
                $("#modalEdicaoObservacao").modal();
            }

            $scope.modalExcluiObservacao = function (dadosObservacao) {
                $scope.dadosObservacao = angular.copy(dadosObservacao);
                $("#modalExcluiObservacao").modal();
            }

            $scope.modalEncaminharEvento = function () {
                $scope.dadosEncaminharEvento = {};
                $("#modalEncaminharEvento").modal();
            }

            $scope.encaminharEvento = function (dadosEncaminharEvento) {
                var model = {
                    eventoId: $scope.eventoId,
                    centrocustodestinoId: dadosEncaminharEvento.centroCustoId,
                    observacao: dadosEncaminharEvento.observacao
                };

                OrdensServicoService.postEncaminharEvento(model)
                    .then(function (response) {
                        $("#modalEncaminharEvento").modal("hide");
                        $scope.dadosEncaminharEvento = {};
                        obterDadosEdicaoEvento();
                        ObterListaComplementarEvento(12);
                        ObterListaComplementarEvento(13);
                    })
            }

            $scope.modalAlterarServicoEvento = function () {
                $scope.dadosAlterarServicoEvento = {};
                $("#modalAlterarServicoEvento").modal();
            }

            $scope.alterarServicoEvento = function (dadosAlterarServicoEvento) {
                var model = {
                    eventoId: $scope.eventoId,
                    tipoServicoNovoId: dadosAlterarServicoEvento.tipoServicoId,
                };

                OrdensServicoService.postAlterarServicoEvento(model)
                    .then(function (response) {
                        $("#modalAlterarServicoEvento").modal("hide");
                        $scope.dadosAlterarServicoEvento = {};
                        obterDadosEdicaoEvento();
                        ObterListaComplementarEvento(8);
                    })
            }

            $scope.incluirObservacao = function (dadosObservacao) {
                var model = {
                    eventoId: $scope.eventoId,
                    observacao: dadosObservacao.descricao
                };

                OrdensServicoService.postIncluirObservacao(model)
                    .then(function (response) {
                        $("#modalIncluiObservacao").modal("hide");
                        $scope.dadosObservacao = {};
                        ObterListaComplementarEvento(12);
                    })
            }

            $scope.editarObservacao = function (dadosObservacao) {
                var model = {
                    eventoObservacaoId: dadosObservacao.eventoObservacaoId,
                    observacao: dadosObservacao.descricao
                }

                OrdensServicoService.putEditarObservacao(model)
                    .then(function (response) {
                        $("#modalEdicaoObservacao").modal("hide");
                        $scope.dadosObservacao = {};
                        ObterListaComplementarEvento(12);
                    })
            }

            $scope.excluirObservacao = function (dadosObservacao) {
                OrdensServicoService.deleteObservacao(dadosObservacao.eventoObservacaoId)
                    .then(function (response) {
                        $("#modalExcluiObservacao").modal("hide");
                        ObterListaComplementarEvento(12);
                    })
            }

            $scope.imprimirInformacoesAdicionais = function () {
                fileDownloadService.get('Api/Chamados/' + $scope.eventoId + '/ImprimirInformacoesAdicionais', "ImprimirInformacoesAdicionais", "pdf")
            }

            $scope.modalReferenciaTermoParcelamento = function () {
                $scope.dadosTermo = {};
                $("#modalReferenciaTermoParcelamento").modal();
            }

            //Termo de Parcelamento
            $scope.imprimirTermoParcelamento = function () {
                fileDownloadService.get('Api/Eventos/' + $scope.eventoId + '/ImpressaoTermoParcelamento?mesReferencia=' + $scope.dadosTermo.mesReferencia, "TermoParcelamento", "pdf")
                $("#modalReferenciaTermoParcelamento").modal("hide");
            }

            EventosService.getExibeTermoParcelamento(3030011).then(function (response) {
                $scope.exibeTermoParcelamento = response.data;
            });

            $scope.verificarServicoSelecionado = function (servico) {
                for (var n = 0; n < $scope.servicosSelecionados.length; n++) {
                    if ($scope.servicosSelecionados[n] == servico) {
                        return true;
                    }
                }
            }

            $scope.selecionarServico = function (servico) {
                if ($scope.verificarServicoSelecionado(servico)) {
                    $scope.servicosSelecionados.splice($scope.servicosSelecionados.indexOf(servico), 1);
                }
                else {
                    $scope.servicosSelecionados.push(servico);
                }
            }

            $scope.verificarPessoaSelecionada = function (pessoa) {
               if ($scope.pessoaSelecionada == pessoa) {
                   return true;
               }
            }

            $scope.selecionarPessoa = function (pessoa) {
                $scope.pessoaSelecionada = pessoa;
                $scope.dadosNovaLigacao.pessoaFisJurId = pessoa.pessoaId;
            }
            

            //Termo Liberação Habite-se
            $scope.imprimirTermoLiberacaoHabitese = function () {
                fileDownloadService.get('Api/Chamados/' + $scope.eventoId + '/ImpressaoTermoLiberacaoHabitese', "TermoLiberacaoHabitese", "pdf")
            }

            EventosService.getExibeTermoLiberacaoHabitese(3030012).then(function (response) {
                $scope.exibeTermoLiberacaoHabitese = response.data;
            });

            //Impressão Observações do Evento
            $scope.imprimirObservacoesEvento = function () {
                fileDownloadService.get('Api/Eventos/' + $scope.eventoId + '/ImprimirObservacoesEvento', "ObservacoesEvento", "pdf")
            }

            $scope.modalProgramarColetor = function () {
                $scope.dadosProgramacaoColetorOs.centroCustoId = '';
                $scope.dadosProgramacaoColetorOs.equipeId = '';
                $scope.dadosProgramacaoColetorOs.tipoProgramacao = '';

                $("#modalProgramarColetorOrdemServico").modal();
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

                model.eventosId.push($scope.eventoId);

                //Interna
                if ($scope.dadosOs.centroCustoId != null) {
                    model.tipoOs = 2;
                }
                // Externa
                else {
                    model.tipoOs = 1;
                }

                OrdensServicoService.postProgramarColetorOs(model)
                    .then(function (response) {
                        ngNotify.set('A programação do evento para o coletor foi realizada!', 'success');
                        $("#modalProgramarOrdemServico").modal("hide");
                        obterDadosEdicaoEvento();
                    })
            }

            $scope.obterCampos = function (id) {
                OrdensServicoService.obterCampos(id)
                    .then(function (response) {
                        $scope.campos = response.data;
                        console.log($scope.campos.tamanhoConteudo);
                    })
            }

            $scope.obterCampos(27);
           

        });
});
