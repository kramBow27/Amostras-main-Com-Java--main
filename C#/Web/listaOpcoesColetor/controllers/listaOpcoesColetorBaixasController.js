define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('ListaOpcoesColetor', 'Baixas');


    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, ngNotify,
            $injector,
            $stateParams, $timeout, OrdensServicoService) {

            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            if (!$.fn.DataTable.isDataTable('#tabela')) {
                $scope.dtOptions = dtOptionsBuilder
                    .newOptions()
                    .withOption('destroy', true)
                    .withOption('order', [])
                    .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');
            }


            $scope.tipoRecursoId = $stateParams.tipoRecursoId;
            console.log($scope.tipoRecursoId);




            OrdensServicoService.getDadosCamposGeracao($scope.tipoRecursoId)
                .then(function (response) {
                    $scope.modelPassosCamposGeracao = response.data;
                    console.log($scope.tipoRecursoId);
                    console.log(response.data)

                })




            // Gerencia a troca de abas ativas.
            $scope.ativarAba = function (passo) {
                $scope.passoAtivo = passo.passoId
            }


           
        })
})
