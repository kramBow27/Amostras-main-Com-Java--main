define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'DetalhesEvento', 'eventoId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $stateParams, $http, ChamadosService, OrdensServicoService, fileDownloadService) {

            $scope.situacaoChamado = OrdensServicoService.getDados();

            // Obtém a lista de eventos e exibe no HTML
            OrdensServicoService.consultaDetalhesEvento($stateParams.eventoId)
                .then(function (response) {
                        $scope.dados = response.data;
                    },
                    function (error) {
                        //failure call back
                    }
                );

            $scope.fotos = [];

            var prepararArrayFotos = function (imagem, imagemId) {
                var model = { imagem: imagem, imagemId: imagemId };

                if ($scope.fotos.length == 0) {
                    $scope.fotos.push([model]);
                    return;
                }

                if ($scope.fotos[$scope.fotos.length - 1].length < 2) {
                    $scope.fotos[$scope.fotos.length - 1].push(model)
                }
                else {
                    $scope.fotos.push([model]);
                }
            }

            OrdensServicoService.obterImagensEvento($stateParams.eventoId)
                .then(function (response) {
                        response.data.forEach(function (imagemId) {
                            $http.get('Api/Eventos/' + imagemId + '/fotoPreview')
                                .then(function (response) {
                                    prepararArrayFotos(response.data, imagemId);
                            })
                        })
                        
                    },
                    function (error) {
                        //failure call back
                    }
                );
            
            $scope.tabActive = 1;


            //Função para mudar a cor da do título do Painel:
            $scope.tipoChamadoClasse = function (status) {
                if (status == "Cancelado") {
                    return "panel-danger";
                }
                else if (status == "Aberto") {
                    return "panel-warning"
                }
                else if (status == "Em Execução") {
                    return "panel-success"
                }
                else {
                    return "panel-default"
                };
            };


            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            $scope.dadosOs = OrdensServicoService.getDados();

            ChamadosService.consultarEventosOrdemServico($scope.dadosOs.ordemServicoId)
                .then(function (response) {
                    $scope.eventos = response.data;
                })

            $scope.imgMaisDetalhes = function (imagemId) {
                fileDownloadService.get('Api/Eventos/' + imagemId + '/foto', "Evento", "JPEG")
            }

        });
});
