define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'EditarGeral', 'ordemServicoId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $state, OrdensServicoService, $stateParams, $http, OrdensServicoService) {
            {
                $scope.dadosOs = OrdensServicoService.getDados();
                var ligacaoId = $stateParams.ligacaoId;
            }
            {
                $http.get("Api/Mapa/" + $scope.dadosOs.ordemServicoId )
                    .then(function (response) {
                        $scope.flagMostraMapa = response.data;
                    })
            }
            {
                $http.get("Api/GuiaRecolhimento/VerificaGuias/" + $scope.dadosOs.ordemServicoId )
                    .then(function (response) {
                        $scope.flagMostraGuiaRecolhimento = response.data;
                        console.log($scope.flagMostraGuiaRecolhimento);
                    })
            }
            {
                $http.get("Api/Mapa/MapaGeo")
                    .then(function (response) {
                        $scope.flagMostraMapaGeo = response.data.utilizaGeo;
                    })
            }
        });
});