define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('Telemetria', 'Detalhes');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $state, $stateParams, $injector, ngNotify, TelemetriaService) {
            var modelService = $injector.get(controller.serviceName);
            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");
            $scope.parametrosCliente = {};

            // Configura a tabela
            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            $scope.tipoOcorrenciaTelemetriaId = $stateParams.ocorrenciaTelemetriaId;

            TelemetriaService.obterOcorrencia($stateParams.ocorrenciaTelemetriaId)
                .then(function (response) {
                    $scope.item = response.data;
                },
                    function (error) {
                        ngNotify.set('Registro não encontrado', 'error');
                        $scope.remoteErrors = errorService.parseErrors(error);
                        $state.go(controller.moduleName + '.lista');
                    });

            TelemetriaService.getBairros($stateParams.ocorrenciaTelemetriaId)
                .then(function (response) {
                    $scope.bairros = response.data;
                });

            //obtem o enail pre cadastrro se existente
            $scope.modalEnvioEmail = function () {
                /*$scope.buscarEmailProtocolo();*/
                $('#modalEnviarLigacoesOcorrenciaEmail').modal('show');
            }

            // envio do protocolo
            $scope.enviarEmailLigacoesOcorrenciaTelemetria = function () {
          
                TelemetriaService.enviarEmailLigacoesOcorrenciaTelemetria($stateParams.ocorrenciaTelemetriaId)
                    .then(function (response) {
                        ngNotify.set(response.data.bairros, 'success');
                    }, function (error) {
                        if (error.status == '403') {
                            ngNotify.set("Você não possui acesso a esse recurso", "error")
                        } else {
                            ngNotify.set("Houve um erro no processo de envio de email. Por favor, contacte o administrador do sistema. Erro: " + error.status, "error")
                        }

                    })
                $('#modalEnviarLigacoesOcorrenciaEmail').modal('hide');
            }

            $scope.cancelar = function () {
                $state.go('telemetria.ocorrencias', { tipoRecursoId: 7 });
            }

            $scope.obterParametrosCliente = function () { 
                TelemetriaService.obterParametrosCliente()
                    .then(function (response) { 
                        $scope.parametrosCliente = response.data;
                        console.log("console.log do email do cliente para testes", $scope.parametrosCliente.email);
                    })
            }

            $scope.obterParametrosCliente();
        });
});
