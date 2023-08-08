using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web.Http;
using System.Net;
using Cebi.Util.WebApi;
using Cebi.Atendimento.Domain.Services.RegistroEventos;
using Cebi.Atendimento.Domain.Services.OrdensServico;
using Cebi.Atendimento.Domain.Services.Eventos;
using Cebi.Atendimento.Domain.DTO;
using Cebi.Atendimento.Domain.Interfaces;
using Cebi.Atendimento.Dal;
using Cebi.Atendimento.Domain.Entities;
using Cebi.Util.WebApi.Messaging;
using Cebi.Atendimento.Domain.Services.Ligacoes;
using Cebi.Stm.Agencia.Domain.Services.AtualizacaoDocumento;
using Cebi.Stm.Agencia.Domain.Interfaces;
using Cebi.Stm.Agencia.Dal;
using Cebi.Stm.Agencia.Domain.Services.AtualizacaoEnderecoEntrega;
using Cebi.Atendimento.Api.Services;
using Cebi.Util.WebApi.Filters;
using Cebi.Atendimento.Domain.Enums;
using Cebi.Util;
using Cebi.Atendimento.Domain.Services.ProgramacaoOrdensServico;
using Cebi.Atendimento.Domain.Services.ConfirmacaoImpressaoOs;
using Cebi.Atendimento.Domain.Services.ReenviarOrdensServicoService;
using Cebi.Atendimento.Domain.Services.Historico;
using Cebi.Atendimento.Domain.Services.ParametrosWeb;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Web.UI.WebControls;
using Cebi.Atendimento.Domain.Services.Chamados;
using System.Threading.Tasks;

namespace Cebi.Atendimento.Api.Controllers
{
    [RoutePrefix("ManutencaoOrdensServico")]
    public class ManutencaoOrdensServicoController : ApiController
    {
        private TratamentoErroDTO retornoErros = new TratamentoErroDTO();

        private readonly IAtendimentoUnitOfWork _unit;
        private readonly IAgenciaUnitOfWork _agenciaUnit;
        //Objeto para realizar lock no método ProgramarColetorOrdensDeServico
        private static readonly object lockObj = new object();

        public ManutencaoOrdensServicoController()
        {
            _unit = new AtendimentoUnitOfWork();
            _agenciaUnit = new AgenciaUnitOfWork();
        }

        [HttpPost]
        [Route("CriarEvento")]
        public IHttpActionResult DadosEvento(DadosOsEventoDTO retorno)
        {
            int eventoIdGerado = 0;

            if (!Validacoes(retorno))
            {
                retornoErros.UserNotification = "Erro na validação do formulário. Por favor, verifique.";
                return Content(HttpStatusCode.BadRequest, retornoErros);
            }

            Funcionario funcionario = ObterFuncionarioService.Executar(_unit);

            var registroEventoService = new RegistroEventosService(_unit);

            eventoIdGerado = registroEventoService.ProcessarDadosEvento(retorno, funcionario.RE);

            return Ok(eventoIdGerado);
        }

        [HttpPut]
        [Route("AtualizarEvento")]
        public IHttpActionResult AtualizarDadosEvento(DadosOsEventoDTO retorno)
        {

            Funcionario funcionario = ObterFuncionarioService.Executar(_unit);

            var registroEventoService = new RegistroEventosService(_unit);

            var evento = _unit.Eventos.Get(retorno.EventoId);

            if (!registroEventoService.VerificarUsuarioLogadoPodeEncerrarEvento(retorno.DadosEvento.FirstOrDefault().TipoServicoId, funcionario.CustoId, evento.CentroCustoId))
            {
                var retornoErro = new TratamentoErroDTO();
                retornoErro.UserNotification = "Seu Departamento não tem permissão para alterar este Evento.";
                return Content(HttpStatusCode.BadRequest, retornoErro);
            }

            if (!Validacoes(retorno))
            {
                retornoErros.UserNotification = "Erro na validação do formulário. Por favor, verifique.";
                return Content(HttpStatusCode.BadRequest, retornoErros);
            }

            registroEventoService.ProcessarDadosEvento(retorno, funcionario.RE);

            return Ok("Evento atualizado.");
        }

        [Route("EditarDados")]
        [CebiPerfilAuthorize("gServ.ordemServico.alteracao")]
        public IHttpActionResult PutDadosOs(DadosManutencaoOrdemServicoDTO retorno)
        {
            Funcionario funcionario = ObterFuncionarioService.Executar(_unit);

            OrdensServicoService osS = new OrdensServicoService(_unit);

            osS.ProcessarDadosOrdemdeServico(retorno, funcionario.RE);

            return Ok("Informações da O.S. atualizadas.");
        }

