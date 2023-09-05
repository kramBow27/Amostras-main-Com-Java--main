define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('CamposColetor', 'Editar', 'campoColetorId');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $state, $stateParams, $injector, $rootScope, ngNotify) {
            var errorService = $injector.get("coreService");
            var modelService = $injector.get(controller.serviceName);

            $scope.item = {};

			var onResponseErrorListener = $rootScope.$on("responseError", function (event, responseErrors) {
                $scope.remoteErrors = responseErrors;
            });

            modelService.get({ id: $stateParams.id },
                function (data) {
                    $scope.item = data;
                });

            $scope.gravar = function () {
                modelService
                    .update($scope.item, function (response) {
                        ngNotify.set('Registro atualizado com sucesso', 'success');
                        $state.go(controller.moduleName + '.lista');
                    });
            };

            $scope.excluir = function (response) {
                modelService.delete({ id: $scope.item[controller.idField] },
                    function (response) {
                        ngNotify.set('Registro excluído com sucesso', 'success');
                        $state.go(controller.moduleName + '.lista');
                    },
                    function (error) {
                        ngNotify.set('Não é permitida a exclusão de registro em uso', 'error');
                    });
            };

            $scope.campoValido = function (campo) {
                if (!campo) return false;
                return campo.$invalid && !campo.$pristine;
            };

            $scope.cancelar = function () {
                history.back();
            };

            $scope.$watch('item.tipo', function (newValue) {
                if (!newValue) {
                    return;
                }
                if (newValue != 5) {
                    $scope.item.listaOpcaoId = "";
                }
                if (newValue != 1 && newValue != 2) {
                    $scope.item.tamanhoConteudo = "";
                }
            })

			$scope.$on("$destroy", onResponseErrorListener);
        });
});
