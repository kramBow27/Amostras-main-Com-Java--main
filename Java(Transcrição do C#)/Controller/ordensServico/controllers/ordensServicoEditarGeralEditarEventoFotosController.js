define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'EditarGeralEditarEventoFotos', 'ordemServicoId');

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
                                                     RegistroEventoService,
                                                     OrdensServicoService,
                                                     EventosService,
                                                     dadosAbasComplementaresEvento,
                                                     FileUploader) {

          // --- Declaração de variáveis básicas

          $scope.optionsGaleriaImagens = {
              base64: true,
              width: 300,
              height: 300
          };

          $scope.dadosAbasComplementaresEvento = dadosAbasComplementaresEvento.data;

          var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

          $scope.dtOptions = dtOptionsBuilder
              .newOptions()
              .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');

          // Variável que conterá os campos da geração de campos. Precisa ser inicializada para o bom funcionamento da diretiva.
          $scope.ordemServicoDetalhes = {};

          // Obtém os dados da Ordem de Serviço, gravados no serviço.
          $scope.dadosOs = OrdensServicoService.getDados();

          // Variável que indica a aba ativa nos campos gerados.
          $scope.passoAtivo;

          $scope.eventoId = $stateParams.eventoId;

          $scope.imagensEvento = [];

          $scope.dadosAbasComplementaresEvento.fotos.forEach(function (dadosFoto) {
              $scope.imagensEvento.push(dadosFoto.documento);
          })

          // Variável que será usada para obter os campos a serem gerados. O model da chamada é esse objeto.
          var modelDadosCamposGeracao = {
              tipoServicoId: null,
              ordemServicoId: $scope.dadosOs.ordemServicoId,
              eventoId: $scope.eventoId,
          }

          // Indica qual aba da rota pai está ativa.
          $scope.$parent.tabActive = 2;

          // Inicializa objeto de status de evento.
          $scope.statusEvento = {};

      }

    )
})