define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('Campos', 'Lista');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $http) {
            var modelService = $injector.get(controller.serviceName);
            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            // Configura a tabela
            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');


            $http.get("Api/Campos/ObterCamposLista")
            .then(function (response) {
                $scope.itens = response.data;
            });
           
        });
});
