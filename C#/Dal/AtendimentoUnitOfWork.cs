using Cebi.Atendimento.Domain.Interfaces;
using Cebi.Atendimento.Dal.Repositories;
using Cebi.Util.Dal.Base;

namespace Cebi.Atendimento.Dal
{
    public partial class AtendimentoUnitOfWork : UnitOfWork, IAtendimentoUnitOfWork
    {
        private readonly AtendimentoContext _context;

        private IAreaManutencaoRepository _areasManutencao;
        private IArtigoRepository _artigos;
        private ICaracteristicaRepository _caracteristicas;
        private IEquipeRepository _equipes;
        private IFuncaoRepository _funcoes;
        private IIntensidadeRepository _intensidades;
        private ILocalizacaoVazamentoRepository _localizacaoVazamentos;
        private ISolicitanteRepository _solicitantes;
        private ITipoEquipamentoSGSRepository _tiposEquipamentosSGS;
        private ITipoOcorrenciaTelemetriaRepository _tiposOcorrenciasTelemetrias;
        private ITipoOcorrenciaRepository _tiposOcorrencias;
        private ITipoPavimentoRepository _tiposPavimentos;
        private ITipoPrioridadeEquipamentoRepository _tiposPrioridadesEquipamentos;
        private IGrupoServicoRepository _gruposServicos;
        private ITipoSinalizacaoRepository _tiposSinalizacao;
        private ICentroCustoServicoNovoRepository _centroCustoServicoNovos;
        private IEventosBaixasColetorRepository _eventosBaixasColetor;
        private ICampoColetorRepository _camposColetor;
        private ITipoServicoCampoColetorRepository _tiposServicoCamposColetor;
        private IMoedaRepository _moedas;
        private ITipoChamadoCategoriaRepository _tipoChamadoCategorias;
        private IOrdensServicoColetorRepository _ordensServicoColetor;
        private IAtendimentoChamadoRepository _atendimentoChamados;
        private ITipoChamadoRepository _tiposChamados;
        private ITipoChamadoDeptoEncRepository _tiposChamadosDeptosEnc;
        private ITipoChamadoTipoChamadoRepository _tiposChamadosTiposChamados;
        private IServicoGrupoRepository _servicoGrupos;
        private ICentroCustoRepository _centrosCusto;
        private IGrupoRepository _grupos;
        private ICategoriaRepository _categorias;
        private ICentroReservacaoRepository _centrosReservacao;
        private IDesignativoRepository _designativos;
        private IPesquisaRepository _pesquisas;
        private ITipoEscavacaoRepository _tiposEscavacao;
        private ITipoExecucaoRepository _tiposExecucao;
        private ITipoRecusaVistoriaRepository _tiposRecusasVistorias;
        private ITipoRegistroRepository _tiposRegistros;
        private IUnidadeRepository _unidades;
        private IViaturaRepository _viaturas;
        private IZonaAbastecimentoRepository _zonasAbastecimento;
        private ITipoServicoRepository _tipoServicos;
        private IFuncionarioRepository _funcionario;
        private ITarefaRepository _tarefas;
        private ITipoServicoTarefaRepository _tiposServicosTarefas;
        private IAtendimentoGrupoRepository _atendimentoGrupos;
        private IEquipeCoordenadasRepository _equipeCoordenadas;
        private ISituacaoAguaRepository _situacaoAguas;
        private ITipoCorteRepository _tiposCortes;
        private ITipoLacreRepository _tiposLacres;
        private ITipoChamadoTipoServicoRepository _tiposChamadoTiposServico;
        private ICronogramaRepository _cronogramas;
        private IDocumentoLigacaoRepository _documentosLigacoes;
        private IEquipamentoComponenteRepository _equipamentosComponentes;
        private IEquipamentoCaracteristicaRepository _equipamentosCaracteristicas;
        private IEquipamentoChamadoRepository _equipamentosChamados;
        private ITipoValaRepository _tiposVala;
        private IParametroClienteRepository _parametrosClientes;

        private IAtendimentoChamadoRepository _atendimentosChamados;
        private IAtendimentoGrupoRepository _atendimentosGrupos;
        private IAtendimentoCampoRepository _atendimentosCampos;
        private IAtendimentoPassoRepository _atendimentosPassos;
        private ICampoRepository _campos;
        private IChamadoRepository _chamados;
        private IDadoPedidoRepository _dadosPedidos;
        private IDadoProprietarioRepository _dadosProprietarios;
        private ILancaServicoRepository _lancaServicos;
        private ILancaServicoEventoRepository _lancaServicosEventos;
        private IListaOpcaoRepository _listaOpcoes;
        private ILocalizacaoVazamentoRepository _localizacoesVazamentos;
        private IMaterialEventoRepository _materiaisEventos;
        private IOrdemServicoRepository _ordensServico;
        private IPassoRepository _passos;
        private IServicoGrupoRepository _servicosGrupos;
        private ISetorAbastecimentoRepository _setoresAbastecimento;
        private ITerceiroRepository _terceiros;
        private ITipoChamadoRepository _tiposChamado;
        private ITipoChamadoCampoRepository _tiposChamadosCampos;
        private ITipoChamadoPassoRepository _tiposChamadosPassos;
        private IValidacaoRepository _validacoes;
        private IValidacaoCampoTipoChamadoRepository _validacoesCamposTiposChamado;
        private IValidacaoCampoAtendimentoRepository _validacoesCamposAtendimentos;
        private IAtendimentoCampoRelacionadoRepository _atendimentosCamposRelacionados;
        private ITipoChamadoCampoRelacionadoRepository _tiposChamadoCamposRelacionados;
        private ITipoEquipamentoRepository _tiposEquipamentos;
        private ILogradouroComplementoRepository _logradourosComplementos;
        private IEquipamentoRepository _equipamentos;
        private IHistoricoOsRepository _historicosOs;
        private IHistoricoChamadoRepository _historicosChamados;
        private ITipoChamadoTipoChamadoRepository _tiposChamadoTiposChamado;
        private IValorPadraoRepository _valorPadrao;
        private IBuscaRepository _buscas;
        private IBuscaCampoRepository _buscasCampos;
        private IChamadoContaRepository _chamadosContas;
        private ITipoServicoCampoRepository _tiposServicosCampos;
        private ITipoServicoCampoRelacionadoRepository _tiposServicosCamposRelacionados;
        private ITipoServicoPassoRepository _tiposServicosPassos;
        private IValidacaoCampoTipoServicoRepository _validacoesCamposTiposServicos;
        private IEquipamentoEventoRepository _equipamentosEventos;
        private IArtigoEventoRepository _artigosEventos;
        private ITipoServicoTarefaRepository _tiposServicoTarefas;
        private ICampoColetorRepository _camposcoletores;
        private ITipoChamadoDeptoEncerrarRepository _tiposChamadosDeptosEncerrrar;
        private IFuncaoEventoRepository _funcoesEventos;
        private ITipoSinalizacaoRepository _tiposSinalizacoes;
        private ITipoChamadoCategoriaRepository _tiposChamadoCategorias;
        private IEquipeAreaRepository _equipesareas;
        private IEquipeServicoRepository _equipeServico;
        private ITipoRecursoRepository _tiposRecurso;
        private ITipoRecursoCampoRepository _tiposRecursosCampos;
        private ITipoRecursoCampoRelacionadoRepository _tiposRecursosCamposRelacionados;
        private ITipoRecursoPassoRepository _tiposRecursosPassos;
        private IValidacaoCampoTipoRecursoRepository _validacoesCamposTiposRecursos;
        private IGuiaRecolhimentoRepository _guiasRecolhimento;
        private ILocalizacaoCavaleteRepository _localizacaoCavaletes;
        private ILogradouroAreaRepository _logradourosAreas;
        private IEventoRepository _eventos;
        private IFuncionarioRepository _funcionarios;
        private IEventoTarefaRepository _eventosTarefas;
        private IServicoServicoRepository _servicosServicos;
        private IMaterialRepository _materiais;
        private IMaterialCaracteristicaRepository _materiaisCaracteristicas;
        private IOcorrenciaRepository _ocorrencias;
        private ITipoCondicaoRedeRepository _tiposCondicoesRedes;
        private ITipoDiametroRedeRepository _tiposDiametrosRedes;
        private ITipoMaterialRedeRepository _tiposMateriaisRedes;
        private ILocalizacaoRedeRepository _localizacoesRedes;
        private IMaoObraEventoRepository _maosObrasEventos;
        private IManobraDescargaEventoRepository _manobrasDescargasEventos;
        private IMaterialServicoRepository _materiaisServicos;
        private IParametroWebRepository _parametrosWeb;
        private ILeituraRepository _leituras;
        private IAtendimentoRepository _atendimentos;
        private IInformacaoAdicionalColetorRepository _informacaoAdicionaisColetor;
        private ITipoServicoDeptoEncerrarRepository _tiposServicosDeptosEncerrar;
        private ICepRepository _ceps;
        private ITipoLigacaoRepository _tiposLigacao;
        private ICondominioRepository _condominios;
        private ISubCondominioRepository _subCondominios;
        private IAtividadeRepository _atividades;
        private ILogradouroRepository _logradouros;
        private IOcorrenciaCidadaoRepository _ocorrenciasCidadao;
        private IBairroRepository _bairros;
        private IBairroLogradouroRepository _bairrosLogradouros;
        private ICepLogradouroRepository _cepsLogradouros;
        private ICategoriaLigacaoRepository _categoriasLigacao;
        private ILigacaoRepository _ligacoes;
        private IHidrometroLigacaoRepository _hidrometrosLigacoes;
        private IProprietarioRepository _proprietarios;
        private IHistoricoLigacaoRepository _historicosLigacoes;
        private ITipoOcorrenciaCidadaoRepository _tiposOcorrenciasCidadao;
        private IImovelRepository _imoveis;
        private IContaRepository _contas;
        private IParametroCebiRepository _parametrosCebi;
        private INivelMascaraRepository _niveisMascaras;
        private IContaRegistroRepository _contasRegistros;
        private ICodigoBarraRepository _codigosBarra;
        private ITipoCampoRepository _tiposCampos;
        private ITabelaRepository _tabelas;
        private ITerrenoRepository _terrenos;
        private IHistoricoHidrometroRepository _historicosHidrometros;
        private IServicoRepository _servicos;
        private IHistoricoCorteRepository _historicosCortes;
        private ICodigoRetencaoRepository _codigosRetencao;
        private ISituacaoHidrometroRepository _situacaoHidrometros;
        private ISituacaoLigacaoRepository _situacaoLigacoes;
        private ISituacaoEsgotoRepository _situacaoEsgotos;
        private IMotivoTrocaRepository _motivosTroca;
        private ITipoCorteRepository _tiposCorte;
        private ICodigoClassificacaoRepository _codigosClassificacao;
        private IHidrometroRepository _hidrometros;
        private ITabelaCriticaRepository _tabelaCriticas;
        private IHistoricoNotificacaoRepository _historicosNotificacoes;
        private IHistoricoNotificacaoCarneRepository _historicosNotificacoesCarnes;
        private ISituacaoHidrometroRepository _situacoesHidrometros;
        private IHistoricoCategoriaRepository _historicosCategorias;
        private ILigacaoFoneticaRepository _ligacoesFonetica;
        private ITrocaHidrometroRepository _trocasHidrometros;
        private ITipoNotificacaoRepository _tiposNotificacoes;
        private IFinalidadeNotificacaoRepository _finalidadesNotificacoes;
        private ILogradouroFoneticaRepository _logradourosFonetica;
        private IGrupoSSBRepository _gruposSSB;
        private ICaixaInspecaoEsgotoRepository _caixasInspecaoEsgoto;
        private ITipoLancamentoRepository _tiposLancamento;
        private IUsuarioRepository _usuarios;
        private ICarneParcelaRepository _carnesParcelas;
        private ICarneRepository _carnes;
        private ICarneServicoRepository _carnesServicos;
        private IArquivoColetorRepository _arquivosColetor;
        private IArquivoColetorEventoRepository _arquivosColetorEvento;
        private IArquivoColetorOrdemServicoRepository _arquivosColetorOrdemServico;
        private IListaOpcaoColetorRepository _listaOpcoesColetor;
        private IOpcaoListaColetorRepository _opcoesListaColetor;
        private ISetorAbastecimentoBairroRepository _setoresAbastecimentoBairro;
        private IOcorrenciaDeptoRepository _ocorrenciasDepto;
        private ILayoutDocumentoRepository _layoutsDocumentos;
        private IEventoValaRepository _eventosValas;
        private ICampoTipoRecursoRepository _campoTipoRecurso;
        private ITipoResponsavelRepository _tiposResponsaveis;
        private IEventoObservacaoRepository _eventoObservacao;
        private IEventoAndamentoRepository _eventoAndamento;
        private ISetorRepository _setor;
        private IBairroLoteamentoRepository _bairrosLoteamentos;
        private ILoteamentoRepository _loteamentos;
        private IMotivoCancelamentoOcorrenciaRepository _motivosCancelamentoOcorrencia;
        private IImobiliariaRepository _imobiliarias;
        private IImobiliariaLigacaoRepository _imobiliariasLigacao;
        private IRedeAguaRepository _redeAgua;
        private IRedeEsgotoRepository _redeEsgoto;
        private IZonaAbastecimentoSsbRepository _zonaAbastecimentoSsb;

