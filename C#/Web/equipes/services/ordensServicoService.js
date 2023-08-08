define(function () {
    var ordensServicoService = function ($http, ngRotasSistemasAuxiliares) {
        // Url base universal
        var baseUrl = "Api/";

        

        // Obtém os dados gravados pela consulta de Ordem de Serviço.
       
        this.getDadosCamposGeracao = function (tipoRecursoId) {
            return $http.get(baseUrl + "TiposRecursosComplementos/Campos?tipoRecursoId=" + tipoRecursoId);
        }

        this.postOrdensServicoParaManutencao = function (model) {
            return $http.post(baseUrl + 'ManutencaoOrdensServico/OrdensdeServicoParaManutencao', model);
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
      
        this.obterCampos = function (id) {
            return $http.get(baseUrl+ 'Campos/' + id);
        }
    }
    return ordensServicoService;
})