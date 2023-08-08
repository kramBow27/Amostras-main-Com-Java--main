
define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'ManutencaoPreventiva');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope,
            $injector,
            $state,
            $stateParams,
            $anchorScroll,
            $location,
            $http,
            localStorageService,
            ngNotify,
            errorsValidationService,
            OrdensServicoService,
            fileDownloadService) {

            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withOption('order', [])
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

            $scope.item = {};
            $scope.tipoRecursoId = $stateParams.tipoRecursoId;
            $scope.passoAtivo = 1;
            $scope.dados = [];
            $scope.idsOrdensServicos = [];
            $scope.eventosEmExecucao = [];
            $scope.dtInstance = {};
            $scope.dtInstanceEmExecucao = {};
            $scope.dadosProgramacaoOs = {};
            $scope.dadosProgramacaoColetorOs = {};
            $scope.tipoIntegracaoSistema = 1;
            $scope.utilizaColetor = false;
            $scope.ordensServico = [];

            var ordensServicoId = [];
            var documentosSelecionados = [];

            var ordensServicoSelecionadas = [];

            OrdensServicoService.getDadosCamposGeracao($scope.tipoRecursoId)
                .then(function (response) {
                    $scope.modelPassosCamposGeracao = response.data;
                })

            // Gerencia a troca de abas ativas.
            $scope.ativarAba = function (passo) {
                $scope.passoAtivo = passo.passoId
            }

            $scope.pesquisarOrdemServico = function () {
                $scope.equipamentos = [];
                $scope.ordensServico = [];
                $scope.ordensServicoSelecionadas = [];

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

                OrdensServicoService.postPesquisaChamadoEquipamentos(model)
                    .then(function (response) {
                        $scope.equipamentos = response.data;

                        if (response.data.length == 0) {
                            ngNotify.set('Não há equipamentos para abertura de O.S. de Manutenção Preventiva!', 'warning');
                        }
                    })
            }

            $scope.ordensServicoSelecionadas = ordensServicoSelecionadas;

            $scope.verificarOrdemServicoSelecionada = function (ordemServico) {
                for (var n = 0; n < $scope.ordensServicoSelecionadas.length; n++) {
                    if ($scope.ordensServicoSelecionadas[n] == ordemServico) {
                        return true;
                    }
                }
            }

            $scope.selecionarOrdemServico = function (ordemServico) {
                if ($scope.verificarOrdemServicoSelecionada(ordemServico)) {
                    $scope.ordensServicoSelecionadas.splice($scope.ordensServicoSelecionadas.indexOf(ordemServico), 1);
                }
                else {
                    $scope.ordensServicoSelecionadas.push(ordemServico);
                }
            }

            $scope.selecionarTodasOrdensServico = function (ordensServico) {

                ordensServico.forEach(function (ordemServico) {
                    if (!$scope.verificarOrdemServicoSelecionada(ordemServico)) {
                        $scope.ordensServicoSelecionadas.push(ordemServico);
                    }
                })
            }

            $scope.limparTodasOrdensServico = function (ordensServico) {
                ordensServico.forEach(function (ordemServico) {
                    if ($scope.verificarOrdemServicoSelecionada(ordemServico)) {
                        $scope.ordensServicoSelecionadas.splice($scope.ordensServicoSelecionadas.indexOf(ordemServico), 1)
                    }
                })
            }

            $scope.gerarOSs = function (equipamentos) {
                $scope.equipamentos = [];

                var model = {
                    atendimentoId: equipamentos[0].atendimentoId,
                    tipoChamadoId: equipamentos[0].tipoChamadoId,
                    funcionarioSolicitanteId: equipamentos[0].funcionarioSolicitanteId,
                    equipamentos: [],
                    ligacoes: []
                }

                equipamentos.forEach(function (equipamento) {
                    model.equipamentos.push(equipamento.equipamentoId);
                })

                OrdensServicoService.postGerarOSs(model)
                    .then(function (response) {
                        $scope.ordensServico = response.data;
                    })
            }
        });
});