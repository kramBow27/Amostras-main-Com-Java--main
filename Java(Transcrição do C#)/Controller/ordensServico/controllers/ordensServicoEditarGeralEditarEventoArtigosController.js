define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'EditarGeralEditarEventoArtigos');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $stateParams, ngNotify, EventosService) {

            // --- Declaração de variáveis básicas

            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            // Inicialização da variável de combo de artigos.
            $scope.listaArtigosCombo = [];

            // Inicialização da variável de inclusão de artigo.
            $scope.inclusaoArtigo = {};

            // Inicialização da variável de edicao de artigo
            $scope.edicaoArtigo = {};

            // Inicialização da variável de edicao de artigo
            $scope.exclusaoArtigo = {};

            var valorPadrao = 0;

            EventosService.obterListaArtigosCombo(valorPadrao)
            .then(function (response) {
                $scope.listaArtigosCombo = response.data;
            })

            var obterListaArtigos = function () {
                EventosService.getObterListaComplementarEvento($scope.eventoId, 5)
                .then(function (response) {
                    $scope.dadosAbasComplementaresEvento.artigos = response.data;
                })
            };

            //----funcoes de salvar e CRUD (exceto o R [Read]) para *ARTIGOS*----//
            //funcao para salvar artigo
            $scope.salvarArtigo = function () {
                $scope.inclusaoArtigo.eventoId = $stateParams.eventoId;
                $scope.inclusaoArtigo.cobrado = false;
                EventosService.postSalvarArtigo($scope.inclusaoArtigo)
                    .then(function (response) {
                        ngNotify.set(response.data.message, "success")
                        obterListaArtigos();
                    });
            }

            //funcao para editar artigo
            $scope.salvarEdicaoArtigo = function () {
                EventosService.putEditarArtigo($scope.edicaoArtigo)
                .then(function (response) {
                    ngNotify.set(response.data.message, "success")
                    obterListaArtigos();
                });
            }

            //funcao para excluir artigo
            $scope.excluirArtigo = function () {
                EventosService.deleteArtigo($scope.exclusaoArtigo.artigoEventoId)
                .then(function (response) {
                    ngNotify.set(response.data.message, "success")
                    obterListaArtigos();
                });
            }


            //modais de ARTIGO
            $scope.modalInclusaoArtigo = function () {
                $scope.inclusaoArtigo = {};

                EventosService.obterListaArtigosCombo(valorPadrao)
                    .then(function (response) {
                        $scope.listaArtigosCombo = response.data;
                    })

                $("#modalInclusaoArtigo").modal('show');
            }
            $scope.modalEdicaoArtigo = function (artigo) {
                $scope.edicaoArtigo = angular.copy(artigo);
                $scope.alterarArtigoSelecionado($scope.edicaoArtigo);

                $("#modalEdicaoArtigo").modal('show');

                EventosService.obterListaArtigosCombo($scope.edicaoArtigo.artigoId)
                    .then(function (response) {
                        $scope.listaArtigosCombo = response.data;
                    })

            }
            $scope.modalPerguntaArtigo = function (artigo) {
                $scope.exclusaoArtigo = artigo;
                $("#modalExcluir").modal('show');
            }

            //watchers ARTIGO
            $scope.$watch('inclusaoArtigo.artigoId', function (newValue) {
                if (!newValue) {
                    return;
                }
                $scope.listaArtigosCombo.forEach(function (artigo) {
                    if (artigo.artigoId == $scope.inclusaoArtigo.artigoId) {
                        $scope.inclusaoArtigo.descricao = artigo.descricao;
                        $scope.inclusaoArtigo.tipo = artigo.tipo;
                        $scope.inclusaoArtigo.permiteEscolherTipo = artigo.permiteEscolherTipo;
                    }
                })
            })

            //$scope.$watch('edicaoArtigo.artigoId', function (newValue) {
            //    if (!newValue) {
            //        return;
            //    }
            //    $scope.listaArtigosCombo.forEach(function (artigo) {
            //        if (artigo.artigoId == $scope.edicaoArtigo.artigoId) {
            //            $scope.edicaoArtigo.descricao = artigo.descricao;
            //        }
            //    })
            //})

            $scope.alterarArtigoSelecionado = function (artigoId) {
                if (!artigoId) {
                    $scope.edicaoArtigo.descricao = null;
                    return; 
                }
                $scope.listaArtigosCombo.forEach(function (artigo) {
                    if (artigo.artigoId == $scope.edicaoArtigo.artigoId) {
                        $scope.edicaoArtigo.descricao = artigo.descricao;
                        $scope.edicaoArtigo.permiteEscolherTipo = artigo.permiteEscolherTipo;
                    }
                })

            }
        });
});