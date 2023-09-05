define(['componentBase'], function (ComponentBase) {

    var component = new ComponentBase('Telemetria');
    var app = angular.module(component.name, ['common']);

    var moduleName = component.name;

    var moduleConfig = {
        states: [
            { name: moduleName, abstract: true, url: '/' + moduleName, templateUrl: moduleName, controller: null },
            { name: moduleName + '.ocorrencias', abstract: false, url: '/ocorrencias/:tipoRecursoId', templateUrl: moduleName + '.ocorrencias', controller: moduleName + 'OcorrenciasController' },
            { name: moduleName + '.detalhes', abstract: false, url: '/detalhes/:ocorrenciaTelemetriaId', templateUrl: moduleName + '.detalhes', controller: moduleName + 'DetalhesController' },
            { name: moduleName + '.editar', abstract: false, url: '/editar/:ocorrenciaTelemetriaId', templateUrl: moduleName + '.editar', controller: moduleName + 'EditarController' },
            { name: moduleName + '.incluir', abstract: false, url: '/incluir', templateUrl: moduleName + '.incluir', controller: moduleName + 'IncluirController' },
            { name: moduleName + '.incluirBairro', abstract: false, url: '/incluirBairro/:ocorrenciaTelemetriaId', templateUrl: moduleName + '.incluirBairro', controller: moduleName + 'IncluirBairroController' },
            { name: moduleName + '.bairro', abstract: false, url: '/bairro/:bairroId', templateUrl: moduleName + '.bairro', controller: moduleName + 'BairroController' }
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

    app.service("TelemetriaService", function ($http) {

        this.obterParametrosCliente = function () {
            return $http.get("Api/SetoresAbastecimento/ObterParametrosCliente");
        }
        this.obterCampos = function (tipoRecursoId) {
            return $http.get("Api/TiposRecursosComplementos/Campos?tipoRecursoId=" + tipoRecursoId);
        }
        this.postOcorrencias = function (model) {
            return $http.post("Api/SetoresAbastecimento/PesquisarOcorrenciasTelemetria", model);
        }
        this.obterOcorrencia = function (ocorrenciaId) {
            return $http.get("Api/SetoresAbastecimento?id=" + ocorrenciaId);
        }
        this.postOcorrencia = function (model) {
            return $http.post("Api/SetoresAbastecimento", model);
        }
        this.editarOcorrencia = function (model) {
            return $http.put("Api/SetoresAbastecimento", model);
        }
        this.enviarEmailLigacoesOcorrenciaTelemetria = function (ocorrenciaTelemetriaId) { 
            return $http.post("Api/SetoresAbastecimento/EnviarEmailLigacoesOcorrenciaTelemetria?ocorrenciaTelemetriaId=" + ocorrenciaTelemetriaId)
        }
        this.getBairros = function (ocorrenciaId) {
            return $http.get("Api/SetoresAbastecimentoBairro/ObterBairrosTelemetria?id=" + ocorrenciaId);
        }
        this.obterBairro = function (bairroId) {
            return $http.get("Api/SetoresAbastecimentoBairro?id=" + bairroId);
        }
        this.excluir = function (bairroId) {
            return $http.delete("Api/SetoresAbastecimentoBairro?id=" + bairroId);
        }
        this.postBairro = function (model) {
            return $http.post("Api/SetoresAbastecimentoBairro", model);
        }
    });

});


