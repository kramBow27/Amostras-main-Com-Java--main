define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'EditarGeralHistorico', 'ordemServicoId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $injector, $http, ChamadosService, OrdensServicoService, EventosService, ngNotify, fileDownloadService) {

            // --- Declaração de variáveis básicas


            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");
            var dTColumnDefBuilder = $injector.get("DTColumnDefBuilder");

            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json')
                .withOption('order', []);

            $scope.dtColumnDefs = [
                 dTColumnDefBuilder.newColumnDef(0).notSortable(),
                 dTColumnDefBuilder.newColumnDef(1).notSortable(),
                 dTColumnDefBuilder.newColumnDef(2).notSortable(),
                 dTColumnDefBuilder.newColumnDef(3).notSortable(),
                 dTColumnDefBuilder.newColumnDef(4).notSortable()
            ];

            $scope.ordemServicoDetalhes = {};

            $scope.$parent.tabActive = 3;

            $scope.novoHistorico = {};

            // --- Obtenção de dados

            $scope.dadosOs = OrdensServicoService.getDados();

            var consultarHistoricos = function () {
                ChamadosService.consultarHistoricoOrdemServico($scope.dadosOs.ordemServicoId)
                    .then(function (response) {
                        $scope.ordemServicoDetalhes.historico = response.data;
                    })
            }

            consultarHistoricos();

            // --- Funções e operações pós obtenção de dados.

            $scope.abrirModalNovoHistorico = function () {
                // Apaga os dados antigos ao abrir o modal.
                $scope.novoHistorico = { ordemServicoId: $scope.dadosOs.ordemServicoId };
                $scope.novoHistoricoForm.$setPristine();

                $("#modalNovoHistorico").modal("show");
            }

            $scope.abrirModalExclusaoHistorico = function (historico) {
                $scope.historicoExcluir = historico;

                $("#modalExclusaoHistorico").modal("show");
            }

            $scope.abrirModalEditarHistorico = function (historico) {
                // Seta os novos dados ao abrir o modal.
                $scope.historicoEditado = {
                    historicoOsId: historico.historicoOsId,
                    descricao: historico.descricao,
                    data: historico.data,
                    nomeFuncionario: historico.nomeFuncionario,
                    automatico: historico.automatico
                };
                $scope.editarHistoricoForm.$setPristine();

                $("#modalEditarHistorico").modal("show");
            }

            $scope.cadastrarNovoHistorico = function () {
                OrdensServicoService.postNovoHistorico($scope.novoHistorico)
                .then(function (response) {
                    consultarHistoricos();
                    $("#modalNovoHistorico").modal("hide");
                    ngNotify.set(response.data, "success");
                })
            }

            $scope.alterarHistorico = function (historico) {
                EventosService.putAtualizarHistoricoOS(historico)
                .then(function (response) {
                    consultarHistoricos();
                    $("#modalEditarHistorico").modal("hide");
                    ngNotify.set(response.data, "success");
                })
            }

            $scope.excluirHistorico = function (historicoId) {
                EventosService.deleteHistoricoOS(historicoId)
                .then(function (response) {
                    consultarHistoricos();
                    ngNotify.set(response.data, "success");
                })
            }

            $scope.imprimirHistoricos = function () {
                fileDownloadService.get('Api/OrdensServico/' + $scope.dadosOs.ordemServicoId + '/ImprimirHistoricos', "ImprimirHistorico", "pdf")
            }

        });
});
