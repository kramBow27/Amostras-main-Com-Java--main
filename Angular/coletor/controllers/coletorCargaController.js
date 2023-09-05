define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('Coletor', 'Carga');

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
          $scope.equipes = [];

          var equipesSelecionadas = [];

          var equipesColetor = function () {
              ColetorService.getEquipesColetor()
              .then(function (response) {
                  $scope.equipes = response.data;
              })
              $scope.equipesSelecionadas = [];
          }

          equipesColetor();

          $scope.liberarCarga = function () {
              var equipesId = [];

              $scope.equipesSelecionadas.forEach(function (equipe) {
                  equipesId.push(equipe.equipeId)
              })

              ColetorService.postLiberarCarga(equipesId)
                .then(function (response) {
                    $("#modalPerguntaCarga").hide();
                    ngNotify.set(response.data.message, 'success');
                    equipesColetor();
                })
          }

          $scope.modalPerguntaCarga = function () {
              $("#modalPerguntaCarga").modal();
          }

          $scope.equipesSelecionadas = equipesSelecionadas;

          $scope.verificarEquipeSelecionada = function (equipe) {
              for (var n = 0; n < $scope.equipesSelecionadas.length; n++) {
                  if ($scope.equipesSelecionadas[n] == equipe) {
                      return true;
                  }
              }
          }

          $scope.selecionarEquipe = function (equipe) {
              if ($scope.verificarEquipeSelecionada(equipe)) {
                  $scope.equipesSelecionadas.splice($scope.equipesSelecionadas.indexOf(equipe), 1);
              }
              else {
                  $scope.equipesSelecionadas.push(equipe);
              }
          }

          $scope.selecionarTodasEquipes = function (equipes) {
              equipes.forEach(function (equipe) {
                  if (!$scope.verificarEquipeSelecionada(equipe)) {
                      $scope.equipesSelecionadas.push(equipe);
                  }
              })
          }

          $scope.limparTodasEquipes = function (equipes) {
              equipes.forEach(function (equipe) {
                  if ($scope.verificarEquipeSelecionada(equipe)) {
                      $scope.equipesSelecionadas.splice($scope.equipesSelecionadas.indexOf(equipe), 1)
                  }
              })
          }
      });
});