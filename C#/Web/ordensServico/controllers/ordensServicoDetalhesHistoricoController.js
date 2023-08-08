define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'DetalhesHistorico', 'ordemServicoId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $stateParams, $http, OrdensServicoService) {

            $scope.situacaoChamado = OrdensServicoService.getDados();
            
            OrdensServicoService.consultaDetalhesHistorico($stateParams.historicoId)
                .then(function (response) {
                        $scope.dados = response.data;
                    },
                    function (error) {
                        //failure call back
                    }
                );

            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            $scope.dadosOs = OrdensServicoService.getDados();

        });
});
