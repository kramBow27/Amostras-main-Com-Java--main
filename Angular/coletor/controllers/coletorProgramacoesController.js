define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('Coletor', 'Programacoes');

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
                                                     ColetorService,
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
          $scope.dtInstance = {};

          var programacaoSelecionada = {};

          ColetorService.obterCampos($scope.tipoRecursoId)
              .then(function (response) {
                  $scope.modelPassosCamposGeracao = response.data;
              })

          $scope.pesquisarProgramacoes = function () {
              $scope.programacaoSelecionada = [];
              $scope.ordensServico = [];

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

              ColetorService.postProgramacoes(model)
                .then(function (response) {
                    $scope.programacoes = response.data;
                    if ($scope.programacoes.length == 0) {
                        ngNotify.set('Nenhuma programação encontrada!', 'error')
                    }
                })

              ColetorService.postOrdensServicoRejeitadas(model)
                  .then(function (response) {
                      $scope.ordensServicoRejeitadas = response.data;
                  })

          }

          $scope.reenviarOrdensServico = function (ordensServicoRejeitadas) {
              var eventosId = [];

              ordensServicoRejeitadas.forEach(function (ordemServico) {
                  eventosId.push(ordemServico.eventoId);
              })

              ColetorService.postReenviarOrdensServico(eventosId)
                .then(function (response) {
                    ngNotify.set(response.data, "success");
                    $scope.pesquisarProgramacoes();
                    $scope.ordensServico = [];
                })
          }

          $scope.programacaoSelecionada = programacaoSelecionada;

          $scope.verificarProgramacaoSelecionada = function (programacao) {
              if ($scope.programacaoSelecionada == programacao) {
                  return true;
              }
          }

          $scope.selecionarProgramacao = function (programacao) {
              if ($scope.verificarProgramacaoSelecionada(programacao)) {
                  $scope.programacaoSelecionada = {};
              }
              else {
                  $scope.programacaoSelecionada = programacao;
              }

              ColetorService.obterOrdensServicoProgramacaoColetor(programacao.arquivoColetorId)
                .then(function (response) {
                    $scope.ordensServico = response.data;
                })
          }

          $scope.limparProgramacao = function () {
              $scope.programacaoSelecionada = {};
          }
      });
});