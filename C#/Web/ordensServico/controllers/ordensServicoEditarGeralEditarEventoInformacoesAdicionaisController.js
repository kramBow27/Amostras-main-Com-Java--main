define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'EditarGeralEditarEventoInformacoesAdicionais');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $stateParams, ngNotify, EventosService) {

            // --- Declaração de variáveis básicas

            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withOption('order', [])
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            $scope.eventoId = $stateParams.eventoId;
            EventosService.getTipoServicoIdEvento($scope.eventoId)
                .then(function (response) {
                    $scope.tipoServicoId = response.data;
                   
                    EventosService.obterCamposTipoServico($scope.tipoServicoId)
                        .then(function (response) {
                            $scope.tipoServicoCamposColetor = response.data;
                            console.log($scope.tipoServicoCamposColetor)
                        })
                })

            var ObterListaComplementarEvento = function () {
                
                        EventosService.obterCamposInformacaoAdicional($scope.eventoId)
                            .then(function (response) {
                                console.log('camposInformacaoAdicional', response.data)
                                $scope.dadosAbasComplementaresEvento.informacoesAdicionais = response.data;
                                console.log("dadosAbas", $scope.dadosAbasComplementaresEvento.informacoesAdicionais);
                            });
                       
                    
            }
            $scope.modalEditar = function () {
                $scope.dadosInformacoesAdicionaisEvento = {};
                EventosService.obterCamposInformacaoAdicional($scope.eventoId)
                    .then(function (response) {
                        
                        $scope.informacoesAdicionais = response.data;
                    
                            
                        
                        console.log("informacoes adicionais", $scope.informacoesAdicionais)

                    });
              

                $("#modalEditarInformacoesAdicionais").modal();
            };

          
            $scope.filterInput = function (informacao) {
                informacao.valor = informacao.valor.replace(/[^0-9.,]/g, '');
                var parts = informacao.valor.split('.');
                if (parts.length > 1) {
                    parts[1] = parts[1].slice(0, 2);
                    informacao.valor = parts.join('.');
                }
                parts = informacao.valor.split(',');
                if (parts.length > 1) {
                    parts[1] = parts[1].slice(0, 2);
                    informacao.valor = parts.join(',');
                }
            };

          
            $scope.alterarInformacoesAdicionaisEvento = function (informacoesAdicionais) {
                console.log("info adicionais", informacoesAdicionais)

                var model = informacoesAdicionais.map(informacaoAdicional => ({
                    nomeCampo: informacaoAdicional?.nomeCampo,
                    evento: informacaoAdicional?.evento,
                    eventoId: informacaoAdicional?.eventoId,
                    campoColetorId: informacaoAdicional?.campoColetorId,
                    informacaoAdicionalColetorId: informacaoAdicional?.informacaoAdicionalColetorId,
                    campo: informacaoAdicional?.campo,
                    ordem: informacaoAdicional?.ordem,
                    valor: informacaoAdicional.valor,
                    valorCheckbox: informacaoAdicional.valorCheckbox,
                    tipo: informacaoAdicional?.tipo,
                    descricaoTipo: informacaoAdicional?.campo?.descricaoTipo,
                    listaOpcaoId: informacaoAdicional?.listaOpcaoId,
                    listaOpcoes: informacaoAdicional?.listaOpcoes,
                    opcaoLista: informacaoAdicional?.opcaoLista
                }))

                EventosService.atualizarInformacoesAdicionais(model, $scope.eventoId)
                    .then(function (response) {
                        console.log('atualizarInformacoesAdicionais', response.data)
                        console.log("model", model);
                        console.log("response", response.data)

                        ObterListaComplementarEvento();

                        $("#modalEditarInformacoesAdicionais").modal("hide");
                    })
            }



            

            //$scope.modalEditar = function () {

            //    EventosService.getTipoServicoIdEvento($scope.eventoId)
            //        .then(function (response) {
            //            $scope.tipoServicoId = response.data; // pega tipo de serviço do evento

            //            EventosService.obterCamposTipoServico($scope.tipoServicoId) // obtem campos do tipo de serviço
            //                .then(function (response) {
            //                    $scope.tipoServicoCamposColetor = response.data; // atribui campos do tipo de serviço 



            //                    EventosService.getObterListaComplementarEvento($scope.eventoId, 7) //obtem lista de informacoes adicionais(que é o 7) 
            //                        .then(function (response) {
            //                            $scope.informacoesAdicionais = response.data; //obtem informacoes adicionais, campos e valores


            //                            var promises = $scope.informacoesAdicionais.map(function (informacaoAdicional) {
            //                                return EventosService.obterCamposColetor(informacaoAdicional.campoColetorId); //obtem campo de cada item 
            //                            });


            //                            Promise.all(promises).then(function (results) {
            //                                $scope.campoInformacoes = [...new Set([...$scope.tipoServicoCamposColetor, ...results.map(function (response) {
            //                                    return response.data;
            //                                })])];


            //                                var opcoesPromises = $scope.campoInformacoes.map(function (campo) {

            //                                    if (campo.listaOpcaoId) {

            //                                        return EventosService.obterOpcoesListaColetor(campo.listaOpcaoId);
            //                                    } else {
            //                                        return Promise.resolve(null);
            //                                    }
            //                                });


            //                                Promise.all(opcoesPromises).then(function (opcoesResults) {
            //                                    $scope.opcoesCampoInformacoes = opcoesResults.map(function (response) {
            //                                        return response ? response.data : null;
            //                                    });


            //                                    let tempResult = new Map();

            //                                    $scope.informacoesAdicionais.forEach(function (info) {
            //                                        let campo = $scope.campoInformacoes.find(c => c.campoColetorId === info.campoColetorId);
            //                                        let listaOpcoes = null;
            //                                        if (campo && campo.listaOpcaoId) {
            //                                            let opcoes = $scope.opcoesCampoInformacoes.find(op => op && Array.isArray(op) && op.some(item => item.listaOpcaoColetorId === campo.listaOpcaoId));
            //                                            if (opcoes) {
            //                                                listaOpcoes = opcoes;
            //                                            }
            //                                        }

            //                                        tempResult.set(info.campoColetorId, {
            //                                            ...info,
            //                                            nomeCampo: campo?.descricao,
            //                                            listaOpcaoId: campo?.listaOpcaoId,
            //                                            valor: info.valor,
            //                                            tipo: campo?.tipo,
            //                                            descricaoTipo: campo?.descricaoTipo,
            //                                            opcaoListaColetorId: campo?.opcaoListaColetorId,
            //                                            listaOpcoes: listaOpcoes
            //                                        });
            //                                    });

            //                                    $scope.tipoServicoCamposColetor.forEach(function (tipoServicoCampoColetor) {
            //                                        let campo = tipoServicoCampoColetor.campoColetor;


            //                                        let listaOpcoes = null;
            //                                        if (campo && campo.listaOpcaoColetor && campo.listaOpcaoColetor.listaOpcaoColetorId) {
            //                                            let opcoes = $scope.opcoesCampoInformacoes.find(op => op && Array.isArray(op) && op.some(item => item.listaOpcaoColetorId === campo.listaOpcaoColetor.listaOpcaoColetorId));


            //                                            if (opcoes) {
            //                                                listaOpcoes = opcoes;
            //                                            }
            //                                        }

            //                                        if (!tempResult.has(campo.campoColetorId)) {
            //                                            tempResult.set(campo.campoColetorId, {
            //                                                ...tipoServicoCampoColetor,
            //                                                nomeCampo: campo?.descricao,
            //                                                listaOpcaoId: campo?.listaOpcaoColetor?.listaOpcaoColetorId,
            //                                                tipo: campo?.tipo,
            //                                                opcaoListaColetorId: campo?.listaOpcaoColetor?.opcaoListaColetorId,
            //                                                listaOpcoes: listaOpcoes
            //                                            });
            //                                        }
            //                                    });


            //                                    $scope.finalCampoInformacoes = Array.from(tempResult.values());

            //                                    console.log('Final:', $scope.finalCampoInformacoes);




            //                                });
            //                            });
            //                        });
            //                });
            //        });

            //    $("#modalEditarInformacoesAdicionais").modal();
            //};

         
            $scope.log = function (variable) {
                console.log(variable);
            };

            

            $scope.cancelar = function () { 
                $("#modalEditarInformacoesAdicionais").modal("hide");
            }
        });
});