        [HttpPut]
        [Route("EncerrarOrdemServico")]
        [CebiPerfilAuthorize("gServ.ordemServico.encerrarOS")]
        public IHttpActionResult EncerrarOrdemServico(DadosManutencaoOrdemServicoDTO command)
        {
            HistoricoService hs = new HistoricoService(_unit);

            var osService = new OrdensServicoService(_unit);
            string celularSolicitante = ObterTelefoneSolicitante(command.OrdemServicoId);
            Funcionario funcionario = ObterFuncionarioService.Executar(_unit);

            if (!osService.VerificarDepartamentoPodeEncerrarOrdemdeServico(funcionario.CustoId, command.TipoChamadoId))
            {
                var retornoErro = new TratamentoErroDTO();
                retornoErro.UserNotification = "Seu Departamento não tem permissão para encerrar esta Ordem de Serviço.";
                return Content(HttpStatusCode.BadRequest, retornoErro);
            }

            if (osService.VerificarOrdemdeServicoTemEventosAbertos(command.OrdemServicoId))
            {
                var retornoErro = new TratamentoErroDTO();
                retornoErro.UserNotification = "Ordem de Serviço possui evento(s) em aberto.";
                return Content(HttpStatusCode.BadRequest, retornoErro);
            }

            // encerrar OS
            var encerrarOsService = new EncerrarOrdemServicoService(_unit);
            encerrarOsService.Executar(command, funcionario.RE);

            _unit.Complete();

            var ls = new LigacoesService(_unit);

            ls.LancaProprietarioConsumidorChamadoLigacao(command.OrdemServicoId, funcionario.FuncionarioId);

            var chamado = _unit.Chamados.Find(x => x.OrdemServicoId == command.OrdemServicoId).OrderBy(x => x.ChamadoId).FirstOrDefault();

            //Grava Histórico na Ligação
            if (chamado.Cdc != null)
            {
                var parametrosWebService = new ParametrosWebService(_unit);
                var utilizaApiExternaParaAberturadeOSporLigacao = (bool)parametrosWebService.ObterValorParametro(ParametrosWebPadrao.UtilizaApiExternaParaAberturadeOSporLigacao);

                if (utilizaApiExternaParaAberturadeOSporLigacao == false)
                {
                    var dadosPedido = _unit.DadosPedidos.Find(x => x.ChamadoId == chamado.ChamadoId).FirstOrDefault();

                    string descricaoHistoricoLigacao = "Encerrada a Ordem de Serviço: " + command.OrdemServicoId + "  Chamado: " + chamado.ChamadoId + "\n" +
                                                       "Data :" + chamado.DataHoraChamado + "\n" +
                                                       "Tipo de Chamado: " + chamado.OrdemServico.TipoChamado.TipoChamadoId + " - " + chamado.OrdemServico.TipoChamado.Descricao + "\n";

                    if (chamado.OrdemServico.ReFuncionarioIdEncarregado != null)
                    {
                        var funcionarioEncarregado = _unit.Funcionario.Find(x => x.RE == chamado.OrdemServico.ReFuncionarioIdEncarregado).FirstOrDefault();
                        descricaoHistoricoLigacao += "Encarregado: " + chamado.OrdemServico.ReFuncionarioIdEncarregado + " - " + funcionarioEncarregado.NomeFuncionario + "\n";
                    }

                    if (chamado.OrdemServico.ViaturaId != null)
                    {
                        var viatura = _unit.Viaturas.Find(x => x.ViaturaId == chamado.OrdemServico.ViaturaId).FirstOrDefault();
                        descricaoHistoricoLigacao += "Viatura: " + chamado.OrdemServico.ViaturaId + viatura.Descricao + "\n";
                    }

                    if (chamado.ImobiliariaId != null)
                    {
                        var imobiliaria = _unit.Imobiliarias.Find(x => x.ImobiliariaId == chamado.ImobiliariaId).FirstOrDefault();
                        descricaoHistoricoLigacao += "Imobiliária: " + imobiliaria.Descricao + "\n";
                    }

                    if (chamado.Observacao != null)
                    {
                        descricaoHistoricoLigacao += "Observação: " + chamado.Observacao + "\n\n";
                    }
                    else
                    {
                        descricaoHistoricoLigacao += "\n";
                    }

                    descricaoHistoricoLigacao += "Evento(s) executado(s):" + "\n\n";

                    var designativo = _unit.Designativos.Get(1);

                    if (designativo.GeraHistoricoEncerramento == true)
                    {
                        var eventos = _unit.Eventos.Find(x => x.OrdemServicoId == command.OrdemServicoId).OrderBy(x => x.Sequencia);

                        foreach (var evento in eventos)
                        {
                            EventosService evS = new EventosService(_unit);

                            DadosEventoHistoricoEncerramentoDTO dadosEventoHistorico = evS.ObterDadosEventoHistoricoEncerramentoOS(evento.EventoId);

                            descricaoHistoricoLigacao += dadosEventoHistorico.Historico + "\n";
                        }

                        if (descricaoHistoricoLigacao.Length <= 2000)
                        {
                            hs.gravarHistorico(descricaoHistoricoLigacao, chamado.Cdc ?? 0, funcionario.FuncionarioId, 17);
                        }
                        else
                        {
                            hs.gravarHistorico(descricaoHistoricoLigacao.Substring(0, 1900), chamado.Cdc ?? 0, funcionario.FuncionarioId, 17);

                            if (descricaoHistoricoLigacao.Length > 1900 && descricaoHistoricoLigacao.Length <= 3800)
                            {
                                hs.gravarHistorico("Encerrada a Ordem de Serviço: " + command.OrdemServicoId + "  Chamado: " + chamado.ChamadoId + "\n\n" + descricaoHistoricoLigacao.Substring(1900), chamado.Cdc ?? 0, funcionario.FuncionarioId, 17);
                            }
                            else
                            {
                                hs.gravarHistorico("Encerrada a Ordem de Serviço: " + command.OrdemServicoId + "  Chamado: " + chamado.ChamadoId + "\n\n" + descricaoHistoricoLigacao.Substring(1900, 1900), chamado.Cdc ?? 0, funcionario.FuncionarioId, 17);

                                if (descricaoHistoricoLigacao.Length > 3800 && descricaoHistoricoLigacao.Length <= 5700)
                                {
                                    hs.gravarHistorico("Encerrada a Ordem de Serviço: " + command.OrdemServicoId + "  Chamado: " + chamado.ChamadoId + "\n\n" + descricaoHistoricoLigacao.Substring(3800), chamado.Cdc ?? 0, funcionario.FuncionarioId, 17);
                                }
                                else
                                {
                                    hs.gravarHistorico("Encerrada a Ordem de Serviço: " + command.OrdemServicoId + "  Chamado: " + chamado.ChamadoId + "\n\n" + descricaoHistoricoLigacao.Substring(3800, 1900), chamado.Cdc ?? 0, funcionario.FuncionarioId, 17);

                                    if (descricaoHistoricoLigacao.Length > 5700 && descricaoHistoricoLigacao.Length <= 7600)
                                    {
                                        hs.gravarHistorico("Encerrada a Ordem de Serviço: " + command.OrdemServicoId + "  Chamado: " + chamado.ChamadoId + "\n\n" + descricaoHistoricoLigacao.Substring(5700), chamado.Cdc ?? 0, funcionario.FuncionarioId, 17);
                                    }
                                    else
                                    {
                                        hs.gravarHistorico("Encerrada a Ordem de Serviço: " + command.OrdemServicoId + "  Chamado: " + chamado.ChamadoId + "\n\n" + descricaoHistoricoLigacao.Substring(5700, 1900), chamado.Cdc ?? 0, funcionario.FuncionarioId, 17);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // enviar SMS ------------------------
            if (!string.IsNullOrEmpty(celularSolicitante))
            {
                new NotificarSmsOrdemServicoEncerradaService().Executar(command.OrdemServicoId);
            }
            // -----------------------------------
            return Ok("Ordem de Serviço encerrada.");
        }

        [HttpPut]
        [Route("LancarServicoOrdemServico")]
        [CebiPerfilAuthorize("gServ.ordemServico.encerrarOS")]
        public IHttpActionResult LancarServicoOrdemServico(DadosManutencaoOrdemServicoDTO command)
        {
            Funcionario funcionario = ObterFuncionarioService.Executar(_unit);
            var ls = new LigacoesService(_unit);

            if (command.LancaServico == 2)
            {
                ls.LancaCobrancaServicosChamadoLigacao(command.OrdemServicoId, funcionario.FuncionarioId);
            }
            else
            {
                OrdensServicoService os = new OrdensServicoService(_unit);
                //Grava Histórico na Ordem de Serviço
                os.GerarHistoricoOrdemdeServico(command.OrdemServicoId, funcionario.RE, "Encerramento da Ordem de Serviço foi executado sem a cobrança do(s) serviço(s).");
            }

            return Ok();
        }

        [HttpPut]
        [Route("AlterarEnderecoChamado")]
        public IHttpActionResult AlterarEnderecoChamado(DadosAlterarEnderecoChamadoDTO model)
        {
            var historico = "";

            OrdensServicoService os = new OrdensServicoService(_unit);
            ChamadosService chaS = new ChamadosService(_unit);

            Funcionario funcionario = ObterFuncionarioService.Executar(_unit);

            var chamado = _unit.Chamados.Get(model.ChamadoId);
            var dadosPedido = _unit.DadosPedidos.Find(x => x.ChamadoId == model.ChamadoId).FirstOrDefault();

            if (chamado.LogradouroId != model.LogradouroId)
            {
                var logradouro = _unit.Logradouros.Get(model.LogradouroId);
                historico = "Logradouro Anterior: " + chamado.Logradouro.Abreviacao + " " + chamado.Logradouro.Titulo + " " + chamado.Logradouro.Nome + "\n";
                historico += "Logradouro Atual: " + logradouro.Abreviacao + " " + logradouro.Titulo + " " + logradouro.Nome + "\n";
                chamado.LogradouroId = model.LogradouroId;
            }

            if (chamado.NroEndChamado != model.NumeroEndereco)
            {
                historico += "Número Anterior: " + chamado.NroEndChamado + "\n";
                historico += "Número Atual: " + model.NumeroEndereco + "\n";
                chamado.NroEndChamado = model.NumeroEndereco;
            }

            if (dadosPedido.BairroId != model.BairroId)
            {
                if (dadosPedido.Bairro != null)
                {
                    historico += "Bairro Anterior: " + dadosPedido.Bairro.Descricao + "\n";
                }
                else
                {
                    historico += "Bairro Anterior: " + "\n";
                }

                var bairro = _unit.Bairros.Get(model.BairroId);
                if (bairro != null)
                {
                    historico += "Bairro Atual: " + bairro.Descricao + "\n";
                }
                else
                {
                    historico += "Bairro Atual: " + "\n";
                }

                chamado.Bairro = bairro.Descricao;
                dadosPedido.BairroId = bairro.BairroId;
            }

            if (chamado.Cep != model.Cep)
            {
                historico += "Cep Anterior: " + chamado.Cep + "\n";
                historico += "Cep Atual: " + model.Cep + "\n";
                chamado.Cep = model.Cep;
            }

            if (chamado.LoteamentoId != model.LoteamentoId)
            {
                if (chamado.Loteamento != null)
                {
                    historico += "Loteamento Anterior: " + chamado.Loteamento.Nome + "\n";
                }
                else
                {
                    historico += "Loteamento Anterior: " + "\n";
                }

                var loteamento = _unit.Loteamentos.Get(model.LoteamentoId);

                if (loteamento != null)
                {
                    historico += "Loteamento Atual: " + loteamento.Nome + "\n";
                }
                else
                {
                    historico += "Loteamento Atual: " + "\n";
                }

                chamado.LoteamentoId = model.LoteamentoId;
            }

            _unit.Chamados.Update(chamado);
            _unit.DadosPedidos.Update(dadosPedido);
            _unit.Complete();

            //Grava Histórico no Chamado
            historico = "Alteração de Endereço do Chamado: " + "\n" + "\n" + historico;

            chaS.GerarHistoricoChamado(chamado.ChamadoId, funcionario.RE, historico);

            return Ok("Executada Alteração do Endereço");
        }

        [HttpPut]
        [Route("BloquearOrdemServico")]
        [CebiPerfilAuthorize("gServ.ordemServico.bloquearOS")]
        public IHttpActionResult BloquearOrdemServico(DadosManutencaoOrdemServicoDTO retorno)
        {
            Funcionario funcionario = ObterFuncionarioService.Executar(_unit);

            OrdensServicoService osS = new OrdensServicoService(_unit);

            osS.BloquearOrdemdeServico(retorno, funcionario.RE);

            return Ok("Ordem de serviço bloqueada.");
        }

        [HttpPut]
        [Route("DesbloquearOrdemServico")]
        [CebiPerfilAuthorize("gServ.ordemServico.desbloquearOS")]
        public IHttpActionResult DesbloquearOrdemServico(DadosManutencaoOrdemServicoDTO retorno)
        {

            Funcionario funcionario = ObterFuncionarioService.Executar(_unit);

            OrdensServicoService osS = new OrdensServicoService(_unit);

            if (!osS.VerificarFuncionarioPodeDesbloquearOrdemServico(retorno.OrdemServicoId, funcionario.RE))
            {
                var retornoErro = new TratamentoErroDTO();
                retornoErro.UserNotification = "Ordem de Serviço bloqueada por outro funcionário!";
                return Content(HttpStatusCode.BadRequest, retornoErro);
            }

            osS.DesbloquearOrdemdeServico(retorno, funcionario.RE);

            return Ok("Ordem de Serviço desbloqueada.");
        }

        [HttpPut]
        [Route("ReativarOrdemServico")]
        [CebiPerfilAuthorize("gServ.ordemServico.reativarOS")]
        public IHttpActionResult ReativarOrdemServico(DadosManutencaoOrdemServicoDTO retorno)
        {
            Funcionario funcionario = ObterFuncionarioService.Executar(_unit);

            OrdensServicoService osS = new OrdensServicoService(_unit);

            osS.ReativarOrdemdeServico(retorno, funcionario.RE);

            return Ok("Ordem de serviço reativada.");
        }

        [HttpGet]
        [Route("{eventoId}/ObterPermissaoEvento")]
        public IHttpActionResult ObterPermissaoEvento(int eventoId)
        {
            Funcionario funcionario = ObterFuncionarioService.Executar(_unit);

            EventosService evS = new EventosService(_unit);

            EventosPermissaoResult eventoPermissao = evS.ObterPermissaoEvento(eventoId, funcionario.RE);

            return Ok(eventoPermissao);
        }

        [HttpGet]
        [Route("{eventoId}/ObterListaComplementarEvento")]
        public IHttpActionResult ObterListaComplementarEvento(int eventoId, Atendimento.Domain.Enums.ListaComplementarEventoEnum listaId)
        {
            EventosService evS = new EventosService(_unit);

            Funcionario funcionario = ObterFuncionarioService.Executar(_unit);

            if (listaId == Atendimento.Domain.Enums.ListaComplementarEventoEnum.Materiais)
            {
                List<EventosMateriaisResult> eventoLista = evS.ObterListasComplementaresEvento(eventoId, listaId, funcionario.RE).Materiais;
                return Ok(eventoLista);
            }
            else if (listaId == Atendimento.Domain.Enums.ListaComplementarEventoEnum.Equipamentos)
            {
                List<EventosEquipamentosResult> eventoLista = evS.ObterListasComplementaresEvento(eventoId, listaId, funcionario.RE).Equipamentos;
                return Ok(eventoLista);
            }
            else if (listaId == Atendimento.Domain.Enums.ListaComplementarEventoEnum.MaodeObras)
            {
                List<EventosMaodeObraResult> eventoLista = evS.ObterListasComplementaresEvento(eventoId, listaId, funcionario.RE).MaodeObra;
                return Ok(eventoLista);
            }
            else if (listaId == Atendimento.Domain.Enums.ListaComplementarEventoEnum.Servicos)
            {
                List<EventosServicosResult> eventoLista = evS.ObterListasComplementaresEvento(eventoId, listaId, funcionario.RE).Servicos;
                return Ok(eventoLista);
            }
            else if (listaId == Atendimento.Domain.Enums.ListaComplementarEventoEnum.Artigos)
            {
                List<EventosArtigosResult> eventoLista = evS.ObterListasComplementaresEvento(eventoId, listaId, funcionario.RE).Artigos;
                return Ok(eventoLista);
            }
            else if (listaId == Atendimento.Domain.Enums.ListaComplementarEventoEnum.RegistrodeManobras)
            {
                List<EventosRegistrodeManobrasResult> eventoLista = evS.ObterListasComplementaresEvento(eventoId, listaId, funcionario.RE).RegistrodeManobras;
                return Ok(eventoLista);
            }
            else if (listaId == Atendimento.Domain.Enums.ListaComplementarEventoEnum.InformacoesAdicionais)
            {
                List<EventosInformacoesAdicionaisResult> eventoLista = evS.ObterListasComplementaresEvento(eventoId, listaId, funcionario.RE).InformacoesAdicionais;
                return Ok(eventoLista);
            }
            else if (listaId == Atendimento.Domain.Enums.ListaComplementarEventoEnum.Tarefas)
            {
                List<EventosTarefasResult> eventoLista = evS.ObterListasComplementaresEvento(eventoId, listaId, funcionario.RE).Tarefas;
                return Ok(eventoLista);
            }
            else if (listaId == Atendimento.Domain.Enums.ListaComplementarEventoEnum.Funcoes)
            {
                List<EventosFuncoesResult> eventoLista = evS.ObterListasComplementaresEvento(eventoId, listaId, funcionario.RE).Funcoes;
                return Ok(eventoLista);
            }
            else if (listaId == Atendimento.Domain.Enums.ListaComplementarEventoEnum.Documentos)
            {
                List<EventosDocumentosResult> eventoLista = evS.ObterListasComplementaresEvento(eventoId, listaId, funcionario.RE).Documentos;
                return Ok(eventoLista);
            }
            else if (listaId == ListaComplementarEventoEnum.Valas)
            {
                List<EventosValaResult> eventoLista = evS.ObterListasComplementaresEvento(eventoId, listaId, funcionario.RE).Valas;
                return Ok(eventoLista);
            }
            else if (listaId == ListaComplementarEventoEnum.Observacoes)
            {
                List<EventosObservacoesResult> eventoLista = evS.ObterListasComplementaresEvento(eventoId, listaId, funcionario.RE).Observacoes;
                return Ok(eventoLista);
            }
            else if (listaId == ListaComplementarEventoEnum.Andamentos)
            {
                List<EventosAndamentosResult> eventoLista = evS.ObterListasComplementaresEvento(eventoId, listaId, funcionario.RE).Andamentos;
                return Ok(eventoLista);
            }

            return Ok();

        }

        [HttpPost]
        [Route("ImprimirPesquisaProgramacao")]
        public IHttpActionResult ObterDadosPesquisaProgramacao(DadosRecursoDTO retorno)
        {

            var CartaRetornoReport = new Atendimento.Reports.OrdemServicoProgramacao(_unit);
            var bytes = CartaRetornoReport.GetPdf(retorno);

            var arquivo = new DownloadArquivoDTO
            {
                file = (byte[])bytes
            };

            return Ok(arquivo);
        }

        [HttpPost]
        [Route("ImprimirPesquisaOS")]
        public IHttpActionResult ObterDadosPesquisaOS(DadosRecursoDTO retorno)
        {

            var CartaRetornoReport = new Atendimento.Reports.OrdemServicoConsulta(_unit);
            var bytes = CartaRetornoReport.GetPdf(retorno);

            var arquivo = new DownloadArquivoDTO
            {
                file = (byte[])bytes
            };

            return Ok(arquivo);
        }

        [HttpPost]
        [Route("OrdensdeServicoParaProgramacao")]
        [CebiPerfilAuthorize("gServ.ordensServicoProgramacao.pesquisar")]
        public IHttpActionResult ObterOrdensdeServicoParaProgramacao(DadosRecursoDTO retorno)
        {
            var camposFiltro = new CamposFiltroProgramacaoOrdensServicoDTO();

            foreach (var dados in retorno.DadosCampos)
            {
                var campo = _unit.Campos.Get(dados.Id);

                switch (campo.Tabela.Nome)
                {
                    case "Filtros":

                        var tipo = typeof(CamposFiltroProgramacaoOrdensServicoDTO);

                        PropertyInfo novoFiltro = tipo.GetProperty(campo.CampoTabelaClasse);

                        if (!string.IsNullOrEmpty(dados.Dados))
                        {
                            if (novoFiltro.PropertyType == typeof(DateTime) || novoFiltro.PropertyType == typeof(DateTime?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToDateTime(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(decimal) || novoFiltro.PropertyType == typeof(decimal?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToDecimal(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(int) || novoFiltro.PropertyType == typeof(int?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(bool) || novoFiltro.PropertyType == typeof(bool?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToBoolean(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(string))
                            {
                                novoFiltro.SetValue(camposFiltro, dados.Dados);
                            }
                            else if (novoFiltro.PropertyType == typeof(Cebi.Atendimento.Domain.Enums.OrdenarProgramacaoOrdensServicoEnum))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(Cebi.Atendimento.Domain.Enums.SituacaoProgramacaoOrdensServicoEnum))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(Cebi.Atendimento.Domain.Enums.SituacaoAgendamentoProgramacaoOrdensServicoEnum))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(Cebi.Atendimento.Domain.Enums.TipoOrdemServicoEnum))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(Cebi.Atendimento.Domain.Enums.SituacaoGuiaProgramacaoOrdensServicoEnum))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(Cebi.Atendimento.Domain.Enums.SituacaoExecucaoProgramacaoOrdensServicoEnum))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                        }
                        else
                        {
                            novoFiltro.SetValue(camposFiltro, null);
                        }

                        break;

                }
            }

            var funcionarioLogado = CebiIdentity.ObterFuncionarioId().Value;
            var funcionario = _unit.Funcionarios.Find(x => x.FuncionarioId == funcionarioLogado).SingleOrDefault();
            camposFiltro.EquipeFuncionarioLogadoId = funcionario.EquipeId;

            OrdensServicoService osS = new OrdensServicoService(_unit);

            var parametrosWebService = new ParametrosWebService(_unit);
            int tipoIntegracaoSistema = Convert.ToInt32(parametrosWebService.ObterValorParametro(ParametrosWebPadrao.TipoIntegracaoSistema));
            bool impressaoLista = parametrosWebService.ObterValorParametro(ParametrosWebPadrao.UtilizaImpressaoOsLista);

            //int tipoPersonalizacaoProgramacaoOs = Convert.ToInt32(parametrosWebService.ObterValorParametro(ParametrosWebPadrao.TipoPersonalizacaoProgramacaoOS));

            List<OrdensServicoParaProgramacaoResult> ordensServicoProgramacao = _unit.OrdensServico.ObterOrdensServicoParaProgramacao(camposFiltro);

            int utilizaColetor = _unit.Equipes.Find(x => x.UsaColetor == true && x.Inutilizada == false).Count();
            foreach (var ordemservico in ordensServicoProgramacao)
            {
                ordemservico.DescricaoPrioridade = Enumerations.GetEnumDescription(ordemservico.Prioridade);
                ordemservico.Endereco = ordemservico.Abreviacao + " " + ordemservico.Titulo + " " + ordemservico.Endereco + " , " + ordemservico.NroEnd;

                if (ordemservico.Complemento != null)
                {
                    ordemservico.Endereco += " -  " + ordemservico.Complemento;
                }

                switch (ordemservico.PeriodoAgendamento)
                {
                    case 0:
                        ordemservico.DescricaoPeriodo = Enumerations.GetEnumDescription(PeriodoAgendamentoEnum.Ambos);
                        break;

                    case 1:
                        ordemservico.DescricaoPeriodo = Enumerations.GetEnumDescription(PeriodoAgendamentoEnum.Manha);
                        break;

                    case 2:
                        ordemservico.DescricaoPeriodo = Enumerations.GetEnumDescription(PeriodoAgendamentoEnum.Tarde);
                        break;
                }

                if (ordemservico.UnidadeTempo == "Min.")
                {
                    ordemservico.CargaHoraria = (decimal)ordemservico.Prazo / 60;
                }
                else if (ordemservico.UnidadeTempo == "Dia")
                {
                    ordemservico.CargaHoraria = (decimal)ordemservico.Prazo * 24;
                }
                else
                {
                    ordemservico.CargaHoraria = (decimal)ordemservico.Prazo;
                }

                ordemservico.CargaHoraria = Math.Round(ordemservico.CargaHoraria, 2);

                //if (tipoPersonalizacaoProgramacaoOs == 2)
                //{
                //    if (ordemservico.DataAberturaEvento.AddHours((double)ordemservico.CargaHoraria) < DateTime.Now)
                //    {
                //        ordemservico.StatusProgramacaoEvento = StatusProgramacaoEventoEnum.NaoProgramadoEmAtraso;
                //    }
                //    else if (ordemservico.DataAberturaEvento.AddHours((double)ordemservico.CargaHoraria / 2) >= DateTime.Now)
                //    {
                //        ordemservico.StatusProgramacaoEvento = StatusProgramacaoEventoEnum.ProgramadoSemAtraso;
                //    }
                //    else if (ordemservico.DataAberturaEvento.AddHours((double)ordemservico.CargaHoraria / 2) < DateTime.Now)
                //    {
                //        ordemservico.StatusProgramacaoEvento = StatusProgramacaoEventoEnum.ProgramadoEmAtraso;
                //    }

                //    ordemservico.DescricaoLegendaVerde = "No Prazo";
                //    ordemservico.DescricaoLegendaAmarela = "A Vencer";
                //    ordemservico.DescricaoLegendaVermelha = "Em Atraso";
                //    ordemservico.DescricaoLegendaBranca = "";
                //}
                //else
                //{

                // Evento Normal
                if (ordemservico.DataAberturaEvento.AddHours((double)ordemservico.CargaHoraria) >= DateTime.Now)
                {
                    // Não Programado
                    if (ordemservico.DataAgendamento == null)
                    {
                        ordemservico.StatusProgramacaoEvento = StatusProgramacaoEventoEnum.NaoProgramadoSemAtraso;
                    }
                    // Programado
                    else
                    {
                        ordemservico.StatusProgramacaoEvento = StatusProgramacaoEventoEnum.ProgramadoSemAtraso;
                    }

                }
                // Evento Em Atraso
                else
                {
                    // Não Programado
                    if (ordemservico.DataAgendamento == null)
                    {
                        ordemservico.StatusProgramacaoEvento = StatusProgramacaoEventoEnum.NaoProgramadoEmAtraso;
                    }
                    // Programado
                    else
                    {
                        ordemservico.StatusProgramacaoEvento = StatusProgramacaoEventoEnum.ProgramadoEmAtraso;
                    }

                }

                ordemservico.DescricaoLegendaVerde = "Programado sem atraso";
                ordemservico.DescricaoLegendaAmarela = "Programado em atraso";
                ordemservico.DescricaoLegendaVermelha = "Não programado em atraso";
                ordemservico.DescricaoLegendaBranca = "Não programado sem atraso";

                //}

                ordemservico.DescricaoEquipe = ordemservico.EquipeId + " - " + ordemservico.DescricaoEquipe;

                var hoje = DateTime.Now;
                var dataAberturaEvento = ordemservico.DataAberturaEvento;

                TimeSpan ts = hoje - dataAberturaEvento;
                ordemservico.TempoDecorrido = Math.Round(ts.TotalHours, 2);

                ordemservico.QtdChamados = osS.ObterQtdChamadosOrdemServico(ordemservico.OrdemServicoId);

                ordemservico.StatusPagamentoOs = osS.ObterStatusPagamentoOrdemServico(ordemservico.OrdemServicoId);

                ordemservico.TipoIntegracaoSistema = tipoIntegracaoSistema;

                if (utilizaColetor > 0)
                {
                    ordemservico.UtilizaColetor = true;
                }
                else
                {
                    ordemservico.UtilizaColetor = false;
                }

                ordemservico.UtilizaImpressaoOsLista = impressaoLista;
            }

            return Ok(ordensServicoProgramacao);

        }

        [HttpPost]
        [Route("OrdensdeServicoEmExecucaoParaProgramacao")]
        public IHttpActionResult ObterOrdensdeServicoEmExecucaoParaProgramacao(DadosRecursoDTO retorno)
        {

            var camposFiltro = new Atendimento.Domain.DTO.CamposFiltroProgramacaoOrdensServicoDTO();

            foreach (var dados in retorno.DadosCampos)
            {
                var campo = _unit.Campos.Get(dados.Id);

                switch (campo.Tabela.Nome)
                {
                    case "Filtros":

                        var tipo = typeof(Atendimento.Domain.DTO.CamposFiltroProgramacaoOrdensServicoDTO);

                        PropertyInfo novoFiltro = tipo.GetProperty(campo.CampoTabelaClasse);

                        if (!string.IsNullOrEmpty(dados.Dados))
                        {
                            if (novoFiltro.PropertyType == typeof(DateTime) || novoFiltro.PropertyType == typeof(DateTime?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToDateTime(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(decimal) || novoFiltro.PropertyType == typeof(decimal?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToDecimal(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(int) || novoFiltro.PropertyType == typeof(int?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(bool) || novoFiltro.PropertyType == typeof(bool?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToBoolean(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(string))
                            {
                                novoFiltro.SetValue(camposFiltro, dados.Dados);
                            }
                            else if (novoFiltro.PropertyType == typeof(Cebi.Atendimento.Domain.Enums.OrdenarProgramacaoOrdensServicoEnum))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(Cebi.Atendimento.Domain.Enums.SituacaoProgramacaoOrdensServicoEnum))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(Cebi.Atendimento.Domain.Enums.TipoOrdemServicoEnum))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                        }
                        else
                        {
                            novoFiltro.SetValue(camposFiltro, null);
                        }

                        break;

                }
            }

            var funcionarioLogado = CebiIdentity.ObterFuncionarioId().Value;
            var funcionario = _unit.Funcionarios.Find(x => x.FuncionarioId == funcionarioLogado).SingleOrDefault();
            camposFiltro.EquipeFuncionarioLogadoId = funcionario.EquipeId;
            var parametrosWebService = new ParametrosWebService(_unit);
            int tipoIntegracaoSistema = Convert.ToInt32(parametrosWebService.ObterValorParametro(ParametrosWebPadrao.TipoIntegracaoSistema));
            bool impressaoLista = parametrosWebService.ObterValorParametro(ParametrosWebPadrao.UtilizaImpressaoOsLista);

            List<OrdensServicoEmExecucaoParaProgramacaoResult> ordensServicoEmExecucaoProgramacao = _unit.OrdensServico.ObterOrdensServicoEmExecucaoParaProgramacao(camposFiltro);

            foreach (var ordemservico in ordensServicoEmExecucaoProgramacao)
            {
                ordemservico.Endereco = ordemservico.Abreviacao + " " + ordemservico.Titulo + " " + ordemservico.Endereco + " , " + ordemservico.NumeroEndereco;

                switch (ordemservico.PeriodoAgendamento)
                {
                    case 0:
                        ordemservico.DescricaoPeriodo = Enumerations.GetEnumDescription(PeriodoAgendamentoEnum.Ambos);
                        break;

                    case 1:
                        ordemservico.DescricaoPeriodo = Enumerations.GetEnumDescription(PeriodoAgendamentoEnum.Manha);
                        break;

                    case 2:
                        ordemservico.DescricaoPeriodo = Enumerations.GetEnumDescription(PeriodoAgendamentoEnum.Tarde);
                        break;
                }

                if (ordemservico.UnidadeTempo == "Min.")
                {
                    ordemservico.CargaHoraria = (decimal)ordemservico.Prazo / 60;
                }
                else if (ordemservico.UnidadeTempo == "Dia")
                {
                    ordemservico.CargaHoraria = (decimal)ordemservico.Prazo * 24;
                }
                else
                {
                    ordemservico.CargaHoraria = (decimal)ordemservico.Prazo;
                }

                ordemservico.CargaHoraria = Math.Round(ordemservico.CargaHoraria, 2);

                if (ordemservico.DataAberturaEvento.AddHours((double)ordemservico.CargaHoraria) < DateTime.Now)
                {
                    ordemservico.StatusProgramacaoEvento = StatusProgramacaoEventoEnum.NaoProgramadoEmAtraso;
                }
                else if (ordemservico.DataAberturaEvento.AddHours((double)ordemservico.CargaHoraria / 2) >= DateTime.Now)
                {
                    ordemservico.StatusProgramacaoEvento = StatusProgramacaoEventoEnum.ProgramadoSemAtraso;
                }
                else if (ordemservico.DataAberturaEvento.AddHours((double)ordemservico.CargaHoraria / 2) < DateTime.Now)
                {
                    ordemservico.StatusProgramacaoEvento = StatusProgramacaoEventoEnum.ProgramadoEmAtraso;
                }


                var hoje = DateTime.Now;
                var dataAberturaEvento = ordemservico.DataAberturaEvento;

                TimeSpan ts = hoje - dataAberturaEvento;
                ordemservico.TempoDecorrido = (decimal)Math.Round(ts.TotalHours, 2);

                ordemservico.TipoIntegracaoSistema = tipoIntegracaoSistema;
                ordemservico.UtilizaImpressaoOsLista = impressaoLista;
            }

            return Ok(ordensServicoEmExecucaoProgramacao);

        }

        [HttpPost]
        [Route("OrdensdeServicoParaManutencao")]
        [CebiPerfilAuthorize("gServ.consultaOSExternas.pesquisar")]
        public IHttpActionResult ObterOrdensdeServicoParaManutencao(DadosRecursoDTO retorno)
        {

            var camposFiltro = new Atendimento.Domain.DTO.CamposFiltroManutencaoOrdensServicoDTO();

            foreach (var dados in retorno.DadosCampos)
            {
                var campo = _unit.Campos.Get(dados.Id);

                switch (campo.Tabela.Nome)
                {
                    case "Filtros":

                        var tipo = typeof(Atendimento.Domain.DTO.CamposFiltroManutencaoOrdensServicoDTO);

                        PropertyInfo novoFiltro = tipo.GetProperty(campo.CampoTabelaClasse);

                        if (!string.IsNullOrEmpty(dados.Dados))
                        {
                            if (novoFiltro.PropertyType == typeof(DateTime) || novoFiltro.PropertyType == typeof(DateTime?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToDateTime(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(decimal) || novoFiltro.PropertyType == typeof(decimal?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToDecimal(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(int) || novoFiltro.PropertyType == typeof(int?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(bool) || novoFiltro.PropertyType == typeof(bool?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToBoolean(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(string))
                            {
                                novoFiltro.SetValue(camposFiltro, dados.Dados);
                            }
                            else if (novoFiltro.PropertyType == typeof(Cebi.Atendimento.Domain.Enums.SituacaoEventoManutencaoOrdensServicoEnum))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(Cebi.Atendimento.Domain.Enums.SituacaoOSManutencaoOrdensServicoEnum))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(Cebi.Atendimento.Domain.Enums.TipoOrdemServicoEnum))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                        }
                        else
                        {
                            novoFiltro.SetValue(camposFiltro, null);
                        }

                        break;

                }
            }

            OrdensServicoService osS = new OrdensServicoService(_unit);

            var parametrosWebService = new ParametrosWebService(_unit);
            int tipoIntegracaoSistema = Convert.ToInt32(parametrosWebService.ObterValorParametro(ParametrosWebPadrao.TipoIntegracaoSistema));

            List<OrdensServicoParaManutencaoResult> ordensServicoManutencao = _unit.OrdensServico.ObterOrdensServicoParaManutencao(camposFiltro);

            foreach (var ordemservico in ordensServicoManutencao)
            {
                ordemservico.StatusOs = osS.ObterStatusOrdemServico(ordemservico.OrdemServicoId);
                ordemservico.DescricaoDepartamentoAtualOs = osS.ObterDepartamentoAtualOrdemServico(ordemservico.OrdemServicoId);
                ordemservico.StatusPagamentoOs = osS.ObterStatusPagamentoOrdemServico(ordemservico.OrdemServicoId);
                ordemservico.QtdChamados = osS.ObterQtdChamadosOrdemServico(ordemservico.OrdemServicoId);
                ordemservico.Endereco = ordemservico.Abreviacao + " " + ordemservico.Titulo + " " + ordemservico.Endereco + " , " + ordemservico.NumeroEndereco;
                ordemservico.TipoIntegracaoSistema = tipoIntegracaoSistema;
                if (ordemservico.QtdChamados >= 4)
                {
                    ordemservico.MaiorChamado = true;
                }

            }

            return Ok(ordensServicoManutencao);
        }
        [HttpPost]
        [Route("ImprimirOrdemServicoPesquisa")]
        [CebiPerfilAuthorize("gServ.consultaOSExternas.pesquisar")]
        public IHttpActionResult ImprimirOrdemServicoPesquisa(DadosRecursoDTO retorno)
        {

            var camposFiltro = new Atendimento.Domain.DTO.CamposFiltroManutencaoOrdensServicoDTO();

            foreach (var dados in retorno.DadosCampos)
            {
                var campo = _unit.Campos.Get(dados.Id);

                switch (campo.Tabela.Nome)
                {
                    case "Filtros":

                        var tipo = typeof(Atendimento.Domain.DTO.CamposFiltroManutencaoOrdensServicoDTO);

                        PropertyInfo novoFiltro = tipo.GetProperty(campo.CampoTabelaClasse);

                        if (!string.IsNullOrEmpty(dados.Dados))
                        {
                            if (novoFiltro.PropertyType == typeof(DateTime) || novoFiltro.PropertyType == typeof(DateTime?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToDateTime(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(decimal) || novoFiltro.PropertyType == typeof(decimal?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToDecimal(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(int) || novoFiltro.PropertyType == typeof(int?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(bool) || novoFiltro.PropertyType == typeof(bool?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToBoolean(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(string))
                            {
                                novoFiltro.SetValue(camposFiltro, dados.Dados);
                            }
                            else if (novoFiltro.PropertyType == typeof(Cebi.Atendimento.Domain.Enums.SituacaoEventoManutencaoOrdensServicoEnum))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(Cebi.Atendimento.Domain.Enums.SituacaoOSManutencaoOrdensServicoEnum))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(Cebi.Atendimento.Domain.Enums.TipoOrdemServicoEnum))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                        }
                        else
                        {
                            novoFiltro.SetValue(camposFiltro, null);
                        }

                        break;

                }
            }

            OrdensServicoService osS = new OrdensServicoService(_unit);

            var parametrosWebService = new ParametrosWebService(_unit);
            int tipoIntegracaoSistema = Convert.ToInt32(parametrosWebService.ObterValorParametro(ParametrosWebPadrao.TipoIntegracaoSistema));

            List<OrdensServicoParaManutencaoResult> ordensServicoManutencao = _unit.OrdensServico.ObterOrdensServicoParaManutencao(camposFiltro);

            foreach (var ordemservico in ordensServicoManutencao)
            {
                ordemservico.StatusOs = osS.ObterStatusOrdemServico(ordemservico.OrdemServicoId);
                ordemservico.DescricaoDepartamentoAtualOs = osS.ObterDepartamentoAtualOrdemServico(ordemservico.OrdemServicoId);
                ordemservico.StatusPagamentoOs = osS.ObterStatusPagamentoOrdemServico(ordemservico.OrdemServicoId);
                ordemservico.QtdChamados = osS.ObterQtdChamadosOrdemServico(ordemservico.OrdemServicoId);
                ordemservico.Endereco = ordemservico.Abreviacao + " " + ordemservico.Titulo + " " + ordemservico.Endereco + " , " + ordemservico.NumeroEndereco;
                ordemservico.TipoIntegracaoSistema = tipoIntegracaoSistema;

            }

            return Ok(ordensServicoManutencao);
        }

        [HttpPost]
        [Route("OrdensdeServicoParaMapa")]
        [CebiPerfilAuthorize("gServ.consultaOSMapa.consulta")]
        public IHttpActionResult ObterOrdensdeServicoParaMapa(DadosRecursoDTO retorno)
        {

            var camposFiltro = new Atendimento.Domain.DTO.CamposFiltroMapaOrdensServicoDTO();

            foreach (var dados in retorno.DadosCampos)
            {
                var campo = _unit.Campos.Get(dados.Id);

                switch (campo.Tabela.Nome)
                {
                    case "Filtros":

                        var tipo = typeof(Atendimento.Domain.DTO.CamposFiltroMapaOrdensServicoDTO);

                        PropertyInfo novoFiltro = tipo.GetProperty(campo.CampoTabelaClasse);

                        if (!string.IsNullOrEmpty(dados.Dados))
                        {
                            if (novoFiltro.PropertyType == typeof(DateTime) || novoFiltro.PropertyType == typeof(DateTime?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToDateTime(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(decimal) || novoFiltro.PropertyType == typeof(decimal?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToDecimal(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(int) || novoFiltro.PropertyType == typeof(int?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(bool) || novoFiltro.PropertyType == typeof(bool?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToBoolean(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(string))
                            {
                                novoFiltro.SetValue(camposFiltro, dados.Dados);
                            }
                            else if (novoFiltro.PropertyType == typeof(Cebi.Atendimento.Domain.Enums.SituacaoEventoManutencaoOrdensServicoEnum))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(Cebi.Atendimento.Domain.Enums.SituacaoOSManutencaoOrdensServicoEnum))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(Cebi.Atendimento.Domain.Enums.TipoOrdemServicoEnum))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                        }
                        else
                        {
                            novoFiltro.SetValue(camposFiltro, null);
                        }

                        break;

                }
            }

            OrdensServicoService osS = new OrdensServicoService(_unit);

            EventosService evS = new EventosService(_unit);

            var parametrosWebService = new ParametrosWebService(_unit);
            int tipoIntegracaoSistema = Convert.ToInt32(parametrosWebService.ObterValorParametro(ParametrosWebPadrao.TipoIntegracaoSistema));

            List<OrdensServicoParaMapaResult> ordensServicoMapa = _unit.OrdensServico.ObterOrdensServicoParaMapa(camposFiltro);

            foreach (var ordemservico in ordensServicoMapa)
            {
                ordemservico.StatusOs = osS.ObterStatusOrdemServico(ordemservico.OrdemServicoId);
                ordemservico.StatusEvento = evS.ObterStatusEvento(ordemservico.Eventoid);
                ordemservico.Endereco = ordemservico.Abreviacao + " " + ordemservico.Titulo + " " + ordemservico.Endereco + " , " + ordemservico.NumeroEndereco;
                ordemservico.TipoIntegracaoSistema = tipoIntegracaoSistema;

                if (ordemservico.Cdc != null)
                {
                    // procura a última leitura para obter a latitude e longitude
                    var leitura = _unit
                        .Leituras
                        .Find(x => x.LigacaoId == ordemservico.Cdc && x.Latitude != null)
                        .OrderByDescending(x => x.AnoReferencia)
                        .ThenByDescending(x => x.MesReferencia)
                        .FirstOrDefault();

                    if (leitura != null)
                    {
                        ordemservico.Latitude = leitura.Latitude;
                        ordemservico.Longitude = leitura.Longitude;
                    }

                }
                else
                {
                    if (ordemservico.NumeroEndereco != null)
                    {
                        var imovel = _unit.Imoveis.Find(x => x.LogradouroId == ordemservico.LogradouroId &&
                                                             x.Numero == ordemservico.NumeroEndereco).FirstOrDefault();

                        if (imovel != null)
                        {
                            // procura a última leitura para obter a latitude e longitude
                            var leitura = _unit
                                .Leituras
                                .Find(x => x.LigacaoId == imovel.ImovelId && x.Latitude != null)
                                .OrderByDescending(x => x.AnoReferencia)
                                .ThenByDescending(x => x.MesReferencia)
                                .FirstOrDefault();

                            if (leitura != null)
                            {
                                ordemservico.Latitude = leitura.Latitude;
                                ordemservico.Longitude = leitura.Longitude;
                            }
                        }
                    }
                }

            }

            return Ok(ordensServicoMapa.OrderBy(x => x.Latitude).ThenBy(x => x.Longitude));
        }

        [HttpPost]
        [Route("ProgramacoesColetores")]
        [CebiPerfilAuthorize("gServ.coletor.programacoes")]
        public IHttpActionResult ObterProgramacoesColetores(DadosRecursoDTO retorno)
        {
            var camposFiltro = new CamposFiltroProgramacoesColetoresDTO();

            foreach (var dados in retorno.DadosCampos)
            {
                var campo = _unit.Campos.Get(dados.Id);

                switch (campo.Tabela.Nome)
                {
                    case "Filtros":

                        var tipo = typeof(CamposFiltroProgramacoesColetoresDTO);

                        PropertyInfo novoFiltro = tipo.GetProperty(campo.CampoTabelaClasse);

                        if (!string.IsNullOrEmpty(dados.Dados))
                        {
                            if (novoFiltro.PropertyType == typeof(DateTime) || novoFiltro.PropertyType == typeof(DateTime?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToDateTime(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(decimal) || novoFiltro.PropertyType == typeof(decimal?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToDecimal(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(int) || novoFiltro.PropertyType == typeof(int?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(bool) || novoFiltro.PropertyType == typeof(bool?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToBoolean(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(string))
                            {
                                novoFiltro.SetValue(camposFiltro, dados.Dados);
                            }
                            else if (novoFiltro.PropertyType == typeof(Cebi.Atendimento.Domain.Enums.SituacaoProgramacaoColetorEnum))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                        }
                        else
                        {
                            novoFiltro.SetValue(camposFiltro, null);
                        }

                        break;

                }
            }

            List<OrdensServicoProgramacoesColetoresResult> programacoesColetores = _unit.OrdensServico.ObterProgramacoesColetores(camposFiltro);

            foreach (var programacao in programacoesColetores)
            {
                if (programacao.QtdOrdensServicoAbertas > 0)
                {
                    programacao.DescricaoSituacaoProgramacaoColetor = Enumerations.GetEnumDescription(SituacaoProgramacaoColetorEnum.Aberta);
                }
                else
                {
                    programacao.DescricaoSituacaoProgramacaoColetor = Enumerations.GetEnumDescription(SituacaoProgramacaoColetorEnum.Encerrada);
                }
            }

            return Ok(programacoesColetores);

        }

        [HttpGet]
        [Route("OrdensServicoProgramacaoColetor")]
        [CebiPerfilAuthorize("gServ.coletor.programacoes")]
        public IHttpActionResult ObterOrdensServicoProgramacaoColetor(int arquivoColetorId)
        {
            var arquivo = _unit.ArquivosColetor.Get(arquivoColetorId);

            List<OrdensServicoProgramacaoColetorResult> ordensServicoProgramacao = _unit.OrdensServico.ObterOrdensServicoProgramacaoColetor(arquivoColetorId);

            foreach (var ordemServico in ordensServicoProgramacao)
            {

                if (arquivo.Arquivo.Substring(0, 3) == "OSI")
                {
                    ordemServico.Endereco = ordemServico.DescricaoAreaManutencao;
                }
                else
                {
                    ordemServico.Endereco = ordemServico.Abreviacao + " " + ordemServico.Titulo + " " + ordemServico.Endereco + " , " + ordemServico.Numero;
                }

                if (ordemServico.Status == CargaColetorEnum.Rejeitada ||
                    ordemServico.Status == CargaColetorEnum.Erro)
                {
                    ordemServico.CorLinha = 4; //Vermelho
                }
                else if (ordemServico.SituacaoEvento == "Em Aberto")
                {
                    ordemServico.CorLinha = 1; // Amarelo
                }
                else
                {
                    if (ordemServico.SituacaoOs == "Aberta")
                    {
                        var eventosAverto = _unit.Eventos.Find(x => x.OrdemServicoId == ordemServico.OrdemServicoId &&
                                                                    x.OcorrenciaId == null &&
                                                                    x.DataHoraTerminoEvento == null).Count();
                        if (eventosAverto > 0)
                        {
                            ordemServico.CorLinha = 2; // Verde
                        }
                        else
                        {
                            ordemServico.CorLinha = 3; // Azul
                        }
                    }
                }

                switch (ordemServico.Status)
                {
                    case CargaColetorEnum.Aguardando:
                        ordemServico.DescricaoStatus = Enumerations.GetEnumDescription(CargaColetorEnum.Aguardando);
                        break;
                    case CargaColetorEnum.Cancelado:
                        ordemServico.DescricaoStatus = Enumerations.GetEnumDescription(CargaColetorEnum.Cancelado);
                        break;
                    case CargaColetorEnum.Cancelamento:
                        ordemServico.DescricaoStatus = Enumerations.GetEnumDescription(CargaColetorEnum.Cancelamento);
                        break;
                    case CargaColetorEnum.Erro:
                        ordemServico.DescricaoStatus = Enumerations.GetEnumDescription(CargaColetorEnum.Erro);
                        break;
                    case CargaColetorEnum.ErroCancelamento:
                        ordemServico.DescricaoStatus = Enumerations.GetEnumDescription(CargaColetorEnum.ErroCancelamento);
                        break;
                    case CargaColetorEnum.Processando:
                        ordemServico.DescricaoStatus = Enumerations.GetEnumDescription(CargaColetorEnum.Processando);
                        break;
                    case CargaColetorEnum.Recebida:
                        ordemServico.DescricaoStatus = Enumerations.GetEnumDescription(CargaColetorEnum.Recebida);
                        break;
                    case CargaColetorEnum.Rejeitada:
                        ordemServico.DescricaoStatus = Enumerations.GetEnumDescription(CargaColetorEnum.Rejeitada);
                        break;
                    case CargaColetorEnum.Transmitida:
                        ordemServico.DescricaoStatus = Enumerations.GetEnumDescription(CargaColetorEnum.Transmitida);
                        break;
                }
            }

            return Ok(ordensServicoProgramacao.OrderBy(x => x.OrdemServicoId));

        }

        [HttpPost]
        [Route("OrdenServicoRejeitadasProgramacoesColetores")]
        [CebiPerfilAuthorize("gServ.coletor.programacoes")]
        public IHttpActionResult ObterOrdenServicoRejeitadasProgramacoesColetores(DadosRecursoDTO retorno)
        {
            var camposFiltro = new CamposFiltroProgramacoesColetoresDTO();

            foreach (var dados in retorno.DadosCampos)
            {
                var campo = _unit.Campos.Get(dados.Id);

                switch (campo.Tabela.Nome)
                {
                    case "Filtros":

                        var tipo = typeof(CamposFiltroProgramacoesColetoresDTO);

                        PropertyInfo novoFiltro = tipo.GetProperty(campo.CampoTabelaClasse);

                        if (!string.IsNullOrEmpty(dados.Dados))
                        {
                            if (novoFiltro.PropertyType == typeof(DateTime) || novoFiltro.PropertyType == typeof(DateTime?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToDateTime(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(decimal) || novoFiltro.PropertyType == typeof(decimal?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToDecimal(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(int) || novoFiltro.PropertyType == typeof(int?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(bool) || novoFiltro.PropertyType == typeof(bool?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToBoolean(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(string))
                            {
                                novoFiltro.SetValue(camposFiltro, dados.Dados);
                            }
                            else if (novoFiltro.PropertyType == typeof(Cebi.Atendimento.Domain.Enums.SituacaoProgramacaoColetorEnum))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                        }
                        else
                        {
                            novoFiltro.SetValue(camposFiltro, null);
                        }

                        break;
                }

            }

            List<OrdensServicoProgramacaoColetorResult> ordensServicoRejeitadas = _unit.OrdensServico.ObterOrdensServicoRejeitadasProgramacaoColetor(camposFiltro);

            foreach (var ordemServico in ordensServicoRejeitadas)
            {
                ordemServico.Endereco = ordemServico.Abreviacao + " " + ordemServico.Titulo + " " + ordemServico.Endereco + " , " + ordemServico.Numero;

                ordemServico.CorLinha = 4; //Vermelho

                if (ordemServico.Status == CargaColetorEnum.Rejeitada)
                {
                    ordemServico.DescricaoStatus = Enumerations.GetEnumDescription(CargaColetorEnum.Rejeitada);
                }
                else if (ordemServico.Status == CargaColetorEnum.Erro)
                {
                    ordemServico.DescricaoStatus = Enumerations.GetEnumDescription(CargaColetorEnum.Erro);
                }
            }

            return Ok(ordensServicoRejeitadas.OrderBy(x => x.OrdemServicoId));

        }

        //Verifica dados de qual tabela devem ser verificados.
        private Boolean Validacoes(DadosOsEventoDTO retorno)
        {
            bool resultado;

            retornoErros = new TratamentoErroDTO();

            foreach (var dados in retorno.DadosEvento)
            {
                var codigo = dados.Id;
                var codigoTipoServico = dados.TipoServicoId;

                var campo = _unit.Campos.Get(codigo);

                switch (campo.Tabela.Nome)
                {
                    case "Evento":

                        ValidaEvento(codigo, codigoTipoServico, retorno);

                        break;

                    case "OrdensServico":

                        ValidaOrdemServico(codigo, codigoTipoServico, retorno);

                        break;

                }
            }

            if (retornoErros.Errors.Count > 0)
            {
                resultado = false;
            }
            else
            {
                resultado = true;
            }

            return resultado;
        }

        //Valida dados da tabela de Evento
        private void ValidaEvento(int codigo, string codigoTipoServico, DadosOsEventoDTO retorno)
        {
            string valor = "";
            string valorMenor = "";
            string valorVazio = "";

            IEnumerable<ValidacaoCampoTipoServico> validacoes = _unit
                .ValidacoesCamposTiposServicos
                .Find(x => x.TipoServicoCampo.CampoId == codigo && x.TipoServicoCampo.TipoServicoId == codigoTipoServico);

            Evento evento = new Evento();

            foreach (var dado in retorno.DadosEvento)
            {

                if (dado.Id == codigo)
                {
                    valor = dado.Dados;
                }
            }

            if (!string.IsNullOrEmpty(valor))
            {
                ObrigatorioPorRelacionamentoTipoServico(codigoTipoServico, codigo, evento, valor, retorno);
            }

            foreach (var validacao in validacoes)
            {

                var tipoValidacao = _unit.Validacoes.Get(validacao.ValidacaoId);

                switch (tipoValidacao.ValidacaoId)
                {
                    case 1: // OBRIGATÓRIO

                        ObrigatorioTipoServico(codigoTipoServico, validacao.TipoServicoCampo.CampoId, evento, valor, retorno);

                        break;

                    case 3: // MAIOR

                        foreach (var dado in retorno.DadosEvento)
                        {

                            if (dado.Id == validacao.RelacionadoId)
                            {
                                valorMenor = dado.Dados;
                            }
                        }

                        Maior(validacao.TipoServicoCampo.CampoId, validacao.RelacionadoId, evento, valor, valorMenor, retorno);

                        break;

                    case 4: // MENOR

                        foreach (var dado in retorno.DadosEvento)
                        {

                            if (dado.Id == validacao.RelacionadoId)
                            {
                                valorMenor = dado.Dados;
                            }
                        }

                        Menor(validacao.TipoServicoCampo.CampoId, validacao.RelacionadoId, evento, valor, valorMenor, retorno);

                        break;

                    case 2: // E-MAIL
                        Email(validacao.TipoServicoCampo.CampoId, evento, valor, retorno);
                        break;

                    case 5: // VAZIO

                        foreach (var dado in retorno.DadosEvento)
                        {

                            if (dado.Id == validacao.RelacionadoId)
                            {
                                valorVazio = dado.Dados;
                            }
                        }

                        Vazio(validacao.TipoServicoCampo.CampoId, validacao.RelacionadoId, evento, valor, valorVazio, retorno);

                        break;

                    case 6: // PREENCHIDO

                        foreach (var dado in retorno.DadosEvento)
                        {

                            if (dado.Id == validacao.RelacionadoId)
                            {
                                valorVazio = dado.Dados;
                            }
                        }

                        Preenchido(validacao.TipoServicoCampo.CampoId, validacao.RelacionadoId, evento, valor, valorVazio, retorno);

                        break;
                }
            }

        }

        //Valida dados da tabela de Ordem de Serviço
        private void ValidaOrdemServico(int codigo, string codigoTipoServico, DadosOsEventoDTO retorno)
        {
            string valor = "";
            string valorMenor = "";
            string valorVazio = "";

            IEnumerable<ValidacaoCampoTipoServico> validacoes = _unit
                .ValidacoesCamposTiposServicos
                .Find(x => x.TipoServicoCampo.CampoId == codigo && x.TipoServicoCampo.TipoServicoId == codigoTipoServico);

            OrdemServico ordemServico = new OrdemServico();

            foreach (var dado in retorno.DadosEvento)
            {
                if (dado.Id == codigo)
                {
                    valor = dado.Dados;
                }
            }

            if (!string.IsNullOrEmpty(valor))
            {
                ObrigatorioPorRelacionamentoTipoServico(codigoTipoServico, codigo, ordemServico, valor, retorno);
            }

            foreach (var validacao in validacoes)
            {
                var tipoValidacao = _unit.Validacoes.Get(validacao.ValidacaoId);

                switch (tipoValidacao.ValidacaoId)
                {
                    case 1: // OBRIGATÓRIO

                        ObrigatorioTipoServico(codigoTipoServico, validacao.TipoServicoCampo.CampoId, ordemServico, valor, retorno);
                        break;

                    case 3: // MAIOR 

                        foreach (var dado in retorno.DadosEvento)
                        {
                            if (dado.Id == validacao.RelacionadoId)
                            {
                                valorMenor = dado.Dados;
                            }
                        }

                        Maior(validacao.TipoServicoCampo.CampoId, validacao.RelacionadoId, ordemServico, valor, valorMenor, retorno);
                        break;

                    case 4: // MENOR

                        foreach (var dado in retorno.DadosEvento)
                        {

                            if (dado.Id == validacao.RelacionadoId)
                            {
                                valorMenor = dado.Dados;
                            }
                        }

                        Menor(validacao.TipoServicoCampo.CampoId, validacao.RelacionadoId, ordemServico, valor, valorMenor, retorno);

                        break;

                    case 2: // E-MAIL

                        Email(validacao.TipoServicoCampo.CampoId, ordemServico, valor, retorno);
                        break;

                    case 5: // VAZIO

                        foreach (var dado in retorno.DadosEvento)
                        {

                            if (dado.Id == validacao.RelacionadoId)
                            {
                                valorVazio = dado.Dados;
                            }
                        }

                        Vazio(validacao.TipoServicoCampo.CampoId, validacao.RelacionadoId, ordemServico, valor, valorVazio, retorno);

                        break;

                    case 6: // PREENCHIDO

                        foreach (var dado in retorno.DadosEvento)
                        {

                            if (dado.Id == validacao.RelacionadoId)
                            {
                                valorVazio = dado.Dados;
                            }
                        }

                        Preenchido(validacao.TipoServicoCampo.CampoId, validacao.RelacionadoId, ordemServico, valor, valorVazio, retorno);

                        break;
                }
            }
        }


        private void ObrigatorioTipoServico(string codigoTipoServico, int campoId, object tabela, string dados, DadosOsEventoDTO retorno)
        {
            var campo = _unit.Campos.Get(campoId);

            if (string.IsNullOrEmpty(dados))
            {
                MensagemErro("Campo:  " + campo.Descricao + " é obrigatório");
            }

            var codigoCampoId = campoId;

            var camposRelacionados =
                _unit.TiposServicosCamposRelacionados.Find(x => x.TipoServicoCampo.CampoId == codigoCampoId && x.TipoServicoCampo.TipoServicoId == codigoTipoServico);

            foreach (var campoRelacionado in camposRelacionados)
            {
                var secundario = _unit.Campos.Get(campoRelacionado.RelacionadoId);

                foreach (var campoSecundarioNovo in retorno.DadosEvento)
                {
                    if (campoSecundarioNovo.Id == secundario.CampoId)
                    {
                        if (string.IsNullOrEmpty(campoSecundarioNovo.Dados))
                        {
                            MensagemErro("Campo:  " + secundario.Descricao + " é obrigatório porque o Campo : " + campo.Descricao + " é obrigatório.");
                        }
                    }
                }
            }
        }

        private void ObrigatorioPorRelacionamentoTipoServico(string codigoTipoServico, int campoId, object tabela, string dados, DadosOsEventoDTO retorno)
        {
            var campo = _unit.Campos.Get(campoId);

            var codigoCampoId = campoId;

            var camposRelacionados =
                _unit.TiposServicosCamposRelacionados.Find(x => x.TipoServicoCampo.CampoId == codigoCampoId && x.TipoServicoCampo.TipoServicoId == codigoTipoServico);

            foreach (var campoRelacionado in camposRelacionados)
            {
                var secundario = _unit.Campos.Get(campoRelacionado.RelacionadoId);

                foreach (var campoSecundarioNovo in retorno.DadosEvento)
                {
                    if (campoSecundarioNovo.Id == secundario.CampoId)
                    {
                        if (string.IsNullOrEmpty(campoSecundarioNovo.Dados))
                        {
                            MensagemErro("Campo:  " + secundario.Descricao + " é obrigatório porque o Campo : " + campo.Descricao + " foi preenchido.");
                        }
                    }
                }
            }
        }

        private void Maior(int campoId, int? campoMenorId, object tabela, string dados, string dadosMenor, DadosOsEventoDTO retorno)
        {
            if (dados == null)
            {
                dados = "";
            }

            if (dadosMenor == null)
            {
                dadosMenor = "";
            }

            var campoMaior = _unit.Campos.Get(campoId);

            var campoMenor = _unit.Campos.Get(campoMenorId);

            var tipoMaior = typeof(Evento);

            PropertyInfo principalMaior = tipoMaior.GetProperty(campoMaior.CampoTabela);

            if (dados != "" && dadosMenor != "")
            {
                if (principalMaior.PropertyType == typeof(DateTime) || principalMaior.PropertyType == typeof(DateTime?))
                {

                    int datas = DateTime.Compare(
                                         Convert.ToDateTime(dados),
                                         Convert.ToDateTime(dadosMenor));

                    if (datas == -1)
                    {

                        MensagemErro("Campo: " + campoMaior.Descricao +
                                                    " deve ser maior que o campo: " +
                                                    campoMenor.Descricao);
                    }

                }
                else if (principalMaior.PropertyType == typeof(decimal) || principalMaior.PropertyType == typeof(decimal?))
                {
                    if (Convert.ToDecimal(dados) < Convert.ToDecimal(dadosMenor))
                    {
                        MensagemErro("Campo: " + campoMaior.Descricao +
                                                          " deve ser maior que o campo: " +
                                                          campoMenor.Descricao);
                    }
                }
                else if (principalMaior.PropertyType == typeof(int) || principalMaior.PropertyType == typeof(int?))
                {
                    if (Convert.ToInt32(dados) < Convert.ToInt32(dadosMenor))
                    {
                        MensagemErro("Campo: " + campoMaior.Descricao +
                                                          " deve ser maior que o campo: " +
                                                          campoMenor.Descricao);
                    }
                }
            }

        }

        private void Menor(int campoId, int? campoMaiorId, object tabela, string dados, string dadosMaior, DadosOsEventoDTO retorno)
        {

            if (dados == null)
            {
                dados = "";
            }

            if (dadosMaior == null)
            {
                dadosMaior = "";
            }

            var campoMaior = _unit.Campos.Get(campoId);

            var campoMenor = _unit.Campos.Get(campoMaiorId);

            var tipoMaior = typeof(Evento);

            PropertyInfo principalMaior = tipoMaior.GetProperty(campoMaior.CampoTabela);

            if (dados != "" && dadosMaior != "")
            {
                if (principalMaior.PropertyType == typeof(DateTime) || principalMaior.PropertyType == typeof(DateTime?))
                {

                    int datas = DateTime.Compare(
                                          Convert.ToDateTime(dados),
                                          Convert.ToDateTime(dadosMaior));

                    if (datas == 1)
                    {

                        MensagemErro("Campo: " + campoMaior.Descricao +
                                                    " deve ser menor que o campo: " +
                                                    campoMenor.Descricao);
                    }

                }
                else if (principalMaior.PropertyType == typeof(decimal) || principalMaior.PropertyType == typeof(decimal?))
                {
                    if (Convert.ToDecimal(dados) > Convert.ToDecimal(dadosMaior))
                    {
                        MensagemErro("Campo: " + campoMaior.Descricao +
                                                          " deve ser maior que o campo: " +
                                                          campoMenor.Descricao);
                    }
                }
                else if (principalMaior.PropertyType == typeof(int) || principalMaior.PropertyType == typeof(int?))
                {
                    if (Convert.ToInt32(dados) > Convert.ToInt32(dadosMaior))
                    {
                        MensagemErro("Campo: " + campoMaior.Descricao +
                                                          " deve ser maior que o campo: " +
                                                          campoMenor.Descricao);
                    }
                }
            }

        }

        private void Email(decimal campoId, object tabela, string dados, DadosOsEventoDTO retorno)
        {
            var campo = _unit.Campos.Get(campoId);

            if (!string.IsNullOrEmpty(dados))
            {

                var tipo = typeof(Evento);
                PropertyInfo principal = tipo.GetProperty(campo.CampoTabelaClasse);
                principal.SetValue(tabela, dados);

                var validaEmail = new System.ComponentModel.DataAnnotations.EmailAddressAttribute();
                var teste = validaEmail.IsValid(principal.GetValue(tabela).ToString());

                if (!validaEmail.IsValid(principal.GetValue(tabela).ToString()))
                {
                    MensagemErro("Campo:  " + campo.Descricao + " não está com o formato de e-mail (email@dominio.com, ou email@dominio.com.br)");
                }
            }

        }

        private void Vazio(int campoInformadoId, int? campoVazioId, object tabela, string dados, string dadosrelacionado, DadosOsEventoDTO retorno)
        {
            if (dados == null)
            {
                dados = "";
            }

            if (dadosrelacionado == null)
            {
                dadosrelacionado = "";
            }

            var campoInformado = _unit.Campos.Get(campoInformadoId);

            var campoVazio = _unit.Campos.Get(campoVazioId);

            if (dados != "" && dadosrelacionado != "")
            {
                MensagemErro("Campo: " + campoVazio.Descricao +
                                                  " não pode ser informado porque o campo : " +
                                                  campoInformado.Descricao + " foi preenchido.");

            }

        }

        private void Preenchido(int campoInformadoId, int? campoPreenchidoId, object tabela, string dados, string dadosrelacionado, DadosOsEventoDTO retorno)
        {
            if (dados == null)
            {
                dados = "";
            }

            if (dadosrelacionado == null)
            {
                dadosrelacionado = "";
            }

            var campoInformado = _unit.Campos.Get(campoInformadoId);

            var campoPreenchido = _unit.Campos.Get(campoPreenchidoId);

            if (dados == "" && dadosrelacionado == "")
            {
                MensagemErro("Campo: " + campoPreenchido.Descricao +
                                                  " deve ser informado porque o campo : " +
                                                  campoInformado.Descricao + " não foi preenchido.");

            }

        }

        private void MensagemErro(string mensagem)
        {
            retornoErros.Errors.Add(mensagem);
        }

        [HttpPost]
        [AllowAnonymous]
        [OverrideAuthorization]
        [Route("ExecutarTarefa")]
        public IHttpActionResult ExecutarTarefa(TarefaDTO tarefa)
        {
            string descricao = "";

            var funcionarioLogado = CebiIdentity.ObterFuncionarioId().Value;

            var evento = _unit.Eventos.Get(tarefa.EventoId);
            var dadosPedido = _unit.DadosPedidos.Find(x => x.Chamado.OrdemServicoId == evento.OrdemServicoId).SingleOrDefault();
            var funcionario = _unit.Funcionarios.Find(x => x.FuncionarioId == funcionarioLogado).SingleOrDefault();
            string servico = evento.ServicoId + "-" + evento.TipoServico.Descricao;

            if (tarefa.TarefaId == 9)
            {
                var model = new AtualizacaoDocumentoCommand
                {
                    InscricaoCadastral = dadosPedido.InscricaoCadastral,
                    Documento = dadosPedido.CpfReq,
                    Usuario = funcionario.LoginName
                };

                descricao = "Executada alteração cadastral de Cpf/Cnpj pelo evento: " + evento.EventoId
                + " do serviço: " + servico
                + ", para a Inscrição Cadastral: " + dadosPedido.InscricaoCadastral
                + " com o cpf/cnpj: " + dadosPedido.CpfReq + ".";

                var atualizaCadastro = new AtualizacaoDocumentoService(_agenciaUnit);
                atualizaCadastro.Atualizar(model);

            }

            if (tarefa.TarefaId == 10)
            {
                var model = new AtualizacaoEnderecoEntregaCommand
                {
                    Bairro = dadosPedido.Chamado.BairroEntr,
                    Cidade = dadosPedido.Chamado.MunicipioEntr,
                    Cep = dadosPedido.Chamado.CepEntr,
                    Complemento = dadosPedido.Chamado.ComplementoEntr,
                    Endereco = dadosPedido.Chamado.EnderecoEntr,
                    InscricaoCadastral = dadosPedido.InscricaoCadastral,
                    Numero = dadosPedido.Chamado.NroEntr,
                    Uf = dadosPedido.Chamado.Uf,
                    Usuario = funcionario.LoginName
                };

                descricao = "Executada alteração cadastral de Endereço de Entrega pelo evento: " + evento.EventoId
                + " do serviço: " + servico
                + ", para a Inscrição Cadastral: " + dadosPedido.InscricaoCadastral
                + " com o endereco: " + model.Endereco + "\n"
                + " numero: " + model.Numero + "\n"
                + " complemento: " + model.Complemento + "\n"
                + " bairro: " + model.Bairro + "\n"
                + " cidade: " + model.Cidade + "\n";

                var atualizaEnderecoEntrega = new AtualizacaoEnderecoEntregaService(_agenciaUnit);
                atualizaEnderecoEntrega.Atualizar(model);
            }

            var eventoTarefa = _unit.EventosTarefas.Get(tarefa.EventoTarefaId);

            eventoTarefa.Executou = true;
            _unit.EventosTarefas.Update(eventoTarefa);
            _unit.Complete();

            GravarHistorico(evento.OrdemServicoId, funcionario.RE, descricao);

            var retorno = ApiReturnMessage.CreateUpdateOkMessage();
            return Ok(retorno);
        }

        public void GravarHistorico(int ordemServicoId, string ReLogado, string descricao)
        {
            var historicoOs = new Atendimento.Domain.Entities.HistoricoOs();
            historicoOs.Automatico = true;
            historicoOs.Data = DateTime.Now;
            historicoOs.FuncionarioId = ReLogado;
            historicoOs.OrdemServicoId = ordemServicoId;
            historicoOs.Descricao = descricao;
            _unit.HistoricosOs.Add(historicoOs);

            _unit.Complete();
        }

        public string ObterTelefoneSolicitante(int ordemServicoId)
        {
            Chamado chamado = _unit.Chamados
                .Find(x => x.OrdemServicoId == ordemServicoId)
                .FirstOrDefault();

            return chamado.CelularSolicitante;
        }

        [HttpPost]
        [Route("ProgramarOrdensServico")]
        public IHttpActionResult ProgramarOrdensServico(ProgramacaoOsDto dadosProgramacaoOs)
        {
            var funcionarioId = CebiIdentity.ObterFuncionarioId().Value;

            var funcionario = _unit.Funcionarios.Get(funcionarioId);

            var programacaoOs = new ProgramacaoOsService(_unit);
            programacaoOs.Executar(dadosProgramacaoOs, funcionario.RE);

            _unit.Complete();

            var retorno = ApiReturnMessage.CreateUpdateOkMessage();
            return Ok(retorno);
        }

        [HttpPost]
        [Route("ProgramarColetorOrdensServico")]
        public IHttpActionResult ProgramarColetorOrdensServico(ProgramacaoColetorOsDto dadosProgramacaoColetorOs)
        {
            lock (lockObj)
            {
                var funcionarioId = CebiIdentity.ObterFuncionarioId().Value;
                foreach (var eventoId in dadosProgramacaoColetorOs.EventosId)
                {
                    var eventoProgramado = _unit.Eventos.Find(x => x.EventoId == eventoId &&
                                                                   x.ImpressaoInd == true).FirstOrDefault();

                    if (eventoProgramado != null)
                    {
                        retornoErros.UserNotification = "Ordem de Serviço número " + eventoProgramado.OrdemServicoId + " selecionada já foi programada por outro usuário.";
                        return Content(HttpStatusCode.BadRequest, retornoErros);

                    }
                }

                var programarColetorOs = new ProgramacaoColetorOsService(_unit);
                programarColetorOs.Executar(dadosProgramacaoColetorOs, funcionarioId);

                _unit.Complete();

                var retorno = ApiReturnMessage.CreateUpdateOkMessage();
                return Ok(retorno);
            }
        }

        //confirmar impressao 
        //datahoraimpressao, refuncionarioimprimiu, impressa - evento e os
        [HttpPost]
        [Route("ConfirmarImpressaoOrdensServicoProgramacao")]
        public IHttpActionResult ConfirmarImpressaoOrdensServicoProgramacao(List<int> eventosId)
        {
            var funcionarioId = CebiIdentity.ObterFuncionarioId().Value;

            var confirmarImpressao = new ConfirmacaoImpressaoOsService(_unit);
            confirmarImpressao.Executar(eventosId, funcionarioId);

            //passar Complete(); para todas as Apis e remover dos Services.
            _unit.Complete();

            return Ok();
        }

        [HttpPost]
        [Route("ReenviarOrdensServico")]
        public IHttpActionResult ReenviarOrdensServico(List<int> eventosId)
        {
            var reenviarOs = new ReenviarOrdensServicoService(_unit);
            reenviarOs.Executar(eventosId);

            _unit.Complete();

            return Ok("Ordens de Serviço reenviadas com sucesso!");
        }

        [HttpPost]
        [Route("OrdensdeServicoEmExecucaoEquipe")]
        public IHttpActionResult ObterOrdensdeServicoEmExecucaoEquipe(string equipeId)
        {

            var funcionarioLogado = CebiIdentity.ObterFuncionarioId().Value;
            var funcionario = _unit.Funcionarios.Find(x => x.FuncionarioId == funcionarioLogado).SingleOrDefault();
            var parametrosWebService = new ParametrosWebService(_unit);
            int tipoIntegracaoSistema = Convert.ToInt32(parametrosWebService.ObterValorParametro(ParametrosWebPadrao.TipoIntegracaoSistema));

            List<OrdensServicoEmExecucaoEquipeResult> ordensServicoEmExecucaoEquipe = _unit.OrdensServico.ObterOrdensServicoEmExecucaoEquipe(equipeId);

            foreach (var ordemservico in ordensServicoEmExecucaoEquipe)
            {
                ordemservico.Endereco = ordemservico.Abreviacao + " " + ordemservico.Titulo + " " + ordemservico.Endereco + " , " + ordemservico.NumeroEndereco;

                switch (ordemservico.PeriodoAgendamento)
                {
                    case 0:
                        ordemservico.DescricaoPeriodo = Enumerations.GetEnumDescription(PeriodoAgendamentoEnum.Ambos);
                        break;

                    case 1:
                        ordemservico.DescricaoPeriodo = Enumerations.GetEnumDescription(PeriodoAgendamentoEnum.Manha);
                        break;

                    case 2:
                        ordemservico.DescricaoPeriodo = Enumerations.GetEnumDescription(PeriodoAgendamentoEnum.Tarde);
                        break;
                }

                if (ordemservico.UnidadeTempo == "Min.")
                {
                    ordemservico.CargaHoraria = (decimal)ordemservico.Prazo / 60;
                }
                else if (ordemservico.UnidadeTempo == "Dia")
                {
                    ordemservico.CargaHoraria = (decimal)ordemservico.Prazo * 24;
                }
                else
                {
                    ordemservico.CargaHoraria = (decimal)ordemservico.Prazo;
                }

                ordemservico.CargaHoraria = Math.Round(ordemservico.CargaHoraria, 2);

                if (ordemservico.DataAberturaEvento.AddHours((double)ordemservico.CargaHoraria) < DateTime.Now)
                {
                    ordemservico.StatusProgramacaoEvento = StatusProgramacaoEventoEnum.NaoProgramadoEmAtraso;
                }
                else if (ordemservico.DataAberturaEvento.AddHours((double)ordemservico.CargaHoraria / 2) >= DateTime.Now)
                {
                    ordemservico.StatusProgramacaoEvento = StatusProgramacaoEventoEnum.ProgramadoSemAtraso;
                }
                else if (ordemservico.DataAberturaEvento.AddHours((double)ordemservico.CargaHoraria / 2) < DateTime.Now)
                {
                    ordemservico.StatusProgramacaoEvento = StatusProgramacaoEventoEnum.ProgramadoEmAtraso;
                }


                var hoje = DateTime.Now;
                var dataAberturaEvento = ordemservico.DataAberturaEvento;

                TimeSpan ts = hoje - dataAberturaEvento;
                ordemservico.TempoDecorrido = (decimal)Math.Round(ts.TotalHours, 2);

                ordemservico.TipoIntegracaoSistema = tipoIntegracaoSistema;
            }

            return Ok(ordensServicoEmExecucaoEquipe);



        }
        [HttpGet]
        [Route("{eventoId}/ObterInformacoesAdicionaisEvento")]

        public IHttpActionResult ObterInformacoesAdicionaisEvento(int campoColetorId)
        {
            var informacoesAdicionais = _unit.InformacaoAdicionaisColetor.ObterCamposInformacoesAdicionais(campoColetorId);

            return Ok(informacoesAdicionais);
        }

        [HttpPut]
        [Route("{eventoId}/AtualizarInformacoesAdicionais")]
       
        public IHttpActionResult AlterarInformacoesAdicionais(List<CampoInformacoesDTO> model, int eventoId)
        {
            
            EventosService evS = new EventosService(_unit);
            Funcionario funcionario = ObterFuncionarioService.Executar(_unit);

            evS.AlterarInformacoesAdicionaisEvento(model, funcionario, eventoId);

            return Ok("Informações Adicionais Alteradas com Sucesso!");
        }

        [HttpGet]
        [Route("{eventoId}/ObterDadosCompletosEvento")]
        public IHttpActionResult ObterDadosCompletosEvento(int eventoId)
        {
            EventosService evS = new EventosService(_unit);
            Funcionario funcionario = ObterFuncionarioService.Executar(_unit);

            string tipoServicoId = evS.ObterTipoServicoIdEvento(eventoId);
            var evento = evS.ObterDadosEventoConsulta(eventoId);

            var camposTipoServico = _unit.TiposServicos.ObterTiposServicoCampoColetor(tipoServicoId);

            var informacoesAdicionais = evS.ObterListasComplementaresEvento(eventoId, ListaComplementarEventoEnum.InformacoesAdicionais, funcionario.RE).InformacoesAdicionais;

            var finalCampoInformacoes = new List<CampoInformacoes>();

            // Processa as Informações Adicionais
            foreach (var informacaoAdicional in informacoesAdicionais)
            {
                var campo = _unit.CamposColetor.Get(informacaoAdicional.CampoColetorId);
                if (campo != null)
                {
                    var listaOpcoes = _unit.OpcoesListaColetor.Find(x => x.ListaOpcaoColetorId == campo.ListaOpcaoId).ToList();

                    var valorCheckBox = "";

                    if (informacaoAdicional.Valor == "true")
                    {
                        valorCheckBox = "Sim";
                    }
                    else if (informacaoAdicional.Valor == "false")
                    {
                        valorCheckBox = "Não";
                    }
                    else
                    {
                        valorCheckBox = "";
                    }

                    finalCampoInformacoes.Add(new CampoInformacoes
                    {
                        NomeCampo = campo.Descricao,
                        Evento = informacaoAdicional.Evento,
                        EventoId = informacaoAdicional.EventoId,
                        CampoColetorId = informacaoAdicional.CampoColetorId,
                        Campo = informacaoAdicional.Campo,
                        InformacaoAdicionalColetorId = informacaoAdicional.InformacaoAdicionalColetorId,
                        Ordem = informacaoAdicional.Ordem,                       
                        Valor = informacaoAdicional.Valor,
                        Tipo = campo.Tipo,
                        DescricaoTipo = campo.Tipo.ToString(),
                        ValorCheckbox = valorCheckBox,
                        ListaOpcaoId = campo.ListaOpcaoId,
                        ListaOpcoes = listaOpcoes,                     
                        OpcaoLista = listaOpcoes?.FirstOrDefault(opcao => opcao.OpcaoListaColetorId.ToString() == informacaoAdicional.Valor),
                        Tamanho = campo.TamanhoConteudo
                });
                }
            }


            // Processa os Campos do Tipo de Serviço
            foreach (var campoTipoServico in camposTipoServico.OrderBy(x=> x.Ordem))
            {
                var campo = campoTipoServico.CampoColetor;
                var informacaoAdicional = informacoesAdicionais.FirstOrDefault(info => info.CampoColetorId == campo.CampoColetorId);
                if (campo != null && informacaoAdicional == null)
                {
                    finalCampoInformacoes.Add(new CampoInformacoes
                    {
                        NomeCampo = campo.Descricao,
                        Evento = _unit.Eventos.Find(x => x.EventoId == eventoId).FirstOrDefault(),
                        EventoId = eventoId,
                        CampoColetorId = campo.CampoColetorId,
                        Campo = campo,
                        Ordem = campoTipoServico.Ordem,                       
                        Valor = null,
                        ValorCheckbox = null,
                        Tipo = campo.Tipo,
                        DescricaoTipo = campo.Tipo.ToString(),
                        ListaOpcaoId = campo.ListaOpcaoId,
                        Tamanho = campo.TamanhoConteudo
                        
                   });
                }
            }

            // Retorne os dados transformados
            return Ok(finalCampoInformacoes);
        }



    }
}