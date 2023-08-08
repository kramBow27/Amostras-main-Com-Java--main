define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'EditarGeralEditarEventoMaoDeObra');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $stateParams, ngNotify, EventosService) {

            // --- Declaração de variáveis básicas

            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            // Inicialização da variável de inclusão de funcionario
            $scope.inclusaoMaoDeObra = {};

            // Inicialização da variável de edicao de funcionario
            $scope.edicaoMaoDeObra = {};

            // Inicialização da variável de edicao de funcionario
            $scope.exclusaoMaoDeObra = {};

            $scope.listaFuncionariosCombo = [];

            // --- Funções e operações pós obtenção de dados.
            $scope.calcularTotalHorasMaoObra = function (quantidadeHoras, preco) {
                return quantidadeHoras * preco;
            }

            EventosService.getListaFuncionariosCombo()
            .then(function (response) {
                $scope.listaFuncionariosCombo = response.data;
            })

            var ObterListaComplementarEvento = function () {
                EventosService.getObterListaComplementarEvento($scope.eventoId, 3)
                 .then(function (response) {
                     $scope.$parent.dadosAbasComplementaresEvento.maodeObra = response.data;
                 });
            }

            //----funcoes de salvar e CRUD (exceto o R [Read]) para *MAO DE OBRA*----//
            //funcao para salvar mao de obra
            $scope.salvarMaoDeObra = function () {
                $scope.inclusaoMaoDeObra.eventoId = $stateParams.eventoId;
                $scope.inclusaoMaoDeObra.cobrado = false;
                EventosService.postSalvarMaoDeObra($scope.inclusaoMaoDeObra)
                    .then(function (response) {
                        ngNotify.set(response.data.message, "success")
                        ObterListaComplementarEvento()
                    });
            }

            //funcao para editar mao de obra
            $scope.salvarEdicaoMaoDeObra = function () {
                EventosService.putEditarMaoDeObra($scope.edicaoMaoDeObra)
                .then(function (response) {
                    ngNotify.set(response.data.message, "success")
                    ObterListaComplementarEvento()
                });
            }

            //funcao para excluir mao de obra
            $scope.excluirMaoDeObra = function () {
                EventosService.deleteMaoDeObra($scope.exclusaoMaoDeObra.maoObraEventoId)
                .then(function (response) {
                    ngNotify.set(response.data.message, "success")
                    ObterListaComplementarEvento()
                });
            }

            //modais de MAO DE OBRA
            $scope.modalInclusaoMaoDeObra = function () {
                $scope.inclusaoMaoDeObra = {};
                $("#modalInclusaoMaoDeObra").modal('show');
            }
            $scope.modalEdicaoMaoDeObra = function (maoObra) {
                $scope.edicaoMaoDeObra = {};
                $scope.maoObra = {};

                $scope.edicaoMaoDeObra = angular.copy(maoObra);

                $scope.maoObra = {
                    re: maoObra.re,
                    nomeFuncionario: maoObra.nomeFuncionario
                }
                $scope.alteracaoFuncionarioSelecionado($scope.edicaoMaoDeObra);
                $scope.calcularHoras($scope.edicaoMaoDeObra);
                $scope.calcularValorTotal($scope.edicaoMaoDeObra);

                $("#modalEdicaoMaoDeObra").modal('show');
            }


            $scope.modalPerguntaMaoDeObra = function (maoObra) {
                $scope.exclusaoMaoDeObra = maoObra;
                $("#modalExcluir").modal('show');
            }



            //watchers MAO DE OBRA

            $scope.$watch('inclusaoMaoDeObra.RE', function (newValue) {
                if (!newValue) {
                    return;
                }
                $scope.listaFuncionariosCombo.forEach(function (funcionario) {
                    if (funcionario.re == $scope.inclusaoMaoDeObra.RE) {
                        $scope.inclusaoMaoDeObra.precoHora = funcionario.precoHora;
                    }
                })
            })

            $scope.$watchGroup(['inclusaoMaoDeObra.dataInicio', 'inclusaoMaoDeObra.dataTermino'], function (newValue) {
                if (!newValue[0] || !newValue[1]) {
                    $scope.inclusaoMaoDeObra.horasTrabalhadas = 0;
                    return;
                }

                var dataInicial = new Date($scope.inclusaoMaoDeObra.dataInicio);
                var dataFinal = new Date($scope.inclusaoMaoDeObra.dataTermino);

                var hours = Math.abs(dataInicial - dataFinal) / 36e5;
                $scope.inclusaoMaoDeObra.horasTrabalhadas = parseFloat(hours.toFixed(2));
            })

            $scope.$watchGroup(['inclusaoMaoDeObra.horasTrabalhadas', 'inclusaoMaoDeObra.precoHora'], function (newValue, oldValue) {
                if (!newValue[1]) {
                    $scope.inclusaoMaoDeObra.totalPreco = 0;
                    return;
                }

                var totalHoras = $scope.inclusaoMaoDeObra.horasTrabalhadas;
                var precoHora = $scope.inclusaoMaoDeObra.precoHora;

                var totalPreco = (precoHora * totalHoras);

                $scope.inclusaoMaoDeObra.totalPreco = parseFloat(totalPreco.toFixed(2));;
            })

            $scope.alteracaoFuncionarioSelecionado = function (edicaoMaoDeObra) {
                if (!edicaoMaoDeObra.re) {
                    $scope.edicaoMaoDeObra.precoHora = null;
                    $scope.edicaoMaoDeObra.totalPreco = null;
                    return;
                }

                $scope.listaFuncionariosCombo.forEach(function (maoObra) {
                    if (maoObra.re == edicaoMaoDeObra.re) {
                        $scope.edicaoMaoDeObra.precoHora = maoObra.precoHora;
                        $scope.calcularHoras($scope.edicaoMaoDeObra)
                        $scope.calcularValorTotal($scope.edicaoMaoDeObra);

                    }
                })
            }


            $scope.calcularHoras = function (edicaoMaoDeObra) {
                if (!edicaoMaoDeObra.dataInicio || !edicaoMaoDeObra.dataTermino) {
                    $scope.edicaoMaoDeObra.horasTrabalhadas = 0;
                    return;
                }

                var dataInicial = new Date($scope.edicaoMaoDeObra.dataInicio);
                var dataFinal = new Date($scope.edicaoMaoDeObra.dataTermino);

                var hours = Math.abs(dataInicial - dataFinal) / 36e5;

                $scope.edicaoMaoDeObra.horasTrabalhadas = parseFloat(hours.toFixed(2));;
                $scope.calcularValorTotal($scope.edicaoMaoDeObra);
                console.log(hours);

            }



            $scope.calcularValorTotal = function (edicaoMaoDeObra) {
                if (!edicaoMaoDeObra.horasTrabalhadas || !edicaoMaoDeObra.precoHora) {
                    $scope.edicaoMaoDeObra.totalHoras = 0;
                    $scope.edicaoMaoDeObra.totalPreco = 0;
                    return;
                }
                var totalHoras = $scope.edicaoMaoDeObra.horasTrabalhadas;
                var precoHora = $scope.edicaoMaoDeObra.precoHora;

                var totalPreco = (precoHora * totalHoras);

                $scope.edicaoMaoDeObra.totalPreco = parseFloat(totalPreco.toFixed(2));

            }

            //$scope.$watch('edicaoMaoDeObra.RE', function (newValue) {
            //    if (!newValue) {
            //        return;
            //    }
            //    $scope.listaFuncionariosCombo.forEach(function (funcionario) {
            //        if (funcionario.re == $scope.edicaoMaoDeObra.RE) {
            //            $scope.edicaoMaoDeObra.precoHora = funcionario.precoHora;
            //        }
            //    })
            //})

            //$scope.$watchGroup(['edicaoMaoDeObra.dataInicio', 'edicaoMaoDeObra.dataTermino'], function (newValue) {
            //    if (!newValue[0] || !newValue[1]) {
            //        $scope.edicaoMaoDeObra.horasTrabalhadas = 0;
            //        return;
            //    }

            //    var dataInicial = new Date($scope.edicaoMaoDeObra.dataInicio);
            //    var dataFinal = new Date($scope.edicaoMaoDeObra.dataTermino);

            //    var hours = Math.abs(dataInicial - dataFinal) / 36e5;

            //    $scope.edicaoMaoDeObra.horasTrabalhadas = parseFloat(hours.toFixed(2));;
            //})

            //$scope.$watchGroup(['edicaoMaoDeObra.horasTrabalhadas', 'edicaoMaoDeObra.precoHora'], function (newValue, oldValue) {
            //    if (!newValue[0] || !newValue[1]) {
            //        $scope.edicaoMaoDeObra.horasTrabalhadas = 0;
            //        return;
            //    }

            //    var totalHoras = $scope.edicaoMaoDeObra.horasTrabalhadas;
            //    var precoHora = $scope.edicaoMaoDeObra.precoHora;

            //    var totalPreco = (precoHora * totalHoras);

            //    $scope.edicaoMaoDeObra.totalPreco = parseFloat(totalPreco.toFixed(2));
            //})
        });
});
