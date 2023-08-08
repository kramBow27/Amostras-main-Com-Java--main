using Cebi.Atendimento.Dal.Config;
using Cebi.Atendimento.Domain.Entities;
using System.Data.Entity;
using Cebi.Util.Dal;
using System.Diagnostics;
using Cebi.Atendimento.Dal.Config.Gerados;

namespace Cebi.Atendimento.Dal
{
    public class AtendimentoContext : DbContext
    {
        internal AtendimentoContext() : base("CebiContext")
        {
            // liga o log dos scripts em Debug Mode
#if DEBUG
            Database.Log = message => Trace.Write(message);
#endif
        }

        public DbSet<AreaManutencao> AreasManutencao { get; set; }
        public DbSet<Artigo> Artigos { get; set; }
        public DbSet<Caracteristica> Caracteristicas { get; set; }
        public DbSet<RedeAgua> RedesAgua { get; set; }
        public DbSet<RedeEsgoto> RedesEsgoto { get; set; }
        public DbSet<ZonaAbastecimentoSsb> ZonasAbastecimentoSsb { get; set; }
        public DbSet<Equipe> Equipes { get; set; }
        public DbSet<EquipeCoordenadas> EquipeCoordenadas {get; set;}
        public DbSet<Funcao> Funcoes { get; set; }
        public DbSet<Intensidade> Intensidades { get; set; }
        public DbSet<Solicitante> Solicitantes { get; set; }
        public DbSet<TipoEquipamentoSGS> TiposEquipamentosSGS { get; set; }
        public DbSet<TipoOcorrenciaTelemetria> TiposOcorrenciasTelemetrias { get; set; }
        public DbSet<TipoPavimento> TiposPavimentos { get; set; }
        public DbSet<TipoPrioridadeEquipamento> TiposPrioridadesEquipamentos { get; set; }
        public DbSet<GrupoServico> GruposServicos { get; set; }
        public DbSet<CentroCustoServicoNovo> CentroCustoServicoNovos { get; set; }
        public DbSet<TipoServicoCampoColetor> TiposServicoCamposColetor { get; set; }
        public DbSet<Moeda> Moedas { get; set; }
        public DbSet<CentroCusto> CentrosCusto { get; set; }
        public DbSet<Grupo> Grupos { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<CentroReservacao> CentrosReservacao { get; set; }
        public DbSet<Designativo> Designativos { get; set; }
        public DbSet<Pesquisa> Pesquisas { get; set; }
        public DbSet<TipoEscavacao> TiposEscavacao { get; set; }
        public DbSet<TipoExecucao> TiposExecucao { get; set; }
        public DbSet<TipoRegistro> TiposRegistros { get; set; }
        public DbSet<Unidade> Unidades { get; set; }
        public DbSet<Viatura> Viaturas { get; set; }
        public DbSet<ZonaAbastecimento> ZonasAbastecimento { get; set; }
        public DbSet<TipoServico> TiposServicos { get; set; }
        public DbSet<Tarefa> Tarefas { get; set; }
        public DbSet<EventosBaixasColetor> EventosBaixasColetor { get; set; }
        public DbSet<TipoServicoTarefa> TiposServicosTarefas { get; set; }
        public DbSet<SituacaoAgua> SituacaoAguas { get; set; }
        public DbSet<TipoLacre> TiposLacres { get; set; }
        public DbSet<TipoChamadoTipoServico> TiposChamadoTiposServico { get; set; }
        public DbSet<Cronograma> Cronogramas { get; set; }
        public DbSet<DocumentoLigacao> DocumentosLigacoes { get; set; }
        public DbSet<SituacaoHidrometro> SituacaoHidrometros { get; set; }
        public DbSet<SituacaoEsgoto> SituacaoEsgotos { get; set; }
        public DbSet<SituacaoLigacao> SituacaoLigacoes { get; set; }
        public DbSet<EquipamentoComponente> EquipamentosComponentes { get; set; }
        public DbSet<EquipamentoCaracteristica> EquipamentosCaracteristicas { get; set; }
        public DbSet<EquipamentoChamado> EquipamentosChamados { get; set; }

        public DbSet<Funcionario> Funcionarios { get; set; }
        public DbSet<AtendimentoGrupo> AtendimentosGrupos { get; set; }
        public DbSet<AtendimentoChamado> AtendimentosChamados { get; set; }
        public DbSet<ServicoGrupo> ServicosGrupos { get; set; }
        public DbSet<ServicoServico> ServicosServicos { get; set; }
        public DbSet<AtendimentoCampo> AtendimentosCampos { get; set; }
        public DbSet<AtendimentoPasso> AtendimentosPassos { get; set; }
        public DbSet<ValidacaoCampoAtendimento> ValidacoesCamposAtendimentos { get; set; }
        public DbSet<ValidacaoCampoTipoChamado> ValidacoesCamposTiposChamado { get; set; }
        public DbSet<Campo> Campos { get; set; }
        public DbSet<Chamado> Chamados { get; set; }
        public DbSet<DadoPedido> DadosPedidos { get; set; }
        public DbSet<DadoProprietario> DadosProprietarios { get; set; }
        public DbSet<Evento> Eventos { get; set; }
        public DbSet<LancaServico> LancaServicos { get; set; }
        public DbSet<LancaServicoEvento> LancaServicosEventos { get; set; }
        public DbSet<ListaOpcao> ListaOpcoes { get; set; }
        public DbSet<LocalizacaoVazamento> LocalizacoesVazamentos { get; set; }
        public DbSet<MaterialEvento> MateriaisEventos { get; set; }
        public DbSet<OrdemServico> OrdensServico { get; set; }
        public DbSet<Passo> Passos { get; set; }
        public DbSet<SetorAbastecimento> SetoresAbastecimento { get; set; }
        public DbSet<Terceiro> Terceiros { get; set; }
        public DbSet<TipoChamado> TiposChamado { get; set; }
        public DbSet<TipoChamadoCampo> TiposChamadosCampos { get; set; }
        public DbSet<TipoChamadoPasso> TiposChamadosPassos { get; set; }
        public DbSet<Validacao> Validacoes { get; set; }

        public DbSet<AtendimentoCampoRelacionado> AtendimentosCamposRelacionados { get; set; }
        public DbSet<TipoChamadoCampoRelacionado> TiposChamadoCamposRelacionados { get; set; }
        public DbSet<TipoEquipamento> TiposEquipamentos { get; set; }
        public DbSet<LogradouroArea> LogradourosAreas { get; set; }
        public DbSet<LogradouroComplemento> LogradourosComplementos { get; set; }
        public DbSet<Equipamento> Equipamentos { get; set; }
        public DbSet<HistoricoChamado> HistoricosChamados { get; set; }
        public DbSet<HistoricoOs> HistoricosOs { get; set; }
        public DbSet<TipoChamadoTipoChamado> TiposChamadoTiposChamado { get; set; }
        public DbSet<ValorPadrao> ValoresPadrao { get; set; }
        public DbSet<Busca> Buscas { get; set; }
        public DbSet<BuscaCampo> BuscasCampos { get; set; }
        public DbSet<ChamadoConta> ChamadosContas { get; set; }
        public DbSet<TipoServicoCampo> TiposServicosCampos { get; set; }
        public DbSet<TipoServicoCampoRelacionado> TiposServicosCamposRelacionados { get; set; }
        public DbSet<TipoServicoPasso> TiposServicosPassos { get; set; }
        public DbSet<ValidacaoCampoTipoServico> ValidacoesCamposTiposServicos { get; set; }
        public DbSet<EquipamentoEvento> EquipamentosEventos { get; set; }
        public DbSet<InformacaoAdicionalColetor> InformacaoAdicionaisColetor { get; set; }
        public DbSet<ArtigoEvento> ArtigosEventos { get; set; }
        public DbSet<EventoTarefa> EventosTarefas { get; set; }
        public DbSet<CampoColetor> CamposColetores { get; set; }
        public DbSet<TipoChamadoDeptoEnc> TiposChamadosDeptosEncerrar { get; set; }
        public DbSet<FuncaoEvento> FuncoesEventos { get; set; }

        public DbSet<TipoSinalizacao> TiposSinalizacoes { get; set; }
        public DbSet<TipoChamadoCategoria> TiposChamadoCategorias { get; set; }
        public DbSet<EquipeArea> EquipesAreas { get; set; }
        public DbSet<EquipeServico> EquipeServico { get; set; }
        public DbSet<TipoRecurso> TiposRecursos { get; set; }
        public DbSet<TipoRecursoCampo> TiposRecursosCampos { get; set; }
        public DbSet<TipoRecursoCampoRelacionado> TiposRecursosCamposRelacionados { get; set; }
        public DbSet<TipoRecursoPasso> TiposRecursosPassos { get; set; }
        public DbSet<ValidacaoCampoTipoRecurso> ValidacoesCamposTiposRecursos { get; set; }
        public DbSet<Domain.Entities.Atendimento> Atendimentos { get; set; }
        public DbSet<TipoOcorrencia> TiposOcorrencias { get; set; }
        public DbSet<Leiturista> Leituristas { get; set; }
        public DbSet<Proprietario> Proprietarios { get; set; }
        public DbSet<CategoriaLigacao> CategoriasLigacao { get; set; }
        public DbSet<MaoObraEvento> MaosObraEvento { get; set; }
        public DbSet<ManobraDescargaEvento> ManobrasDescargaEvento { get; set; }

        public DbSet<ParametroCebi> ParametrosCebi { get; set; }
        public DbSet<ContaRegistro> ContasRegistros { get; set; }
        public DbSet<Tabela> Tabelas { get; set; }
        public DbSet<HistoricoHidrometro> HistoricosHidrometros { get; set; }
        public DbSet<Servico> Servicos { get; set; }
        public DbSet<HistoricoLigacao> HistoricosLigacoes { get; set; }
        public DbSet<HistoricoCorte> HistoricosCortes { get; set; }
        public DbSet<TipoVala> TiposVala { get; set; }
        public DbSet<EventoVala> EventosValas { get; set; }
        public DbSet<CampoTipoRecurso> CampoTipoRecurso { get; set; }
        public DbSet<EventoObservacao> EventosObservacoes { get; set; }
        public DbSet<EventoAndamento> EventosAndamentos { get; set; }
        public DbSet<Responsabilidade> Responsabilidades { get; set; }
        public DbSet<ModuloCliente> ModuloCliente { get; set; }
        public DbSet<PessoaFisJur> PessoaFIsJur { get; set; }
        public DbSet<PessoaEntrega> PessoaEntrega { get; set; }
        public DbSet<DocumentosPessoa> DocumentoPessoa { get; set; }

        //saneamento
        public DbSet<ParametroCliente> ParametrosClientes { get; set; }

        public DbSet<Logradouro> Logradouros { get; set; }
        public DbSet<Ligacao> Ligacoes { get; set; }
        public DbSet<TipoLigacao> TiposLigacao { get; set; }
        public DbSet<PavimentacaoLeito> PavimentacoesLeito { get; set; }
        public DbSet<PavimentacaoPasseio> PavimentacoesPasseio { get; set; }
        public DbSet<HidrometroLigacao> HidrometrosLigacoes { get; set; }
        public DbSet<TipoCorte> TiposCorte { get; set; }
        public DbSet<Hidrometro> Hidrometros { get; set; }
        public DbSet<Marca> Marcas { get; set; }
        public DbSet<Vazao> Vazaos { get; set; }
        public DbSet<GuiaRecolhimento> GuiasRecolhimento { get; set; }
        public DbSet<Ocorrencia> Ocorrencias { get; set; }
        public DbSet<Leitura> Leituras { get; set; }
        public DbSet<Bairro> Bairros { get; set; }
        public DbSet<Terreno> Terrenos { get; set; }
        public DbSet<Imovel> Imoveis { get; set; }
        public DbSet<NivelMascara> NiveisMascaras { get; set; }
        public DbSet<BairroLogradouro> BairrosLogradouros { get; set; }
        public DbSet<CepLogradouro> CepsLogradouros { get; set; }
        public DbSet<LocalizacaoRede> LocalizacoesRede { get; set; }
        public DbSet<TipoMaterialRede> TiposMateriaisRede { get; set; }
        public DbSet<TipoCondicaoRede> TiposCondicoesRede { get; set; }
        public DbSet<TipoDiametroRede> TiposDiametrosRede { get; set; }
        public DbSet<TipoRecusaVistoria> TiposRecusaVistoria { get; set; }
        public DbSet<TipoOcorrenciaCidadao> TiposOcorrenciaCidadao { get; set; }
        public DbSet<OcorrenciaCidadao> OcorrenciasCidadao { get; set; }
        public DbSet<ParametroWeb> ParametrosWeb { get; set; }
        public DbSet<MaterialServico> MateriaisServico { get; set; }
        public DbSet<LigacaoFonetica> LigacoesFonetica { get; set; }
        public DbSet<HistoricoNotificacao> HistoricosNotificacoes { get; set; }
        public DbSet<Conta> Contas { get; set; }
        public DbSet<Atividade> Atividades { get; set; }
        public DbSet<Material> Materiais { get; set; }
        public DbSet<MaterialCaracteristica> MateriaisCaracteristicas { get; set; }
        public DbSet<TipoServicoDeptoEncerrar> TiposServicosDeptoEncerrar { get; set; }
        public DbSet<LocalizacaoCavalete> LocalizacoesCavalete { get; set; }
        public DbSet<TipoCampo> TiposCampos { get; set; }
        public DbSet<Condominio> Condominios { get; set; }
        public DbSet<SubCondominio> SubCondominios { get; set; }
        public DbSet<CodigoClassificacao> CodigosClassificacao { get; set; }
        public DbSet<TabelaCritica> TabelaCriticas { get; set; }
        public DbSet<HistoricoNotificacaoCarne> HistoricosNotificacoesCarnes { get; set; }
        public DbSet<TrocaHidrometro> TrocasHidrometros { get; set; }
        public DbSet<TipoNotificacao> TiposNotificacoes { get; set; }
        public DbSet<FinalidadeNotificacao> FinalidadesNotificacoes { get; set; }
        public DbSet<CodigoRetencao> CodigosRetencao { get; set; }
        public DbSet<CarneParcela> CarnesParcelas { get; set; }
        public DbSet<LogradouroFonetica> LogradourosFonetica { get; set; }
        public DbSet<Cep> Ceps { get; set; }
        public DbSet<GrupoSSB> GruposSSB { get; set; }
        public DbSet<CaixaInspecaoEsgoto> CaixasInspecaoEsgoto { get; set; }
        public DbSet<TipoLancamento> TiposLancamento { get; set; }
        public DbSet<Carne> Carnes { get; set; }
        public DbSet<CarneServico> CarnesServicos { get; set; }
        public DbSet<ArquivoColetor> ArquivosColetor { get; set; }
        public DbSet<ArquivoColetorEvento> ArquivosColetorEvento { get; set; }
        public DbSet<ArquivoColetorOrdemServico> ArquivosColetorOrdemServico { get; set; }
        public DbSet<ListaOpcaoColetor> ListaOpcoesColetor { get; set; }
        public DbSet<OpcaoListaColetor> OpcoesListaColetor { get; set; }
        public DbSet<SetorAbastecimentoBairro> SetoresAbastecimentoBairro { get; set; }
        public DbSet<OcorrenciaDepto> OcorrenciasDepto { get; set; }
        public DbSet<LayoutDocumento> LayoutsDocumentos { get; set; }
        public DbSet<TipoResponsavel> TiposResponsaveis { get; set; }

        public DbSet<OrdensServicoColetor> OrdensServicoColetor { get; set; }
        public DbSet<Setor> Setores { get; set; }
        public DbSet<BairroLoteamento> BairrosLoteamentos { get; set; }
        public DbSet<Loteamento> Loteamentos { get; set; }
        public DbSet<MotivoCancelamentoOcorrencia> MotivosCancelamentoOcorrencia { get; set; }
        public DbSet<Imobiliaria> Imobiliarias { get; set; }
        public DbSet<ImobiliariaLigacao> ImobiliariasLigacao { get; set; }
        public DbSet<TipoChamadoCampoRegraCampo> TiposChamadoCamposRegrasCampos { get; set; }
        public DbSet<TipoChamadoCampoRegra> TiposChamadoCamposRegras { get; set; }
        public DbSet<EstadoCivil> EstadosCivil { get; set; }
        public DbSet<Regiao> Regioes { get; set; }
        public DbSet<TiposChamadoServico> TiposChamadoServico { get; set; }
        public DbSet<CronogramaServicoAtivar> CronogramasServicosAtivar { get; set; }
        public DbSet<Feriado> Feriados { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            DatabaseContextConfigurator.Config(modelBuilder);

            // mapeamentos entidades x tabelas
            modelBuilder.Configurations.Add(new LayoutDocumentoEfConfig());
            modelBuilder.Configurations.Add(new ArquivoColetorEfConfig());
            modelBuilder.Configurations.Add(new ArquivoColetorEventoEfConfig());
            modelBuilder.Configurations.Add(new ArquivoColetorOrdemServicoEfConfig());
            modelBuilder.Configurations.Add(new CaracteristicaEfConfig());
            modelBuilder.Configurations.Add(new TipoEquipamentoSGSEfConfig());
            modelBuilder.Configurations.Add(new TipoOcorrenciaTelemetriaEfConfig());
            modelBuilder.Configurations.Add(new TipoOcorrenciaEfConfig());
            modelBuilder.Configurations.Add(new TipoPrioridadeEquipamentoEfConfig());
            modelBuilder.Configurations.Add(new GrupoServicoEfConfig());
            modelBuilder.Configurations.Add(new CentroCustoServicoNovoEfConfig());
            modelBuilder.Configurations.Add(new TipoServicoCampoColetorEfConfig());
            modelBuilder.Configurations.Add(new TipoChamadoEfConfig());
            modelBuilder.Configurations.Add(new TipoChamadoDeptoEncEfConfig());
            modelBuilder.Configurations.Add(new PesquisaEfConfig());
            modelBuilder.Configurations.Add(new TipoEscavacaoEfConfig());
            modelBuilder.Configurations.Add(new SituacaoAguaEfConfig());
            modelBuilder.Configurations.Add(new TipoLacreEfConfig());
            modelBuilder.Configurations.Add(new MotivoCancelamentoOcorrenciaEfConfig());
            modelBuilder.Configurations.Add(new ParametroClienteEfConfig());
            modelBuilder.Configurations.Add(new EventosBaixasColetorEfConfig());

            //////////////////////////////////////////////////////////////////////////////
            modelBuilder.Configurations.Add(new TipoChamadoCampoRegraCampoEfConfig());
            modelBuilder.Configurations.Add(new TipoChamadoCampoRegraEfConfig());
            modelBuilder.Configurations.Add(new ZonaAbastecimentoEfConfig());
            modelBuilder.Configurations.Add(new CentroReservacaoEfConfig());
            modelBuilder.Configurations.Add(new AtendimentoGrupoEfConfig());
            modelBuilder.Configurations.Add(new AtendimentoChamadoEfConfig());
            modelBuilder.Configurations.Add(new CronogramaEfConfig());
            modelBuilder.Configurations.Add(new ServicoGrupoEfConfig());
            modelBuilder.Configurations.Add(new ServicoServicoEfConfig());
            modelBuilder.Configurations.Add(new AreaManutencaoEfConfig());
            modelBuilder.Configurations.Add(new ValidacaoCampoTipoChamadoEfConfig());
            modelBuilder.Configurations.Add(new CampoEfConfig());
            modelBuilder.Configurations.Add(new CategoriaEfConfig());
            modelBuilder.Configurations.Add(new ChamadoEfConfig());
            modelBuilder.Configurations.Add(new DadoPedidoEfConfig());
            modelBuilder.Configurations.Add(new DadoProprietarioEfConfig());
            modelBuilder.Configurations.Add(new ProprietarioEfConfig());
            modelBuilder.Configurations.Add(new IntensidadeEfConfig());
            modelBuilder.Configurations.Add(new LancaServicoEfConfig());
            modelBuilder.Configurations.Add(new LancaServicoEventoEfConfig());
            modelBuilder.Configurations.Add(new ListaOpcaoEfConfig());
            modelBuilder.Configurations.Add(new LocalizacaoVazamentoEfConfig());
            modelBuilder.Configurations.Add(new MaterialEventoEfConfig());
            modelBuilder.Configurations.Add(new OrdemServicoEfConfig());
            modelBuilder.Configurations.Add(new PassoEfConfig());
            modelBuilder.Configurations.Add(new SetorAbastecimentoEfConfig());
            modelBuilder.Configurations.Add(new TerceiroEfConfig());
            modelBuilder.Configurations.Add(new TipoChamadoCampoEfConfig());
            modelBuilder.Configurations.Add(new TipoChamadoPassoEfConfig());
            modelBuilder.Configurations.Add(new ValidacaoEfConfig());
            modelBuilder.Configurations.Add(new GrupoEfConfig());
            modelBuilder.Configurations.Add(new AtendimentoPassoEfConfig());
            modelBuilder.Configurations.Add(new AtendimentoCampoEfConfig());
            modelBuilder.Configurations.Add(new AtendimentoCampoRelacionadoEfConfig());
            modelBuilder.Configurations.Add(new TipoEquipamentoEfConfig());
            modelBuilder.Configurations.Add(new CentroCustoEfConfig());
            modelBuilder.Configurations.Add(new DesignativoEfConfig());
            modelBuilder.Configurations.Add(new LogradouroAreaEfConfig());
            modelBuilder.Configurations.Add(new LogradouroComplementoEfConfig());
            modelBuilder.Configurations.Add(new HistoricoOsEfConfig());
            modelBuilder.Configurations.Add(new HistoricoChamadoEfConfig());
            modelBuilder.Configurations.Add(new TipoChamadoTipoChamadoEfConfig());
            modelBuilder.Configurations.Add(new EquipeEfConfig());
            modelBuilder.Configurations.Add(new ValorPadraoEfConfig());
            modelBuilder.Configurations.Add(new BuscaEfConfig());
            modelBuilder.Configurations.Add(new BuscaCampoEfConfig());
            modelBuilder.Configurations.Add(new ChamadoContaEfConfig());
            modelBuilder.Configurations.Add(new TipoChamadoTipoServicoEfConfig());
            modelBuilder.Configurations.Add(new TipoServicoCampoRelacionadoEfConfig());
            modelBuilder.Configurations.Add(new TipoServicoPassoEfConfig());
            modelBuilder.Configurations.Add(new ValidacaoCampoTipoServicoEfConfig());
            modelBuilder.Configurations.Add(new EquipamentoEventoEfConfig());
            modelBuilder.Configurations.Add(new ArtigoEventoEfConfig());
            modelBuilder.Configurations.Add(new TarefaEfConfig());
            modelBuilder.Configurations.Add(new TipoServicoTarefaEfConfig());
            modelBuilder.Configurations.Add(new ArtigoEfConfig());
            modelBuilder.Configurations.Add(new CampoColetorEfConfig());
            modelBuilder.Configurations.Add(new FuncaoEfConfig());
            modelBuilder.Configurations.Add(new FuncaoEventoEfConfig());
            modelBuilder.Configurations.Add(new EventoEfConfig());
            modelBuilder.Configurations.Add(new ViaturaEfConfig());
            modelBuilder.Configurations.Add(new TipoPavimentoEfConfig());
            modelBuilder.Configurations.Add(new TipoSinalizacaoEfConfig());
            modelBuilder.Configurations.Add(new TipoChamadoCategoriaEfConfig());
            modelBuilder.Configurations.Add(new UnidadeEfConfig());
            modelBuilder.Configurations.Add(new EquipeAreaEfConfig());
            modelBuilder.Configurations.Add(new EquipeServicoEfConfig());
            modelBuilder.Configurations.Add(new EquipeCoordenadasEfConfig());
            modelBuilder.Configurations.Add(new TipoRecursoEfConfig());
            modelBuilder.Configurations.Add(new TipoRecursoCampoEfConfig());
            modelBuilder.Configurations.Add(new TipoRecursoCampoRelacionadoEfConfig());
            modelBuilder.Configurations.Add(new TipoRecursoPassoEfConfig());
            modelBuilder.Configurations.Add(new ValidacaoCampoTipoRecursoEfConfig());
            modelBuilder.Configurations.Add(new TipoServicoEfConfig());
            modelBuilder.Configurations.Add(new LogradouroEfConfig());
            modelBuilder.Configurations.Add(new TipoChamadoCampoRelacionadoEfConfig());
            modelBuilder.Configurations.Add(new SolicitanteEfConfig());
            modelBuilder.Configurations.Add(new OcorrenciaEfConfig());
            modelBuilder.Configurations.Add(new EventoTarefaEfConfig());
            modelBuilder.Configurations.Add(new InformacaoAdicionalColetorEfConfig());
            modelBuilder.Configurations.Add(new TipoServicoCampoEfConfig());
            modelBuilder.Configurations.Add(new MaterialEfConfig());
            modelBuilder.Configurations.Add(new MaterialCaracteristicaEfConfig());
            modelBuilder.Configurations.Add(new EquipamentoComponenteEfConfig());
            modelBuilder.Configurations.Add(new EquipamentoCaracteristicaEfConfig());
            modelBuilder.Configurations.Add(new EquipamentoChamadoEfConfig());

            modelBuilder.Configurations.Add(new FuncionarioEfConfig());
            modelBuilder.Configurations.Add(new ParametroCebiEfConfig());
            modelBuilder.Configurations.Add(new NivelMascaraEfConfig());
            modelBuilder.Configurations.Add(new ContaRegistroEfConfig());
            modelBuilder.Configurations.Add(new TipoCampoEfConfig());
            modelBuilder.Configurations.Add(new TabelaEfConfig());
            modelBuilder.Configurations.Add(new HistoricoHidrometroEfConfig());
            modelBuilder.Configurations.Add(new ServicoEfConfig());
            modelBuilder.Configurations.Add(new MoedaEfConfig());
            modelBuilder.Configurations.Add(new HistoricoCorteEfConfig());
            modelBuilder.Configurations.Add(new CepEfConfig());
            modelBuilder.Configurations.Add(new OrdensServicoColetorEfConfig());

            modelBuilder.Configurations.Add(new ListaOpcaoColetorEfConfig());
            modelBuilder.Configurations.Add(new OpcaoListaColetorEfConfig());
            modelBuilder.Configurations.Add(new CampoTipoRecursoEfConfig());

            modelBuilder.Configurations.Add(new ResponsabilidadeEfConfig());
            modelBuilder.Configurations.Add(new ModuloClienteEfConfig());
            modelBuilder.Configurations.Add(new PessoaFisJurEfConfig());
            modelBuilder.Configurations.Add(new PessoaEntregaEfConfig());
            modelBuilder.Configurations.Add(new DocumentosPessoaEfConfig());

            //saneamento
            modelBuilder.Configurations.Add(new LeituraEfConfig());
            modelBuilder.Configurations.Add(new ValidacaoCampoAtendimentoEfConfig());
            modelBuilder.Configurations.Add(new AtendimentoEfConfig());
            modelBuilder.Configurations.Add(new HidrometroLigacaoEfConfig());
            modelBuilder.Configurations.Add(new TerrenoEfConfig());
            modelBuilder.Configurations.Add(new ImovelEfConfig());
            modelBuilder.Configurations.Add(new GuiaRecolhimentoEfConfig());
            modelBuilder.Configurations.Add(new BairroEfConfig());
            modelBuilder.Configurations.Add(new HidrometroEfConfig());
            modelBuilder.Configurations.Add(new MarcaEfConfig());
            modelBuilder.Configurations.Add(new VazaoEfConfig());
            modelBuilder.Configurations.Add(new DocumentoLigacaoEfConfig());
            modelBuilder.Configurations.Add(new EquipamentoEfConfig());
            modelBuilder.Configurations.Add(new MaoObraEventoEfConfig());
            modelBuilder.Configurations.Add(new ManobraDescargaEventoEfConfig());
            modelBuilder.Configurations.Add(new TipoExecucaoEfConfig());
            modelBuilder.Configurations.Add(new LeituristaEfConfig());
            modelBuilder.Configurations.Add(new LocalizacaoRedeEfConfig());
            modelBuilder.Configurations.Add(new TipoMaterialRedeEfConfig());
            modelBuilder.Configurations.Add(new TipoCondicaoRedeEfConfig());
            modelBuilder.Configurations.Add(new TipoDiametroRedeEfConfig());
            modelBuilder.Configurations.Add(new TipoRegistroEfConfig());
            modelBuilder.Configurations.Add(new TipoRecusaVistoriaEfConfig());
            modelBuilder.Configurations.Add(new TipoOcorrenciaCidadaoEfConfig());
            modelBuilder.Configurations.Add(new LigacaoEfConfig());
            modelBuilder.Configurations.Add(new TipoCorteEfConfig());
            modelBuilder.Configurations.Add(new PavimentacaoLeitoEfConfig());
            modelBuilder.Configurations.Add(new PavimentacaoPasseioEfConfig());
            modelBuilder.Configurations.Add(new TipoLigacaoEfConfig());
            modelBuilder.Configurations.Add(new CepLogradouroEfConfig());
            modelBuilder.Configurations.Add(new BairroLogradouroEfConfig());
            modelBuilder.Configurations.Add(new OcorrenciaCidadaoEfConfig());
            modelBuilder.Configurations.Add(new CategoriaLigacaoEfConfig());
            modelBuilder.Configurations.Add(new ParametroWebEfConfig());
            modelBuilder.Configurations.Add(new MaterialServicoEfConfig());
            modelBuilder.Configurations.Add(new LigacaoFoneticaEfConfig());
            modelBuilder.Configurations.Add(new HistoricoLigacaoEfConfig());
            modelBuilder.Configurations.Add(new ContaEfConfig());
            modelBuilder.Configurations.Add(new AtividadeEfConfig());
            modelBuilder.Configurations.Add(new TipoServicoDeptoEncerrarEfConfig());
            modelBuilder.Configurations.Add(new LocalizacaoCavaleteEfConfig());
            modelBuilder.Configurations.Add(new CondominioEfConfig());
            modelBuilder.Configurations.Add(new SituacaoHidrometroEfConfig());
            modelBuilder.Configurations.Add(new SituacaoEsgotoEfConfig());
            modelBuilder.Configurations.Add(new SituacaoLigacaoEfConfig());
            modelBuilder.Configurations.Add(new MotivoTrocaEfConfig());
            modelBuilder.Configurations.Add(new HistoricoCategoriaEfConfig());
            modelBuilder.Configurations.Add(new CodigoClassificacaoEfConfig());
            modelBuilder.Configurations.Add(new TabelaCriticaEfConfig());
            modelBuilder.Configurations.Add(new TrocaHidrometroEfConfig());
            modelBuilder.Configurations.Add(new TipoNotificacaoEfConfig());
            modelBuilder.Configurations.Add(new FinalidadeNotificacaoEfConfig());
            modelBuilder.Configurations.Add(new CodigoRetencaoEfConfig());
            modelBuilder.Configurations.Add(new CarneParcelaEfConfig());
            modelBuilder.Configurations.Add(new CarneEfConfig());
            modelBuilder.Configurations.Add(new LogradouroFoneticaEfConfig());
            modelBuilder.Configurations.Add(new HistoricoNotificacaoEfConfig());
            modelBuilder.Configurations.Add(new HistoricoNotificacaoCarneEfConfig());
            modelBuilder.Configurations.Add(new GrupoSSBEfConfig());
            modelBuilder.Configurations.Add(new CaixaInspecaoEsgotoEfConfig());
            modelBuilder.Configurations.Add(new TipoLancamentoEfConfig());
            modelBuilder.Configurations.Add(new UsuarioEfConfig());
            modelBuilder.Configurations.Add(new TipoValaEfConfig());
            modelBuilder.Configurations.Add(new CarneServicoEfConfig());
            modelBuilder.Configurations.Add(new SetorAbastecimentoBairroEfConfig());
            modelBuilder.Configurations.Add(new OcorrenciaDeptoEfConfig());
            modelBuilder.Configurations.Add(new EventoValaEfConfig());
            modelBuilder.Configurations.Add(new TipoResponsavelEfConfig());
            modelBuilder.Configurations.Add(new EventoObservacaoEfConfig());
            modelBuilder.Configurations.Add(new EventoAndamentoEfConfig());
            modelBuilder.Configurations.Add(new SetorEfConfig());
            modelBuilder.Configurations.Add(new BairroLoteamentoEfConfig());
            modelBuilder.Configurations.Add(new LoteamentoEfConfig());
            modelBuilder.Configurations.Add(new ImobiliariaEfConfig());
            modelBuilder.Configurations.Add(new ImobiliariaLigacaoEfConfig());
            modelBuilder.Configurations.Add(new EstadoCivilEfConfig());
            modelBuilder.Configurations.Add(new RedeAguaEfConfig());
            modelBuilder.Configurations.Add(new RedeEsgotoEfConfig());
            modelBuilder.Configurations.Add(new RegiaoEfConfig());
            modelBuilder.Configurations.Add(new TiposChamadoServicoEfConfig());
            modelBuilder.Configurations.Add(new CronogramaServicoAtivarEfConfig());
            modelBuilder.Configurations.Add(new FeriadoEfConfig());
        }
    }
}