        private IPavimentacaoLeitoRepository _pavimentacoesLeito;
        private IPavimentacaoPasseioRepository _pavimentacoesPasseio;
        private ITipoChamadoCampoRegraCampoRepository _tiposChamadoCamposRegrasCampos;
        private ITipoChamadoCampoRegraRepository _tiposChamadoCamposRegras;

        private IEstadoCivilRepository _estadosCivil;
        private IRegiaoRepository _regioes;

        private IResponsabilidadeRepository _responsabilidade;
        private IModuloClienteRepository _moduloCliente;
        private IPessoaFisJurRepository _pessoaFisJur;
        private IPessoaEntregaRepository _pessoaEntrega;
        private IDocumentosPessoaRepository _documentoPessoa;
        private ITiposChamadoServicoRepository _tipoChamadoServico;
        private ICronogramaServicoAtivarRepository _cronogramasServicosAtivar;
        private IFeriadoRepository _feriados;

        public AtendimentoUnitOfWork() : base(new AtendimentoContext())
        {
            _context = (AtendimentoContext)base.Context;
        }
        public ITipoChamadoCampoRegraCampoRepository TiposChamadoCamposRegrasCampos
        {
            get
            {
                if (_tiposChamadoCamposRegrasCampos == null)
                {
                    _tiposChamadoCamposRegrasCampos = new TipoChamadoCampoRegraCampoRepository(_context);
                }

                return _tiposChamadoCamposRegrasCampos;
            }
        }

        public IEventosBaixasColetorRepository EventosBaixasColetor
        {
            get
            {
                if(_eventosBaixasColetor == null)
                {
                    _eventosBaixasColetor = new EventosBaixasColetorRepository(_context);
                }
                return _eventosBaixasColetor;
            }
        }
        public ISubCondominioRepository SubCondominios
        {
            get
            {
                if (_subCondominios == null)
                {
                    _subCondominios = new SubCondominioRepository(_context);
                }

                return _subCondominios;
            }
        }

        public IEquipeCoordenadasRepository EquipeCoordenadas
        {
            get
            {
                if (_equipeCoordenadas == null)
                {
                    _equipeCoordenadas= new EquipeCoordenadasRepository(_context);
                }

                return _equipeCoordenadas;
            }
        }

        public IZonaAbastecimentoSsbRepository   ZonasAbastecimentoSsb
        {
            get
            {
                if (_zonaAbastecimentoSsb == null)
                {
                    _zonaAbastecimentoSsb = new ZonaAbastecimentoSsbRepository(_context);
                }

                return _zonaAbastecimentoSsb;
            }
        }
        public IRedeEsgotoRepository RedesEsgoto
        {
            get
            {
                if (_redeEsgoto == null)
                {
                    _redeEsgoto = new RedeEsgotoRepository(_context);
                }

                return _redeEsgoto;
            }
        }

        public IRedeAguaRepository RedesAgua
        {
            get
            {
                if (_redeAgua == null)
                {
                    _redeAgua = new RedeAguaRepository(_context);
                }

                return _redeAgua;
            }
        }

        public ITipoChamadoCampoRegraRepository TiposChamadoCamposRegras
        {
            get
            {
                if (_tiposChamadoCamposRegras == null)
                {
                    _tiposChamadoCamposRegras = new TipoChamadoCampoRegraRepository(_context);
                }

                return _tiposChamadoCamposRegras;
            }
        }
        public IParametroClienteRepository ParametrosClientes
        {
            get
            {
                if (_parametrosClientes == null)
                {
                    _parametrosClientes = new ParametroClienteRepository(_context);
                }

                return _parametrosClientes;
            }
        }
        public IMotivoCancelamentoOcorrenciaRepository MotivosCancelamentoOcorrencia
        {
            get
            {
                if (_motivosCancelamentoOcorrencia == null)
                {
                    _motivosCancelamentoOcorrencia = new MotivoCancelamentoOcorrenciaRepository(_context);
                }

                return _motivosCancelamentoOcorrencia;
            }
        }

        public ITipoResponsavelRepository TiposResponsaveis
        {
            get
            {
                if (_tiposResponsaveis == null)
                {
                    _tiposResponsaveis = new TipoResponsavelRepository(_context);
                }

                return _tiposResponsaveis;
            }
        }

        public ILayoutDocumentoRepository LayoutsDocumentos
        {
            get
            {
                if (_layoutsDocumentos == null)
                {
                    _layoutsDocumentos = new LayoutDocumentoRepository(_context);
                }

                return _layoutsDocumentos;
            }
        }

