define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'EditarGeralEditarChamado', 'ordemServicoId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $window, $http, $stateParams, ChamadosService, fileDownloadService, OrdensServicoService, ngNotify, errorsValidationService, $location, $anchorScroll) {

            // --- Declaração de variáveis básicas
            $scope.valorTotal = 0;
            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");
            var dTColumnDefBuilder = $injector.get("DTColumnDefBuilder");

            $scope.dtOptionsOrdensServicoRelacionadas = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            $scope.dtOptionsCadastros = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json')
                .withOption('order', [0]);

            $scope.dtOptionsServicos = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json')
                .withOption('order', [0]);

            $scope.dtOptionsContas = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json')
                .withOption('order', [0]);

            $scope.dtOptionsHistoricos = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json')
                .withOption('order', [0]);

            // Inicialização da variável de Chamado Id
            $scope.chamadoId = $stateParams.chamadoId;

            // Inicialização da variável de dados básicos do chamado (pois existe uma função de status, e o objeto não pode ser nulo)
            $scope.dadosBasicosChamado = {};
            $scope.tipoPagamento = {};
            $scope.flagGeraGuia = false;

            // Inicialização das listas complementares das abas fixas.
            $scope.listaComplementarCadastros = [];
            $scope.listaComplementarServicos = [];
            $scope.listaComplementarContas = [];
            $scope.listaComplementarHistoricosChamado = [];

            // Inicialização da lista de combo de cobrança de serviços.
            $scope.listaCobrancaServicos = [];

            // Inicialização da variável de adição de novo serviço (necessário pois tem um watcher vinculada a ela).
            $scope.novoServicoListaComplementar = {};

            // Inicialização de combos de Bairro e Cep 
            $scope.comboBairros = [];
            $scope.comboCeps = [];
            $scope.cdc = {};


            // --- Obtenção de dados

            // Prepara o objeto de consulta de dados da geração de campos.
            var modelObtencaoDadosGeracaoCampos = {
                chamadoId: $scope.chamadoId,
            }

            // Busca as configurações para a geração de campos.
            ChamadosService.getDadosGeracaoCamposTipoChamado(modelObtencaoDadosGeracaoCampos)
                .then(function (responseDadosGeracaoCampos) {
                    $scope.modelPassosCamposGeracao = responseDadosGeracaoCampos.data;
                })
            // Consultar os dados do chamado e distribuir as informações aos seus devidos lugares.
            ChamadosService.obterDadosManutencaoChamado($scope.chamadoId)
                .then(function (response) {
                    // Criando variável de informações fixas do chamado.
                    $scope.dadosBasicosChamado = {
                        chamadoId: response.data.chamadoId,
                        ordemServicoId: response.data.ordemServicoId,
                        nomeAtendente: response.data.nomeAtendente,
                        dataTermino: response.data.dataTermino,
                        descricaoAtendimento: response.data.descricaoAtendimento,
                        descricaoTipoChamado: response.data.descricaoTipoChamado,
                        statusChamado: response.data.status,
                        atendimentoId: response.data.tipoAtendimentoId,
                        tipoChamadoId: response.data.tipoChamadoId,
                        centroCustoId: response.data.centroCustoId,
                        imprimeTrocaTitularidade: response.data.imprimeTrocaTitularidade,
                        imprimeContratoLigacaoNova: response.data.imprimeContratoLigacaoNova,
                        imprimeTermo: response.data.imprimeTermo,
                        imprimeGuia: response.data.imprimeGuia,
                        imprimeTermoDoacao: response.data.imprimeTermoDoacao,
                        imprimeProtocolo: response.data.imprimeProtocolo
                    }

                    // Inicializa a variável de controle de abas fixas na primeira aba (cadastros)
                    $scope.passoAtivoAbasFixas = $scope.dadosBasicosChamado.centroCustoId == null ? 2 : 3;

                    //Obtém o cdc através da Ordem de Serviço para depois copiar os dados do imóvel do mesmo
                    ChamadosService.consultarChamadosOrdemServico($scope.dadosBasicosChamado.ordemServicoId)
                        .then(function (response) {
                            $scope.cdc = response.data[0].cdc;
                        })

                    $scope.listaComplementarCadastros = response.data.cadastros;
                    response.data.servicos.forEach(function (item) {
                        $scope.listaComplementarServicos.push({
                            lancaServicoId: item.lancaServicoId,
                            tipoServicoId: item.tipoServicoId,
                            descricao: item.descricao,
                            qtdeParcelas: item.quantidadeParcelas,
                            precoUnitarioFixo: item.valorServico,
                            cobrado: item.cobrado
                        })
                    })

                    response.data.contas.forEach(function (item) {
                        $scope.listaComplementarContas.push({
                            contaId: item.contaId,
                            mes: item.mes,
                            ano: item.ano,
                            datavencimento: item.dataVencimento,
                            valortotal: item.valorTotal,
                            tipo: item.tipo
                        })
                    })
                    OrdensServicoService.verificaGeraGuia($scope.dadosBasicosChamado.ordemServicoId)
                        .then(function (response) {
                            $scope.flagGeraGuia = response.data;
                        })

                    OrdensServicoService.getNegociacao($scope.dadosBasicosChamado.ordemServicoId)
                        .then(function (response) {
                            $scope.tipoPagamento = response.data;
                        })

                })


            var obterHistoricosChamado = function () {
                ChamadosService.obterHistoricoChamado($scope.chamadoId)
                    .then(function (response) {
                        $scope.listaComplementarHistoricosChamado = response.data;

                    })
            }
            obterHistoricosChamado();

            //Gera guia de recolhimento
            $scope.gerarGuiaRecolhimento = function () {
                OrdensServicoService.gerarGuiaRecolhimento($scope.dadosBasicosChamado.ordemServicoId)
                    .then(function (response) {
                        fileDownloadService.get("Api/OrdensServico/" + response.data + "/ImpressaoGuia", "GuiaRecolhimento", "pdf");
                        OrdensServicoService.verificaGeraGuia($scope.dadosBasicosChamado.ordemServicoId)
                            .then(function (response) {
                                $scope.flagGeraGuia = response.data;
                            });
                        $scope.dadosBasicosChamado.imprimeGuia = true
                    })
            }

            // --- Funções e operações pós obtenção de dados.

            // Determina uma classe para destaque no portlet, baseado no status do chamado.
            $scope.statusChamadoClasse = function (status) {
                if (status == "Aberta") {
                    return "yellow";
                } else if (status == "Em Execução") {
                    return "green";
                } else if (status == "Cancelada") {
                    return "red";
                } else {
                    return "blue";
                }
            }

            // Gerencia a troca de abas ativas.
            $scope.ativarAba = function (passo) {
                $scope.passoAtivo = passo.passoId
            }

            // - Funções relativas a aba fixa de cadastros.

            // Prepara o controle de index de alteração.
            // O controle por index de alteração é necessário pois os cadastros podem ser armazenados temporariamente em memória, e só são enviados quando o chamado é registrado,
            // portanto não tem um ID de registro ainda.
            var indexAlteracaoCadastro = -1;
            var indexExclusaoCadastro = -1;

            // Abre o modal para adicionar um cadastro na lista complementar de Cadastros (abas fixas)
            $scope.modalAdicionarCadastroListaComplementar = function () {
                $scope.novoCadastroListaComplementar = {};
                $scope.novoCadastroForm.$setPristine();
                $("#modalIncluirCadastro").modal("show")
            }

            // Abre o modal para editar um cadastro na lista complementar de Cadastros (abas fixas)
            $scope.modalEditarCadastroListaComplementar = function (cadastro, index) {
                $scope.registroEditadoCadastroListaComplementar = angular.copy(cadastro);
                indexAlteracaoCadastro = index;
                $scope.editarCadastroForm.$setPristine();
                $("#modalEditarCadastro").modal("show")
            }

            // Abre o modal para excluir um cadastro na lista complementar de Cadastros (abas fixas)
            $scope.modalExcluirCadastroListaComplementar = function (index) {
                indexExclusaoCadastro = index;
                $("#modalExcluirCadastro").modal("show")
            }

            // Insere um novo cadastro na lista de Cadastros (abas fixas).
            $scope.adicionarNovoCadastro = function (item) {
                if (item.logradouroId) {
                    ChamadosService.getDescricaoLogradouro(item.logradouroId)
                        .then(function (response) {
                            item.endereco = response.data.endereco;
                        })
                }
                $scope.listaComplementarCadastros.push(item);
                $('#modalIncluirCadastro').modal('hide');
            }

            // Altera um cadastro na lista de Cadastros (abas fixas).
            $scope.editarCadastro = function (item) {
                if (item.logradouroId) {
                    ChamadosService.getDescricaoLogradouro(item.logradouroId)
                        .then(function (response) {
                            item.endereco = response.data.endereco;
                        })
                }
                $scope.listaComplementarCadastros[indexAlteracaoCadastro] = item;
                indexAlteracaoCadastro = -1
                $('#modalEditarCadastro').modal('hide');
            }

            // Altera um cadastro na lista de Cadastros (abas fixas).
            $scope.excluirCadastro = function () {

                $scope.listaComplementarCadastros.splice(indexExclusaoCadastro, 1);
                indexExclusaoCadastro = -1
                $scope.$apply();
                $('#modalEditarCadastro').modal('hide');
            }

            // - Funções relativas a aba fixa de serviços.

            // Prepara o controle de index de alteração.
            // O controle por index de alteração é necessário pois os servicos podem ser armazenados temporariamente em memória, e só são enviados quando o chamado é registrado,
            // portanto não tem um ID de registro ainda.
            var indexAlteracaoServico = -1;
            var indexExclusaoServico = -1;
            var valorPadrao = undefined;

            // Abre o modal para adicionar um servico na lista complementar de Servicos (abas fixas)
            $scope.modalAdicionarServicoListaComplementar = function () {
                $scope.novoServicoListaComplementar = {};
                $scope.novoServicoForm.$setPristine();
                $("#modalIncluirServico").modal("show")
            }

            //Busca na API os tipos de cobrança da aba Serviços.
            ChamadosService.getListaCobrancaServicos(valorPadrao)
                .then(function (responseServicos) {
                    $scope.listaCobrancaServicos = responseServicos.data;
                })

            // Abre o modal para editar um servico na lista complementar de Servicos (abas fixas)
            $scope.modalEditarServicoListaComplementar = function (servico, index) {
                indexAlteracaoServico = index;
                $scope.registroEditadoServicoListaComplementar = angular.copy(servico);
                $scope.editarServicoForm.$setPristine();
                $("#modalEditarServico").modal("show")

                ChamadosService.getListaCobrancaServicos($scope.registroEditadoServicoListaComplementar.tipoServicoId)
                    .then(function (responseServicos) {
                        $scope.listaCobrancaServicos = responseServicos.data;
                    })
            }


            // Abre o modal para excluir um servico na lista complementar de Servicos (abas fixas)
            $scope.modalExcluirServicoListaComplementar = function (index) {
                indexExclusaoServico = index;
                $("#modalExcluirServico").modal("show")
            }

            // Insere um novo servico na lista de Servicos (abas fixas).
            $scope.adicionarNovoServico = function (item) {
                var itemFormatado = item;

                if (typeof (itemFormatado.precoUnitarioFixo) == 'string') {
                    itemFormatado.precoUnitarioFixo = itemFormatado.precoUnitarioFixo.replace(/[^\d|\-+|\,+.]/g, '');
                    itemFormatado.precoUnitarioFixo = itemFormatado.precoUnitarioFixo.replace(/,/g, '.');
                    itemFormatado.precoUnitarioFixo = parseFloat(itemFormatado.precoUnitarioFixo);
                }

                $scope.listaComplementarServicos.push(itemFormatado);
                $('#modalIncluirServico').modal('hide');
            }

            // Altera um servico na lista de Servicos (abas fixas).
            $scope.editarServico = function (item) {
                var itemFormatado = item;

                if (typeof (itemFormatado.precoUnitarioFixo) == 'string') {
                    itemFormatado.precoUnitarioFixo = itemFormatado.precoUnitarioFixo.replace(/[^\d|\-+|\,+.]/g, '');
                    itemFormatado.precoUnitarioFixo = itemFormatado.precoUnitarioFixo.replace(/,/g, '.');
                    itemFormatado.precoUnitarioFixo = parseFloat(itemFormatado.precoUnitarioFixo);
                }

                $scope.listaComplementarServicos[indexAlteracaoServico] = itemFormatado;
                indexAlteracaoServico = -1
                $('#modalEditarServico').modal('hide');
            }

            // Altera um servico na lista de Servicos (abas fixas).
            $scope.excluirServico = function () {
                $scope.listaComplementarServicos.splice(indexExclusaoServico, 1);
                indexExclusaoServico = -1
                $scope.$apply();
                $('#modalEditarServico').modal('hide');
            }

            // - Funções relativas a aba fixa de históricos de chamado.

            // Verifica se o criador do histórico é o mesmo que o usuário logado.
            $scope.validarIdentidade = function (item) {
                if (item.reLogado == item.re) {
                    return false;
                }
                return true;
            }

            // Prepara o controle de index de alteração.
            // O controle por index de alteração é necessário pois os servicos podem ser armazenados temporariamente em memória, e só são enviados quando o chamado é registrado,
            // portanto não tem um ID de registro ainda.
            var indexAlteracaoHistorico = -1;
            var indexExclusaoHistorico = -1;

            // Abre o modal para adicionar um servico na lista complementar de Servicos (abas fixas)
            $scope.modalAdicionarHistoricoListaComplementar = function () {
                $scope.novoHistoricoListaComplementar = {};
                $scope.novoHistoricoForm.$setPristine();
                $("#modalIncluirHistorico").modal("show")
            }

            // Abre o modal para editar um servico na lista complementar de Servicos (abas fixas)
            $scope.modalEditarHistoricoListaComplementar = function (servico, index) {
                $scope.editarHistoricoListaComplementar = angular.copy(servico);
                indexAlteracaoHistorico = index;
                $scope.editarHistoricoForm.$setPristine();
                $("#modalEditarHistorico").modal("show")
            }

            // Abre o modal para excluir um servico na lista complementar de Servicos (abas fixas)
            $scope.modalExcluirHistoricoListaComplementar = function (historico) {
                indexExclusaoHistorico = historico.historicoChamadoId;
                $("#modalExcluirHistorico").modal("show")
            }

            // Insere um novo histórico na lista de históricos (abas fixas).
            $scope.adicionarNovoHistorico = function (item) {
                item.chamadoId = $scope.chamadoId;
                item.automatico = false;

                ChamadosService.incluirHistoricoChamado(item)
                    .then(function (response) {
                        obterHistoricosChamado();
                    })

                $scope.listaComplementarHistoricosChamado.push(item);
                $('#modalIncluirHistorico').modal('hide');
            }

            // Altera um histórico na lista de históricos (abas fixas).
            $scope.editarHistorico = function (item) {
                item.chamadoId = $scope.chamadoId;
                item.automatico = false;

                ChamadosService.alterarHistoricoChamado(item)
                    .then(function (response) {
                        obterHistoricosChamado();
                    })

                $('#modalEditarHistorico').modal('hide');
            }

            // Remove o histórico da lista (abas fixas).
            $scope.excluirHistorico = function () {
                ChamadosService.excluirHistoricoChamado(indexExclusaoHistorico)
                    .then(function (response) {
                        obterHistoricosChamado();
                    })
            }

            $scope.editarChamado = function () {

                var listaServicos = [];

                $scope.listaComplementarServicos.forEach(function (item) {
                    listaServicos.push({
                        lancaServicoId: item.lancaServicoId,
                        tipoServicoId: item.tipoServicoId,
                        quantidadeParcelas: item.qtdeParcelas,
                        valorServico: item.precoUnitarioFixo,
                    })
                })

                var model = {
                    dadosChamado: [],
                    chamadoId: $scope.dadosBasicosChamado.chamadoId,
                    ordemServicoId: $scope.dadosBasicosChamado.ordemServicoId,
                    servicos: listaServicos,
                    cadastros: $scope.listaComplementarCadastros
                };


                //Varre o objeto da geração de campos e pega as informações necessárias para a edição do chamado.
                $scope.modelPassosCamposGeracao.forEach(function (passo) {
                    passo.campos.forEach(function (campo) {
                        model.dadosChamado.push({
                            id: campo.campoId,
                            tipo: campo.tipoId,
                            dados: campo.valor,
                            atendimentoId: $scope.dadosBasicosChamado.atendimentoId,
                            tipoChamadoId: $scope.dadosBasicosChamado.tipoChamadoId
                        })
                    })
                })
                //Envia os dados
                ChamadosService.atualizarChamado(model)
                    //Em caso de sucesso executa:
                    .then(function (response) {
                        $scope.erros = {};
                        ngNotify.set("Chamado editado com sucesso!", "success")
                        $scope.envioSucesso = "Chamado editado com sucesso!";
                        $scope.tipoAtendimento = "";
                        $scope.tipoChamado = "";
                        $window.location.reload();
                    },
                        //em caso de erro executa:
                        function (error) {
                            $scope.errosFormularioRegistroChamado = errorsValidationService.parseErrors(error.data);
                            $location.hash('editarChamadoForm');
                            $anchorScroll();
                        })
            }

            //--- Cadastro de Proprietario

            /* Limpa os campos das opções "Selecionar" e "Digitar" para que não aconteça conflitos
               e desabilita a cópia de informações quando estiver ativa a opção "Selecionar".
            */
            $scope.limpaComboInclusao = function () {
                $scope.novoCadastroListaComplementar.logradouroId = null;
                $scope.novoCadastroListaComplementar.bairroId = null;
                $scope.novoCadastroListaComplementar.cep = null;

                $scope.desabilitaCopiaImovel = false;
            }
            $scope.limpaCaixaInclusao = function () {
                $scope.novoCadastroListaComplementar.endereco = null;
                $scope.novoCadastroListaComplementar.nomeBairro = null;
                $scope.novoCadastroListaComplementar.cep = null;

                $scope.desabilitaCopiaImovel = true;
            }
            $scope.limpaComboEdicao = function () {
                $scope.registroEditadoCadastroListaComplementar.logradouroId = null;
                $scope.registroEditadoCadastroListaComplementar.bairroId = null;
                $scope.registroEditadoCadastroListaComplementar.cep = null;

                $scope.desabilitaCopiaImovel = false;
            }
            $scope.limpaCaixaEdicao = function () {
                $scope.registroEditadoCadastroListaComplementar.endereco = null;
                $scope.registroEditadoCadastroListaComplementar.nomeBairro = null;
                $scope.registroEditadoCadastroListaComplementar.cep = null;

                $scope.desabilitaCopiaImovel = true;
            }
            // Limpa todos os campos
            $scope.limpaCamposInclusao = function () {
                $scope.novoCadastroListaComplementar = {};
            }
            $scope.limpaCamposEdicao = function () {
                $scope.registroEditadoCadastroListaComplementar = {};
            }

            // Utilizado para obter um combo com os bairos e ceps relacionados ao logradouro selecionado.
            // Inclusão
            $scope.buscaDadosEnderecoInclusao = function (endereco) {
                if (!endereco) {
                    $scope.comboBairros = [];
                    $scope.comboCeps = [];
                    $scope.novoCadastroListaComplementar.nomeBairro = null;
                    $scope.novoCadastroListaComplementar.cep = null;
                    $scope.novoCadastroListaComplementar.numero = null;
                } else {

                    ChamadosService.getBairrosEndereco(endereco)
                        .then(function (response) {
                            $scope.comboBairros = response.data;
                            $scope.novoCadastroListaComplementar.bairroId = $scope.comboBairros[0].bairroId;
                        })
                    ChamadosService.getCepEndereco(endereco)
                        .then(function (response) {
                            $scope.comboCeps = response.data;
                            $scope.novoCadastroListaComplementar.cep = $scope.comboCeps[0].cepId;
                        })
                };
            };
            // Edição
            $scope.buscaDadosEnderecoEdicao = function (endereco) {
                if (!endereco) {
                    $scope.comboBairros = [];
                    $scope.comboCeps = [];
                    $scope.registroEditadoCadastroListaComplementar.nomeBairro = null;
                    $scope.registroEditadoCadastroListaComplementar.cep = null;
                    $scope.registroEditadoCadastroListaComplementar.numero = null;
                } else {

                    ChamadosService.getBairrosEndereco(endereco)
                        .then(function (response) {
                            $scope.comboBairros = response.data;
                            $scope.registroEditadoCadastroListaComplementar.bairroId = $scope.comboBairros[0].bairroId;
                        })
                    ChamadosService.getCepEndereco(endereco)
                        .then(function (response) {
                            $scope.comboCeps = response.data;
                            $scope.registroEditadoCadastroListaComplementar.cep = $scope.comboCeps[0].cepId;
                        })
                };
            };
            //dados da ligacaos
            $scope.dados = {}
            var dadosLigacao = function () {
                $http.get('Api/Ligacao?id=' + $scope.chamadoId)
                    .success(function (response) {
                        $scope.dados = response
                    });

            }
            dadosLigacao()

            // -- Obtém os dados do imóvel para fazer a cópia e copia dados do Imóvel 
            // Inclusão
            $scope.copiaDadosImovelInclusao = function () {
                ChamadosService.getEnderecoLigacao($scope.chamadoId)
                    .then(function (response) {
                        $scope.novoCadastroListaComplementar.endereco = response.data.endereco;
                        $scope.novoCadastroListaComplementar.numero = response.data.numero;
                        $scope.novoCadastroListaComplementar.complemento = response.data.complemento;
                        $scope.novoCadastroListaComplementar.nomeBairro = response.data.nomeBairro;
                        $scope.novoCadastroListaComplementar.cep = response.data.cep;
                        $scope.novoCadastroListaComplementar.municipio = response.data.municipio;
                        $scope.novoCadastroListaComplementar.estado = response.data.estado;
                    });
            };
            // Edição
            $scope.copiaDadosImovelEdicao = function () {
                ChamadosService.getEnderecoLigacao($scope.chamadoId)
                    .then(function (response) {
                        $scope.registroEditadoCadastroListaComplementar.endereco = response.data.endereco;
                        $scope.registroEditadoCadastroListaComplementar.numero = response.data.numero;
                        $scope.registroEditadoCadastroListaComplementar.complemento = response.data.complemento;
                        $scope.registroEditadoCadastroListaComplementar.nomeBairro = response.data.nomeBairro;
                        $scope.registroEditadoCadastroListaComplementar.cep = response.data.cep;
                        $scope.registroEditadoCadastroListaComplementar.municipio = response.data.municipio;
                        $scope.registroEditadoCadastroListaComplementar.estado = response.data.estado;
                    });
            };

            // --- Watchers

            // Observa a mudança no serviço selecionado no modal de adição de serviço para preencher campos automaticamente
            $scope.$watch("novoServicoListaComplementar.tipoServicoId", function (nvTipoServicoId) {
                if (!nvTipoServicoId) {
                    return;
                }

                for (var c = 0; c < $scope.listaCobrancaServicos.length; c++) {
                    if ($scope.listaCobrancaServicos[c].tipoServicoId == nvTipoServicoId) {
                        $scope.novoServicoListaComplementar = angular.copy($scope.listaCobrancaServicos[c])
                    }
                }
            })

            // Observa a mudança no serviço selecionado no modal de edição de serviço para preencher campos automaticamente
            $scope.$watch("registroEditadoServicoListaComplementar.tipoServicoId", function (nvTipoServicoId, oldNvTipoServicoId) {
                if (!nvTipoServicoId) {
                    return;
                }

                for (var c = 0; c < $scope.listaCobrancaServicos.length; c++) {
                    if ($scope.listaComplementarServicos[indexAlteracaoServico].tipoServicoId == nvTipoServicoId && $scope.listaCobrancaServicos[c].tipoServicoId == nvTipoServicoId) {
                        $scope.registroEditadoServicoListaComplementar = angular.copy($scope.listaComplementarServicos[indexAlteracaoServico])
                        break;
                    }
                    if ($scope.listaCobrancaServicos[c].tipoServicoId == nvTipoServicoId) {
                        $scope.registroEditadoServicoListaComplementar = angular.copy($scope.listaCobrancaServicos[c])
                    }
                }
            })

            $scope.gerarProtocolo = function () {
                fileDownloadService.get('Api/Chamados/' + $scope.chamadoId + '/Protocolo', "Protocolo", "pdf")
            }

            $scope.gerarTrocaTitularidade = function () {
                fileDownloadService.get('Api/Chamados/' + $scope.chamadoId + '/TrocaTitularidade', "TrocaTitularidade", "pdf")
            }

            $scope.gerarContratoLigacaoNova = function () {
                fileDownloadService.get('Api/Chamados/' + $scope.chamadoId + '/ContratoLigacaoNova', "ContratoLigacaoNova", "pdf")
            }

            $scope.imprimirGuiaRecolhimento = function () {
                fileDownloadService.get("Api/OrdensServico/" + $scope.dadosBasicosChamado.ordemServicoId + "/ImpressaoGuiaPorOS", "GuiaRecolhimento", "pdf");
            }

            $scope.gerarTermoDoacao = function () {
                fileDownloadService.get('Api/Chamados/TermoDoacao', "TermoDoacao", "pdf");
            }
            $scope.gerarTermoAdesao = function () {
                fileDownloadService.get('Api/Chamados/' + $scope.chamadoId + '/TermoAdesao', "TermoAdesao", "pdf")
            }

            //verifica se o cliente tem email de origem
            {

                $http.get("Api/Protocolo/" + $scope.chamadoId)
                    .then(function (response) {
                        $scope.flagEnviaEmail = response.data;
                    })

            }
            //busca email se existente
            $scope.modalEnvioEmail = function () {
                $scope.buscarEmailProtocolo();
                $('#modalEnviarProtocoloEmail').modal('show');
            }

            $scope.buscarEmailProtocolo = function () {

                $http.get("Api/Protocolo/" + $scope.chamadoId + "/Email")
                    .then(function (response) {
                        $scope.email = response.data;
                    })

            }
            // envio do protocolo por email
            $scope.enviarEmail = function () {
                var model = {
                    emailTo: $scope.email,
                    chamadoId: $scope.chamadoId
                }
                $http.post("Api/Protocolo/Email", model)
                    .then(function (response) {
                        ngNotify.set(response.data, 'success');
                    }, function (error) {
                        if (error.status == '403') {
                            ngNotify.set("Você não possui acesso a esse recurso", "error")
                        } else {
                            ngNotify.set("Houve um erro no processo de envio de email. Por favor, contacte o administrador do sistema. Erro: " + error.status, "error")
                        }
                    })
                $('#modalEnviarProtocoloEmail').modal('hide');
            }

            $scope.processarAcaoInputTextoGerado1 = function (valorCampo) {
                ChamadosService.processarCampoBuscavel1(1, valorCampo.valor)
                    .then(function (response) {
                        response.data.forEach(function (data) {
                            $scope.modelPassosCamposGeracao.forEach(function (abas) {
                                abas.campos.forEach(function (campo) {
                                    if (campo.campoId == data.campoId) {
                                        campo.valor = data.valorPadrao;
                                    }
                                })
                            })
                        })
                    })
            }

            $scope.processarAcaoInputTextoGerado2 = function (valorCampo) {
                ChamadosService.processarCampoBuscavel1(2, valorCampo.valor)
                    .then(function (response) {
                        response.data.forEach(function (data) {
                            $scope.modelPassosCamposGeracao.forEach(function (abas) {
                                abas.campos.forEach(function (campo) {
                                    if (campo.campoId == data.campoId) {
                                        campo.valor = data.valorPadrao;
                                    }
                                })
                            })
                        })
                    })
            }

            $scope.processarAcaoInputTextoGerado5 = function (valorCampo) {

                if (valorCampo.valor == "") {
                    valorCampo.valor = "0";
                }

                ChamadosService.processarCampoBuscavel1(5, valorCampo.valor)
                    .then(function (response) {
                        response.data.forEach(function (data) {
                            $scope.modelPassosCamposGeracao.forEach(function (abas) {
                                abas.campos.forEach(function (campo) {
                                    if (campo.campoId == data.campoId) {
                                        campo.valor = data.valorPadrao;
                                    }
                                })
                            })
                        })
                    })
            }

            $scope.imprimirHistoricos = function () {
                fileDownloadService.get('Api/Chamados/' + $scope.chamadoId + '/ImprimirHistoricos', "ImprimirHistoricos", "pdf")
            }

            $scope.tabActive = 1;
        });
});

