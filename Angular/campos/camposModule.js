define(['componentBase'], function (ComponentBase) {

    var component = new ComponentBase('Campos');
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

    app.service("CamposService", function ($http) {
        this.detalhes = function (campoId) {
            return $http.get("Api/Campos/Detalhes?campoId=" +campoId);
        }
    });
    
});