        public IOcorrenciaDeptoRepository OcorrenciasDepto
        {
            get
            {
                if (_ocorrenciasDepto == null)
                {
                    _ocorrenciasDepto = new OcorrenciaDeptoRepository(_context);
                }

                return _ocorrenciasDepto;
            }
        }

        public ISetorAbastecimentoBairroRepository SetoresAbastecimentoBairro
        {
            get
            {
                if (_setoresAbastecimentoBairro == null)
                {
                    _setoresAbastecimentoBairro = new SetorAbastecimentoBairroRepository(_context);
                }

                return _setoresAbastecimentoBairro;
            }
        }

        public IListaOpcaoColetorRepository ListaOpcoesColetor
        {
            get
            {
                if (_listaOpcoesColetor == null)
                {
                    _listaOpcoesColetor = new ListaOpcaoColetorRepository(_context);
                }

                return _listaOpcoesColetor;
            }
        }

        public IOpcaoListaColetorRepository OpcoesListaColetor
        {
            get
            {
                if (_opcoesListaColetor == null)
                {
                    _opcoesListaColetor = new OpcaoListaColetorRepository(_context);
                }

                return _opcoesListaColetor;
            }
        }

        public IArquivoColetorRepository ArquivosColetor
        {
            get
            {
                if (_arquivosColetor == null)
                {
                    _arquivosColetor = new ArquivoColetorRepository(_context);
                }

                return _arquivosColetor;
            }
        }

        public IArquivoColetorEventoRepository ArquivosColetorEvento
        {
            get
            {
                if (_arquivosColetorEvento == null)
                {
                    _arquivosColetorEvento = new ArquivoColetorEventoRepository(_context);
                }

                return _arquivosColetorEvento;
            }
        }

        public IArquivoColetorOrdemServicoRepository ArquivosColetorOrdemServico
        {
            get
            {
                if (_arquivosColetorOrdemServico == null)
                {
                    _arquivosColetorOrdemServico = new ArquivoColetorOrdemServicoRepository(_context);
                }

                return _arquivosColetorOrdemServico;
            }
        }

        public ICarneRepository Carnes
        {
            get
            {
                if (_carnes == null)
                {
                    _carnes = new CarneRepository(_context);
                }

                return _carnes;
            }
        }

        public ICarneParcelaRepository CarnesParcelas
        {
            get
            {
                if (_carnesParcelas == null)
                {
                    _carnesParcelas = new CarneParcelaRepository(_context);
                }

                return _carnesParcelas;
            }
        }

        public ITipoLancamentoRepository TiposLancamento
        {
            get
            {
                if (_tiposLancamento == null)
                {
                    _tiposLancamento = new TipoLancamentoRepository(_context);
                }

                return _tiposLancamento;
            }
        }

        public ICaixaInspecaoEsgotoRepository CaixasInspecaoEsgoto
        {
            get
            {
                if (_caixasInspecaoEsgoto == null)
                {
                    _caixasInspecaoEsgoto = new CaixaInspecaoEsgotoRepository(_context);
                }

                return _caixasInspecaoEsgoto;
            }
        }

        public IGrupoSSBRepository GruposSSB
        {
            get
            {
                if (_gruposSSB == null)
                {
                    _gruposSSB = new GrupoSSBRepository(_context);
                }

                return _gruposSSB;
            }
        }

        public ILogradouroFoneticaRepository LogradourosFonetica
        {
            get
            {
                if (_logradourosFonetica == null)
                {
                    _logradourosFonetica = new LogradouroFoneticaRepository(_context);
                }

                return _logradourosFonetica;
            }
        }

        public IFinalidadeNotificacaoRepository FinalidadesNotificacoes
        {
            get
            {
                if (_finalidadesNotificacoes == null)
                {
                    _finalidadesNotificacoes = new FinalidadeNotificacaoRepository(_context);
                }

                return _finalidadesNotificacoes;
            }
        }

        public ITipoNotificacaoRepository TiposNotificacoes
        {
            get
            {
                if (_tiposNotificacoes == null)
                {
                    _tiposNotificacoes = new TipoNotificacaoRepository(_context);
                }

                return _tiposNotificacoes;
            }
        }

        public ITrocaHidrometroRepository TrocasHidrometros
        {
            get
            {
                if (_trocasHidrometros == null)
                {
                    _trocasHidrometros = new TrocaHidrometroRepository(_context);
                }

                return _trocasHidrometros;
            }
        }

        public IOrdensServicoColetorRepository OrdensServicoColetor
        {
            get
            {
                if(_ordensServicoColetor == null)
                {
                    _ordensServicoColetor = new OrdensServicoColetorRepository(_context);
                }
                return _ordensServicoColetor;
            }
        }
        public ILigacaoFoneticaRepository LigacoesFonetica
        {
            get
            {
                if (_ligacoesFonetica == null)
                {
                    _ligacoesFonetica = new LigacaoFoneticaRepository(_context);
                }

                return _ligacoesFonetica;
            }
        }

        public IHistoricoCategoriaRepository HistoricosCategorias
        {
            get
            {
                if (_historicosCategorias == null)
                {
                    _historicosCategorias = new HistoricoCategoriaRepository(_context);
                }

                return _historicosCategorias;
            }
        }

        public ISituacaoHidrometroRepository SituacoesHidrometros
        {
            get
            {
                if (_situacoesHidrometros == null)
                {
                    _situacoesHidrometros = new SituacaoHidrometroRepository(_context);
                }

                return _situacoesHidrometros;
            }
        }

        public IHistoricoNotificacaoRepository HistoricosNotificacoes
        {
            get
            {
                if (_historicosNotificacoes == null)
                {
                    _historicosNotificacoes = new HistoricoNotificacaoRepository(_context);
                }

                return _historicosNotificacoes;
            }
        }

        public IHistoricoNotificacaoCarneRepository HistoricosNotificacoesCarnes
        {
            get
            {
                if (_historicosNotificacoesCarnes == null)
                {
                    _historicosNotificacoesCarnes = new HistoricoNotificacaoCarneRepository(_context);
                }

                return _historicosNotificacoesCarnes;
            }
        }

        public ITabelaCriticaRepository TabelaCriticas
        {
            get
            {
                if (_tabelaCriticas == null)
                {
                    _tabelaCriticas = new TabelaCriticaRepository(_context);
                }

                return _tabelaCriticas;
            }
        }

        public IHidrometroRepository Hidrometros
        {
            get
            {
                if (_hidrometros == null)
                {
                    _hidrometros = new HidrometroRepository(_context);
                }

                return _hidrometros;
            }
        }

        public ICodigoClassificacaoRepository CodigosClassificacao
        {
            get
            {
                if (_codigosClassificacao == null)
                {
                    _codigosClassificacao = new CodigoClassificacaoRepository(_context);
                }

                return _codigosClassificacao;
            }
        }

        public ITipoCorteRepository TiposCorte
        {
            get
            {
                if (_tiposCorte == null)
                {
                    _tiposCorte = new TipoCorteRepository(_context);
                }

                return _tiposCorte;
            }
        }

        public IMotivoTrocaRepository MotivosTroca
        {
            get
            {
                if (_motivosTroca == null)
                {
                    _motivosTroca = new MotivoTrocaRepository(_context);
                }

                return _motivosTroca;
            }
        }

        public ISituacaoEsgotoRepository SituacaoEsgotos
        {
            get
            {
                if (_situacaoEsgotos == null)
                {
                    _situacaoEsgotos = new SituacaoEsgotoRepository(_context);
                }

                return _situacaoEsgotos;
            }
        }

        public ISituacaoLigacaoRepository SituacaoLigacoes
        {
            get
            {
                if (_situacaoLigacoes == null)
                {
                    _situacaoLigacoes = new SituacaoLigacaoRepository(_context);
                }

                return _situacaoLigacoes;
            }
        }

        public ISituacaoHidrometroRepository SituacaoHidrometros
        {
            get
            {
                if (_situacaoHidrometros == null)
                {
                    _situacaoHidrometros = new SituacaoHidrometroRepository(_context);
                }

                return _situacaoHidrometros;
            }
        }

        public IAreaManutencaoRepository AreasManutencao
        {
            get
            {
                if (_areasManutencao == null)
                {
                    _areasManutencao = new AreaManutencaoRepository(_context);
                }

                return _areasManutencao;
            }
        }

        public IArtigoRepository Artigos
        {
            get
            {
                if (_artigos == null)
                {
                    _artigos = new ArtigoRepository(_context);
                }

                return _artigos;
            }
        }

        public ICaracteristicaRepository Caracteristicas
        {
            get
            {
                if (_caracteristicas == null)
                {
                    _caracteristicas = new CaracteristicaRepository(_context);
                }

                return _caracteristicas;
            }
        }

        public IEquipeRepository Equipes
        {
            get
            {
                if (_equipes == null)
                {
                    _equipes = new EquipeRepository(_context);
                }

                return _equipes;
            }
        }

        public IFuncaoRepository Funcoes
        {
            get
            {
                if (_funcoes == null)
                {
                    _funcoes = new FuncaoRepository(_context);
                }

                return _funcoes;
            }
        }

