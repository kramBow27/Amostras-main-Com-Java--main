﻿using Cebi.Util.Domain.Interfaces;

namespace Cebi.Atendimento.Domain.Interfaces
{
    public partial interface IAtendimentoUnitOfWork : IUnitOfWork
    {
        IParametroClienteRepository ParametrosClientes { get; }
        IAreaManutencaoRepository AreasManutencao { get; }
        IArtigoRepository Artigos { get; }
        ICaracteristicaRepository Caracteristicas { get; }
        IEquipeRepository Equipes { get; }
        IFuncaoRepository Funcoes { get; }

        IOrdensServicoColetorRepository OrdensServicoColetor { get; }
        IIntensidadeRepository Intensidades { get; }
        ILocalizacaoVazamentoRepository LocalizacaoVazamentos { get; }
        ISolicitanteRepository Solicitantes { get; }
        ITipoEquipamentoSGSRepository TiposEquipamentosSGS { get; }
        ITipoOcorrenciaTelemetriaRepository TiposOcorrenciasTelemetrias { get; }
        ITipoPavimentoRepository TiposPavimentos { get; }
        ITipoPrioridadeEquipamentoRepository TiposPrioridadesEquipamentos { get; }
        IGrupoServicoRepository GruposServicos { get; }
        ITipoSinalizacaoRepository TiposSinalizacao { get; }
        ICentroCustoServicoNovoRepository CentroCustoServicoNovos { get; }
        ICampoColetorRepository CamposColetor { get; }
        ITipoServicoCampoColetorRepository TiposServicoCamposColetor { get; }
        IMoedaRepository Moedas { get; }
        ITipoChamadoCategoriaRepository TipoChamadoCategorias { get; }
        IAtendimentoChamadoRepository AtendimentoChamados { get; }
        ITipoChamadoRepository TiposChamados { get; }
        ITipoChamadoDeptoEncRepository TiposChamadosDeptosEnc { get; }
        ITipoChamadoTipoChamadoRepository TiposChamadosTiposChamados { get; }
        IServicoGrupoRepository ServicoGrupos { get; }
        ICentroCustoRepository CentrosCusto { get; }
        IGrupoRepository Grupos { get; }
        ICategoriaRepository Categorias { get; }
        ICentroReservacaoRepository CentrosReservacao { get; }
        IDesignativoRepository Designativos { get; }
        IPesquisaRepository Pesquisas { get; }
        ITipoEscavacaoRepository TiposEscavacao { get; }
        ITipoExecucaoRepository TiposExecucao { get; }
        ITipoRecusaVistoriaRepository TiposRecusasVistorias { get; }
        ITipoCondicaoRedeRepository TiposCondicoesRedes { get; }
        ITipoRegistroRepository TiposRegistros { get; }
        IUnidadeRepository Unidades { get; }
        IViaturaRepository Viaturas { get; }
        IZonaAbastecimentoRepository ZonasAbastecimento { get; }
        IEventosBaixasColetorRepository EventosBaixasColetor { get; }
        IFuncionarioRepository Funcionario { get; }
        ITarefaRepository Tarefas { get; }
        ITipoServicoTarefaRepository TiposServicosTarefas { get; }
        IAtendimentoGrupoRepository AtendimentoGrupos { get; }
        ISituacaoAguaRepository SituacaoAguas { get; }
        ISituacaoHidrometroRepository SituacaoHidrometros { get; }
        ISituacaoLigacaoRepository SituacaoLigacoes { get; }
        ISituacaoEsgotoRepository SituacaoEsgotos { get; }
        ITipoCorteRepository TiposCortes { get; }
        ITipoLacreRepository TiposLacres { get; }
        ITipoChamadoTipoServicoRepository TiposChamadoTiposServico { get; }
        ICronogramaRepository Cronogramas { get; }
        IDocumentoLigacaoRepository DocumentosLigacoes { get; }
        IServicoGrupoRepository ServicosGrupos { get; }
        ITipoChamadoCampoRelacionadoRepository TiposChamadoCamposRelacionados { get; }
        ILogradouroAreaRepository LogradourosAreas { get; }
        IChamadoRepository Chamados { get; }
        IDadoPedidoRepository DadosPedidos { get; }
        ITipoServicoRepository TiposServicos { get; }
        IDadoProprietarioRepository DadosProprietarios { get; }
        ILancaServicoRepository LancaServicos { get; }
        ILancaServicoEventoRepository LancaServicosEventos { get; }
        IListaOpcaoRepository ListaOpcoes { get; }
        ILocalizacaoVazamentoRepository LocalizacoesVazamentos { get; }
        IOrdemServicoRepository OrdensServico { get; }
        IPassoRepository Passos { get; }
        ITerceiroRepository Terceiros { get; }
        ITipoChamadoRepository TiposChamado { get; }
        ITipoChamadoCampoRepository TiposChamadosCampos { get; }
        ITipoChamadoPassoRepository TiposChamadosPassos { get; }
        IValidacaoRepository Validacoes { get; }
        IValidacaoCampoAtendimentoRepository ValidacoesCamposAtendimentos { get; }
        IValidacaoCampoTipoChamadoRepository ValidacoesCamposTiposChamado { get; }
        IEquipamentoRepository Equipamentos { get; }
        IEquipamentoComponenteRepository EquipamentosComponentes { get; }
        IEquipamentoCaracteristicaRepository EquipamentosCaracteristicas { get; }
        IEquipamentoChamadoRepository EquipamentosChamados { get; }
        IHistoricoChamadoRepository HistoricosChamados { get; }
        IHistoricoOsRepository HistoricosOs { get; }
        ITipoChamadoTipoChamadoRepository TiposChamadoTiposChamado { get; }
        IValorPadraoRepository ValoresPadrao { get; }
        IChamadoContaRepository ChamadosContas { get; }
        ITipoServicoCampoRepository TiposServicosCampos { get; }
        ITipoServicoCampoRelacionadoRepository TiposServicosCamposRelacionados { get; }
        ITipoServicoPassoRepository TiposServicosPassos { get; }
        IValidacaoCampoTipoServicoRepository ValidacoesCamposTiposServicos { get; }
        IEquipamentoEventoRepository EquipamentosEventos { get; }
        ITipoServicoTarefaRepository TiposServicoTarefas { get; }
        ITipoChamadoDeptoEncerrarRepository TiposChamadosDeptosEncerrar { get; }
        IFuncaoEventoRepository FuncoesEventos { get; }
        IMaterialEventoRepository MateriaisEventos { get; }
        ITipoSinalizacaoRepository TiposSinalizacoes { get; }
        ITipoChamadoCategoriaRepository TiposChamadoCategorias { get; }
        IEquipeAreaRepository EquipesAreas { get; }
        IEquipeServicoRepository EquipeServico { get; }

