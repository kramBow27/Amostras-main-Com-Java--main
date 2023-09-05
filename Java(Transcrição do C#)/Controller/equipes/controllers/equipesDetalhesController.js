define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('Equipes', 'Detalhes');

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope,$timeout, $state, $stateParams, $injector, $http, OrdensServicoService) {
            var modelService = $injector.get(controller.serviceName);
            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");
            $scope.item = {};
            // Configura a tabela
            $scope.dtOptions = dtOptionsBuilder
                .newOptions()
                .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');
            console.log(modelService)
            console.log($stateParams.id)

            modelService.get({ id: $stateParams.id },
              
                
                function (data) {
                    $scope.item = data;
                },
           
                function (error) {
                    ngNotify.set('Registro não encontrado', 'error');
                    $scope.remoteErrors = errorService.parseErrors(error);
                    $state.go(controller.moduleName + '.');
                });

            
            $http.get("Api/Equipes/GetAreasEquipe?equipeId=" + $stateParams.id)
                .then(function (response) {

                    $scope.areas = response.data;
            
                
            })

            $http.get("Api/Equipes/GetFuncionariosEquipe?equipeId=" + $stateParams.id)
                .then(function (response) {
                    $scope.funcionarios = response.data;
           

                })

            OrdensServicoService.obterEquipe($stateParams.id)
                .then(function (response) {
                    $scope.equipe = response.data;
                    $scope.loadScript();

                })

            $scope.voltar = function () {
                $state.go(controller.moduleName + '.lista', {}, { reload: true });
            }
        
            $scope.mapMarkersOSs = function () {
                if ($scope.equipe.ultimaColeta) {
                    var lat = parseFloat($scope.equipe.ultimaLatitude.replace(",", "."));
                    var long = parseFloat($scope.equipe.ultimaLongitude.replace(",", "."));

                    var map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 14,
                        center: new google.maps.LatLng(lat, long),
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    });





                    
                    if ($scope.equipe && $scope.equipe.ultimaColeta) {
                        var equipe = $scope.equipe;
                        var agora = new Date();
                        var ultimaColeta = new Date(equipe.ultimaColeta);
                        var dataFormatada = ultimaColeta.toLocaleDateString('pt-BR', { timeZone: 'UTC' }) + ' ' + ultimaColeta.toLocaleTimeString('pt-BR', { timeZone: 'UTC', hour12: false });
                        var diferenca = agora - ultimaColeta
                        var image = "assets/img/imagesvermelha.png";

                        if (diferenca <= 300000) {
                            image = "assets/img/imagesverde.png";
                        } else if (diferenca <= 900000) {
                            image = "assets/img/images.png";
                        }

                        var latitude = parseFloat(equipe.ultimaLatitude.replace(",", "."));
                        var longitude = parseFloat(equipe.ultimaLongitude.replace(",", "."));

                        equipe.marker = new google.maps.Marker({
                            position: new google.maps.LatLng(latitude, longitude),
                            map: map,
                            title: 'Ver dados da Equipe',
                            icon: image
                        });

                        equipe.marker.infowindow = new google.maps.InfoWindow({
                            content:'Equipe: ' + equipe.equipeId + ' - ' + equipe.descricao +
                                '<br/>Última Coleta: ' + dataFormatada
                        });



                        equipe.marker.infowindow.open(map, equipe.marker);


                        google.maps.event.addListener(equipe.marker, 'click', (function (marker, equipe) {
                            return function () {


                                equipe.marker.infowindow.open(map, equipe.marker);

                            }
                        })(equipe.marker, equipe));
                    }

                }
                else { 
                    console.log("Equipe sem ultima coleta!")
                }
            }

            $scope.loadScript = function () {
                if (!window.google || !window.google.maps) {
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDJHHGZoNkj_6y92A5asBOtMuYAP2cRTHA&libraries=visualization";
                    document.body.appendChild(script);
                }
                $timeout(function () {
                    $scope.mapMarkersOSs();
                }, 2000);
            };
            
           
        });
});