        public IIntensidadeRepository Intensidades
        {
            get
            {
                if (_intensidades == null)
                {
                    _intensidades = new IntensidadeRepository(_context);
                }

                return _intensidades;
            }
        }


        public ILocalizacaoVazamentoRepository LocalizacaoVazamentos
        {
            get
            {
                if (_localizacaoVazamentos == null)
                {
                    _localizacaoVazamentos = new LocalizacaoVazamentoRepository(_context);
                }

                return _localizacaoVazamentos;
            }
        }

        public ISolicitanteRepository Solicitantes
        {
            get
            {
                if (_solicitantes == null)
                {
                    _solicitantes = new SolicitanteRepository(_context);
                }

                return _solicitantes;
            }
        }

        public ITipoEquipamentoSGSRepository TiposEquipamentosSGS
        {
            get
            {
                if (_tiposEquipamentosSGS == null)
                {
                    _tiposEquipamentosSGS = new TipoEquipamentoSGSRepository(_context);
                }

                return _tiposEquipamentosSGS;
            }
        }

        public ITipoOcorrenciaTelemetriaRepository TiposOcorrenciasTelemetrias
        {
            get
            {
                if (_tiposOcorrenciasTelemetrias == null)
                {
                    _tiposOcorrenciasTelemetrias = new TipoOcorrenciaTelemetriaRepository(_context);
                }

                return _tiposOcorrenciasTelemetrias;
            }
        }

        public ITipoPavimentoRepository TiposPavimentos
        {
            get
            {
                if (_tiposPavimentos == null)
                {
                    _tiposPavimentos = new TipoPavimentoRepository(_context);
                }

                return _tiposPavimentos;
            }
        }

        public ITipoPrioridadeEquipamentoRepository TiposPrioridadesEquipamentos
        {
            get
            {
                if (_tiposPrioridadesEquipamentos == null)
                {
                    _tiposPrioridadesEquipamentos = new TipoPrioridadeEquipamentoRepository(_context);
                }

                return _tiposPrioridadesEquipamentos;
            }
        }

        public IGrupoServicoRepository GruposServicos
        {
            get
            {
                if (_gruposServicos == null)
                {
                    _gruposServicos = new GrupoServicoRepository(_context);
                }

                return _gruposServicos;
            }
        }

        public ITipoSinalizacaoRepository TiposSinalizacao
        {
            get
            {
                if (_tiposSinalizacao == null)
                {
                    _tiposSinalizacao = new TipoSinalizacaoRepository(_context);
                }

                return _tiposSinalizacao;
            }
        }

        public ICentroCustoServicoNovoRepository CentroCustoServicoNovos
        {
            get
            {
                if (_centroCustoServicoNovos == null)
                {
                    _centroCustoServicoNovos = new CentroCustoServicoNovoRepository(_context);
                }

                return _centroCustoServicoNovos;
            }
        }

        public ICampoColetorRepository CamposColetor
        {
            get
            {
                if (_camposColetor == null)
                {
                    _camposColetor = new CampoColetorRepository(_context);
                }

                return _camposColetor;
            }
        }

        public ITipoServicoCampoColetorRepository TiposServicoCamposColetor
        {
            get
            {
                if (_tiposServicoCamposColetor == null)
                {
                    _tiposServicoCamposColetor = new TipoServicoCampoColetorRepository(_context);
                }

                return _tiposServicoCamposColetor;
            }
        }

        public IMoedaRepository Moedas
        {
            get
            {
                if (_moedas == null)
                {
                    _moedas = new MoedaRepository(_context);
                }

                return _moedas;
            }
        }

        public ITipoChamadoCategoriaRepository TipoChamadoCategorias
        {
            get
            {
                if (_tipoChamadoCategorias == null)
                {
                    _tipoChamadoCategorias = new TipoChamadoCategoriaRepository(_context);
                }

                return _tipoChamadoCategorias;
            }
        }

        public IAtendimentoChamadoRepository AtendimentoChamados
        {
            get
            {
                if (_atendimentoChamados == null)
                {
                    _atendimentoChamados = new AtendimentoChamadoRepository(_context);
                }

                return _atendimentoChamados;
            }
        }

        public ITipoChamadoRepository TiposChamados
        {
            get
            {
                if (_tiposChamados == null)
                {
                    _tiposChamados = new TipoChamadoRepository(_context);
                }

                return _tiposChamados;
            }
        }

        public ITipoChamadoDeptoEncRepository TiposChamadosDeptosEnc
        {
            get
            {
                if (_tiposChamadosDeptosEnc == null)
                {
                    _tiposChamadosDeptosEnc = new TipoChamadoDeptoEncRepository(_context);
                }

                return _tiposChamadosDeptosEnc;
            }
        }

        public ITipoChamadoTipoChamadoRepository TiposChamadosTiposChamados
        {
            get
            {
                if (_tiposChamadosTiposChamados == null)
                {
                    _tiposChamadosTiposChamados = new TipoChamadoTipoChamadoRepository(_context);
                }

                return _tiposChamadosTiposChamados;
            }
        }

        public IServicoGrupoRepository ServicoGrupos
        {
            get
            {
                if (_servicoGrupos == null)
                {
                    _servicoGrupos = new ServicoGrupoRepository(_context);
                }

                return _servicoGrupos;
            }
        }

        public ICentroCustoRepository CentrosCusto
        {
            get
            {
                if (_centrosCusto == null)
                {
                    _centrosCusto = new CentroCustoRepository(_context);
                }

                return _centrosCusto;
            }
        }

        public IGrupoRepository Grupos
        {
            get
            {
                if (_grupos == null)
                {
                    _grupos = new GrupoRepository(_context);
                }

                return _grupos;
            }
        }

        public ICategoriaRepository Categorias
        {
            get
            {
                if (_categorias == null)
                {
                    _categorias = new CategoriaRepository(_context);
                }

                return _categorias;
            }
        }

        public ICentroReservacaoRepository CentrosReservacao
        {
            get
            {
                if (_centrosReservacao == null)
                {
                    _centrosReservacao = new CentroReservacaoRepository(_context);
                }

                return _centrosReservacao;
            }
        }

        public IDesignativoRepository Designativos
        {
            get
            {
                if (_designativos == null)
                {
                    _designativos = new DesignativoRepository(_context);
                }

                return _designativos;
            }
        }

        public IPesquisaRepository Pesquisas
        {
            get
            {
                if (_pesquisas == null)
                {
                    _pesquisas = new PesquisaRepository(_context);
                }

                return _pesquisas;
            }
        }

        public ITipoEscavacaoRepository TiposEscavacao
        {
            get
            {
                if (_tiposEscavacao == null)
                {
                    _tiposEscavacao = new TipoEscavacaoRepository(_context);
                }

                return _tiposEscavacao;
            }
        }

        public ITipoExecucaoRepository TiposExecucao
        {
            get
            {
                if (_tiposExecucao == null)
                {
                    _tiposExecucao = new TipoExecucaoRepository(_context);
                }

                return _tiposExecucao;
            }
        }

        public ITipoRecusaVistoriaRepository TiposRecusasVistorias
        {
            get
            {
                if (_tiposRecusasVistorias == null)
                {
                    _tiposRecusasVistorias = new TipoRecusaVistoriaRepository(_context);
                }

                return _tiposRecusasVistorias;
            }
        }

        public ITipoRegistroRepository TiposRegistros
        {
            get
            {
                if (_tiposRegistros == null)
                {
                    _tiposRegistros = new TipoRegistroRepository(_context);
                }

                return _tiposRegistros;
            }
        }

        public IUnidadeRepository Unidades
        {
            get
            {
                if (_unidades == null)
                {
                    _unidades = new UnidadeRepository(_context);
                }

                return _unidades;
            }
        }

        public IViaturaRepository Viaturas
        {
            get
            {
                if (_viaturas == null)
                {
                    _viaturas = new ViaturaRepository(_context);
                }

                return _viaturas;
            }
        }

        public IZonaAbastecimentoRepository ZonasAbastecimento
        {
            get
            {
                if (_zonasAbastecimento == null)
                {
                    _zonasAbastecimento = new ZonaAbastecimentoRepository(_context);
                }

                return _zonasAbastecimento;
            }
        }

        public ITipoServicoRepository TiposServicos
        {
            get
            {
                if (_tipoServicos == null)
                {
                    _tipoServicos = new TipoServicoRepository(_context);
                }

                return _tipoServicos;
            }
        }

        public IFuncionarioRepository Funcionario
        {
            get
            {
                if (_funcionario == null)
                {
                    _funcionario = new FuncionarioRepository(_context);
                }

                return _funcionario;
            }
        }

        public ITarefaRepository Tarefas
        {
            get
            {
                if (_tarefas == null)
                {
                    _tarefas = new TarefaRepository(_context);
                }

                return _tarefas;
            }
        }

