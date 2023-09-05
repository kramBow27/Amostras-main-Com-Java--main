define(function () {
    var registroEventoService = function ($http) {
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

        this.getDadosCamposGeracao = function (model) {
            return $http.get(baseUrl + "TiposServicosComplementos/Campos", { params: model });
        }

        this.postDadosCamposGeracao = function (model) {
            return $http.post(baseUrl + "ManutencaoOrdensServico/CriarEvento", model);
        }

        this.putDadosCamposGeracao = function (model) {
            return $http.put(baseUrl + "ManutencaoOrdensServico/AtualizarEvento", model);
        }

    }
    return registroEventoService;
})