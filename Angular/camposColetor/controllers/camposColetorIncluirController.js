define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('CamposColetor', 'Incluir');

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
                    },
                    function (rejection) {
                        if (rejection.status === 400) {
                            ngNotify.set('O campo Código deve ser numérico', 'error');
                        };
                    });
            }

            $scope.cancelar = function () {
                history.back();
            }

            $scope.campoValido = function (campo) {
                if (!campo) return false;
                return campo.$invalid && !campo.$pristine;
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