        public ITipoServicoTarefaRepository TiposServicosTarefas
        {
            get
            {
                if (_tiposServicosTarefas == null)
                {
                    _tiposServicosTarefas = new TipoServicoTarefaRepository(_context);
                }

                return _tiposServicosTarefas;
            }
        }

        public IAtendimentoGrupoRepository AtendimentoGrupos
        {
            get
            {
                if (_atendimentoGrupos == null)
                {
                    _atendimentoGrupos = new AtendimentoGrupoRepository(_context);
                }

                return _atendimentoGrupos;
            }
        }

        public ISituacaoAguaRepository SituacaoAguas
        {
            get
            {
                if (_situacaoAguas == null)
                {
                    _situacaoAguas = new SituacaoAguaRepository(_context);
                }

                return _situacaoAguas;
            }
        }

        public ITipoCorteRepository TiposCortes
        {
            get
            {
                if (_tiposCortes == null)
                {
                    _tiposCortes = new TipoCorteRepository(_context);
                }

                return _tiposCortes;
            }
        }

        public ITipoLacreRepository TiposLacres
        {
            get
            {
                if (_tiposLacres == null)
                {
                    _tiposLacres = new TipoLacreRepository(_context);
                }

                return _tiposLacres;
            }
        }

        public ITipoChamadoTipoServicoRepository TiposChamadoTiposServico
        {
            get
            {
                if (_tiposChamadoTiposServico == null)
                {
                    _tiposChamadoTiposServico = new TipoChamadoTipoServicoRepository(_context);
                }

                return _tiposChamadoTiposServico;
            }
        }

        public ICronogramaRepository Cronogramas
        {
            get
            {
                if (_cronogramas == null)
                {
                    _cronogramas = new CronogramaRepository(_context);
                }

                return _cronogramas;
            }

        }

        public IDocumentoLigacaoRepository DocumentosLigacoes
        {
            get
            {
                if (_documentosLigacoes == null)
                {
                    _documentosLigacoes = new DocumentoLigacaoRepository(_context);
                }

                return _documentosLigacoes;
            }
        }

        public ICodigoRetencaoRepository CodigosRetencao
        {
            get
            {
                if (_codigosRetencao == null)
                {
                    _codigosRetencao = new CodigoRetencaoRepository(_context);
                }

                return _codigosRetencao;
            }
        }

        public IHistoricoCorteRepository HistoricosCortes
        {
            get
            {
                if (_historicosCortes == null)
                {
                    _historicosCortes = new HistoricoCorteRepository(_context);
                }

                return _historicosCortes;
            }
        }

        public IServicoRepository Servicos
        {
            get
            {
                if (_servicos == null)
                {
                    _servicos = new ServicoRepository(_context);
                }

                return _servicos;
            }
        }

        public IHistoricoHidrometroRepository HistoricoHidrometros
        {
            get
            {
                if (_historicosHidrometros == null)
                {
                    _historicosHidrometros = new HistoricoHidrometroRepository(_context);
                }

                return _historicosHidrometros;
            }
        }

        public ITerrenoRepository Terrenos
        {
            get
            {
                if (_terrenos == null)
                {
                    _terrenos = new TerrenoRepository(_context);
                }

                return _terrenos;
            }
        }

        public ITabelaRepository Tabelas
        {
            get
            {
                if (_tabelas == null)
                {
                    _tabelas = new TabelaRepository(_context);
                }

                return _tabelas;
            }
        }

        public ITipoCampoRepository TiposCampos
        {
            get
            {
                if (_tiposCampos == null)
                {
                    _tiposCampos = new TipoCampoRepository(_context);
                }

                return _tiposCampos;
            }
        }

        public ICodigoBarraRepository CodigoBarras
        {
            get
            {
                if (_codigosBarra == null)
                {
                    _codigosBarra = new CodigoBarraRepository(_context);
                }

                return _codigosBarra;
            }
        }

        public IContaRegistroRepository ContasRegistros
        {
            get
            {
                if (_contasRegistros == null)
                {
                    _contasRegistros = new ContaRegistroRepository(_context);
                }

                return _contasRegistros;
            }
        }

        public ITipoOcorrenciaRepository TiposOcorrencias
        {
            get
            {
                if (_tiposOcorrencias == null)
                {
                    _tiposOcorrencias = new TipoOcorrenciaRepository(_context);
                }

                return _tiposOcorrencias;
            }
        }

        public INivelMascaraRepository NiveisMascaras
        {
            get
            {
                if (_niveisMascaras == null)
                {
                    _niveisMascaras = new NivelMascaraRepository(_context);
                }

                return _niveisMascaras;
            }
        }

        public IParametroCebiRepository ParametrosCebi
        {
            get
            {
                if (_parametrosCebi == null)
                {
                    _parametrosCebi = new ParametroCebiRepository(_context);
                }

                return _parametrosCebi;
            }
        }

        public IImovelRepository Imoveis
        {
            get
            {
                if (_imoveis == null)
                {
                    _imoveis = new ImovelRepository(_context);
                }

                return _imoveis;
            }
        }

        public ITipoOcorrenciaCidadaoRepository TiposOcorrenciasCidadao
        {
            get
            {
                if (_tiposOcorrenciasCidadao == null)
                {
                    _tiposOcorrenciasCidadao = new TipoOcorrenciaCidadaoRepository(_context);
                }

                return _tiposOcorrenciasCidadao;
            }
        }

        public IMaterialRepository Materiais
        {
            get
            {
                if (_materiais == null)
                {
                    _materiais = new MaterialRepository(_context);
                }

                return _materiais;
            }
        }

        public IMaterialCaracteristicaRepository MateriaisCaracteristicas
        {
            get
            {
                if (_materiaisCaracteristicas == null)
                {
                    _materiaisCaracteristicas = new MaterialCaracteristicaRepository(_context);
                }

                return _materiaisCaracteristicas;
            }
        }

        public IHistoricoLigacaoRepository HistoricosLigacoes
        {
            get
            {
                if (_historicosLigacoes == null)
                {
                    _historicosLigacoes = new HistoricoLigacaoRepository(_context);
                }

                return _historicosLigacoes;
            }
        }

        public IProprietarioRepository Proprietarios
        {
            get
            {
                if (_proprietarios == null)
                {
                    _proprietarios = new ProprietarioRepository(_context);
                }

                return _proprietarios;
            }
        }

        public IHidrometroLigacaoRepository HidrometrosLigacoes
        {
            get
            {
                if (_hidrometrosLigacoes == null)
                {
                    _hidrometrosLigacoes = new HidrometroLigacaoRepository(_context);
                }

                return _hidrometrosLigacoes;
            }
        }

        public ILigacaoRepository Ligacoes
        {
            get
            {
                if (_ligacoes == null)
                {
                    _ligacoes = new LigacaoRepository(_context);
                }

                return _ligacoes;
            }
        }

        public ICategoriaLigacaoRepository CategoriasLigacao
        {
            get
            {
                if (_categoriasLigacao == null)
                {
                    _categoriasLigacao = new CategoriaLigacaoRepository(_context);
                }

                return _categoriasLigacao;
            }
        }

        public ICepLogradouroRepository CepsLogradouros
        {
            get
            {
                if (_cepsLogradouros == null)
                {
                    _cepsLogradouros = new CepLogradouroRepository(_context);
                }

                return _cepsLogradouros;
            }
        }

        public IBairroRepository Bairros
        {
            get
            {
                if (_bairros == null)
                {
                    _bairros = new BairroRepository(_context);
                }

                return _bairros;
            }
        }

        public IBairroLogradouroRepository BairrosLogradouros
        {
            get
            {
                if (_bairrosLogradouros == null)
                {
                    _bairrosLogradouros = new BairroLogradouroRepository(_context);
                }

                return _bairrosLogradouros;
            }
        }

        public IOcorrenciaCidadaoRepository OcorrenciasCidadao
        {
            get
            {
                if (_ocorrenciasCidadao == null)
                {
                    _ocorrenciasCidadao = new OcorrenciaCidadaoRepository(_context);
                }

                return _ocorrenciasCidadao;
            }
        }

        public ILogradouroRepository Logradouros
        {
            get
            {
                if (_logradouros == null)
                {
                    _logradouros = new LogradouroRepository(_context);
                }

                return _logradouros;
            }
        }

        public IAtividadeRepository Atividades
        {
            get
            {
                if (_atividades == null)
                {
                    _atividades = new AtividadeRepository(_context);
                }

                return _atividades;
            }
        }

        public ICondominioRepository Condominios
        {
            get
            {
                if (_condominios == null)
                {
                    _condominios = new CondominioRepository(_context);
                }

                return _condominios;
            }
        }

        public ITipoLigacaoRepository TiposLigacao
        {
            get
            {
                if (_tiposLigacao == null)
                {
                    _tiposLigacao = new TipoLigacaoRepository(_context);
                }

                return _tiposLigacao;
            }
        }

        public ILocalizacaoCavaleteRepository LocalizacoesCavalete
        {
            get
            {
                if (_localizacaoCavaletes == null)
                {
                    _localizacaoCavaletes = new LocalizacaoCavaleteRepository(_context);
                }

                return _localizacaoCavaletes;
            }
        }

