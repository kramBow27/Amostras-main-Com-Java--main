define(['componentBase'], function (ComponentBase) {

    var component = new ComponentBase('ListaOpcoesColetor');
    var app = angular.module(component.name, ['common']);

    app.config(function ($controllerProvider) {
        app.registerController = $controllerProvider.register;
    });

    app.config(function ($stateProvider) {
        component.states.forEach(function (item) {
            var state = component.configureState(item);
            $stateProvider.state(state);
        });
    });

    app.factory(component.serviceName, function ($resource) {
        return $resource('api/' + component.name + '/:id', null, {
            update: { method: 'PUT' }
        });
    });

    app.service("ListaOpcoesColetorService", function ($http) {
        this.criar = function (model) {
            return $http.post("api/ListaOpcoesColetor", model);
        }

        this.obter = function () {
            return $http.get("Api/ListaOpcoesColetor");
        }

        this.editar = function (model) {
            return $http.put("api/ListaOpcoesColetor", model);
        }

        this.excluir = function (id) {
            return $http.delete("api/ListaOpcoesColetor/" + id);
        }

        this.obterDetalhesListaOpcoesColetor = function (id) {
            return $http.get("Api/ListaOpcoesColetor/" + id);
        }

        this.obterOpcoesListaColetor = function (id) {
            return $http.get("Api/OpcoesListaColetor/ObterOpcoesListaColetor?listaOpcaoId=" + id);
        }

    });

});
