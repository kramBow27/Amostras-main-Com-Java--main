define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('Telemetria', 'Ocorrencias');

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
                                                     TelemetriaService,
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

          TelemetriaService.obterCampos($scope.tipoRecursoId)
              .then(function (response) {
                  $scope.modelPassosCamposGeracao = response.data;
              })

          $scope.pesquisarOcorrencias = function () {
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

              TelemetriaService.postOcorrencias(model)
                .then(function (response) {
                    $scope.ocorrencias = response.data;
                    if ($scope.ocorrencias.length == 0) {
                        ngNotify.set('Nenhuma ocorrência encontrada!', 'error')
                    }
                })
          }
      });
});