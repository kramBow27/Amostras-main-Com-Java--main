define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('ListaOpcoesColetor', 'Editar', 'listaOpcaoColetorId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $state, $stateParams, $injector, $rootScope, ngNotify, ListaOpcoesColetorService) {
            var errorService = $injector.get("coreService");
            var modelService = $injector.get(controller.serviceName);

            $scope.item = {};

            var onResponseErrorListener = $rootScope.$on("responseError", function (event, responseErrors) {
                $scope.remoteErrors = responseErrors;
            });

            ListaOpcoesColetorService.obterDetalhesListaOpcoesColetor($stateParams.id)
                .then(function (response) {
                    $scope.item = response.data;
                },
                function (error) {
                    ngNotify.set('Registro não encontrado', 'error');
                });

            $scope.gravar = function () {
                ListaOpcoesColetorService.editar($scope.item)
                    .then(function (response) {
                        ngNotify.set('Registro atualizado com sucesso', 'success');
                        $state.go('listaOpcoesColetor.detalhes', ({ id: $scope.item.listaOpcaoColetorId }));
                    });
            };

            $scope.excluir = function (response) {
                ListaOpcoesColetorService.excluir($scope.item[controller.idField])
                   .then(function (response) {
                       ngNotify.set('Registro excluído com sucesso', 'success');
                       $state.go('listaOpcoesColetor.lista');
                   });
            };

            $scope.campoValido = function (campo) {
                if (!campo) return false;
                return campo.$invalid && !campo.$pristine;
            };

            $scope.cancelar = function () {
                history.back();
            };

            $scope.$on("$destroy", onResponseErrorListener);
        });
});