        public ICepRepository Ceps
        {
            get
            {
                if (_ceps == null)
                {
                    _ceps = new CepRepository(_context);
                }

                return _ceps;
            }
        }

        public ILeituraRepository Leituras
        {
            get
            {
                if (_leituras == null)
                {
                    _leituras = new LeituraRepository(_context);
                }

                return _leituras;
            }
        }

        public IGuiaRecolhimentoRepository GuiasRecolhimento
        {
            get
            {
                if (_guiasRecolhimento == null)
                {
                    _guiasRecolhimento = new GuiaRecolhimentoRepository(_context);
                }

                return _guiasRecolhimento;
            }
        }

        public IParametroWebRepository ParametrosWeb
        {
            get
            {
                if (_parametrosWeb == null)
                {
                    _parametrosWeb = new ParametroWebRepository(_context);
                }

                return _parametrosWeb;
            }
        }
        public IInformacaoAdicionalColetorRepository InformacaoAdicionaisColetor
        {
            get
            {
                if (_informacaoAdicionaisColetor == null)
                {
                    _informacaoAdicionaisColetor = new InformacaoAdicionalColetorRepository(_context);
                }

                return _informacaoAdicionaisColetor;
            }
        }

        public ITipoServicoDeptoEncerrarRepository TiposServicosDeptosEncerrar
        {
            get
            {
                if (_tiposServicosDeptosEncerrar == null)
                {
                    _tiposServicosDeptosEncerrar = new TipoServicoDeptoEncerrarRepository(_context);
                }

                return _tiposServicosDeptosEncerrar;
            }
        }

        public IAtendimentoRepository Atendimentos
        {
            get
            {
                if (_atendimentos == null)
                {
                    _atendimentos = new AtendimentoRepository(_context);
                }

                return _atendimentos;
            }
        }

        public IServicoServicoRepository ServicosServicos
        {
            get
            {
                if (_servicosServicos == null)
                {
                    _servicosServicos = new ServicoServicoRepository(_context);
                }

                return _servicosServicos;
            }
        }

        public IEventoTarefaRepository EventosTarefas
        {
            get
            {
                if (_eventosTarefas == null)
                {
                    _eventosTarefas = new EventoTarefaRepository(_context);
                }

                return _eventosTarefas;
            }
        }

        public IFuncionarioRepository Funcionarios
        {
            get
            {
                if (_funcionarios == null)
                {
                    _funcionarios = new FuncionarioRepository(_context);
                }

                return _funcionarios;
            }
        }

        public IEventoRepository Eventos
        {
            get
            {
                if (_eventos == null)
                {
                    _eventos = new EventoRepository(_context);
                }

                return _eventos;
            }
        }

        public ILogradouroAreaRepository LogradourosAreas
        {
            get
            {
                if (_logradourosAreas == null)
                {
                    _logradourosAreas = new LogradouroAreaRepository(_context);
                }

                return _logradourosAreas;
            }
        }


        public IMaoObraEventoRepository MaosObrasEventos
        {
            get
            {
                if (_maosObrasEventos == null)
                {
                    _maosObrasEventos = new MaoObraEventoRepository(_context);
                }

                return _maosObrasEventos;
            }
        }


        public IManobraDescargaEventoRepository ManobrasDescargasEventos
        {
            get
            {
                if (_manobrasDescargasEventos == null)
                {
                    _manobrasDescargasEventos = new ManobraDescargaEventoRepository(_context);
                }

                return _manobrasDescargasEventos;
            }
        }

        public IMaterialServicoRepository MateriaisServicos
        {
            get
            {
                if (_materiaisServicos == null)
                {
                    _materiaisServicos = new MaterialServicoRepository(_context);
                }

                return _materiaisServicos;
            }
        }

        public IAtendimentoRepository Atendimento
        {
            get
            {
                if (_atendimentos == null)
                {
                    _atendimentos = new AtendimentoRepository(_context);
                }

                return _atendimentos;
            }
        }

        public ILocalizacaoRedeRepository LocalizacaoRedes
        {
            get
            {
                if (_localizacoesRedes == null)
                {
                    _localizacoesRedes = new LocalizacaoRedeRepository(_context);
                }

                return _localizacoesRedes;
            }
        }

        public ITipoMaterialRedeRepository TiposMateriaisRedes
        {
            get
            {
                if (_tiposMateriaisRedes == null)
                {
                    _tiposMateriaisRedes = new TipoMaterialRedeRepository(_context);
                }

                return _tiposMateriaisRedes;
            }
        }


        public ITipoDiametroRedeRepository TiposDiametrosRedes
        {
            get
            {
                if (_tiposDiametrosRedes == null)
                {
                    _tiposDiametrosRedes = new TipoDiametroRedeRepository(_context);
                }

                return _tiposDiametrosRedes;
            }
        }

        public ITipoCondicaoRedeRepository TiposCondicoesRedes
        {
            get
            {
                if (_tiposCondicoesRedes == null)
                {
                    _tiposCondicoesRedes = new TipoCondicaoRedeRepository(_context);
                }

                return _tiposCondicoesRedes;
            }
        }

        public IOcorrenciaRepository Ocorrencias
        {
            get
            {
                if (_ocorrencias == null)
                {
                    _ocorrencias = new OcorrenciaRepository(_context);
                }

                return _ocorrencias;
            }
        }

        public IValorPadraoRepository ValoresPadrao
        {
            get
            {
                if (_valorPadrao == null)
                {
                    _valorPadrao = new ValorPadraoRepository(_context);
                }

                return _valorPadrao;
            }
        }

        public ITipoChamadoTipoServicoRepository TiposChamadosTiposServicos
        {
            get
            {
                if (_tiposChamadoTiposServico == null)
                {
                    _tiposChamadoTiposServico = new TipoChamadoTipoServicoRepository(_context);
                }

                return _tiposChamadoTiposServico;
            }
        }

        public ITipoEquipamentoRepository TiposEquipamentos
        {
            get
            {
                if (_tiposEquipamentos == null)
                {
                    _tiposEquipamentos = new TipoEquipamentoRepository(_context);
                }

                return _tiposEquipamentos;
            }
        }

        public IAtendimentoChamadoRepository AtendimentosChamados
        {
            get
            {
                if (_atendimentosChamados == null)
                {
                    _atendimentosChamados = new AtendimentoChamadoRepository(_context);
                }

                return _atendimentosChamados;
            }
        }

        public IAtendimentoGrupoRepository AtendimentosGrupos
        {
            get
            {
                if (_atendimentosGrupos == null)
                {
                    _atendimentosGrupos = new AtendimentoGrupoRepository(_context);
                }

                return _atendimentosGrupos;
            }
        }

        public IAtendimentoCampoRepository AtendimentosCampos
        {
            get
            {
                if (_atendimentosCampos == null)
                {
                    _atendimentosCampos = new AtendimentoCampoRepository(_context);
                }

                return _atendimentosCampos;
            }
        }

        public IAtendimentoPassoRepository AtendimentosPassos
        {
            get
            {
                if (_atendimentosPassos == null)
                {
                    _atendimentosPassos = new AtendimentoPassoRepository(_context);
                }

                return _atendimentosPassos;
            }
        }

        public ICampoRepository Campos
        {
            get
            {
                if (_campos == null)
                {
                    _campos = new CampoRepository(_context);
                }

                return _campos;
            }
        }

        public IChamadoRepository Chamados
        {
            get
            {
                if (_chamados == null)
                {
                    _chamados = new ChamadoRepository(_context);
                }

                return _chamados;
            }
        }

        public IDadoPedidoRepository DadosPedidos
        {
            get
            {
                if (_dadosPedidos == null)
                {
                    _dadosPedidos = new DadoPedidoRepository(_context);
                }

                return _dadosPedidos;
            }
        }

        public IDadoProprietarioRepository DadosProprietarios
        {
            get
            {
                if (_dadosProprietarios == null)
                {
                    _dadosProprietarios = new DadoProprietarioRepository(_context);
                }

                return _dadosProprietarios;
            }
        }

        public ILancaServicoRepository LancaServicos
        {
            get
            {
                if (_lancaServicos == null)
                {
                    _lancaServicos = new LancaServicoRepository(_context);
                }

                return _lancaServicos;
            }
        }

        public ILancaServicoEventoRepository LancaServicosEventos
        {
            get
            {
                if (_lancaServicosEventos == null)
                {
                    _lancaServicosEventos = new LancaServicoEventoRepository(_context);
                }

                return _lancaServicosEventos;
            }
        }

        public IListaOpcaoRepository ListaOpcoes
        {
            get
            {
                if (_listaOpcoes == null)
                {
                    _listaOpcoes = new ListaOpcaoRepository(_context);
                }

                return _listaOpcoes;
            }
        }

        public ILocalizacaoVazamentoRepository LocalizacoesVazamentos
        {
            get
            {
                if (_localizacoesVazamentos == null)
                {
                    _localizacoesVazamentos = new LocalizacaoVazamentoRepository(_context);
                }

                return _localizacoesVazamentos;
            }
        }

