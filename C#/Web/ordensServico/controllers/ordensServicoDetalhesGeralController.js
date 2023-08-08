define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'DetalhesGeral', 'ordemServicoId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $state) {

        });
});