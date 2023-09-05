define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'EditarGeralEditarEventoVala');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $stateParams, $http, ngNotify, EventosService) {

            // --- Declaração de variáveis básicas

            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            $scope.total = 0;

            // Inicialização da variável de combo de funcao.
            $scope.listaValasCombo = [];

            // Inicialização da variável de inclusão de funcao.
            $scope.inclusaoVala = {};

            // Inicialização da variável de edicao de funcao
            $scope.edicaoVala = {};

            // Inicialização da variável de edicao de funcao
            $scope.exclusaoVala = {};

            function obterListaValas() {
                EventosService.getObterListaComplementarEvento($scope.eventoId, 11)
                .then(function (response) {
                    $scope.$parent.dadosAbasComplementaresEvento.vala = response.data;
                })
            };

            obterListaValas();

            var valorPadrao = 0;

            EventosService.obterValas(valorPadrao)
                .then(function (response) {
                    $scope.listaValasCombo = response.data;
                })

            // Obtém o preço do serviço do tipo da vala

            $scope.getPrecoUnitario = function (servicoId, modal) {
                if ((servicoId == null || servicoId == "") && modal == 1) {
                    $scope.inclusaoVala.valorM2 = 0
                    return;
                }

                if ((servicoId == null || servicoId == "") && modal == 2) {
                    $scope.edicaoVala.valorM2 = 0
                    return;
                }

                $http.get("Api/TipoServicos/GetPreco?id=" + servicoId)
                .then(function (response) {
                    if (modal == 1) {
                        $scope.inclusaoVala.valorM2 = response.data
                        $scope.calculaAreaModal($scope.inclusaoVala.largura, $scope.inclusaoVala.comprimento, $scope.inclusaoVala.valorM2);
                    }

                    if (modal == 2) {
                        $scope.edicaoVala.valorM2 = response.data
                        $scope.calculaAreaModal($scope.edicaoVala.largura, $scope.edicaoVala.comprimento, $scope.edicaoVala.valorM2);

                    }
                })
            }

            // Calcula o valor total no modal

            $scope.calculaAreaModal = function (largura, comprimento, valorm2) {
                if (largura == undefined || comprimento == undefined) return 0;

                var area = (largura * comprimento);

                $scope.total = valorm2 * area;
            }

            // Calcula o valor total no grid

            $scope.calculaArea = function (largura, comprimento, valorm2) {
                if (largura == undefined || comprimento == undefined) return 0;

                var area = (largura * comprimento);

                var resultado = valorm2 * area;
                return resultado;
            }


            // Modais Vala

            $scope.modalInclusaoVala = function () {
                $scope.inclusaoVala = {};
                $scope.total = 0;
                $("#modalInclusaoVala").modal('show');

                EventosService.obterValas(valorPadrao)
                    .then(function (response) {
                        $scope.listaValasCombo = response.data;
                    })
            }

            $scope.modalEdicaoVala = function (vala) {
                $scope.edicaoVala = {};
                $scope.edicaoVala = angular.copy(vala);
                $scope.calculaAreaModal($scope.edicaoVala.largura, $scope.edicaoVala.comprimento, $scope.edicaoVala.valorM2);

                EventosService.obterValas($scope.edicaoVala.tipoValaId)
                    .then(function (response) {
                        $scope.listaValasCombo = response.data;
                    })

                $("#modalEdicaoVala").modal('show');
            }

            $scope.modalExcluirVala = function (vala) {
                $scope.idExclusaoVala = vala;
                $("#modalExcluir").modal('show');
            }

            // Inclui a vala no evento

            $scope.gravar = function (model) {
                model.cobrado = false;
                model.eventoId = $stateParams.eventoId;

                $http.post("Api/EventosValas", model)
                .then(function (response) {
                    $("#modalInclusaoVala").modal('hide');
                    obterListaValas();
                })
            }

            // Exclui a vala do evento

            $scope.excluirVala = function () {
                $http.delete("Api/EventosValas?id=" + $scope.idExclusaoVala)
                .then(function (response) {
                    $("#modalExcluir").modal('hide');
                    ngNotify.set(response.data.message, "success")
                    obterListaValas();
                })
            }

            // Edita a vala do evento

            $scope.editarVala = function (model) {
                $http.put("Api/EventosValas", model)
                .then(function (response) {
                    ngNotify.set(response.data.message, "success")
                    $("#modalEdicaoVala").modal("hide");
                    obterListaValas();
                })
            };

        });
});