        public IMaterialEventoRepository MateriaisEventos
        {
            get
            {
                if (_materiaisEventos == null)
                {
                    _materiaisEventos = new MaterialEventoRepository(_context);
                }

                return _materiaisEventos;
            }
        }

        public IOrdemServicoRepository OrdensServico
        {
            get
            {
                if (_ordensServico == null)
                {
                    _ordensServico = new OrdemServicoRepository(_context);
                }

                return _ordensServico;
            }
        }

        public IPassoRepository Passos
        {
            get
            {
                if (_passos == null)
                {
                    _passos = new PassoRepository(_context);
                }

                return _passos;
            }
        }

        public IServicoGrupoRepository ServicosGrupos
        {
            get
            {
                if (_servicosGrupos == null)
                {
                    _servicosGrupos = new ServicoGrupoRepository(_context);
                }

                return _servicosGrupos;
            }
        }

        public ISetorAbastecimentoRepository SetoresAbastecimento
        {
            get
            {
                if (_setoresAbastecimento == null)
                {
                    _setoresAbastecimento = new SetorAbastecimentoRepository(_context);
                }

                return _setoresAbastecimento;
            }
        }

        public ITerceiroRepository Terceiros
        {
            get
            {
                if (_terceiros == null)
                {
                    _terceiros = new TerceiroRepository(_context);
                }

                return _terceiros;
            }
        }

        public ITipoChamadoRepository TiposChamado
        {
            get
            {
                if (_tiposChamado == null)
                {
                    _tiposChamado = new TipoChamadoRepository(_context);
                }

                return _tiposChamado;
            }
        }

        public ITipoChamadoCampoRepository TiposChamadosCampos
        {
            get
            {
                if (_tiposChamadosCampos == null)
                {
                    _tiposChamadosCampos = new TipoChamadoCampoRepository(_context);
                }

                return _tiposChamadosCampos;
            }
        }

        public ITipoChamadoPassoRepository TiposChamadosPassos
        {
            get
            {
                if (_tiposChamadosPassos == null)
                {
                    _tiposChamadosPassos = new TipoChamadoPassoRepository(_context);
                }

                return _tiposChamadosPassos;
            }
        }

        public IValidacaoRepository Validacoes
        {
            get
            {
                if (_validacoes == null)
                {
                    _validacoes = new ValidacaoRepository(_context);
                }

                return _validacoes;
            }
        }

        public IValidacaoCampoTipoChamadoRepository ValidacoesCamposTiposChamado
        {
            get
            {
                if (_validacoesCamposTiposChamado == null)
                {
                    _validacoesCamposTiposChamado = new ValidacaoCampoTipoChamadoRepository(_context);
                }

                return _validacoesCamposTiposChamado;
            }
        }

        public IValidacaoCampoAtendimentoRepository ValidacoesCamposAtendimentos
        {
            get
            {
                if (_validacoesCamposAtendimentos == null)
                {
                    _validacoesCamposAtendimentos = new ValidacaoCampoAtendimentoRepository(_context);
                }

                return _validacoesCamposAtendimentos;
            }
        }

        public IAtendimentoCampoRelacionadoRepository AtendimentosCamposRelacionados
        {
            get
            {
                if (_atendimentosCamposRelacionados == null)
                {
                    _atendimentosCamposRelacionados = new AtendimentoCampoRelacionadoRepository(_context);
                }

                return _atendimentosCamposRelacionados;
            }
        }

        public ITipoChamadoCampoRelacionadoRepository TiposChamadoCamposRelacionados
        {
            get
            {
                if (_tiposChamadoCamposRelacionados == null)
                {
                    _tiposChamadoCamposRelacionados = new TipoChamadoCampoRelacionadoRepository(_context);
                }

                return _tiposChamadoCamposRelacionados;
            }
        }

        public ILogradouroComplementoRepository LogradourosComplementos
        {
            get
            {
                if (_logradourosComplementos == null)
                {
                    _logradourosComplementos = new LogradouroComplementoRepository(_context);
                }

                return _logradourosComplementos;
            }
        }

        public IEquipamentoRepository Equipamentos
        {
            get
            {
                if (_equipamentos == null)
                {
                    _equipamentos = new EquipamentoRepository(_context);
                }

                return _equipamentos;
            }
        }

        public IHistoricoChamadoRepository HistoricosChamados
        {
            get
            {
                if (_historicosChamados == null)
                {
                    _historicosChamados = new HistoricoChamadoRepository(_context);
                }

                return _historicosChamados;
            }
        }

        public IHistoricoOsRepository HistoricosOs
        {
            get
            {
                if (_historicosOs == null)
                {
                    _historicosOs = new HistoricoOsRepository(_context);
                }

                return _historicosOs;
            }
        }

        public ITipoChamadoTipoChamadoRepository TiposChamadoTiposChamado
        {
            get
            {
                if (_tiposChamadoTiposChamado == null)
                {
                    _tiposChamadoTiposChamado = new TipoChamadoTipoChamadoRepository(_context);
                }

                return _tiposChamadoTiposChamado;
            }
        }

        public IBuscaRepository Buscas
        {
            get
            {
                if (_buscas == null)
                {
                    _buscas = new BuscaRepository(_context);
                }

                return _buscas;
            }
        }

        public IBuscaCampoRepository BuscasCampos
        {
            get
            {
                if (_buscasCampos == null)
                {
                    _buscasCampos = new BuscaCampoRepository(_context);
                }

                return _buscasCampos;
            }
        }

        public IChamadoContaRepository ChamadosContas
        {
            get
            {
                if (_chamadosContas == null)
                {
                    _chamadosContas = new ChamadoContaRepository(_context);
                }

                return _chamadosContas;
            }
        }

        public ITipoServicoCampoRepository TiposServicosCampos
        {
            get
            {
                if (_tiposServicosCampos == null)
                {
                    _tiposServicosCampos = new TipoServicoCampoRepository(_context);
                }

                return _tiposServicosCampos;
            }
        }

        public ITipoServicoCampoRelacionadoRepository TiposServicosCamposRelacionados
        {
            get
            {
                if (_tiposServicosCamposRelacionados == null)
                {
                    _tiposServicosCamposRelacionados = new TipoServicoCampoRelacionadoRepository(_context);
                }

                return _tiposServicosCamposRelacionados;
            }
        }

        public ITipoServicoPassoRepository TiposServicosPassos
        {
            get
            {
                if (_tiposServicosPassos == null)
                {
                    _tiposServicosPassos = new TipoServicoPassoRepository(_context);
                }

                return _tiposServicosPassos;
            }
        }
        public IValidacaoCampoTipoServicoRepository ValidacoesCamposTiposServicos
        {
            get
            {
                if (_validacoesCamposTiposServicos == null)
                {
                    _validacoesCamposTiposServicos = new ValidacaoCampoTipoServicoRepository(_context);
                }

                return _validacoesCamposTiposServicos;
            }
        }


        public IEquipamentoEventoRepository EquipamentosEventos
        {
            get
            {
                if (_equipamentosEventos == null)
                {
                    _equipamentosEventos = new EquipamentoEventoRepository(_context);
                }

                return _equipamentosEventos;
            }
        }

        public IArtigoEventoRepository ArtigosEventos
        {
            get
            {
                if (_artigosEventos == null)
                {
                    _artigosEventos = new ArtigoEventoRepository(_context);
                }

                return _artigosEventos;
            }
        }

        public ITipoServicoTarefaRepository TiposServicoTarefas
        {
            get
            {
                if (_tiposServicoTarefas == null)
                {
                    _tiposServicoTarefas = new TipoServicoTarefaRepository(_context);
                }

                return _tiposServicoTarefas;
            }
        }

        public ICampoColetorRepository CamposColetores
        {
            get
            {
                if (_camposcoletores == null)
                {
                    _camposcoletores = new CampoColetorRepository(_context);
                }

                return _camposcoletores;
            }
        }

        public ITipoChamadoDeptoEncerrarRepository TiposChamadosDeptosEncerrar
        {
            get
            {
                if (_tiposChamadosDeptosEncerrrar == null)
                {
                    _tiposChamadosDeptosEncerrrar = new TipoChamadoDeptoEncerrarRepository(_context);
                }

                return _tiposChamadosDeptosEncerrrar;
            }
        }

        public IFuncaoEventoRepository FuncoesEventos
        {
            get
            {
                if (_funcoesEventos == null)
                {
                    _funcoesEventos = new FuncaoEventoRepository(_context);
                }

                return _funcoesEventos;
            }
        }

        public ITipoSinalizacaoRepository TiposSinalizacoes
        {
            get
            {
                if (_tiposSinalizacoes == null)
                {
                    _tiposSinalizacoes = new TipoSinalizacaoRepository(_context);
                }

                return _tiposSinalizacoes;
            }
        }

