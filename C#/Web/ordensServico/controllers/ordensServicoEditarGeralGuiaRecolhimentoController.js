define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'EditarGeralGuiaRecolhimento', 'ordemServicoId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $state, OrdensServicoService, $stateParams, $http, fileDownloadService, ngNotify ) {

            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");
            var dTColumnDefBuilder = $injector.get("DTColumnDefBuilder");

            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json')
                .withOption('order', [0, 'desc']);

            $scope.dtColumnDefs = [
                dTColumnDefBuilder.newColumnDef(6).notSortable()
            ];

            $scope.dadosOs = OrdensServicoService.getDados();
            $scope.guiasRecolhimento = [];
            $scope.guiaSelecionada = 0;
            $scope.ligacaoId = $stateParams.ligacaoId;

            $scope.$parent.breadcumb = [
                { link: '#/ligacao/' + $scope.ligacaoId + '/detalhes/geral/resumo', descricao: 'Ligação ' + $scope.ligacaoId },
                { descricao: 'Guias de Recolhimento' }
            ]
            $scope.abrirDetalhes = function (id) {
                $scope.guiaSelecionada = id;
                $state.go("ordensServico.editar.geral.guiaRecolhimento.detalhes");
            }
            /*Buscar Dados*/
            var buscarGuiasRecolhimento = function () {
                $http.get('Api/GuiaRecolhimento/' + $scope.dadosOs.ordemServicoId + '/ObterGuiasRecolhimentoOS')
                    .success(function (response) {
                        $scope.guiasRecolhimento = response;
                    });
            }
            buscarGuiasRecolhimento();



            /*Imprimir Guia*/
            $scope.gerarGuiaRecolhimento = function () {
                fileDownloadService.get("Api/OrdensServico/" + $scope.dadosOs.ordemServicoId + "/ImpressaoGuiaPorOS", "GuiaRecolhimento", "pdf");
            }

            /*Enviar Guia por Email*/
            $scope.abrirModalEmail = function (id) {
                $scope.guiaSelecionada = id;
                $("#modalEnviaGuiaRecolhimento").modal('show');
            }

            $scope.enviarEmail = function () {
                var model = {
                    emailTo: $scope.email,
                    ordemServicoId: $scope.dadosOs.ordemServicoId,
                    guiaRecolhimentoId: $scope.guiaSelecionada
                };

                $http.post("Api/GuiaRecolhimento/Email", model)
                    .then(function (response) {
                        ngNotify.set(response.data, 'success');
                    }, function (error) {
                        if (error.status == '403') {
                            ngNotify.set("Você não possui acesso a esse recurso", "error")
                        } else {
                            ngNotify.set("Houve um erro no processo de envio de email. Por favor, contacte o administrador do sistema. Erro: " + error.status, "error")
                        }
                    })
                $('#modalEnviaGuiaRecolhimento').modal('hide');
            }

            /*Abrir Modal Cancelamento*/
            $scope.abrirModalCancelamento = function (id) {
                $scope.guiaSelecionada = id;
                $("#modalCancelar").modal('show');
            }

            //Cancelar Guia Recolhimento
            $scope.cancelarGuiaRecolhimento = function (observacao) {
                $scope.observacao = observacao;
                $http.post("Api/GuiaRecolhimento/CancelarGuia/" + $scope.guiaSelecionada + "/" + $scope.observacao)
                    .then(function (response) {
                        ngNotify.set(response.data, 'success');

                        buscarGuiasRecolhimento();
                    })
                $('#modalCancelar').modal('hide');
            }

            $scope.$parent.tabActive = 6;
        })

});