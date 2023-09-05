define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('Equipes', 'Monitoramento');
    

    angular
        .module(controller.moduleName)
        .registerController(controller.name, function ($scope, ngNotify,
            $injector,
            $stateParams,  $timeout, OrdensServicoService) {

            var dtOptionsBuilder = $injector.get("DTOptionsBuilder");

            if (!$.fn.DataTable.isDataTable('#tabela')) {
                $scope.dtOptions = dtOptionsBuilder
                    .newOptions()
                    .withOption('destroy', true)
                    .withOption('order', [])
                    .withLanguageSource('assets/plugins/jquery.datatables/Portuguese-Brasil.json');
            }

          
            $scope.equipe = {};
            $scope.markers = [];
            $scope.equipesMarkers = [];
            $scope.tipoRecursoId = $stateParams.tipoRecursoId;
            $scope.passoAtivo = 1;
            $scope.dados = [];
            $scope.tipoIntegracaoSistema = 1;
            $scope.equipes = [];
            var es = $scope.equipes.find(x => x.ultimaLatitude != null);
            var equipesSelecionadas = [];
            $scope.equipesSelecionadas = equipesSelecionadas;

            $scope.verificarEquipeSelecionada = function (equipe) {
                return $scope.equipesSelecionadas.includes(equipe);
            }
            


            console.log("params",$stateParams);



            $scope.selecionarEquipe = function (equipe) {
                if ($scope.verificarEquipeSelecionada(equipe)) {
                    $scope.equipesSelecionadas.splice($scope.equipesSelecionadas.indexOf(equipe), 1);
                    var markerIndex = $scope.markers.indexOf(equipe);
                    if (markerIndex !== -1) {
                        $scope.markers.splice(markerIndex, 1);
                    }
                    $scope.mapMarkersOSs();
                }
                else {
                    $scope.equipesSelecionadas.push(equipe);

                    $scope.markers.push(equipe);
                    $scope.mapMarkersOSSelecionada(equipe);
                  
                     
                    
                }
            
               
                
            }
         
            $scope.limparTodasEquipes = function (equipes) {
                equipes.forEach(function (equipe) {
                    if ($scope.verificarEquipeSelecionada(equipe)) {
                        $scope.equipesSelecionadas.splice($scope.equipesSelecionadas.indexOf(equipe), 1)
                    }
                });
                $scope.equipesSelecionadas = [];
                $scope.markers = [];
                $scope.ordensServicoEquipe = [];
                $scope.mapMarkersOSLimpaSeleção();
               
            }
            $scope.selecionarTodasEquipes = function (equipes) {
                equipes.forEach(function (equipe) {
                    if (!$scope.verificarEquipeSelecionada(equipe) && equipe.ultimaLatitude) {
                        $scope.equipesSelecionadas.push(equipe);
                    }
                });
                $scope.markers = equipes.filter(equipe => equipe.ultimaLatitude);
                $scope.ordensServicoEquipe = [];
                $scope.mapMarkersOSs();
               
            }




            OrdensServicoService.getDadosCamposGeracao($scope.tipoRecursoId)
                .then(function (response) {
                    $scope.modelPassosCamposGeracao = response.data;
                    console.log($scope.tipoRecursoId);
                    console.log(response.data)
                    
                })




            // Gerencia a troca de abas ativas.
            $scope.ativarAba = function (passo) {
                $scope.passoAtivo = passo.passoId
            }


            $scope.mapMarkersOSs = function () {
                var bounds = new google.maps.LatLngBounds();

                // Inicialize o mapa 
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 14,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });

                var infowindow = new google.maps.InfoWindow();
          

                for (i = 0; i < $scope.equipes.length; i++) {
                    var equipe = $scope.equipes[i];
                    if ($scope.markers.includes(equipe)) {
                        var agora = new Date();
                        var ultimaColeta = new Date(equipe.ultimaColeta);
                        var diferenca = agora - ultimaColeta
                        var image = "assets/img/imagesvermelha.png"; 

                        if (diferenca <= 300000) { 
                            image = "assets/img/imagesverde.png";
                        } else if (diferenca <= 900000) { 
                            image = "assets/img/images.png";
                        }

                        var latitude = parseFloat(equipe.ultimaLatitude.replace(",", "."));
                        var longitude = parseFloat(equipe.ultimaLongitude.replace(",", "."));

                        var latLng = new google.maps.LatLng(latitude, longitude);

                        // Estenda os limites para incluir essa localização
                        bounds.extend(latLng);

                        equipe.marker = new google.maps.Marker({
                            position: latLng,
                            map: map,
                            title: 'Ver dados da Equipe',
                            icon: image
                        });
                        equipe.marker.infowindow = new google.maps.InfoWindow({
                            content: equipe.equipeId + ' - ' + equipe.descricao
                        });

                       

                        equipe.marker.infowindow.open(map, equipe.marker);
                       

                        google.maps.event.addListener(equipe.marker, 'click', (function (marker, equipe) {
                            return function () {
                               
                                OrdensServicoService.postOrdensServicoEquipe(equipe.equipeId)
                                    .then(function (response) {
                                        $scope.ordensServicoEquipe = response.data;
                                        $scope.equipe = equipe;
                                        console.log($scope.ordensServicoEquipe);
                                    })
                                equipe.marker.infowindow.open(map, equipe.marker);
                              
                            }
                        })(equipe.marker, equipe));
                    }
                }
                map.fitBounds(bounds);
            }

            $scope.mapMarkersOSSelecionada = function (equipeSelecionada) {
             
                var bounds = new google.maps.LatLngBounds();

                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 14,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });

                       

                for (i = 0; i < $scope.equipes.length; i++) {
                    var equipe = $scope.equipes[i];
                    if ($scope.markers.includes(equipe)) {
                        var agora = new Date();
                        var ultimaColeta = new Date(equipe.ultimaColeta);
                        var diferenca = agora - ultimaColeta   
                        var image = "assets/img/imagesvermelha.png";

                        if (diferenca <= 300000) {
                            image = "assets/img/imagesverde.png";
                        } else if (diferenca <= 900000) {
                            image = "assets/img/images.png";
                        }

                        var latitude = parseFloat(equipe.ultimaLatitude.replace(",", "."));
                        var longitude = parseFloat(equipe.ultimaLongitude.replace(",", "."));

                        var latLng = new google.maps.LatLng(latitude, longitude);

                        bounds.extend(latLng);


                        equipe.marker = new google.maps.Marker({
                            position: latLng,
                            map: map,
                            title: 'Ver dados da Equipe',
                            icon: image
                        });
                        equipe.marker.infowindow = new google.maps.InfoWindow({
                            content: equipe.equipeId + ' - ' + equipe.descricao
                        });

                        equipe.marker.isOpen = false;

                        equipe.marker.infowindow.open(map, equipe.marker);
                        equipe.marker.isOpen = true;

                        google.maps.event.addListener(equipe.marker, 'click', (function (marker, equipe) {
                            return function () {

                                OrdensServicoService.postOrdensServicoEquipe(equipe.equipeId)
                                    .then(function (response) {
                                        $scope.ordensServicoEquipe = response.data;
                                        $scope.equipe = equipe;
                                        console.log($scope.ordensServicoEquipe);
                                    })
                                equipe.marker.infowindow.open(map, equipe.marker);

                            }
                        })(equipe.marker, equipe));
                    }
                }
                map.fitBounds(bounds);
            }

            $scope.mapMarkersOSLimpaSeleção = function () {

                var es = $scope.equipes.find(x => x.ultimaLatitude != null);
                var lat = parseFloat(es.ultimaLatitude.replace(",", "."));
                var long = parseFloat(es.ultimaLongitude.replace(",", "."));

                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 14,
                    center: new google.maps.LatLng(lat, long),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });

                var infowindow = new google.maps.InfoWindow();


                for (i = 0; i < $scope.equipes.length; i++) {
                    var equipe = $scope.equipes[i];
                    if ($scope.markers.includes(equipe)) {
                        var agora = new Date();
                        var ultimaColeta = new Date(equipe.ultimaColeta);
                        var diferenca = agora - ultimaColeta
                      
                        var image = "assets/img/imagesvermelha.png";

                        if (diferenca <= 300000) {
                            image = "assets/img/imagesverde.png";
                        } else if (diferenca <= 900000) {
                            image = "assets/img/imagesazul.png";
                        }

                        var latitude = parseFloat(equipe.ultimaLatitude.replace(",", "."));
                        var longitude = parseFloat(equipe.ultimaLongitude.replace(",", "."));

                        equipe.marker = new google.maps.Marker({
                            position: new google.maps.LatLng(latitude, longitude),
                            map: map,
                            title: 'Ver dados da Equipe',
                            icon: image
                        });

                        
                        google.maps.event.addListener(equipe.marker, 'click', (function (marker, equipe) {
                            return function () {
                                
                               

                                OrdensServicoService.postOrdensServicoEquipe(equipe.equipeId)
                                    .then(function (response) {
                                        
                                        $scope.ordensServicoEquipe = response.data;
                                        
                                        $scope.equipe = equipe;
                                        
                                        console.log($scope.ordensServicoEquipe);
                                    })
                                equipe.marker.infowindow.open(map, equipe.marker);

                            }
                        })(equipe.marker, equipe));
                    }
                }
            }
           


            $scope.loadScript = function () {
                if (!window.google || !window.google.maps) {
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDJHHGZoNkj_6y92A5asBOtMuYAP2cRTHA&libraries=visualization";
                    document.body.appendChild(script);
                }
                setTimeout(function () {
                    $scope.mapMarkersOSs();
                }, 2000);
            };


            $scope.obterEquipes = function () {
                $scope.equipes = [];

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

                OrdensServicoService.obterEquipes(model)
                    .then(function (response) {
                        $scope.equipes = [];
                        $scope.equipes = response.data;
                        
                        console.log($scope.equipes);

                        for (i = 0; i < $scope.equipes.length; i++) {
                            if ($scope.equipes[i].ultimaLatitude != null) {
                                $scope.equipesSelecionadas.push($scope.equipes[i]);
                                $scope.equipesMarkers.push($scope.equipes[i]);
                                $scope.markers.push($scope.equipes[i]);
                                $scope.equipe = $scope.equipes[i];                             
                             
                            }
                        }
                     

                        if ($scope.equipes.length == '0') {
                            ngNotify.set('Registro não localizado!', 'error');
                        }
                        $scope.loadScript();
                    })              
            }

            $scope.statusColor = function (equipe) {
                var agora = new Date();
                var ultimaColeta = new Date(equipe.ultimaColeta);
                var diferenca = agora - ultimaColeta;

                if (diferenca <= 300000) {
                    return '#D0E9C6'; 
                } else if (diferenca <= 900000) {
                    return '#FAF2CC'; 
                } else if (ultimaColeta == null) { 
                    return null;
                }
                else {
                    return '#EBCCCC';
                }
            };


            $scope.clickEquipe = function (equipe) {
                $timeout(function () {
                    $scope.selecionarEquipe(equipe);
                }, 10);
            };

            $scope.pesquisarEquipes = function () { 
                $timeout(function () { 
                    $scope.obterEquipes();
                    $scope.ordensServicoEquipe = [];
                }, 1200)
            }
                      
        })
})
