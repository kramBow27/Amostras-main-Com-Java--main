define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('Baixas', 'Consultar');


    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $timeout, ngNotify,
            $injector,
            $stateParams, OrdensServicoService) {

            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withOption('order', [])
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            $scope.tipoRecursoId = $stateParams.tipoRecursoId;
            $scope.passoAtivo = 1;
            var baixasSelecionadas = [];
            $scope.baixasSelecionadas = baixasSelecionadas;
          
            console.log("params", $stateParams);


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

            $scope.modalEditar = function (id) {
                OrdensServicoService.obterBaixa(id)
                    .then(function (response) { 
                        $scope.baixa = response.data;
                        console.log(response.data)
                        
                        console.log($scope.conteudoXml);
                    })


                $("#modalEditarConteudoXml").modal();
            };


            $scope.atualizarBaixa = function (id) { 
               
                        var model = {
                            eventoBaixaColetorId: id,
                            dataRegistro: $scope.baixa.dataRegistro,
                            eventoId: $scope.baixa.eventoId,
                            ordemServicoId: $scope.baixa.ordemServicoId,
                            equipeId: $scope.baixa.equipeId,
                            equipamentoId: $scope.baixa.equipamentoId,
                            conteudoBaixa: $scope.baixa.conteudoBaixa
                        }
                        OrdensServicoService.atualizarBaixa(model)
                            .then(function (response) {
                                console.log("model", model);
                                console.log("response", response.data)
                            })
                $scope.obterBaixas();
                $("#modalEditarConteudoXml").modal("hide");
              
                
            }

            $scope.executarProcedure = function (id) { 
                OrdensServicoService.obterBaixa(id)
                    .then(function (response)
                    {
                        $scope.baixa = response.data;
                        var model = {
                            eventoBaixaColetorId: id,
                            dataRegistro: $scope.baixa.dataRegistro,
                            eventoId: $scope.baixa.eventoId,
                            ordemServicoId: $scope.baixa.ordemServicoId,
                            equipeId: $scope.baixa.equipeId,
                            equipamentoId: $scope.baixa.equipamentoId,
                            conteudoBaixa:$scope.baixa.conteudoBaixa
                        }
                        OrdensServicoService.executarProcedureBaixa(model)
                            .then(function (response) { 
                                console.log(response.data);
                            })
                    })
                $scope.obterBaixas();
            }

            $scope.executarTodasBaixas = function (baixas) {
                var baixasComErro = baixas.filter(function (baixa) {
                    return baixa.mensagemErro;
                });

                if (baixasComErro.length === 0) {
                    return;
                }

                // Decodifica o conteúdo de cada baixa
                baixasComErro.forEach(function (baixa) {
                    var decodedContent = atob(baixa.conteudoBaixa);
                    baixa.conteudoBaixa = decodedContent;
                });

                var model = baixasComErro;
                console.log('model', model);

                OrdensServicoService.executarProcedureBaixasSelecionadas(model)
                    .then(function (response) {
                        console.log(response.data);
                    })
                    .catch(function (error) {
                        console.error(error);
                    });

                $scope.obterBaixas();
            };

            

            $scope.limparTodasBaixas = function (baixas) {
                baixas.forEach(function (baixa) {
                    if ($scope.verificarBaixaSelecionada(baixa)) {
                        $scope.baixasSelecionadas.splice($scope.baixasSelecionadas.indexOf(baixa), 1)
                    }
                });
                $scope.baixasSelecionadas = [];
           

            }
            $scope.selecionarTodasBaixas = function (baixas) {
                baixas.forEach(function (baixa) {
                    if (!$scope.verificarBaixaSelecionada(baixa) && baixa.mensagemErro) {
                        $scope.baixasSelecionadas.push(baixa);
                    }
                });

            }


            $scope.obterBaixas = function () {
                $scope.baixas = [];

                var model = {
                    tipoRecursoId: $scope.tipoRecursoId,
                    dadosCampos: []
                }


                for (var i = 0; i < $scope.modelPassosCamposGeracao.length; i++) {
                    for (var j = 0; j < $scope.modelPassosCamposGeracao[i].campos.length; j++) {
                        var id = $scope.modelPassosCamposGeracao[i].campos[j].campoId;
                        var dados = $scope.modelPassosCamposGeracao[i].campos[j].valor;

                        model.dadosCampos.push({
                            id: id,
                            dados: dados
                        })
                    }
                }

                OrdensServicoService.obterBaixas(model)
                    .then(function (response) {
                        $scope.baixas = [];
                        $scope.baixas = response.data;

                        console.log($scope.baixas);

                        


                        if ($scope.baixas.length == '0') {
                            ngNotify.set('Registro não localizado!', 'error');
                        }
                      
                    })
            }

            $scope.verificarBaixaSelecionada = function (baixa) {
                return $scope.baixasSelecionadas.includes(baixa);
            }

            $scope.selecionarBaixa = function (baixa) {
                if (baixa.mensagemErro != null) { // apenas baixas com mensagem de erro podem ser selecionadas
                    if ($scope.verificarBaixaSelecionada(baixa)) {
                        $scope.baixasSelecionadas.splice($scope.baixasSelecionadas.indexOf(baixa), 1);
                    }
                    else {
                        $scope.baixasSelecionadas.push(baixa);
                    }
                }
            }

            $scope.clickBaixa = function (baixa) {
                if (baixa.mensagemErro != null) { // apenas baixas com mensagem de erro podem ser selecionadas
                    $timeout(function () {
                        $scope.selecionarBaixa(baixa);
                    }, 10);
                }
            };

        })
})
