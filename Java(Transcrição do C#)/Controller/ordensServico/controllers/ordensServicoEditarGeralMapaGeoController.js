define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'EditarGeralMapaGeo', 'ordemServicoId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $http, $sce, $stateParams, ChamadosService, OrdensServicoService) {
            $scope.dados = {};
            $scope.dadosOs = OrdensServicoService.getDados();
            $http.get("Api/Mapa/MapaGeo")
                .then(function (response) {
                    $scope.dados.url = response.data.url;

                    $scope.urlMapa = $sce.trustAsResourceUrl($scope.dados.url + $scope.dadosOs.cdc);
                    console.log($scope.dadosOs);
                })
            $scope.$parent.tabActive = 7;

        });
});
