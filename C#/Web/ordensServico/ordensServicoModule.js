define(['componentBase'], function (ComponentBase) {

    var component = new ComponentBase('OrdensServico');
    var app = angular.module(component.name, ['common']);

    var modelo = component.name;
    var moduleName = modelo.toLowerCase();

    var resolveDadosOs = {
        dadosOs: function ($stateParams, OrdensServicoService) {
            return OrdensServicoService.consultarOrdemServico($stateParams.ordemServicoId);
        }
    };

    var resolveDadosEdicaoOs = {
        dadosOs: function ($stateParams, OrdensServicoService) {
            return OrdensServicoService.consultarEdicaoOrdemServico($stateParams.ordemServicoId)
                .then(function (response) {
                    OrdensServicoService.setDados(response.data);
                    return response
                })
        }
    };

    var resolveDadosAbasComplementaresEdicaoEvento = {
        dadosAbasComplementaresEvento: function ($stateParams, EventosService) {
            return EventosService.getAbasComplementaresEvento($stateParams.eventoId)
        }
    };

    var moduleConfig = {
        states: [
            { name: modelo, abstract: true, url: '/' + modelo, templateUrl: modelo, controller: null },
            { name: modelo + '.detalhes', abstract: false, url: '/detalhes/:ordemServicoId', templateUrl: modelo + '.detalhes', controller: modelo + 'DetalhesController', resolve: resolveDadosOs },
            { name: modelo + '.detalhes.geral', abstract: false, url: '/geral', templateUrl: modelo + '.detalhes.geral', controller: modelo + 'DetalhesGeralController' },
            { name: modelo + '.detalhes.geral.dados', abstract: false, url: '/dados', templateUrl: modelo + '.detalhes.geral.dados', controller: modelo + 'DetalhesGeralDadosController' },
            { name: modelo + '.detalhes.geral.chamados', abstract: false, url: '/chamados', templateUrl: modelo + '.detalhes.geral.chamados', controller: modelo + 'DetalhesGeralChamadosController' },
            { name: modelo + '.detalhes.geral.eventos', abstract: false, url: '/eventos', templateUrl: modelo + '.detalhes.geral.eventos', controller: modelo + 'DetalhesGeralEventosController' },
            { name: modelo + '.detalhes.geral.historico', abstract: false, url: '/historico', templateUrl: modelo + '.detalhes.geral.historico', controller: modelo + 'DetalhesGeralHistoricoController' },
            { name: modelo + '.detalhes.geral.documentos', abstract: false, url: '/documentos', templateUrl: modelo + '.detalhes.geral.documentos', controller: modelo + 'DetalhesGeralDocumentosController' },
            { name: modelo + '.detalhes.evento', abstract: false, url: '/evento/:eventoId', templateUrl: modelo + '.detalhes.evento', controller: modelo + 'DetalhesEventoController' },
            { name: modelo + '.detalhes.historico', abstract: false, url: '/historico/:historicoId', templateUrl: modelo + '.detalhes.historico', controller: modelo + 'DetalhesHistoricoController' },
            { name: modelo + '.consulta', abstract: false, url: '/consulta/:tipoConsulta', templateUrl: modelo + '.consulta', controller: modelo + 'ConsultaController' },
            { name: modelo + '.editar', abstract: false, url: '/editar/:ordemServicoId', templateUrl: modelo + '.editar', controller: modelo + 'EditarController', resolve: resolveDadosEdicaoOs },
            { name: modelo + '.editar.geral', abstract: false, url: '/geral', templateUrl: modelo + '.editar.geral', controller: modelo + 'EditarGeralController' },
            { name: modelo + '.editar.geral.chamados', abstract: false, url: '/chamados', templateUrl: modelo + '.editar.geral.chamados', controller: modelo + 'EditarGeralChamadosController' },
            { name: modelo + '.editar.geral.eventos', abstract: false, url: '/eventos', templateUrl: modelo + '.editar.geral.eventos', controller: modelo + 'EditarGeralEventosController' },
            { name: modelo + '.editar.geral.historico', abstract: false, url: '/historico', templateUrl: modelo + '.editar.geral.historico', controller: modelo + 'EditarGeralHistoricoController' },
            { name: modelo + '.editar.geral.documentos', abstract: false, url: '/documentos', templateUrl: modelo + '.editar.geral.documentos', controller: modelo + 'EditarGeralDocumentosController' },
            { name: modelo + '.editar.geral.editarChamado', abstract: false, url: '/chamado/:chamadoId', templateUrl: modelo + '.editar.geral.editarChamado', controller: modelo + 'EditarGeralEditarChamadoController' },
            { name: modelo + '.editar.geral.novoEvento', abstract: false, url: '/novoEvento', templateUrl: modelo + '.editar.geral.novoEvento', controller: modelo + 'EditarGeralNovoEventoController' },
            { name: modelo + '.editar.geral.editarEvento', abstract: false, url: '/evento/:eventoId', templateUrl: modelo + '.editar.geral.editarEvento', controller: modelo + 'EditarGeralEditarEventoController', resolve: resolveDadosAbasComplementaresEdicaoEvento },
            { name: modelo + '.editar.geral.editarEvento.materiais', abstract: false, url: '/materiais', templateUrl: modelo + '.editar.geral.editarEvento.materiais', controller: modelo + 'EditarGeralEditarEventoMateriaisController' },
            { name: modelo + '.editar.geral.editarEvento.equipamentos', abstract: false, url: '/equipamentos', templateUrl: modelo + '.editar.geral.editarEvento.equipamentos', controller: modelo + 'EditarGeralEditarEventoEquipamentosController' },
            { name: modelo + '.editar.geral.editarEvento.maoDeObra', abstract: false, url: '/maoDeObra', templateUrl: modelo + '.editar.geral.editarEvento.maoDeObra', controller: modelo + 'EditarGeralEditarEventoMaoDeObraController' },
            { name: modelo + '.editar.geral.editarEvento.servicos', abstract: false, url: '/servicos', templateUrl: modelo + '.editar.geral.editarEvento.servicos', controller: modelo + 'EditarGeralEditarEventoServicosController' },
            { name: modelo + '.editar.geral.editarEvento.artigos', abstract: false, url: '/artigos', templateUrl: modelo + '.editar.geral.editarEvento.artigos', controller: modelo + 'EditarGeralEditarEventoArtigosController' },
            { name: modelo + '.editar.geral.editarEvento.manobraDescarga', abstract: false, url: '/manobraDescarga', templateUrl: modelo + '.editar.geral.editarEvento.manobraDescarga', controller: modelo + 'EditarGeralEditarEventoManobraDescargaController' },
            { name: modelo + '.editar.geral.editarEvento.informacoesAdicionais', abstract: false, url: '/informacoesAdicionais', templateUrl: modelo + '.editar.geral.editarEvento.informacoesAdicionais', controller: modelo + 'EditarGeralEditarEventoInformacoesAdicionaisController' },
            { name: modelo + '.editar.geral.editarEvento.andamentos', abstract: false, url: '/andamentos', templateUrl: modelo + '.editar.geral.editarEvento.andamentos', controller: modelo + 'EditarGeralEditarEventoAndamentosController' },
            { name: modelo + '.editar.geral.editarEvento.funcoes', abstract: false, url: '/funcoes', templateUrl: modelo + '.editar.geral.editarEvento.funcoes', controller: modelo + 'EditarGeralEditarEventoFuncoesController' },
            { name: modelo + '.editar.geral.editarEvento.vala', abstract: false, url: '/vala', templateUrl: modelo + '.editar.geral.editarEvento.vala', controller: modelo + 'EditarGeralEditarEventoValaController' },
            { name: modelo + '.editar.geral.editarEvento.documentos', abstract: false, url: '/documentos', templateUrl: modelo + '.editar.geral.editarEvento.documentos', controller: modelo + 'EditarGeralEditarEventoDocumentosController' },
            { name: modelo + '.editar.geral.editarEvento.tarefas', abstract: false, url: '/tarefas', templateUrl: modelo + '.editar.geral.editarEvento.tarefas', controller: modelo + 'EditarGeralEditarEventoTarefasController' },
            { name: modelo + '.editar.geral.editarEvento.fotos', abstract: false, url: '/fotos', templateUrl: modelo + '.editar.geral.editarEvento.fotos', controller: modelo + 'EditarGeralEditarEventoFotosController' },
            { name: modelo + '.editar.geral.mapa', abstract: false, url: '/mapa', templateUrl: modelo + '.editar.geral.mapa', controller: modelo + 'EditarGeralMapaController', params: { blockScrollTop: true } },
            { name: modelo + '.editar.geral.mapaGeo', abstract: false, url: '/mapaGeo', templateUrl: modelo + '.editar.geral.mapaGeo', controller: modelo + 'EditarGeralMapaGeoController', params: { blockScrollTop: true } },
            { name: modelo + '.editar.geral.guiaRecolhimento', abstract: false, url: '/guiaRecolhimento', templateUrl: modelo + '.editar.geral.guiaRecolhimento', controller: modelo + 'EditarGeralGuiaRecolhimentoController' },
            { name: modelo + '.editar.geral.guiaRecolhimentoDetalhes', abstract: false, url: '/detalhes/:id', templateUrl: modelo + '.editar.geral.guiaRecolhimento.detalhes', controller: modelo + 'EditarGeralGuiaRecolhimentoDetalhesController' },
            { name: modelo + '.externas', abstract: false, url: '/externas/:tipoRecursoId', templateUrl: modelo + '.externas', controller: modelo + 'ExternasController' },
            { name: modelo + '.internas', abstract: false, url: '/internas/:tipoRecursoId', templateUrl: modelo + '.internas', controller: modelo + 'InternasController' },
            { name: modelo + '.programacao', abstract: false, url: '/programacao/:tipoRecursoId', templateUrl: modelo + '.programacao', controller: modelo + 'ProgramacaoController' },
            { name: modelo + '.programacaoInternas', abstract: false, url: '/programacaoInternas/:tipoRecursoId', templateUrl: modelo + '.programacaoInternas', controller: modelo + 'ProgramacaoInternasController' },
            { name: modelo + '.manutencaoPreventiva', abstract: false, url: '/manutencaoPreventiva/:tipoRecursoId', templateUrl: modelo + '.manutencaoPreventiva', controller: modelo + 'ManutencaoPreventivaController' },
            { name: modelo + '.mapa', abstract: false, url: '/mapa/:tipoRecursoId', templateUrl: modelo + '.mapa', controller: modelo + 'MapaController' },
        ],
        paths: {
            base: function () { return 'app/modules/' + moduleName },
            controllers: function () { return moduleConfig.paths.base() + '/controllers/' },
            getView: function (templateName) { return moduleConfig.paths.base() + '/views/' + templateName + '.html' }
        }
    };

    require([
        'app/modules/ordensServico/services/ordensServicoService.js',
        'app/modules/ordensServico/services/registroEventoService.js',
        'app/modules/ordensServico/services/eventosService.js',
        'app/modules/chamados/services/chamadosService.js',
        'app/modules/ordensServico/directives/dadosBasicosOrdemServicoDirective.js',
    ], function (ordensServicoService, registroEventoService, eventosService, chamadosService, dadosBasicosOrdemServicoDirective) {
        app.service('OrdensServicoService', ordensServicoService);
        app.service('RegistroEventoService', registroEventoService);
        app.service('EventosService', eventosService);
        app.service('ChamadosService', chamadosService);

        app.directive('dadosBasicosOrdemServico', dadosBasicosOrdemServicoDirective);
    })

    app.config(function ($controllerProvider) {
        app.registerController = $controllerProvider.register;
    });

    app.constant('ngRotasSistemasAuxiliares', {
        rotaBalcao: window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/balcao_ssb/"
    });

    app.config(function ($stateProvider, $urlRouterProvider) {

        moduleConfig.states.forEach(function (rota) {
            var state = {
                name: rota.name,
                url: rota.url,
                abstract: rota.abstract,
                templateUrl: moduleConfig.paths.getView(rota.templateUrl),
                template: rota.template
            };

            if (rota.controller) {
                state.controller = rota.controller;

                if (rota.resolve) {
                    state.resolve = rota.resolve
                    state.resolve.controllerFile = function (coreService) {
                        return coreService.loadController(moduleConfig, rota.controller);
                    }
                } else {
                    state.resolve = {
                        controllerFile: function (coreService) {
                            return coreService.loadController(moduleConfig, rota.controller);
                        }
                    };
                }
            }

            $stateProvider.state(state);
        });
    });

    app.service("inclusaoService", function ($http, BaseServerConfig) {
        var baseUrl = BaseServerConfig.serverUrl + "Api/";

        this.postIncluir = function () {
            return $http.post(baseUrl + 'MateriaisEventos/Post')
        }

       
    })
});