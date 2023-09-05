define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('CamposColetor', 'Lista');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector) {
            var modelService = $injector.get(controller.serviceName);
            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            // Configura a tabela
            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            modelService.query(function (data) {
                $scope.itens = data;
            });
        });
});
