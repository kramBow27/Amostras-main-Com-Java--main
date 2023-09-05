define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'EditarGeralGuiaRecolhimentoDetalhes', 'ordemServicoId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $location, fileDownloadService, $stateParams, $http) {
            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            // Configura a tabela
            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            $scope.guiaRecolhimentoId = $stateParams.id;
            $scope.guiaRecolhimento = [];
            var ObterDetalhesGuia = function () {
                $http.get('Api/GuiaRecolhimento/' + $scope.guiaRecolhimentoId + '/Detalhes')
                    .success(function (response) {
                        $scope.guiaRecolhimento = response;
                        defineServicos();
                    });
            }
            ObterDetalhesGuia();



            function defineServicos() {

                $scope.servicos = [{
                    id: $scope.guiaRecolhimento.tipoServicoId1,
                    descricao: $scope.guiaRecolhimento.servico1,
                    quantidade: $scope.guiaRecolhimento.quantidade1,
                    valor: $scope.guiaRecolhimento.valorServico1
                },
                {
                    id: $scope.guiaRecolhimento.tipoServicoId2,
                    descricao: $scope.guiaRecolhimento.servico2,
                    quantidade: $scope.guiaRecolhimento.quantidade2,
                    valor: $scope.guiaRecolhimento.valorServico2
                },
                {
                    id: $scope.guiaRecolhimento.tipoServicoId3,
                    descricao: $scope.guiaRecolhimento.servico3,
                    quantidade: $scope.guiaRecolhimento.quantidade3,
                    valor: $scope.guiaRecolhimento.valorServico3
                },
                {
                    id: $scope.guiaRecolhimento.tipoServicoId4,
                    descricao: $scope.guiaRecolhimento.servico4,
                    quantidade: $scope.guiaRecolhimento.quantidade4,
                    valor: $scope.guiaRecolhimento.valorServico4
                },
                {
                    id: $scope.guiaRecolhimento.tipoServicoId5,
                    descricao: $scope.guiaRecolhimento.servico5,
                    quantidade: $scope.guiaRecolhimento.quantidade5,
                    valor: $scope.guiaRecolhimento.valorServico5
                },
                {
                    id: $scope.guiaRecolhimento.tipoServicoId6,
                    descricao: $scope.guiaRecolhimento.servico6,
                    quantidade: $scope.guiaRecolhimento.quantidade6,
                    valor: $scope.guiaRecolhimento.valorServico6
                },
                {
                    id: $scope.guiaRecolhimento.tipoServicoId7,
                    descricao: $scope.guiaRecolhimento.servico7,
                    quantidade: $scope.guiaRecolhimento.quantidade7,
                    valor: $scope.guiaRecolhimento.valorServico7
                },
                {
                    id: $scope.guiaRecolhimento.tipoServicoId8s,
                    descricao: $scope.guiaRecolhimento.servico8,
                    quantidade: $scope.guiaRecolhimento.quantidade8,
                    valor: $scope.guiaRecolhimento.valorServico8
                }];

                console.log($scope.servicos);
            }


        });
});