        IEquipeCoordenadasRepository EquipeCoordenadas { get; }
        ITipoRecursoRepository TiposRecurso { get; }
        ITipoRecursoCampoRepository TiposRecursosCampos { get; }
        ITipoRecursoCampoRelacionadoRepository TiposRecursosCamposRelacionados { get; }
        ITipoRecursoPassoRepository TiposRecursosPassos { get; }
        IValidacaoCampoTipoRecursoRepository ValidacoesCamposTiposRecursos { get; }
        IEventoRepository Eventos { get; }
        IMaoObraEventoRepository MaosObrasEventos { get; }
        IFuncionarioRepository Funcionarios { get; }
        IArtigoEventoRepository ArtigosEventos { get; }
        IManobraDescargaEventoRepository ManobrasDescargasEventos { get; }
        IEventoTarefaRepository EventosTarefas { get; }
        ICampoRepository Campos { get; }
        IServicoServicoRepository ServicosServicos { get; }
        IMaterialServicoRepository MateriaisServicos { get; }
        IAtendimentoRepository Atendimentos { get; }
        ISetorAbastecimentoRepository SetoresAbastecimento { get; }
        IAtendimentoPassoRepository AtendimentosPassos { get; }
        IAtendimentoCampoRepository AtendimentosCampos { get; }
        IAtendimentoCampoRelacionadoRepository AtendimentosCamposRelacionados { get; }
        IParametroWebRepository ParametrosWeb { get; }
        IAtendimentoChamadoRepository AtendimentosChamados { get; }
        IMaterialRepository Materiais { get; }
        IMaterialCaracteristicaRepository MateriaisCaracteristicas { get; }
        IAtendimentoGrupoRepository AtendimentosGrupos { get; }
        ITipoEquipamentoRepository TiposEquipamentos { get; }
        ICampoColetorRepository CamposColetores { get; }
        IParametroCebiRepository ParametrosCebi { get; }
        INivelMascaraRepository NiveisMascaras { get; }

