define(['componentBase'], function (ComponentBase) {

    var component = new ComponentBase('CamposColetor');
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

    
});
