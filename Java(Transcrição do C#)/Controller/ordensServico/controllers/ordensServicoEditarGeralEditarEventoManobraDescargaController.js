define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'EditarGeralEditarEventoManobraDescarga');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $stateParams, ngNotify, EventosService) {

            // --- Declaração de variáveis básicas

            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            /*iniciliazacoes de variaveis de manobra*/

            $scope.listaTipoRegistroCombo = [];

            $scope.listaLogradourosCombo = [];

            // Inicialização da variável de inclusão de artigo.
            $scope.inclusaoManobra = {};

            // Inicialização da variável de edicao de artigo
            $scope.edicaoManobra = {};

            // Inicialização da variável de edicao de artigo
            $scope.exclusaoManobra = {};

            EventosService.getListaTiposRegistrosCombo()
                .then(function (response) {
                    $scope.listaTipoRegistroCombo = response.data;
                })

            EventosService.getListaLogradourosCombo()
                .then(function (response) {
                    $scope.listaLogradourosCombo = response.data;
                })

            var ObterListaComplementarEvento = function () {
                EventosService.getObterListaComplementarEvento($scope.eventoId, 6)
                 .then(function (response) {
                     $scope.dadosAbasComplementaresEvento.registrodeManobras = response.data;
                 });
            }


            //----funcoes de salvar e CRUD (exceto o R [Read]) para *MANOBRAS*----//
            //funcao para salvar manobra
            $scope.salvarManobra = function () {
                $scope.inclusaoManobra.eventoId = $stateParams.eventoId;
                $scope.inclusaoManobra.cobrado = false;
                EventosService.postSalvarManobra($scope.inclusaoManobra)
                    .then(function (response) {
                        ngNotify.set(response.data.message, "success")
                        ObterListaComplementarEvento()
                    });
            }

            //funcao para editar manobra
            $scope.salvarEdicaoManobra = function () {
                EventosService.putEditarManobra($scope.edicaoManobra)
                .then(function (response) {
                    ngNotify.set(response.data.message, "success")
                    ObterListaComplementarEvento()
                    console.log($scope.edicaoManobra.aberturaHora, $scope.edicaoManobra.fechamentoHora);

                });
            }

            //funcao para excluir manobra
            $scope.excluirManobra = function () {
                EventosService.deleteManobra($scope.exclusaoManobra.manobraDescargaEventoId)
                .then(function (response) {
                    ngNotify.set(response.data.message, "success")
                    ObterListaComplementarEvento()
                });
            }

            //modais de MANOBRA
            $scope.modalInclusaoManobra = function () {
                $scope.inclusaoManobra = {};
                $("#modalInclusaoManobra").modal('show');
            }

            $scope.modalEdicaoManobra = function (manobra) {
                $scope.edicaoManobra = angular.copy(manobra);
                $scope.edicaoManobra.aberturaHora = "2019-01-01T" + $scope.edicaoManobra.aberturaHora + ":00";
                $scope.edicaoManobra.fechamentoHora = "2019-01-01T"+$scope.edicaoManobra.fechamentoHora+":00";
                $("#modalEdicaoManobra").modal('show');
            }
            $scope.modalPerguntaManobra = function (manobra) {
                $scope.exclusaoManobra = manobra;
                $("#modalExcluir").modal('show');
            }


        });
});