define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('CamposColetor', 'Detalhes');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $state, $stateParams, $injector) {
            var service = $injector.get(controller.serviceName);
            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            // Configura a tabela
            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            service.get({ id: $stateParams.id },
                function (data) {
                    $scope.item = data;
                },
                function (error) {
                    ngNotify.set('Registro não encontrado', 'error');
                    $scope.remoteErrors = errorService.parseErrors(error);
                    $state.go(controller.moduleName + '.lista');
                });

            $scope.voltar = function () {
                $state.go(controller.moduleName + '.lista');
            }

            

        });
});

