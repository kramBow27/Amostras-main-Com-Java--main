define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'EditarGeralNovoEvento', 'ordemServicoId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $state, $location, $anchorScroll, ngNotify, OrdensServicoService, RegistroEventoService, errorsValidationService) {

            // --- Declaração de variáveis básicas

            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            // Variável que conterá os campos da geração de campos. Precisa ser inicializada para o bom funcionamento da diretiva.
            $scope.ordemServicoDetalhes = {};

            // Variável que indica a aba ativa da página.
            $scope.passoAtivo;
                                    
            // Indica qual aba da rota pai está ativa.
            $scope.$parent.tabActive = 2;


            // --- Obtenção de dados

            // Obtém os dados da Ordem de Serviço, gravados no serviço.
            $scope.dadosOs = OrdensServicoService.getDados();

            $scope.tipoEventoClasse = function (status) {
                if (status == "Cancelado") {
                    return "danger";
                }
                else if (status == "Aberto") {
                    return "warning"
                }
                else if (status == "Em Execução") {
                    return "success"
                };
            };

            // --- Funções e operações pós obtenção de dados.

            // Gerencia a troca de abas ativas.
            $scope.ativarAba = function (passo) {
                $scope.passoAtivo = passo.passoId
            }

            // --- Watchers

            $scope.$watch('tipoServicoId', function (newValue, oldValue) {
                if (newValue == null || newValue == oldValue) {
                    return;
                }

                // Variável que será usada para obter os campos a serem gerados. O model da chamada é esse objeto.
                var modelDadosCamposGeracao = {
                    tipoServicoId: newValue,
                    ordemServicoId: $scope.dadosOs.ordemServicoId,
                    eventoId: null
                }

                // Obtém os dados dos campos e abas a serem gerados.
                RegistroEventoService.getDadosCamposGeracao(modelDadosCamposGeracao)
                    .then(function (response) {
                        $scope.modelPassosCamposGeracao = response.data;
                    })
            })

            $scope.executarCriacaoEvento = function () {
                $scope.errosFormularioNovoEvento = null;

                var model = {
                    ordemServicoId: $scope.dadosOs.ordemServicoId,
                    eventoId: null,
                    dadosEvento: []
                }

                $scope.modelPassosCamposGeracao.forEach(function (passoCampos) {
                    passoCampos.campos.forEach(function (campo) {
                        model.dadosEvento.push({
                            id: campo.campoId,
                            dados: campo.valor,
                            tipoServicoId: $scope.tipoServicoId
                        })
                    })
                })

                RegistroEventoService.postDadosCamposGeracao(model)
                .then(function (response) {
                    $scope.$emit('AtualizacaoEventosOS');
                    $state.go("ordensServico.editar.geral.editarEvento", { ordemServicoId: $scope.dadosOs.ordemServicoId, eventoId: response.data})
                    ngNotify.set("Evento registrado.", "success");

                }, function (error) {
                    $scope.errosFormularioNovoEvento = errorsValidationService.parseErrors(error.data);
                    $location.hash('novoEventoForm');
                    $anchorScroll();
                })
            }

            $scope.verificarFormularioInvalido = function (form) {
                if (form.$invalid || !$scope.modelPassosCamposGeracao) {
                    return true;
                }

                return false;
            }

        });
});
