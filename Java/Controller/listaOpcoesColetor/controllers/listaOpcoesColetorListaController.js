define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('ListaOpcoesColetor', 'Lista');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, ListaOpcoesColetorService) {
            var modelService = $injector.get(controller.serviceName);
            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            // Configura a tabela
            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            ListaOpcoesColetorService.obter()
                .then(function (response) {
                    $scope.itens = response.data;
                })
        });
});
