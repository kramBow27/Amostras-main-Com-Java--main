define(function () {
    var equipesService = function ($http) {
        // Url base universal
        var baseUrl = "Api/";

        this.getDadosCamposGeracao = function (tipoRecursoId) {
            return $http.get(baseUrl + "TiposRecursosComplementos/Campos?tipoRecursoId=" + tipoRecursoId);
            this.obterEquipes = function (model) { 
                return $http.post(baseUrl + "Equipes/ObterEquipes", model)
            }
        }
       
    }

    return equipesService;
})