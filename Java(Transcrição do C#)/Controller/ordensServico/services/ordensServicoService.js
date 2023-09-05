define(function () {
    var ordensServicoService = function ($http, ngRotasSistemasAuxiliares) {
        // Url base universal
        var baseUrl = "Api/";

        var dados;

        // Obtém os dados gravados pela consulta de Ordem de Serviço.
        this.getDados = function () {
            return dados;
        };

        // Grava os dados da consulta de Ordem de Serviço para futura referência.
        this.setDados = function (input) {
            dados = input;
        };

        this.verificarDataAtualServer = function () {
            return $http.get(baseUrl + "Configuracoes/DataAtual");
        }

        this.obterBaixas = function (model) { 
            return $http.post('Api/Coletor/ObterBaixas', model)
        }

        this.gravarFotoOrdemServico = function (model) { 
            return $http.post('Api/Coletor/GravarFotoOrdemServico', model);
        }

        this.consultarExistenciaOrdemServico = function (ordemServico, anoOrdemServico) {
            return $http.get(baseUrl + "OrdensServico/ConsultaExistencia?anoOrdemServicoId=" + anoOrdemServico + "&numeroOrdemServico=" + ordemServico);
        }

        this.gravarEventosBaixasColetor = function (model) { 
            return $http.post('Api/Coletor/GravarBaixaOrdemServico', model);
        }

        this.consultarOrdemServico = function (ordemServicoId) {
            return $http.get(baseUrl + "OrdensServico/" + ordemServicoId + "/Consulta");
        }

        this.consultaLigacao = function (cdc) {
            return $http.get(baseUrl + 'BuscarLigacao/' + cdc);
        }

        this.consultaDetalhesEvento = function (eventoId) {
            return $http.get('Api/Eventos/' + eventoId + '/Consulta');
        }

        this.obterImagensEvento = function (eventoId) {
            return $http.get('Api/Eventos/' + eventoId + '/IdsFotosEvento');
        }

        this.atualizarEquipeEquipamentoCoordenadas = function (model) { 
            return $http.put('Api/Coletor/GravarEquipeEquipamentoCoordenada', model)
        }

        this.obterEquipeCoordenadas = function (id) {
            return $http.get('Api/Coletor/ObterEquipeCoordenada?id=' + id)
        }

        this.obterBaixa = function (id) { 
            return $http.get('Api/Coletor/ObterBaixa?id=' + id); ExecutarProcedureBaixa
        }

        this.atualizarBaixa = function (model) { 
            return $http.put('Api/Coletor/AtualizarBaixaOrdemServico', model);
        }
        this.executarProcedureBaixa = function (model) {
            return $http.post('Api/Coletor/ExecutarProcedureBaixa', model);
        }

        this.executarProcedureBaixasSelecionadas = function (model) { 
            return $http.post('Api/Coletor/ExecutarProcedureTodasBaixas', model)
        }
        this.excluirDoumentoOrdemServico = function (documentoId) {
            return $http.delete('Api/DocumentosLigacoes?id=' + documentoId);
        }

        this.consultaDetalhesHistorico = function (historicoId) {
            return $http.get('Api/OrdensServico/' + historicoId + '/Historico');
        }

        this.consultarEdicaoOrdemServico = function (ordemServicoId) {
            return $http.get(baseUrl + "OrdensServico/" + ordemServicoId + "/Manutencao");
        }

        this.editarOrdemServico = function (model) {
            return $http.put(baseUrl + "ManutencaoOrdensServico/EditarDados", model);
        }

        this.encerrarOrdemServico = function (model) {
            return $http.put(baseUrl + "ManutencaoOrdensServico/EncerrarOrdemServico", model);
        }

        this.reativarOrdemServico = function (model) {
            return $http.put(baseUrl + "ManutencaoOrdensServico/ReativarOrdemServico", model);
        }

        this.bloquearOrdemServico = function (model) {
            return $http.put(baseUrl + "ManutencaoOrdensServico/BloquearOrdemServico", model);
        }

        this.desbloquearOrdemServico = function (model) {
            return $http.put(baseUrl + "ManutencaoOrdensServico/DesbloquearOrdemServico", model);
        }

        this.verificarPossibilidadeEncerramentoOS = function (ordemServicoId) {
            return $http.get(baseUrl + "ManutencaoOrdensServico/VerificarOrdemServicoPodeSerEncerrada?ordemServicoId=" + ordemServicoId);
        }

        this.cancelarOrdemServico = function (model) {
            return $http.post('Api/OrdensServico/CancelarOrdemServico', model);
        };

        this.postNovoHistorico = function (model) {
            return $http.post('Api/HistoricosOs/Incluir', model);
        };

        this.putAtualizarHistoricoOS = function (model) {
            return $http.put('Api/HistoricosOs/Alterar', model);
        };

        this.deleteHistoricoOS = function (historicoOsId) {
            return $http.delete('Api/HistoricosOs/' + historicoOsId + '/Excluir');
        };

        this.gerarCargaInicialEquipe = function (equipeId, equipamentoId) {
            return $http.get('Api/Coletor/GerarCargaInicialEquipe?equipeId=' + equipeId + '&equipamentoId=' + equipamentoId); 
        }
        this.getDadosCamposGeracao = function (tipoRecursoId) {
            return $http.get(baseUrl + "TiposRecursosComplementos/Campos?tipoRecursoId=" + tipoRecursoId);
        }

        this.postOrdensServicoParaManutencao = function (model) {
            return $http.post(baseUrl + 'ManutencaoOrdensServico/OrdensdeServicoParaManutencao', model);
        }

        this.postOrdensServicoParaMapa = function (model) {
            return $http.post(baseUrl + 'ManutencaoOrdensServico/OrdensdeServicoParaMapa', model);
        }

        this.postOrdensServicoParaProgramacao = function (model) {
            return $http.post(baseUrl + 'ManutencaoOrdensServico/OrdensdeServicoParaProgramacao', model);
        }

        this.postOrdensServicoEmExecucao = function (model) {
            return $http.post(baseUrl + 'ManutencaoOrdensServico/OrdensdeServicoEmExecucaoParaProgramacao', model);
        }

        this.postCancelarOrdensServico = function (model) {
            return $http.post(baseUrl + 'OrdensServico/CancelarOrdensServico', model);
        }

        this.postOrdensServicoEquipe = function (equipeId) { 
            return $http.post(baseUrl + 'ManutencaoOrdensServico/OrdensdeServicoEmExecucaoEquipe?equipeId='+ equipeId)
        }

        this.obterEquipes = function (model) {
            return $http.post(baseUrl + "Equipes/ObterEquipes", model)
        }
        this.obterEquipe = function (id) {
            return $http.get(baseUrl + "Equipes/ObterEquipe?id=" + id)
        }

        this.postExecutarOrdensServico = function (model) {
            return $http.post(baseUrl + 'OrdensServico/ExecutarOrdensServico', model)
        }

        this.getObterDadosEventoCorteLigacao = function (eventoId) {
            return $http.get(baseUrl + 'Eventos/' + eventoId + '/ObterDadosEventoCorteLigacao')
        }

        this.getObterDadosEventoReligacaoLigacao = function (eventoId) {
            return $http.get(baseUrl + 'Eventos/' + eventoId + '/ObterDadosEventoReligacaoLigacao')
        }

        this.getObterDadosNovoUsuarioLigacao = function (eventoId) {
            return $http.get(baseUrl + 'Eventos/' + eventoId + '/ObterDadosNovoUsuarioLigacao')
        }

        this.getObterDadosEventoLacreLigacao = function (eventoId) {
            return $http.get(baseUrl + 'Eventos/' + eventoId + '/ObterDadosEventoLacreLigacao')
        }

        this.getObterDadosEventoInstalacaoLigacao = function (eventoId) {
            return $http.get(baseUrl + 'Eventos/' + eventoId + '/ObterDadosEventoInstalacaoLigacao')
        }

        this.getObterDadosEventoAlteracaoDocumentoStm = function (eventoId) {
            return $http.get(baseUrl + 'Eventos/' + eventoId + '/ObterDadosEventoAlteracaoDocumentoStm')
        }

        this.getObterDadosEventoEnderecoEntregaStm = function (eventoId) {
            return $http.get(baseUrl + 'Eventos/' + eventoId + '/ObterDadosEventoEnderecoEntregaStm')
        }

        this.getObterDadosEventoExclusaoLigacao = function (eventoId) {
            return $http.get(baseUrl + 'Eventos/' + eventoId + '/ObterDadosEventoExclusaoLigacao')
        }

        this.getObterDadosEventoInstalacaoEsgoto = function (eventoId) {
            return $http.get(baseUrl + 'Eventos/' + eventoId + '/ObterDadosEventoInstalacaoEsgoto')
        }

        this.getObterDadosEventoAlteracaoSituacaoHidrometro = function (eventoId) {
            return $http.get(baseUrl + 'Eventos/' + eventoId + '/ObterDadosEventoAlteracaoSituacaoHidrometro')
        }

        this.getObterDadosEventoRetirarRetencaoContas = function (eventoId) {
            return $http.get(baseUrl + 'Eventos/' + eventoId + '/ObterDadosEventoRetencaoContas')
        }

        this.getObterDadosEventoHistoricoEncerramento = function (eventoId) {
            return $http.get(baseUrl + 'Eventos/' + eventoId + '/ObterDadosEventoHistoricoEncerramento')
        }

        this.getObterDadosEventoHistoricoVistoria = function (eventoId) {
            return $http.get(baseUrl + 'Eventos/' + eventoId + '/ObterDadosEventoHistoricoVistoria')
        }

        this.getObterDadosEventoAtualizaLacreLigacao = function (eventoId) {
            return $http.get(baseUrl + 'Eventos/' + eventoId + '/ObterDadosEventoAtualizaLacreLigacao')
        }

        this.obterDadosEventoIncluirLigacaoImobiliaria = function (eventoId) {
            return $http.get(baseUrl + 'Eventos/' + eventoId + '/ObterDadosEventoIncluirLigacaoImobiliaria')
        }

        this.obterDadosEventoExcluirLigacaoImobiliaria = function (eventoId) {
            return $http.get(baseUrl + 'Eventos/' + eventoId + '/ObterDadosEventoExcluirLigacaoImobiliaria')
        }

        this.getObterDadosEventoTrocaHidrometro = function (eventoId) {
            return $http.get(baseUrl + 'Eventos/' + eventoId + '/ObterDadosEventoTrocaHidrometro')
        }

        this.getObterDadosEventoCobrancaServico = function (eventoId) {
            return $http.get(baseUrl + 'Eventos/' + eventoId + '/ObterDadosEventoCobrancaServico')
        }

        this.getObterDadosInativacaoLigacao = function (eventoId) {
            return $http.get(baseUrl + 'Eventos/' + eventoId + '/ObterDadosEventoInativarLigacao')
        }

        this.getObterDadosAlteracaoCadastral = function (eventoId) {
            return $http.get(baseUrl + 'Eventos/' + eventoId + '/ObterDadosEventoAlteracaoCadastral')
        }

        this.getObterDadosEventoTrocaTitularidade = function (eventoId) {
            return $http.get(baseUrl + 'Eventos/' + eventoId + '/ObterDadosEventoTrocaTitularidade')
        }

        this.getCadPessoas = function () {
            return $http.get(baseUrl + 'Eventos/ObterCadPessoas');
        }

        this.postCortarLigacao = function (model) {
            return $http.post(baseUrl + 'Ligacoes/CortarLigacao', model)
        }

        this.postReligarLigacao = function (model) {
            return $http.post(baseUrl + 'Ligacoes/ReligarLigacao', model)
        }

        this.postLacrarLigacao = function (model) {
            return $http.post(baseUrl + 'Ligacoes/LacrarLigacao', model)
        }

        this.postInstalarHidrometro = function (model) {
            return $http.post(baseUrl + 'Ligacoes/InstalarHidrometro', model)
        }

        this.postExcluirLigacao = function (model) {
            return $http.post(baseUrl + 'Ligacoes/ExcluirLigacao', model)
        }

        this.postInstalarEsgoto = function (model) {
            return $http.post(baseUrl + 'Ligacoes/InstalarEsgoto', model)
        }

        this.postAlterarSituacaoHidrometro = function (model) {
            return $http.post(baseUrl + 'Ligacoes/AlterarSituacaoHidrometro', model)
        }

        this.postGerarHistoricoEncerramento = function (model) {
            return $http.post(baseUrl + 'Ligacoes/GerarHistoricoEncerramento', model)
        }

        this.postGerarHistoricoVistoria = function (model) {
            return $http.post(baseUrl + 'Ligacoes/GerarHistoricoVistoria', model)
        }

        this.postRetirarRetencaoContas = function (model) {
            return $http.post(baseUrl + 'Ligacoes/RetirarRetencaoContas', model)
        }

        this.postAtualizarLacreLigacao = function (model) {
            return $http.post(baseUrl + 'Ligacoes/AtualizarLacreLigacao', model)
        }

        this.postTrocarHidrometro = function (model) {
            return $http.post(baseUrl + 'Ligacoes/TrocarHidrometro', model)
        }

        this.postCobrarServico = function (model) {
            return $http.post(baseUrl + 'Ligacoes/CobrarServico', model)
        }

        this.getObterDadosEventoNovaLigacao = function (eventoId) {
            return $http.get(baseUrl + "Eventos/" + eventoId + "/ObterDadosEventoLigacaoNova")
        }

        this.postIncluirNovaLigacao = function (model) {
            return $http.post(baseUrl + "Ligacoes/Incluir", model)
        }

        this.postInativarLigacao = function (model) {
            return $http.post(baseUrl + "Ligacoes/InativarLigacao", model)
        }

        this.postProgramarOs = function (dadosProgramacaoOs) {
            return $http.post(baseUrl + "ManutencaoOrdensServico/ProgramarOrdensServico", dadosProgramacaoOs)
        }

        this.postProgramarColetorOs = function (dadosProgramacaoColetorOs) {
            return $http.post(baseUrl + "ManutencaoOrdensServico/ProgramarColetorOrdensServico", dadosProgramacaoColetorOs)
        }

        this.postAtualizarCadastro = function (model) {
            return $http.post(baseUrl + "Ligacoes/AlterarCadastro", model)
        }

        this.postCriarResponsavel = function (model) {
            return $http.post(baseUrl + "Ligacoes/CriarResponsavel", model)
        }

        this.incluirLigacaoImobiliaria = function (model) {
            return $http.post(baseUrl + "Ligacoes/IncluirLigacaoImobiliaria", model)
        }

        this.excluirLigacaoImobiliaria = function (model) {
            return $http.post(baseUrl + "Ligacoes/ExcluirLigacaoImobiliaria", model)
        }

        this.incluirUsuarioLigacao = function (model) {
            return $http.post(baseUrl + "Ligacoes/IncluirUsuarioLigacao", model)
        }

        this.postAtualizarResponsaveis = function (model) {
            return $http.post(baseUrl + "Ligacoes/AtualizarResponsaveis", model)
        }

        this.obterDescricaoEnderecoEntregaSelecionado = function (logradouroId) {
            return $http.get("Api/Logradouros/" + logradouroId)
        }

        this.obterDescricaoBairroEntregaSelecionado = function (bairroId) {
            return $http.get("Api/Bairros/" + bairroId)
        }

        this.obterEnderecoEntrega = function (cdc) {
            return $http.get(baseUrl + "Imoveis/Get?id=" + cdc)
        }

        this.ObterCepXlogradouro = function (logradouro) {
            return $http.get("Api/OrdensServico/Logradouro/" + logradouro + "/Cep");
        }

        this.PesquisaBairrosLogradouro = function (logradouroId) {
            return $http.get("Api/bairros/PesquisaBairrosLogradouro?logradouroId=" + logradouroId);
        }

        this.PesquisaCepsCodigoLogradouro = function (logradouroId) {
            return $http.get("Api/Ceps/PesquisaCepsCodigoLogradouro?logradouroId=" + logradouroId);
        }

        this.getOsAbertoLigacao = function (ligacaoId, ordemServicoId) {
            return $http.get("Api/OrdensServico/OsEmAbertoLigacao?ligacaoId=" + ligacaoId + "&ordemServicoId=" + ordemServicoId);
        }

        this.postConfirmarImpressaoOsProgramacao = function (eventosId) {
            return $http.post(baseUrl + "ManutencaoOrdensServico/ConfirmarImpressaoOrdensServicoProgramacao", eventosId);
        }

        this.getObservacoes = function (eventoId) {
            return $http.get("Api/EventosObservacoes");
        }

        this.postIncluirObservacao = function (model) {
            return $http.post(baseUrl + "EventosObservacoes", model)
        }

        this.postEncaminharEvento = function (model) {
            return $http.post(baseUrl + "Eventos/EncaminharEvento", model)
        }

        this.postAlterarServicoEvento = function (model) {
            return $http.post(baseUrl + "Eventos/AlterarServicoEvento", model)
        }

        this.putEditarObservacao = function (model) {
            return $http.put(baseUrl + "EventosObservacoes", model)
        }

        this.deleteObservacao = function (eventoObservacaoId) {
            return $http.delete(baseUrl + "EventosObservacoes?id=" + eventoObservacaoId)
        }
        this.postPesquisaChamadoEquipamentos = function (model) {
            return $http.post('api/Equipamentos/ObterDadosEquipamentosManutencaoPreventiva', model);
        }
        this.postGerarOSs = function (model) {
            return $http.post("Api/OrdensServico/GerarOrdensServicoAutomaticas", model);
        }
        this.imprimirDocumento = function (model) {
            return $http.post('Api/Documento/Imprimir', model)
        }
        this.getNegociacao = function (ordemServicoId) {
            return $http.get("Api/OrdensServico/FormaPagamento?id=" + ordemServicoId);
        }
        this.getServicos = function (ordemServicoId) {
            return $http.get("Api/Chamados/" + ordemServicoId + "/PossuiServicos");
        }
        this.lancarServicos = function (model) {
            return $http.put(baseUrl + "ManutencaoOrdensServico/LancarServicoOrdemServico", model);
        }
        this.obterFlagGEO = function () {
            return $http.get("Api/Mapa/MapaGeo")
        }
        this.gerarGuiaRecolhimento = function (ordemServicoId) {
            return $http.get(baseUrl + "OrdensServico/" + ordemServicoId + "/GeraGuiaRecolhimentoOrdemServico");
        }
        this.verificaGeraGuia = function (ordemServicoId) {
            return $http.get("Api/Chamados/VerificaGuiaOS?ordemServicoId=" + ordemServicoId);
        }
        this.getObterDadosEventoServicosLancados = function (eventoId) {
            return $http.get(baseUrl + 'Eventos/' + eventoId + '/ObterDadosEventoServicosLancados' )
        }
        this.postBloquearServicosLancados = function (model) {
            return $http.post(baseUrl + 'Ligacoes/BloquearServicosLancados', model)
        }

        this.obterCampos = function (id) {
            return $http.get(baseUrl+ 'Campos/' + id);
        }
    }
    return ordensServicoService;
})