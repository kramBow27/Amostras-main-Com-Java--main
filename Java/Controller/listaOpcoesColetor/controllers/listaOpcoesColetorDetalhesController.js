define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('ListaOpcoesColetor', 'Detalhes');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $state, $stateParams, $injector, ListaOpcoesColetorService, ngNotify) {
            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            // Configura a tabela
            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            ListaOpcoesColetorService.obterDetalhesListaOpcoesColetor($stateParams.id)
                .then(function (response) {
                    $scope.item = response.data;
                },
                function (error) {
                    ngNotify.set('Registro não encontrado', 'error');
                });

            ListaOpcoesColetorService.obterOpcoesListaColetor($stateParams.id)
                .then(function (response) {
                    $scope.opcoesListaColetor = response.data;
                })

            $scope.voltar = function () {
                $state.go(controller.moduleName + '.lista');
            }
        });
});