        ILogradouroComplementoRepository LogradourosComplementos { get; }
        IGuiaRecolhimentoRepository GuiasRecolhimento { get; }
        ILeituraRepository Leituras { get; }
        IHistoricoLigacaoRepository HistoricosLigacoes { get; }
        IProprietarioRepository Proprietarios { get; }
        IHidrometroLigacaoRepository HidrometrosLigacoes { get; }
        ILigacaoRepository Ligacoes { get; }
        ICategoriaLigacaoRepository CategoriasLigacao { get; }
        ICepLogradouroRepository CepsLogradouros { get; }
        IBairroRepository Bairros { get; }
        IBairroLogradouroRepository BairrosLogradouros { get; }
        ILogradouroRepository Logradouros { get; }
        IOcorrenciaCidadaoRepository OcorrenciasCidadao { get; }
        IAtendimentoRepository Atendimento { get; }
        IAtividadeRepository Atividades { get; }
        ICondominioRepository Condominios { get; }
        ISubCondominioRepository SubCondominios { get; }
        ITipoLigacaoRepository TiposLigacao { get; }
        ILocalizacaoCavaleteRepository LocalizacoesCavalete { get; }
        ICepRepository Ceps { get; }
        IInformacaoAdicionalColetorRepository InformacaoAdicionaisColetor { get; }
        ITipoServicoDeptoEncerrarRepository TiposServicosDeptosEncerrar { get; }
        ILocalizacaoRedeRepository LocalizacaoRedes { get; }
        ITipoMaterialRedeRepository TiposMateriaisRedes { get; }
        ITipoDiametroRedeRepository TiposDiametrosRedes { get; }
        IOcorrenciaRepository Ocorrencias { get; }
        IBuscaCampoRepository BuscasCampos { get; }
        IBuscaRepository Buscas { get; }
        ITipoOcorrenciaCidadaoRepository TiposOcorrenciasCidadao { get; }
        IImovelRepository Imoveis { get; }
        IContaRepository Contas { get; }
        ITipoOcorrenciaRepository TiposOcorrencias { get; }
        IContaRegistroRepository ContasRegistros { get; }
        ICodigoBarraRepository CodigoBarras { get; }
        ITipoCampoRepository TiposCampos { get; }
        ITabelaRepository Tabelas { get; }
        ITerrenoRepository Terrenos { get; }
        IHistoricoHidrometroRepository HistoricoHidrometros { get; }
        IServicoRepository Servicos { get; }
        IHistoricoCorteRepository HistoricosCortes { get; }
        ICodigoRetencaoRepository CodigosRetencao { get; }
        IMotivoTrocaRepository MotivosTroca { get; }
        ITipoCorteRepository TiposCorte { get; }
        ICodigoClassificacaoRepository CodigosClassificacao { get; }
        IHidrometroRepository Hidrometros { get; }
        ITabelaCriticaRepository TabelaCriticas { get; }
        IHistoricoNotificacaoRepository HistoricosNotificacoes { get; }
        IHistoricoNotificacaoCarneRepository HistoricosNotificacoesCarnes { get; }
        IHistoricoCategoriaRepository HistoricosCategorias { get; }
        ISituacaoHidrometroRepository SituacoesHidrometros { get; }
        ILigacaoFoneticaRepository LigacoesFonetica { get; }
        ITrocaHidrometroRepository TrocasHidrometros { get; }
        ITipoNotificacaoRepository TiposNotificacoes { get; }
        IFinalidadeNotificacaoRepository FinalidadesNotificacoes { get; }
        ILogradouroFoneticaRepository LogradourosFonetica { get; }
        IGrupoSSBRepository GruposSSB { get; }
        ICaixaInspecaoEsgotoRepository CaixasInspecaoEsgoto { get; }
        ITipoLancamentoRepository TiposLancamento { get; }
        ITipoValaRepository TiposVala { get; }
        IUsuarioRepository Usuarios { get; }
        ICarneParcelaRepository CarnesParcelas { get; }
        ICarneServicoRepository CarnesServicos { get; }
        ICarneRepository Carnes { get; }
        IArquivoColetorRepository ArquivosColetor { get; }
        IArquivoColetorEventoRepository ArquivosColetorEvento { get; }
        IArquivoColetorOrdemServicoRepository ArquivosColetorOrdemServico { get; }
        IListaOpcaoColetorRepository ListaOpcoesColetor { get; }
        IOpcaoListaColetorRepository OpcoesListaColetor { get; }
        ISetorAbastecimentoBairroRepository SetoresAbastecimentoBairro { get; }
        IOcorrenciaDeptoRepository OcorrenciasDepto { get; }
        ILayoutDocumentoRepository LayoutsDocumentos { get; }
        IEventoValaRepository EventosValas { get; }
        ICampoTipoRecursoRepository CamposTiposRecursos { get; }
        ITipoResponsavelRepository TiposResponsaveis { get; }
        IEventoObservacaoRepository EventosObservacoes { get; }
        IEventoAndamentoRepository EventosAndamentos { get; }
        ISetorRepository Setores { get; }
        IBairroLoteamentoRepository BairrosLoteamentos { get; }
        ILoteamentoRepository Loteamentos { get; }
        IMotivoCancelamentoOcorrenciaRepository MotivosCancelamentoOcorrencia { get; }
        IImobiliariaRepository Imobiliarias { get; }
        IImobiliariaLigacaoRepository ImobiliariasLigacao { get; }
        IPavimentacaoLeitoRepository PavimentacoesLeito { get; }
        IPavimentacaoPasseioRepository PavimentacoesPasseio { get; }
        ITipoChamadoCampoRegraCampoRepository TiposChamadoCamposRegrasCampos { get; }
        ITipoChamadoCampoRegraRepository TiposChamadoCamposRegras { get; }
        IRedeAguaRepository RedesAgua { get; }
        IRedeEsgotoRepository RedesEsgoto { get; }
        IZonaAbastecimentoSsbRepository ZonasAbastecimentoSsb { get; }
        IEstadoCivilRepository EstadosCivil { get; }
        IRegiaoRepository Regioes { get; }
        IResponsabilidadeRepository Responsabilidades { get; }
        IModuloClienteRepository ModuloCliente { get; }
        IPessoaFisJurRepository PessoaFIsJur { get; }
        IPessoaEntregaRepository PessoaEntrega { get; }
        IDocumentosPessoaRepository DocumentoPessoa { get; }
        ITiposChamadoServicoRepository TiposChamadoServico { get; }
        ICronogramaServicoAtivarRepository CronogramasServicosAtivar { get; }
        IFeriadoRepository Feriados { get; }
    }
}