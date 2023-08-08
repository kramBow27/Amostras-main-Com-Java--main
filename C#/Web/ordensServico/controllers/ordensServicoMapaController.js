define(['controllerBase'], function (ControllerBase) {

    var controller = new ControllerBase('OrdensServico', 'Mapa');

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
            OrdensServicoService,
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
            $scope.ordemServicoCancelamento = {};
            $scope.idsOrdensServicos = [];
            $scope.ordemServicoExecucao = {};
            $scope.ordensServicoCanceladasOuExecutadas = [];
            $scope.eventosEmExecucao = [];
            $scope.dtInstance = {};
            $scope.tipoIntegracaoSistema = 1;

            var ordensServicoId = [];
            var documentosSelecionados = [];

            var ordensServicoSelecionadas = [];

            OrdensServicoService.getDadosCamposGeracao($scope.tipoRecursoId)
                .then(function (response) {
                    $scope.modelPassosCamposGeracao = response.data;
                })

            // Gerencia a troca de abas ativas.
            $scope.ativarAba = function (passo) {
                $scope.passoAtivo = passo.passoId
            }

            $scope.pesquisarOrdemServico = function () {
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

                OrdensServicoService.postOrdensServicoParaMapa(model)
                    .then(function (response) {
                        $scope.ordensServico = response.data;
                        $scope.tipoIntegracaoSistema = response.data[0].tipoIntegracaoSistema;
                        if ($scope.ordensServico.length == '0') {
                            ngNotify.set('Registro não localizado!', 'error');
                        }
                    })
            }

            $scope.mapMarkersOSs = function () {

                var os = $scope.ordensServico.find(x => x.latitude != null);

                var lat = parseFloat(os.latitude.replace(",", "."));
                var long = parseFloat(os.longitude.replace(",", "."));

                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 14,
                    center: new google.maps.LatLng(lat, long),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });

                var infowindow = new google.maps.InfoWindow();

                var marker, i;

                var latitudeTemp = "" ;
                var longitudeTemp = "";
                var statusOsTemp = "";
                var mensagemInfo = "";

                for (i = 0; i < $scope.ordensServico.length; i++) {

                    var ordemServico = $scope.ordensServico[i];

                    if (ordemServico.latitude != null && ordemServico.longitude != null) {

                        var dataOs = $scope.ordensServico[i].dataAberturaOrdemServico;
                        var data = new Date(dataOs);
                        var dataFormatada = data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });

                        if (latitudeTemp.length == 0 && longitudeTemp.length == 0) {

                            latitudeTemp = ordemServico.latitude;
                            longitudeTemp = ordemServico.longitude;
                            statusOsTemp = ordemServico.statusOs;

                            mensagemInfo = 'Ordem de Serviço: ' + $scope.ordensServico[i].ordemServicoId +
                                            '<br/>Status: ' + $scope.ordensServico[i].statusOs +
                                            '<br/>Chamado: ' + $scope.ordensServico[i].chamadoId +
                                            '<br/>Data Abertura: ' + dataFormatada +
                                            '<br/>Tipo de Chamado: ' + $scope.ordensServico[i].descricaoTipoChamado +
                                            '<br/>Serviço: ' + $scope.ordensServico[i].descricaoServico +
                                            '<br/>Status: ' + $scope.ordensServico[i].statusEvento +
                                            '<br/>Cdc: ' + $scope.ordensServico[i].cdc +
                                            '<br/>Solicitante: ' + $scope.ordensServico[i].nomeSolicitante +
                                            '<br/>Endereço: ' + $scope.ordensServico[i].endereco +
                                            '<br/>Bairro: ' + $scope.ordensServico[i].bairro +
                                            '<br/>CEP: ' + $scope.ordensServico[i].cep;
                        }
                        else {

                            if (ordemServico.latitude == latitudeTemp || ordemServico.longitude == longitudeTemp) {
                                mensagemInfo = mensagemInfo + '<br/><br/>Ordem de Serviço: ' + $scope.ordensServico[i].ordemServicoId +
                                                               '<br/>Status: ' + $scope.ordensServico[i].statusOs +
                                                               '<br/>Chamado: ' + $scope.ordensServico[i].chamadoId +
                                                               '<br/>Data Abertura: ' + dataFormatada +
                                                               '<br/>Tipo de Chamado: ' + $scope.ordensServico[i].descricaoTipoChamado +
                                                               '<br/>Serviço: ' + $scope.ordensServico[i].descricaoServico +
                                                               '<br/>Status: ' + $scope.ordensServico[i].statusEvento +
                                                               '<br/>Cdc: ' + $scope.ordensServico[i].cdc;
                            }
                            else {

                                var image = "assets/img/images.png";

                                if (statusOsTemp == "Executada") {
                                    image = "assets/img/imagesazul.png";
                                }
                                else if (statusOsTemp == "Em Execução") {
                                    image = "assets/img/imagesverde.png";
                                }
                                else if (statusOsTemp == "Cancelada") {
                                    image = "assets/img/imagesvermelha.png";
                                }

                                var latitude = parseFloat(latitudeTemp.replace(",", "."));
                                var longitude = parseFloat(longitudeTemp.replace(",", "."));

                                marker = new google.maps.Marker
                                    (
                                        {
                                            position: new google.maps.LatLng(latitude, longitude),
                                            map: map,
                                            title: 'Ver dados da Ordem de Serviço',
                                            icon: image
                                        }
                                    );

                                google.maps.event.addListener(marker, 'click', (function (marker, i, mensagemInfo) {
                                    return function () {
                                        infowindow.setContent(mensagemInfo);
                                        infowindow.open(map, marker);
                                    }
                                })(marker, i, mensagemInfo));

                                latitudeTemp = ordemServico.latitude;
                                longitudeTemp = ordemServico.longitude;

                                mensagemInfo = 'Ordem de Serviço: ' + $scope.ordensServico[i].ordemServicoId +                                          // +
                                           '<br/>Status: ' + $scope.ordensServico[i].statusOs +
                                           '<br/>Chamado: ' + $scope.ordensServico[i].chamadoId +
                                           '<br/>Data Abertura: ' + dataFormatada +
                                           '<br/>Tipo de Chamado: ' + $scope.ordensServico[i].descricaoTipoChamado +
                                           '<br/>Serviço: ' + $scope.ordensServico[i].descricaoServico +
                                           '<br/>Status: ' + $scope.ordensServico[i].statusEvento +
                                           '<br/>Cdc: ' + $scope.ordensServico[i].cdc +
                                           '<br/>Solicitante: ' + $scope.ordensServico[i].nomeSolicitante +
                                           '<br/>Endereço: ' + $scope.ordensServico[i].endereco +
                                           '<br/>Bairro: ' + $scope.ordensServico[i].bairro +
                                           '<br/>CEP: ' + $scope.ordensServico[i].cep;

                            }

                            statusOsTemp = ordemServico.statusOs;
                        }
                    }
                }

                var image = "assets/img/images.png";

                if (statusOsTemp == "Executada") {
                    image = "assets/img/imagesazul.png";
                }
                else if (statusOsTemp == "Em Execução") {
                    image = "assets/img/imagesverde.png";
                }
                else if (statusOsTemp == "Cancelada") {
                    image = "assets/img/imagesvermelha.png";
                }

                var latitude = parseFloat(latitudeTemp.replace(",", "."));
                var longitude = parseFloat(longitudeTemp.replace(",", "."));

                marker = new google.maps.Marker
                    (
                        {
                            position: new google.maps.LatLng(latitude, longitude),
                            map: map,
                            title: 'Ver dados da Ordem de Serviço',
                            icon: image
                        }
                    );

                google.maps.event.addListener(marker, 'click', (function (marker, i, mensagemInfo) {
                    return function () {
                        infowindow.setContent(mensagemInfo);
                        infowindow.open(map, marker);
                    }
                })(marker, i, mensagemInfo));

            }

            $scope.mapCalorOSs = function () {
                var os = $scope.ordensServico.find(x => x.latitude != null);
                var lat = parseFloat(os.latitude.replace(",", "."));
                var long = parseFloat(os.longitude.replace(",", "."));

                var points = [];

                var map = new google.maps.Map(document.getElementById('mapCalor'), {
                    zoom: 14,
                    center: new google.maps.LatLng(lat, long),
                });

                for (i = 0; i < $scope.ordensServico.length; i++) {
                    var ordemServico = $scope.ordensServico[i];
                    if (ordemServico.latitude != null && ordemServico.longitude != null) {

                        var latitude = parseFloat(ordemServico.latitude.replace(",", "."));
                        var longitude = parseFloat(ordemServico.longitude.replace(",", "."));

                        points.push(new google.maps.LatLng(latitude, longitude))
                    }
                }

                var pointArray = new google.maps.MVCArray(points);

                var heatMap = new google.maps.visualization.HeatmapLayer({
                    data: pointArray
                });

                heatMap.setMap(map);
                directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });

                heatMap.set("radius", heatMap.get("radius") ? null : 30);

                //heatMap.set("opacity", heatMap.get("opacity") ? null : 0.2);
            }



            $scope.loadScript = function () {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDJHHGZoNkj_6y92A5asBOtMuYAP2cRTHA&libraries=visualization";
                document.body.appendChild(script);
                setTimeout(function () {
                    $scope.mapMarkersOSs();
                    $scope.mapCalorOSs();
                }, 2000);
            };
        });
})