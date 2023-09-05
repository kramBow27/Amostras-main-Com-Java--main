define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'EditarGeralMapa', 'ordemServicoId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $http, $sce, $stateParams, ChamadosService, OrdensServicoService) {
            $scope.dados = {};
            $scope.dadosOs = OrdensServicoService.getDados();
            var ligacaoId = $stateParams.ligacaoId;
            $http.get("Api/Mapa/" + $scope.dadosOs.ordemServicoId + "/Localizacao")
                    .then(function (response) {
                        $scope.dados = response.data;

                        $scope.urlMapa = $sce.trustAsResourceUrl("https://gps.cebinet.com.br/mapa/index?lat=" + $scope.dados.latitude.replace(",", ".") + "&lng=" + $scope.dados.longitude.replace(",", "."));

                    })
            $scope.$parent.tabActive = 5;

        });
});

