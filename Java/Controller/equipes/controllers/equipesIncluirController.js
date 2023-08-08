define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('Equipes', 'Incluir');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, $state, $stateParams, $injector, $rootScope, ngNotify) {
            var errorService = $injector.get("coreService");
            var modeloService = $injector.get(controller.serviceName);

            $scope.item = {};

			var onResponseErrorListener = $rootScope.$on("responseError", function (event, responseErrors) {
                $scope.remoteErrors = responseErrors;
            });

            

			$scope.gravar = function () {
                modeloService
                    .save($scope.item, function (response) {
                        ngNotify.set('Registro incluído com sucesso', 'success');
                        $state.go(controller.moduleName + '.lista');
                    });
            }

            $scope.cancelar = function () {
                history.back();
            }

            $scope.campoValido = function (campo) {
                if (!campo) return false;
                return campo.$invalid && !campo.$pristine;
            };
            

			$scope.$on("$destroy", onResponseErrorListener);
        });
});