        public ITipoChamadoCategoriaRepository TiposChamadoCategorias
        {
            get
            {
                if (_tiposChamadoCategorias == null)
                {
                    _tiposChamadoCategorias = new TipoChamadoCategoriaRepository(_context);
                }

                return _tiposChamadoCategorias;
            }
        }

        public IEquipeAreaRepository EquipesAreas
        {
            get
            {
                if (_equipesareas == null)
                {
                    _equipesareas = new EquipeAreaRepository(_context);
                }

                return _equipesareas;
            }
        }

        public IEquipeServicoRepository EquipeServico
        {
            get
            {
                if (_equipeServico == null)
                {
                    _equipeServico = new EquipeServicoRepository(_context);
                }

                return _equipeServico;
            }

        }

        public ITipoRecursoRepository TiposRecurso
        {
            get
            {
                if (_tiposRecurso == null)
                {
                    _tiposRecurso = new TipoRecursoRepository(_context);
                }

                return _tiposRecurso;
            }
        }

        public ITipoRecursoCampoRepository TiposRecursosCampos
        {
            get
            {
                if (_tiposRecursosCampos == null)
                {
                    _tiposRecursosCampos = new TipoRecursoCampoRepository(_context);
                }

                return _tiposRecursosCampos;
            }
        }


        public ITipoRecursoCampoRelacionadoRepository TiposRecursosCamposRelacionados
        {
            get
            {
                if (_tiposRecursosCamposRelacionados == null)
                {
                    _tiposRecursosCamposRelacionados = new TipoRecursoCampoRelacionadoRepository(_context);
                }

                return _tiposRecursosCamposRelacionados;
            }
        }

        public ITipoRecursoPassoRepository TiposRecursosPassos
        {
            get
            {
                if (_tiposRecursosPassos == null)
                {
                    _tiposRecursosPassos = new TipoRecursoPassoRepository(_context);
                }

                return _tiposRecursosPassos;
            }
        }
        public IValidacaoCampoTipoRecursoRepository ValidacoesCamposTiposRecursos
        {
            get
            {
                if (_validacoesCamposTiposRecursos == null)
                {
                    _validacoesCamposTiposRecursos = new ValidacaoCampoTipoRecursoRepository(_context);
                }

                return _validacoesCamposTiposRecursos;
            }
        }

        public IContaRepository Contas
        {
            get
            {
                if (_contas == null)
                {
                    _contas = new ContaRepository(_context);
                }

                return _contas;
            }
        }

        public IEquipamentoComponenteRepository EquipamentosComponentes
        {
            get
            {
                if (_equipamentosComponentes == null)
                {
                    _equipamentosComponentes = new EquipamentoComponenteRepository(_context);
                }

                return _equipamentosComponentes;
            }
        }

        public IEquipamentoCaracteristicaRepository EquipamentosCaracteristicas
        {
            get
            {
                if (_equipamentosCaracteristicas == null)
                {
                    _equipamentosCaracteristicas = new EquipamentoCaracteristicaRepository(_context);
                }

                return _equipamentosCaracteristicas;
            }
        }

        public IEquipamentoChamadoRepository EquipamentosChamados
        {
            get
            {
                if (_equipamentosChamados == null)
                {
                    _equipamentosChamados = new EquipamentoChamadoRepository(_context);
                }

                return _equipamentosChamados;
            }
        }

        public ITipoValaRepository TiposVala
        {
            get
            {
                if (_tiposVala == null)
                {
                    _tiposVala = new TipoValaRepository(_context);
                }

                return _tiposVala;
            }
        }

        public IEventoValaRepository EventosValas
        {
            get
            {
                if (_eventosValas == null)
                {
                    _eventosValas = new EventoValaRepository(_context);
                }

                return _eventosValas;
            }
        }

        public ICarneServicoRepository CarnesServicos
        {
            get
            {
                if (_carnesServicos == null)
                {
                    _carnesServicos = new CarneServicoRepository(_context);
                }

                return _carnesServicos;
            }
        }


        public ICampoTipoRecursoRepository CamposTiposRecursos
        {
            get
            {
                if (_campoTipoRecurso == null)
                {
                    _campoTipoRecurso = new CampoTipoRecursoRepository(_context);
                }

                return _campoTipoRecurso;
            }
        }

        public IEventoObservacaoRepository EventosObservacoes
        {
            get
            {
                if (_eventoObservacao == null)
                {
                    _eventoObservacao = new EventoObservacaoRepository(_context);
                }

                return _eventoObservacao;
            }
        }

        public IEventoAndamentoRepository EventosAndamentos
        {
            get
            {
                if (_eventoAndamento == null)
                {
                    _eventoAndamento = new EventoAndamentoRepository(_context);
                }

                return _eventoAndamento;
            }
        }

        public ISetorRepository Setores
        {
            get
            {
                if (_setor == null)
                {
                    _setor = new SetorRepository(_context);
                }

                return _setor;
            }
        }

        public IUsuarioRepository Usuarios
        {
            get
            {
                if (_usuarios == null)
                {
                    _usuarios = new UsuarioRepository(_context);
                }

                return _usuarios;
            }
        }

        public IBairroLoteamentoRepository BairrosLoteamentos
        {
            get
            {
                if (_bairrosLoteamentos == null)
                {
                    _bairrosLoteamentos = new BairroLoteamentoRepository(_context);
                }

                return _bairrosLoteamentos;
            }
        }

        public ILoteamentoRepository Loteamentos
        {
            get
            {
                if (_loteamentos == null)
                {
                    _loteamentos = new LoteamentoRepository(_context);
                }
                return _loteamentos;
            }
        }

        public IImobiliariaRepository Imobiliarias
        {
            get
            {
                if (_imobiliarias == null)
                {
                    _imobiliarias = new ImobiliariaRepository(_context);
                }
                return _imobiliarias;
            }
        }

        public IImobiliariaLigacaoRepository ImobiliariasLigacao
        {
            get
            {
                if (_imobiliariasLigacao == null)
                {
                    _imobiliariasLigacao = new ImobiliariaLigacaoRepository(_context);
                }
                return _imobiliariasLigacao;
            }
        }

        public IPavimentacaoLeitoRepository PavimentacoesLeito
        {
            get
            {
                if (_pavimentacoesLeito == null)
                {
                    _pavimentacoesLeito = new PavimentacaoLeitoRepository(_context);
                }

                return _pavimentacoesLeito;
            }
        }

        public IPavimentacaoPasseioRepository PavimentacoesPasseio
        {
            get
            {
                if (_pavimentacoesPasseio == null)
                {
                    _pavimentacoesPasseio = new PavimentacaoPasseioRepository(_context);
                }

                return _pavimentacoesPasseio;
            }
        }
        public IEstadoCivilRepository EstadosCivil
        {
            get
            {
                if (_estadosCivil == null)
                {
                    _estadosCivil = new EstadoCivilRepository(_context);
                }

                return _estadosCivil;
            }
        }

        public IRegiaoRepository Regioes
        {
            get
            {
                if (_regioes == null)
                {
                    _regioes = new RegiaoRepository(_context);
                }

                return _regioes;
            }
        }

        public IResponsabilidadeRepository Responsabilidades
        {
            get
            {
                if (_responsabilidade == null)
                {
                    _responsabilidade = new ResponsabilidadeRepository(_context);
                }

                return _responsabilidade;
            }
        }

        public IModuloClienteRepository ModuloCliente
        {
            get
            {
                if (_moduloCliente == null)
                {
                    _moduloCliente = new ModuloClienteRepository(_context);
                }

                return _moduloCliente;
            }
        }
        
        public IPessoaFisJurRepository PessoaFIsJur
        {
            get
            {
                if (_pessoaFisJur == null)
                {
                    _pessoaFisJur = new PessoaFisJurRepository(_context);
                }

                return _pessoaFisJur;
            }
        }
         public IPessoaEntregaRepository PessoaEntrega
        {
            get
            {
                if (_pessoaEntrega == null)
                {
                    _pessoaEntrega = new PessoaEntregaRepository(_context);
                }

                return _pessoaEntrega;
            }
        }
         public IDocumentosPessoaRepository DocumentoPessoa
        {
            get
            {
                if (_documentoPessoa == null)
                {
                    _documentoPessoa = new DocumentosPessoaRepository(_context);
                }

                return _documentoPessoa;
            }
        } 
        public ITiposChamadoServicoRepository TiposChamadoServico

        {
            get
            {
                if (_tipoChamadoServico == null)
                {
                    _tipoChamadoServico = new TiposChamadoServicoRepository(_context);
                }

                return _tipoChamadoServico;
            }
        }

        public ICronogramaServicoAtivarRepository CronogramasServicosAtivar
        {
            get
            {
                if (_cronogramasServicosAtivar == null)
                {
                    _cronogramasServicosAtivar = new CronogramaServicoAtivarRepository(_context);
                }

                return _cronogramasServicosAtivar;
            }
        }

        public IFeriadoRepository Feriados
        {
            get
            {
                if (_feriados == null)
                {
                    _feriados = new FeriadoRepository(_context);
                }

                return _feriados;
            }
        }

    }
}