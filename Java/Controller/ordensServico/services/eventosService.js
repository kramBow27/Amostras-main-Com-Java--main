define(function () {
    var eventosService = function ($http) {
        // Url base universal
        var baseUrl = "Api/";

        this.getObterListaComplementarEvento = function (eventoId, listaId) {
            return $http.get(baseUrl + "ManutencaoOrdensServico/" + eventoId + "/ObterListaComplementarEvento?listaId=" + listaId)
        }
        this.obterOpcoesListaColetor = function (id) {
            return $http.get("Api/OpcoesListaColetor/ObterOpcoesListaColetor?listaOpcaoId=" + id);
        }

        this.obterCamposInformacaoAdicional = function (eventoId) { 
            return $http.get(baseUrl + "ManutencaoOrdensServico/" + eventoId +"/ObterDadosCompletosEvento?eventoId=" + eventoId)
        }
      
        this.obterCamposTipoServico = function (id) {
            return $http.get(baseUrl+ "TipoServico/ObterTiposServicoCampoColetor?id=" + id);
        }
        this.obterInformacoesAdicionais = function (eventoId) { 
            return $http.get(baseUrl + "ManutencaoOrdensServico/" + eventoId +"/ObterInformacoesAdicionaisEvento?eventoId=" + eventoId)
        }

        this.obterValas = function (valor) {
            return $http.get(baseUrl + "TiposVala/Combo?valor=" + valor)
        }

        // Obtém os dados gravados pela consulta de Ordem de Serviço.
        this.getTipoServicoIdEvento = function (eventoId) {
            return $http.get(baseUrl + "Eventos/" + eventoId + "/TipoServicoIdEvento");
        };

        // Obtém o status do evento.
        this.getStatusEvento = function (eventoId) {
            return $http.get(baseUrl + "Eventos/" + eventoId + "/Status");
        }

        // Obtém os dados das abas complementares da edição de eventos.
        this.getAbasComplementaresEvento = function (eventoId) {
            return $http.get(baseUrl + "Eventos/" + eventoId + "/ListasComplementaresEvento");
        };

        this.putAtualizarHistoricoOS = function (model) {
            return $http.put(baseUrl + "HistoricosOs/Alterar", model)
        }

        this.deleteHistoricoOS = function (historicoId) {
            return $http.delete(baseUrl + "HistoricosOs/" + historicoId + "/Excluir")
        }

        this.getPermissaoEvento = function (eventoId) {
            return $http.get('Api/ManutencaoOrdensServico/' + eventoId + '/ObterPermissaoEvento');
        };

        /*chamadas para Api de MATERIAIS EVENTOS*/
        this.postSalvarMaterial = function (model) {
            return $http.post(baseUrl + "MateriaisEventos", model)
        }
        this.putEditarMaterial = function (model) {
            return $http.put(baseUrl + "MateriaisEventos", model)
        }
        this.deleteMaterial = function (materialEventoId) {
            return $http.delete(baseUrl + "MateriaisEventos/" + materialEventoId)
        }
        this.getListaMateriaisCombo = function (descricao) {
            return $http.get(baseUrl + "Materiais/MateriaisCombo?descricao=" + descricao)
        }

        /*chamadas para Api de EQUIPAMENTOS EVENTOS*/
        this.postSalvarEquipamento = function (model) {
            return $http.post(baseUrl + "EquipamentosEventos", model)
        }
        this.putEditarEquipamento = function (model) {
            return $http.put(baseUrl + "EquipamentosEventos", model)
        }
        this.atualizarInformacoesAdicionais = function (model, eventoId) { 
            return $http.put(baseUrl + "ManutencaoOrdensServico/" + eventoId +"/AtualizarInformacoesAdicionais", model, eventoId)
        }
        this.deleteEquipamento = function (equipamentoEventoId) {
            return $http.delete(baseUrl + "EquipamentosEventos/" + equipamentoEventoId)
        }
        this.getListaEquipamentosCombo = function (eventoId) {
            return $http.get(baseUrl + "equipamentos")
        }

        /*chamadas para Api de MAO DE OBRA EVENTOS*/
        this.postSalvarMaoDeObra = function (model) {
            return $http.post(baseUrl + "MaoObrasEventos", model)
        }
        this.putEditarMaoDeObra = function (model) {
            return $http.put(baseUrl + "MaoObrasEventos", model)
        }
        this.deleteMaoDeObra = function (maoDeObraEventoId) {
            return $http.delete(baseUrl + "MaoObrasEventos/" + maoDeObraEventoId)
        }

        this.getListaFuncionariosCombo = function () {
            return $http.get(baseUrl + "funcionarios")
        }

        /*chamadas para Api de SERVIÇOS*/
        this.postSalvarServico = function (model) {
            return $http.post(baseUrl + "LancaServicosEventos", model)
        }
        this.getServico = function (lancaServicoEventoId) {
            return $http.get(baseUrl + "LancaServicosEventos?id=" + lancaServicoEventoId)
        }
        this.putEditarServico = function (model) {
            return $http.put(baseUrl + "LancaServicosEventos", model)
        }
        this.deleteServico = function (servicoEventoId) {
            return $http.delete(baseUrl + "LancaServicosEventos/" + servicoEventoId)
        }
        this.getListaTipoServicosCombo = function (valor) {
            return $http.get(baseUrl + "tiposServicosComplementos/ListaTiposServicoAtivos?valor=" + valor)
        }

        /*chamadas para Api de ARTIGOS*/
        this.postSalvarArtigo = function (model) {
            return $http.post(baseUrl + "ArtigosEventos", model)
        }
        this.putEditarArtigo = function (model) {
            return $http.put(baseUrl + "ArtigosEventos", model)
        }
        this.deleteArtigo = function (artigoEventoId) {
            return $http.delete(baseUrl + "ArtigosEventos/" + artigoEventoId)
        }

        this.getListaArtigosCombo = function (eventoId) {
            return $http.get(baseUrl + "artigos")
        }

        this.obterListaArtigosCombo = function (valor) {
            return $http.get(baseUrl + "artigos/Combo?valor=" + valor)
        }

        /*chamadas para Api de MANOBRAS*/
        this.postSalvarManobra = function (model) {
            return $http.post(baseUrl + "ManobrasDescargasEventos", model)
        }
        this.putEditarManobra = function (model) {
            return $http.put(baseUrl + "ManobrasDescargasEventos", model)
        }
        this.deleteManobra = function (manobraEventoId) {
            return $http.delete(baseUrl + "ManobrasDescargasEventos/" + manobraEventoId)
        }
        this.getListaTiposRegistrosCombo = function (eventoId) {
            return $http.get(baseUrl + "tiposregistros")
        }
        this.getListaLogradourosCombo = function (eventoId) {
            return $http.get(baseUrl + "logradouros")
        }

        /*chamadas para Api de FUNCOES*/
        this.postSalvarFuncao = function (model) {
            return $http.post(baseUrl + "FuncoesEventos", model)
        }
        this.putEditarFuncao = function (model) {
            return $http.put(baseUrl + "FuncoesEventos", model)
        }
        this.deleteFuncao = function (funcaoEventoId) {
            return $http.delete(baseUrl + "FuncoesEventos/" + funcaoEventoId)
        }
        this.getListaFuncoesCombo = function (eventoId) {
            return $http.get(baseUrl + "funcoes")
        }
        /*chamadas para Api de DOCUMENTOS*/
        this.getDocumentosEvento = function (eventoId) {
            return $http.get('Api/Eventos/' + eventoId + '/Documentos')
        }
        this.deleteDocumentosEvento = function (documentoId) {
            return $http.delete(baseUrl + 'DocumentosLigacoes?id=' + documentoId)
        }

        //chamada para Api de execução do service atualizar CPF/CNPJ
        this.postExecutarTarefa = function (model) {
            return $http.post(baseUrl + 'ManutencaoOrdensServico/ExecutarTarefa', model)
        }

        //Chamada Api Carta Retorno
        this.getExibeCartaRetorno = function (parametroId) {
            return $http.get(baseUrl + "OrdensServico/ImprimeCartaRetorno?parametroId=" + parametroId)
        }

        //Chamada Api Termo de Parcelamento
        this.getExibeTermoParcelamento = function (parametroId) {
            return $http.get(baseUrl + "OrdensServico/ImprimeTermoParcelamento?parametroId=" + parametroId)
        }

        //Chamada Api Termo Liberação Habite-se
        this.getExibeTermoLiberacaoHabitese = function (parametroId) {
            return $http.get(baseUrl + "OrdensServico/ImprimeTermoLiberacaoHabitese?parametroId=" + parametroId)
        }

        this.obterCamposColetor = function (id) { 
            return $http.get(baseUrl + "CamposColetor/Get?id=" + id) 
        }
    }

    return eventosService;
})