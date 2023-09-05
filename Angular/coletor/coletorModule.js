define(['componentBase'], function (ComponentBase) {

    var component = new ComponentBase('Coletor');
    var app = angular.module(component.name, ['common']);

    var moduleName = component.name;

    var moduleConfig = {
        states: [
            { name: moduleName, abstract: true, url: '/' + moduleName, templateUrl: moduleName, controller: null },
            { name: moduleName + '.carga', abstract: false, url: '/carga', templateUrl: moduleName + '.carga', controller: moduleName + 'CargaController' },
            { name: moduleName + '.programacoes', abstract: false, url: '/programacoes/:tipoRecursoId', templateUrl: moduleName + '.programacoes', controller: moduleName + 'ProgramacoesController' }
        ],
        paths: {
            base: function () { return 'app/modules/' + moduleName },
            controllers: function () { return moduleConfig.paths.base() + '/controllers/' },
            getView: function (templateName) { return moduleConfig.paths.base() + '/views/' + templateName + '.html' }
        }
    };

    app.config(function ($stateProvider, $urlRouterProvider) {

        moduleConfig.states.forEach(function (rota) {
            var state = {
                name: rota.name,
                url: rota.url,
                abstract: rota.abstract,
                templateUrl: moduleConfig.paths.getView(rota.templateUrl),
                template: rota.template
            };

            if (rota.controller) {
                state.controller = rota.controller;

                if (rota.resolve) {
                    state.resolve = rota.resolve
                    state.resolve.controllerFile = function (coreService) {
                        return coreService.loadController(moduleConfig, rota.controller);
                    }
                } else {
                    state.resolve = {
                        controllerFile: function (coreService) {
                            return coreService.loadController(moduleConfig, rota.controller);
                        }
                    };
                }
            }

            $stateProvider.state(state);
        });
    });
    app.config(function ($controllerProvider) {
        app.registerController = $controllerProvider.register;
    });

    app.factory(component.serviceName, function ($resource) {
        return $resource('api/' + component.name + '/:id', null, {
            update: { method: 'PUT' }
        });
    });

    app.service("ColetorService", function ($http) {
        this.obterCampos = function (tipoRecursoId) {
            return $http.get("Api/TiposRecursosComplementos/Campos?tipoRecursoId=" + tipoRecursoId);
        }

        this.getEquipesColetor = function (id) {
            return $http.get("Api/Coletor/Carga");
        }

        this.postLiberarCarga = function (equipesId) {
            return $http.post("Api/Coletor/LiberarCarga", equipesId);
        }

        this.postProgramacoes = function (model) {
            return $http.post("Api/ManutencaoOrdensServico/ProgramacoesColetores", model);
        }

        this.postOrdensServicoRejeitadas = function (model) {
            return $http.post("Api/ManutencaoOrdensServico/OrdenServicoRejeitadasProgramacoesColetores", model);
        }
        
        this.obterOrdensServicoProgramacaoColetor = function (arquivoColetorId) {
            return $http.get("Api/ManutencaoOrdensServico/OrdensServicoProgramacaoColetor?arquivoColetorId=" + arquivoColetorId);
        }
        this.postReenviarOrdensServico = function (eventosId) {
            return $http.post("Api/ManutencaoOrdensServico/ReenviarOrdensServico", eventosId);
        }

    });

});


