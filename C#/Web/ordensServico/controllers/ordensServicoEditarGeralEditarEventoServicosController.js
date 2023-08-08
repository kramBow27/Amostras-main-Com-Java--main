define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'EditarGeralEditarEventoServicos');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $stateParams, ngNotify, EventosService) {

            // --- Declaração de variáveis básicas

            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            // Inicialização da variável de combo de servicos.
            $scope.listaTipoServicosCombo = [];

            // Inicialização da variável de inclusão de servico.
            $scope.inclusaoServico = {};

            // Inicialização da variável de edicao de servico
            $scope.edicaoServico = {};

            // Inicialização da variável de exclusao de servico
            $scope.exclusaoServico = {};

            var indexAlteracaoServico = -1;

            $scope.calcularTotalValorHorasServico = function (valorServico, qtdhoras) {

                if (!qtdhoras) {
                    qtdhoras = 1;
                }

                return valorServico * qtdhoras;
            }
            var valorPadrao = undefined;

            EventosService.getListaTipoServicosCombo(valorPadrao)
                .then(function (response) {
                    $scope.listaTipoServicosCombo = response.data;
                })

            var ObterListaComplementarEvento = function () {
                EventosService.getObterListaComplementarEvento($scope.eventoId, 4)
                 .then(function (response) {
                     $scope.dadosAbasComplementaresEvento.servicos = response.data;
                 });
            }

            //----funcoes de salvar e CRUD (exceto o R [Read]) para *SERVIÇOS*----//
            //funcao para salvar servico
            $scope.salvarServico = function () {
                $scope.inclusaoServico.eventoId = $stateParams.eventoId;
                $scope.inclusaoServico.cobrado = false;

                if (!$scope.inclusaoServico.qtdhoras) {
                    $scope.inclusaoServico.qtdhoras = null;
                }
                else {
                    $scope.inclusaoServico.qtdhoras = $scope.inclusaoServico.qtdhoras.toString().replace(",", ".");
                }

                EventosService.postSalvarServico($scope.inclusaoServico)
                    .then(function (response) {
                        ngNotify.set(response.data.message, "success")
                        ObterListaComplementarEvento()
                    });

                indexAlteracaoServico = -1;
            }

            //funcao para editar servico
            $scope.salvarEdicaoServico = function () {
                $scope.inclusaoServico.eventoId = $stateParams.eventoId;
                $scope.inclusaoServico.cobrado = false;

                EventosService.putEditarServico($scope.edicaoServico)
                .then(function (response) {
                    ngNotify.set(response.data.message, "success")
                    ObterListaComplementarEvento()
                });
            }

            //funcao para excluir servico
            $scope.excluirServico = function () {
                EventosService.deleteServico($scope.exclusaoServico.lancaServicoEventoId)
                .then(function (response) {
                    ngNotify.set(response.data.message, "success")
                    ObterListaComplementarEvento()
                });
            }

            //Modais de SERVICO
            $scope.modalInclusaoServico = function () {
                $scope.inclusaoServico = {};

                EventosService.getListaTipoServicosCombo(valorPadrao)
                     .then(function (response) {
                         $scope.listaTipoServicosCombo = response.data;
                     })

                $("#modalInclusaoServico").modal('show');
            }
            $scope.modalEdicaoServico = function (servico, index) {
                if (servico.lancaServicoEventoId != $scope.edicaoServico.lancaServicoEventoId) {
                    EventosService.getListaTipoServicosCombo(servico.servicoId)
                        .then(function (response) {
                            $scope.listaTipoServicosCombo = response.data;
                            $scope.edicaoServico = angular.copy(servico);
                        })
                }

                indexAlteracaoServico = index;
                $scope.alteracaoServicoSelecionado();
                $("#modalEdicaoServico").modal('show');
            }
            $scope.modalPerguntaServico = function (servico) {
                $scope.exclusaoServico = servico;
                $("#modalExcluir").modal('show');
            }

            //Watchers SERVICO
            $scope.$watch('inclusaoServico.tipoServicoId', function (newValue) {
                if (!newValue) {
                    return;
                }
                $scope.listaTipoServicosCombo.forEach(function (servico) {
                    if (servico.tipoServicoId == $scope.inclusaoServico.tipoServicoId) {
                        $scope.inclusaoServico.precoUnitarioFixo = servico.precoUnitarioFixo;
                    }
                })
            })

            $scope.$watchGroup(['inclusaoServico.qtdhoras', 'inclusaoServico.precoUnitarioFixo'], function (newValue, oldValue) {
                if (!newValue[1]) {
                    $scope.inclusaoServico.valorServico = 0;
                    return;
                }

                if (!$scope.inclusaoServico.qtdhoras) {
                    var quantidadeHoras = 1;
                }
                else {
                    var quantidadeHoras = $scope.inclusaoServico.qtdhoras.toString().replace(",", ".");
                }

                var precoUnitarioFixo = parseFloat($scope.inclusaoServico.precoUnitarioFixo.toString().replace("R$", "").replace(",", "."));

                var totalPreco = (precoUnitarioFixo * quantidadeHoras);

                $scope.inclusaoServico.valorServico = parseFloat(totalPreco.toFixed(2));;

            })

            $scope.$watch("edicaoServico.lancaServicoEventoId", function (nvLancaServicoEventoId, oldNvTipoServicoId) {
                if (!nvLancaServicoEventoId) {
                    return;
                }
                var valor = 0;
                var valorServico = 0;
                var horas = 1;

                EventosService.getServico($scope.edicaoServico.lancaServicoEventoId)
                    .then(function (response) {
                        if (response) {

                            valorServico = response.data.valorServico;

                            if (!response.data.qtdhoras) {
                                horas = 1;
                            }
                            else {
                                horas = response.data.qtdhoras;
                            }

                            valor = valorServico / horas;

                            for (var c = 0; c < $scope.listaTipoServicosCombo.length; c++) {
                                if ($scope.listaTipoServicosCombo[c].tipoServicoId == $scope.edicaoServico.servicoId && $scope.dadosAbasComplementaresEvento.servicos[indexAlteracaoServico].servicoId == $scope.edicaoServico.servicoId) {
                                    $scope.edicaoServico.precoUnitarioFixo = valor;
                                    break;
                                }
                                if ($scope.listaTipoServicosCombo[c].tipoServicoId == $scope.edicaoServico.servicoId) {
                                    $scope.edicaoServico.precoUnitarioFixo = angular.copy($scope.listaTipoServicosCombo[c].precoUnitarioFixo);
                                }
                            }
                        }
                        else {
                            return;
                        }
                    })
            })


            $scope.alteracaoServicoSelecionado = function (servicoId) {
                if (!servicoId) {
                    return;
                }
                $scope.listaTipoServicosCombo.forEach(function (servico) {
                    if (servico.tipoServicoId == servicoId) {
                        $scope.edicaoServico.precoUnitarioFixo = servico.precoUnitarioFixo;
                        $scope.calcularValorTotal($scope.edicaoServico);
                    }
                })
            }

            $scope.calcularValorTotal = function (edicaoServico) {

                //if (!edicaoServico.qtdhoras || !edicaoServico.precoUnitarioFixo) {
                //    $scope.edicaoServico.valorServico = 0;
                //    return;
                //}

                //var quantidadeHoras = $scope.edicaoServico.qtdhoras.toString().replace(",", ".");
                //var precoUnitarioFixo = parseFloat($scope.edicaoServico.precoUnitarioFixo.toString().replace("R$", "").replace(",", "."));
                //var totalPreco = (precoUnitarioFixo * quantidadeHoras);

                if (!edicaoServico.precoUnitarioFixo) {
                    $scope.edicaoServico.valorServico = 0;
                    return;
                }

                var precoUnitarioFixo = parseFloat($scope.edicaoServico.precoUnitarioFixo.toString().replace("R$", "").replace(",", "."));

                if (!edicaoServico.qtdhoras) {
                    var quantidadeHoras = 1;
                }
                else {
                    var quantidadeHoras = $scope.edicaoServico.qtdhoras.toString().replace(",", ".");
                }

                var totalPreco = (precoUnitarioFixo * quantidadeHoras);

                $scope.edicaoServico.valorServico = parseFloat(totalPreco.toFixed(2));
            }

        });
});


