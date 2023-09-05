define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'EditarGeralEditarEventoEquipamentos');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $stateParams, ngNotify, EventosService) {

            // --- Declaração de variáveis básicas

            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            // Inicialização da variável de combo de equipamentos.
            $scope.listaEquipamentosCombo = [];

            // Inicialização da variável de inclusão de equipamento
            $scope.inclusaoEquipamento = {};

            // Inicialização da variável de edicao de equipamento
            $scope.edicaoEquipamento = {};

            // Inicialização da variável de exclusao de equipamento
            $scope.exclusaoEquipamento = {};

            // --- Obtenção de dados.

            // Obter lista de materias do evento.
            var obterListaEquipamentos = function () {
                EventosService.getObterListaComplementarEvento($scope.eventoId, 2)
                .then(function (response) {
                    $scope.$parent.listaEquipamentosEvento = response.data;
                })
            };

            obterListaEquipamentos();

            EventosService.getListaEquipamentosCombo()
                .then(function (response) {
                    $scope.listaEquipamentosCombo = response.data;
                });

            // --- Funções e operações pós obtenção de dados.
            
            $scope.calcularValorHorasTotalDebitarEquipamento = function (preco, horas) {
                return preco * horas;
            };

            //modais de EQUIPAMENTO
            $scope.modalInclusaoEquipamento = function () {
                $scope.inclusaoEquipamento = {};
                $("#modalInclusaoEquipamento").modal('show');
            };

            $scope.modalEdicaoEquipamento = function (equipamento) {
                $scope.edicaoEquipamento = {};
                $scope.equipamento = {};

                $scope.edicaoEquipamento = angular.copy(equipamento);

                $scope.calcularValorTotal($scope.edicaoEquipamento);
                $scope.alteracaoEquipamentoSelecionado($scope.edicaoEquipamento.equipamentoId);
                $scope.calcularHoras($scope.edicaoEquipamento);

                $("#modalEdicaoEquipamento").modal('show');
            };

            $scope.modalPerguntaEquipamento = function (equipamento) {
                $scope.exclusaoEquipamento = equipamento;
                $("#modalExcluir").modal('show');
            };

            //----funcoes de CRUD (exceto o R [Read]) para *EQUIPAMENTO*----//
            //funcao para salvar equipamento
            $scope.salvarEquipamento = function () {
                $scope.inclusaoEquipamento.eventoId = $stateParams.eventoId;
                $scope.inclusaoEquipamento.cobrado = false;
                $scope.inclusaoEquipamento.baixado = false;
                EventosService.postSalvarEquipamento($scope.inclusaoEquipamento)
                    .then(function (response) {
                        ngNotify.set(response.data.message, "success")
                        obterListaEquipamentos();
                    });
            };

            //funcao para salvar equipamento
            $scope.salvarEdicaoEquipamento = function () {
                EventosService.putEditarEquipamento($scope.edicaoEquipamento)
                .then(function (response) {
                    ngNotify.set(response.data.message, "success")
                    obterListaEquipamentos();
                });
            };

            //funcao para excluir equipamento
            $scope.excluirEquipamento = function () {
                EventosService.deleteEquipamento($scope.exclusaoEquipamento.equipamentoEventoId)
                .then(function (response) {
                    ngNotify.set(response.data.message, "success")
                    obterListaEquipamentos();
                });
            };
            

            // -- Watchers
            /*
                Os watchers são criados para mudança de valor de campo de forma dinamica,
                onde sao usados para as operações Create e Update no CRUD (Create, Read, Update, Delete);

                Aqui, os watchers sao definidos para preço unitario, preço total ou descrição de cada modulo.
                Ao mudar o combobox em alguns lugares, o preço unitario do escolhido irá mudar, 
                e ao digitar a quantidade, o preço total irá mudar, 
                multiplicando quantidade * preço (em material, por ex);

                O $watcherGroup permite vigiar mais de um model, para permitir a "comunicação" entre ambos os campos.
            
            */

            //watchers EQUIPAMENTO
            $scope.$watch('inclusaoEquipamento.equipamentoId', function (newValue) {
                if (!newValue) {
                    $scope.inclusaoEquipamento.precoHora = null;
                    $scope.inclusaoEquipamento.dataHoraInicio = null;
                    $scope.inclusaoEquipamento.dataHoraFinal = null;
                    $scope.inclusaoEquipamento.totalPreco = null;
                    return;
                }
                $scope.listaEquipamentosCombo.forEach(function (equipamento) {
                    if (equipamento.equipamentoId == $scope.inclusaoEquipamento.equipamentoId) {
                        $scope.inclusaoEquipamento.precoHora = equipamento.precoHora;
                    }
                })
            });

            $scope.$watchGroup(['inclusaoEquipamento.dataHoraInicio', 'inclusaoEquipamento.dataHoraFinal'], function (newValue) {
                if (!newValue[0] || !newValue[1]) {
                    $scope.inclusaoEquipamento.horasTrabalhadas = 0;
                    return;
                }

                var dataInicial = new Date($scope.inclusaoEquipamento.dataHoraInicio);
                var dataFinal = new Date($scope.inclusaoEquipamento.dataHoraFinal);

                var hours = Math.abs(dataFinal - dataInicial) / 36e5;

                $scope.inclusaoEquipamento.horasTrabalhadas = parseFloat(hours.toFixed(2));;
            });

            $scope.$watchGroup(['inclusaoEquipamento.horasTrabalhadas', 'inclusaoEquipamento.precoHora'], function (newValue, oldValue) {
                if (!newValue[0] || !newValue[1]) {
                    $scope.inclusaoEquipamento.totalPreco = 0;
                    return;
                }

                var totalHoras = $scope.inclusaoEquipamento.horasTrabalhadas;
                var precoHora = $scope.inclusaoEquipamento.precoHora;

                var totalPreco = (precoHora * totalHoras);

                $scope.inclusaoEquipamento.totalPreco = parseFloat(totalPreco.toFixed(2));;
            });


            // - Ng change para atualizar os dados dos modais ao ter informações atualizadas - 

            $scope.alteracaoEquipamentoSelecionado = function (equipamentoId) {
                if (!equipamentoId) {
                    $scope.edicaoEquipamento.precoHora = null;
                    $scope.edicaoEquipamento.dataHoraInicio = null;
                    $scope.edicaoEquipamento.dataHoraFinal = null;
                    $scope.edicaoEquipamento.totalPreco = null;
                    return;
                }

                $scope.listaEquipamentosCombo.forEach(function (equipamento) {
                    if (equipamento.equipamentoId == $scope.edicaoEquipamento.equipamentoId) {
                        $scope.edicaoEquipamento.precoHora = equipamento.precoHora;
                        $scope.calcularValorTotal($scope.edicaoEquipamento);
                    }
                })
            }

            $scope.calcularHoras = function (edicaoEquipamento) {
                if (!edicaoEquipamento.dataHoraInicio || !edicaoEquipamento.dataHoraFinal) {
                    $scope.edicaoEquipamento.horasTrabalhadas = 0;
                    return;
                }

                var dataInicial = new Date($scope.edicaoEquipamento.dataHoraInicio);
                var dataFinal = new Date($scope.edicaoEquipamento.dataHoraFinal);

                var hours = Math.abs(dataFinal - dataInicial) / 36e5;

                $scope.edicaoEquipamento.horasTrabalhadas = parseFloat(hours.toFixed(2));
                $scope.calcularValorTotal($scope.edicaoEquipamento);

            }

            $scope.calcularValorTotal = function (edicaoEquipamento) {
                if (!edicaoEquipamento.horasTrabalhadas || !edicaoEquipamento.precoHora) {
                    $scope.edicaoEquipamento.totalPreco = 0;
                    return;
                }
                var totalHoras = $scope.edicaoEquipamento.horasTrabalhadas;
                var precoHora = $scope.edicaoEquipamento.precoHora;

                var totalPreco = (precoHora * totalHoras);

                $scope.edicaoEquipamento.totalPreco = parseFloat(totalPreco.toFixed(2));;

            }

            //watcher para edicao de equipamento, para mudar o preço/hora do produto ao mudar no combo

            //$scope.$watch('edicaoEquipamento.equipamentoId', function (newValue) {
            //    if (!newValue) {
            //        $scope.edicaoEquipamento.precoHora = null;
            //        $scope.edicaoEquipamento.dataHoraInicio = null;
            //        $scope.edicaoEquipamento.dataHoraFinal = null;
            //        $scope.edicaoEquipamento.totalPreco = null;
            //        return;
            //    }
            //    $scope.listaEquipamentosCombo.forEach(function (equipamento) {
            //        if (equipamento.equipamentoId == $scope.edicaoEquipamento.equipamentoId) {
            //            $scope.edicaoEquipamento.precoHora = equipamento.precoHora;
            //        }
            //    })
            //});

            //$scope.$watchGroup(['edicaoEquipamento.dataHoraInicio', 'edicaoEquipamento.dataHoraFinal'], function (newValue, oldValue) {
            //    if (!newValue[0] || !newValue[1]) {
            //        $scope.edicaoEquipamento.horasTrabalhadas = 0;
            //        return;
            //    }

            //    var dataInicial = new Date($scope.edicaoEquipamento.dataHoraInicio);
            //    var dataFinal = new Date($scope.edicaoEquipamento.dataHoraFinal);

            //    var hours = Math.abs(dataFinal - dataInicial) / 36e5;

            //    $scope.edicaoEquipamento.horasTrabalhadas = parseFloat(hours.toFixed(2));
            //    $scope.calcularValorTotal($scope.edicaoEquipamento);
            //});

            //$scope.$watchGroup(['edicaoEquipamento.horasTrabalhadas', 'edicaoEquipamento.precoHora'], function (newValue, oldValue) {
            //    if (!newValue[0] || !newValue[1]) {
            //        return;
            //    }

            //    var totalHoras = $scope.edicaoEquipamento.horasTrabalhadas;
            //    var precoHora = $scope.edicaoEquipamento.precoHora;

            //    var totalPreco = (precoHora * totalHoras);

            //    $scope.edicaoEquipamento.totalPreco = parseFloat(totalPreco.toFixed(2));;
            //});
        });
});