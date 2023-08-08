define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'EditarGeralEditarEventoMateriais');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $stateParams, ngNotify, EventosService) {

            // --- Declaração de variáveis básicas

            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            // Inicialização da variável de combo de materiais.
            $scope.listaMateriaisCombo = [];

            // Inicialização da variável de inclusão de material
            $scope.inclusaoMaterial = {};

            // Inicialização da variável de edicao de material
            $scope.edicaoMaterial = {};

            $scope.material = {};

            // Inicialização da variável de edicao de material
            $scope.exclusaoMaterial = {};

            // --- Obtenção de dados.

            // Obter lista de materias do evento.
            var obterListaMateriais = function () {
                EventosService.getObterListaComplementarEvento($scope.eventoId, 1)
                .then(function (response) {
                    $scope.$parent.listaMateriaisEvento = response.data;
                })
            }
            obterListaMateriais();

            EventosService.getListaMateriaisCombo()
                .then(function (response) {
                    $scope.listaMateriaisCombo = response.data;
                })

            // --- Funções e operações pós obtenção de dados.
            //modais de MATERIAL
            $scope.modalInclusaoMaterial = function () {
                $scope.inclusaoMaterial = {};
                $("#modalInclusaoMaterial").modal('show');
            }
            $scope.modalEdicaoMaterial = function (material) {
                $scope.edicaoMaterial = {};
                $scope.material = {};

                $scope.edicaoMaterial = angular.copy(material);

                $scope.material = {
                    materialId: material.materialId,
                    descricao: material.descricaoMaterial
                };

                $scope.alteracaoMaterialSelecionado($scope.material.materialId);
                $scope.calcularValorTotal($scope.edicaoMaterial);

                $("#modalEdicaoMaterial").modal('show');
            }
            $scope.modalPerguntaMaterial = function (material) {
                $scope.exclusaoMaterial = material;
                $("#modalExcluir").modal('show');
            }

            //funcao para salvar material
            $scope.salvarMaterial = function () {
                $scope.inclusaoMaterial.eventoId = $stateParams.eventoId;
                $scope.inclusaoMaterial.cobrado = false;
                $scope.inclusaoMaterial.baixado = false;
                $scope.inclusaoMaterial.quantidade = $scope.inclusaoMaterial.quantidade.toString().replace(",", ".");
                EventosService.postSalvarMaterial($scope.inclusaoMaterial)
                    .then(function (response) {
                        $("#modalInclusaoMaterial").modal('hide');
                        ngNotify.set(response.data.message, "success")
                        obterListaMateriais();
                    })
            }

            //funcao para salvar material
            $scope.salvarEdicaoMaterial = function () {
                $scope.edicaoMaterial.quantidade = $scope.edicaoMaterial.quantidade.toString().replace(",", ".");
                EventosService.putEditarMaterial($scope.edicaoMaterial)
                .then(function (response) {
                    ngNotify.set(response.data.message, "success")
                    obterListaMateriais();
                });
            }

            //funcao para excluir material
            $scope.excluirMaterial = function () {
                EventosService.deleteMaterial($scope.exclusaoMaterial.materialEventoId)
                .then(function (response) {
                    ngNotify.set(response.data.message, "success")
                    obterListaMateriais();
                });
            }

            $scope.calcularValorTotalMaterial = function (quantidade, precoUnitario) {
                return quantidade * precoUnitario;
            }


            // --- ng-change MATE-RIAL
            $scope.inclusaoMaterialSelecionado = function (materialId) {
                if (!materialId) {
                    $scope.inclusaoMaterial.precoUnitario = 0;
                    $scope.inclusaoMaterial.unidade = null;
                    $scope.inclusaoMaterial.quantidade = null;
                    $scope.inclusaoMaterial.totalPreco = 0;
                    return;
                }
                $scope.listaMateriaisCombo.forEach(function (material) {
                    if (material.materialId == materialId) {
                        $scope.inclusaoMaterial.precoUnitario = material.precoMercado;
                        $scope.inclusaoMaterial.unidade = material.unidade;
                        $scope.calcularValorTotal($scope.inclusaoMaterial);

                    }
                })
            }


            $scope.calcularValorTotalInclusao = function (inclusaoMaterial) {
                if (!inclusaoMaterial.quantidade || !inclusaoMaterial.precoUnitario) {
                    $scope.inclusaoMaterial.totalPreco = 0;
                    return;
                }

                var quantidade = $scope.inclusaoMaterial.quantidade.toString().replace(",", ".");
                var precoUnitario = $scope.inclusaoMaterial.precoUnitario;

                var totalPreco = (quantidade * precoUnitario);

                $scope.inclusaoMaterial.totalPreco = parseFloat(totalPreco.toFixed(2));
            }

            //ng-change para edicao de material, para mudar o preço unitario e a unidade do produto ao mudar no combo

            $scope.alteracaoMaterialSelecionado = function (materialId) {
                if (!materialId) {
                    $scope.edicaoMaterial.quantidade = null;
                    $scope.edicaoMaterial.precoUnitario = 0;
                    $scope.edicaoMaterial.totalPreco = 0;
                    $scope.edicaoMaterial.unidade = null;
                    return;
                } 

                $scope.listaMateriaisCombo.forEach(function (material) {
                    if (material.materialId == materialId) {
                        $scope.edicaoMaterial.precoUnitario = material.precoMercado;
                        $scope.edicaoMaterial.unidade = material.unidade;
                        $scope.calcularValorTotal($scope.edicaoMaterial);

                    }  
                })
            }

            $scope.calcularValorTotal = function (edicaoMaterial) {
                if (!edicaoMaterial.quantidade || !edicaoMaterial.precoUnitario) {
                    $scope.edicaoMaterial.totalPreco = 0;
                    return;
                }

                var quantidade = $scope.edicaoMaterial.quantidade.toString().replace(",", ".");
                var precoUnitario = $scope.edicaoMaterial.precoUnitario;

                var totalPreco = (quantidade * precoUnitario);

                $scope.edicaoMaterial.totalPreco = parseFloat(totalPreco.toFixed(2));
            }
        });
});
