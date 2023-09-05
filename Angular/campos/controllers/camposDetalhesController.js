define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('Campos', 'Detalhes');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $stateParams, CamposService) {
            var modelService = $injector.get(controller.serviceName);
            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            // Configura a tabela
            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');
            
            CamposService.detalhes($stateParams.id)
                .then(function (response) {
                    $scope.itens = response.data;
                });
        });
});
