define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'EditarGeralEditarEventoFuncoes');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $stateParams, ngNotify, EventosService) {

            // --- Declaração de variáveis básicas

            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            // Inicialização da variável de combo de funcao.
            $scope.listaFuncoesCombo = [];

            // Inicialização da variável de inclusão de funcao.
            $scope.inclusaoFuncao = {};

            // Inicialização da variável de edicao de funcao
            $scope.edicaoFuncao = {};

            // Inicialização da variável de edicao de funcao
            $scope.exclusaoFuncao = {};

            EventosService.getListaFuncoesCombo()
                .then(function (response) {
                    $scope.listaFuncoesCombo = response.data;
                })

            var ObterListaComplementarEvento = function () {
                EventosService.getObterListaComplementarEvento($scope.eventoId, 9)
                 .then(function (response) {
                     $scope.dadosAbasComplementaresEvento.funcoes = response.data;
                 });
            }

            //----funcoes de salvar e CRUD (exceto o R [Read]) para *FUNCOES*----//
            //funcao para salvar funcao
            $scope.salvarFuncao = function () {
                $scope.inclusaoFuncao.eventoId = $stateParams.eventoId;
                $scope.inclusaoFuncao.cobrado = false;
                EventosService.postSalvarFuncao($scope.inclusaoFuncao)
                    .then(function (response) {
                        ngNotify.set(response.data.message, "success")
                        ObterListaComplementarEvento();
                    });
            }

            //funcao para editar funcao
            $scope.salvarEdicaoFuncao = function () {
                EventosService.putEditarFuncao($scope.edicaoFuncao)
                .then(function (response) {
                    ngNotify.set(response.data.message, "success")
                    ObterListaComplementarEvento();
                });
            }

            //funcao para excluir funcao
            $scope.excluirFuncao = function () {
                EventosService.deleteFuncao($scope.exclusaoFuncao.funcaoEventoId)
                .then(function (response) {
                    ngNotify.set(response.data.message, "success")
                    ObterListaComplementarEvento();
                });
            }

            //modais de FUNCAO
            $scope.modalInclusaoFuncao = function () {
                $scope.inclusaoFuncao.quantidade = "";
                $scope.inclusaoFuncao = {};
                $("#modalInclusaoFuncao").modal('show');
            }
            $scope.modalEdicaoFuncao = function (funcao) {
                $scope.edicaoFuncao = angular.copy(funcao);
                $("#modalEdicaoFuncao").modal('show');
            }
            $scope.modalPerguntaFuncao = function (funcao) {
                $scope.exclusaoFuncao = funcao;
                $("#modalExcluir").modal('show');
            }
        });
});