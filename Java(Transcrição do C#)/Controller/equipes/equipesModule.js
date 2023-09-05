define(['componentBase'], function (ComponentBase) {

    var component = new ComponentBase('Equipes');
    var app = angular.module(component.name, ['common']);

    var moduleName = component.name;
   

    var moduleConfig = {
        states: [
            { name: moduleName, abstract: true, url: '/' + moduleName, templateUrl: moduleName, controller: null },
            { name: moduleName + '.detalhes', abstract: false, url: '/detalhes/:id/?equipeId', templateUrl: moduleName + '.detalhes', controller: moduleName + 'DetalhesController' },
            { name: moduleName + '.editar', abstract: false, url: '/editar/:id', templateUrl: moduleName + '.editar', controller: moduleName + 'EditarController' },
            { name: moduleName + '.incluir', abstract: false, url: '/incluir/:id', templateUrl: moduleName + '.incluir', controller: moduleName + 'IncluirController' },
            { name: moduleName + '.lista', abstract: false, url: '/lista', templateUrl: moduleName + '.lista', controller: moduleName + 'ListaController' },
            { name: moduleName + '.monitoramento', abstract: false, url: '/monitoramento/:tipoRecursoId', templateUrl: moduleName + '.monitoramento', controller: moduleName + 'MonitoramentoController' },

           
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

    
});
