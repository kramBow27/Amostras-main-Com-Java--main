/*
    Atendimento.cs
    Gerado em: 11/09/2018
    Via Cebi.Lhamas, versão 2.4.1
*/

using System.Web.Http;
using Cebi.Atendimento.Domain.Interfaces;
using Cebi.Atendimento.Dal;
using System.Linq;
using Cebi.Util.WebApi.Filters;
using System.Collections.Generic;
using Cebi.Atendimento.Domain.Entities;
using Cebi.Atendimento.Domain.DTO;
using Cebi.Atendimento.Domain.Enums;
using Cebi.Util;
using System;
using Cebi.Util.WebApi.Messaging;
using Cebi.Atendimento.Domain.Services.EquipeCoordenadas;
using Cebi.Atendimento.Domain.Services.EventosBaixaColetor;
using Cebi.Atendimento.Domain.Services.GravarFotoOSService;
using ExcelLibrary.BinaryFileFormat;
using Cebi.Atendimento.Domain.Services.Equipes;
using System.Reflection;
using System.Net;
using Cebi.Atendimento.Domain.Services.OrdensServicoColetor;

namespace Cebi.Atendimento.Api.Controllers
{
    [RoutePrefix("Coletor")]
    public partial class ColetorController : ApiController
    {
        private readonly IAtendimentoUnitOfWork _unit;

        public ColetorController()
        {
            _unit = new AtendimentoUnitOfWork();
        }

        [HttpGet]
        [Route("Carga")]
        [CebiPerfilAuthorize("gServ.coletor.carga")]
        public IHttpActionResult Carga()
        {
            var listaCargasColetor = new List<CargaColetorDto>();
            var equipes = _unit.Equipes.Find(x => x.UsaColetor == true && x.Inutilizada == false && x.CentroCustoId != null).OrderBy(x => x.Descricao);

            foreach (var equipe in equipes)
            {
                var centroCusto = _unit.CentrosCusto.Get(equipe.CentroCustoId);
                var cargaColetor = new CargaColetorDto();

                cargaColetor.EquipeId = equipe.EquipeId;
                cargaColetor.Descricao = equipe.Descricao;

                if (centroCusto != null)
                {
                    cargaColetor.DescricaoCentroCusto = centroCusto.Descricao;
                }

                cargaColetor.DataStatus = equipe.DataStatus;

                switch (equipe.CargaColetor)
                {
                    case 0:
                        cargaColetor.DescricaoStatus = Enumerations.GetEnumDescription(CargaColetorEnum.Aguardando);
                        break;
                    case 1:
                        cargaColetor.DescricaoStatus = Enumerations.GetEnumDescription(CargaColetorEnum.Processando);
                        break;
                    case 2:
                        cargaColetor.DescricaoStatus = Enumerations.GetEnumDescription(CargaColetorEnum.Transmitida);
                        break;
                    case 3:
                        cargaColetor.DescricaoStatus = Enumerations.GetEnumDescription(CargaColetorEnum.Erro);
                        break;
                    case 4:
                        cargaColetor.DescricaoStatus = Enumerations.GetEnumDescription(CargaColetorEnum.Recebida);
                        break;
                    case 5:
                        cargaColetor.DescricaoStatus = Enumerations.GetEnumDescription(CargaColetorEnum.Rejeitada);
                        break;
                    case 6:
                        cargaColetor.DescricaoStatus = Enumerations.GetEnumDescription(CargaColetorEnum.Cancelamento);
                        break;
                    case 7:
                        cargaColetor.DescricaoStatus = Enumerations.GetEnumDescription(CargaColetorEnum.Cancelado);
                        break;
                    case 8:
                        cargaColetor.DescricaoStatus = Enumerations.GetEnumDescription(CargaColetorEnum.ErroCancelamento);
                        break;
                    case null:
                        cargaColetor.DescricaoStatus = "Não executada";
                        break;
                }

                listaCargasColetor.Add(cargaColetor);
            }

            return Ok(listaCargasColetor);
        }

        [HttpPost]
        [Route("LiberarCarga")]
        [CebiPerfilAuthorize("gServ.coletor.carga")]
        public IHttpActionResult LiberarCarga(List<string> equipesId)
        {
            foreach (var equipeId in equipesId)
            {
                var equipe = _unit.Equipes.Get(equipeId);

                equipe.CargaColetor = 0;
                equipe.DataStatus = DateTime.Now;

                _unit.Equipes.Update(equipe);
            }

            _unit.Complete();

            var retorno = ApiReturnMessage.CreateUpdateOkMessage();
            return Ok(retorno);
        }

        [HttpGet]
        [Route("ObterEquipeCoordenada")]
        public IHttpActionResult ObterEquipeCoordenada(int id)
        {
            var equipeCoordenada = _unit.EquipeCoordenadas.Get(id);
            return Ok(equipeCoordenada);
        }

        [HttpPut]
        [Route("GravarEquipeEquipamentoCoordenada")]
        [AllowAnonymous]
        public IHttpActionResult GravarEquipeEquipamentoCoordenada(EquipeCoordenadasDTO equipeCoordenadas)
        {
            var EquipeEquipamentoCoordenadasService = new EquipeCoordenadasService(_unit);
            var mensagemRetorno = EquipeEquipamentoCoordenadasService.AlterarEquipeEquipamentoCoordenadas(equipeCoordenadas);

            if (mensagemRetorno == "OK")
            {
                return Ok("Coordenada gravada com sucesso!");
            }
            else
            {
                return BadRequest(mensagemRetorno);
            }

        }

        [HttpPost]
        [Route("GravarBaixaOrdemServico")]
        [AllowAnonymous]
        public IHttpActionResult GravarBaixaOrdemServico(EventosBaixasColetorStringDTO eventosBaixasColetor)
        {
            var EventosBaixasColetorService = new EventosBaixasColetorService(_unit);
            var EventoBaixa = _unit.EventosBaixasColetor.Find(x => x.OrdemServicoId == eventosBaixasColetor.OrdemServicoId && x.EventoId == eventosBaixasColetor.EventoId);

            if (EventoBaixa.Count() == 0)
            {
                try
                {
                    EventosBaixasColetorService.ExecutarPrecedureGravarBaixaOS(eventosBaixasColetor.ConteudoBaixa);

                }
                catch (Exception ex)
                {
                    eventosBaixasColetor.MensagemErro = ex.ToString();

                }

                var eventosBaixasColetorDTO = EventosBaixasColetorService.ConvertToEventosBaixasColetorDTO(eventosBaixasColetor);

                try
                {
                    EventosBaixasColetorService.GravarEventosBaixasColetor(eventosBaixasColetorDTO);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.InnerException.Message + "/" + ex.InnerException.InnerException.Message);
                }

            }
            else
            {
                return Ok("Baixa já realizada");
            }

            return Ok("Baixas realizada com sucesso");

        }

        [HttpPost]
        [Route("ExecutarProcedureBaixa")]
        [CebiPerfilAuthorize("gServ.coletor.baixas")]
        [AllowAnonymous]
        public IHttpActionResult ExecutarProcedureBaixa(EventosBaixasColetorStringDTO eventosBaixasColetor)
        {
            var EventosBaixasColetorService = new EventosBaixasColetorService(_unit);
            try
            {
                EventosBaixasColetorService.ExecutarPrecedureGravarBaixaOS(eventosBaixasColetor.ConteudoBaixa);

            }
            catch (Exception ex)
            {
                eventosBaixasColetor.MensagemErro = ex.ToString();
                var eventosBaixasColetorDTOErro = EventosBaixasColetorService.ConvertToEventosBaixasColetorDTO(eventosBaixasColetor);
                var eventosBaixasEntitieErro = EventosBaixasColetorService.ConvertToEventosBaixasColetorEntitie(eventosBaixasColetorDTOErro);
                _unit.EventosBaixasColetor.Update(eventosBaixasEntitieErro);
                _unit.Complete();
                return BadRequest("Baixa Não Realizada");

            }
            eventosBaixasColetor.MensagemErro = null;
            var eventosBaixasColetorDTO = EventosBaixasColetorService.ConvertToEventosBaixasColetorDTO(eventosBaixasColetor);
            var eventosBaixasEntitie = EventosBaixasColetorService.ConvertToEventosBaixasColetorEntitie(eventosBaixasColetorDTO);
            _unit.EventosBaixasColetor.Update(eventosBaixasEntitie);
            _unit.Complete();


            return Ok("Baixas realizada com sucesso");

        }
        [HttpPost]
        [Route("ExecutarProcedureTodasBaixas")]
        [CebiPerfilAuthorize("gServ.coletor.baixas")]
        [AllowAnonymous]
        public IHttpActionResult ExecutarProcedureTodasBaixas(List<EventosBaixasColetorStringDTO> eventosBaixasColetor)
        {
            var EventosBaixasColetorService = new EventosBaixasColetorService(_unit);
            List<string> baixasNaoRealizadas = new List<string>();

            foreach (var baixa in eventosBaixasColetor)
            {
                try
                {
                    EventosBaixasColetorService.ExecutarPrecedureGravarBaixaOS(baixa.ConteudoBaixa);
                    baixa.MensagemErro = null;
                    var eventosBaixasColetorDTO = EventosBaixasColetorService.ConvertToEventosBaixasColetorDTO(baixa);
                    var eventosBaixasEntitie = EventosBaixasColetorService.ConvertToEventosBaixasColetorEntitie(eventosBaixasColetorDTO);
                    _unit.EventosBaixasColetor.Update(eventosBaixasEntitie);
                    _unit.Complete();
                }
                catch (Exception ex)
                {
                    var eventoBaixaColetorIdString = baixa.EventoBaixaColetorId.ToString();
                    baixasNaoRealizadas.Add(eventoBaixaColetorIdString); // adiciona o ID da baixa não realizada à lista
                    baixa.MensagemErro = ex.ToString();
                    var eventosBaixasColetorDTOErro = EventosBaixasColetorService.ConvertToEventosBaixasColetorDTO(baixa);
                    var eventosBaixasEntitieErro = EventosBaixasColetorService.ConvertToEventosBaixasColetorEntitie(eventosBaixasColetorDTOErro);
                    _unit.EventosBaixasColetor.Update(eventosBaixasEntitieErro);
                    _unit.Complete();
                }
            }

            if (baixasNaoRealizadas.Count == 0)
            {
                return Ok("Baixas realizada com sucesso");
            }
            else if (baixasNaoRealizadas.Count == eventosBaixasColetor.Count)
            {
                return BadRequest("Nenhuma baixa foi realizada");
            }
            else
            {
                string todasAsBaixasNaoRealizadas = string.Join(", ", baixasNaoRealizadas);
                return BadRequest("Baixas " + todasAsBaixasNaoRealizadas + " não realizadas");
            }
        }


        [HttpPut]
        [Route("AtualizarBaixaOrdemServico")]
        [CebiPerfilAuthorize("gServ.coletor.baixas")]
        [AllowAnonymous]
        public IHttpActionResult AtualizarConteudoXml(EventosBaixasColetorStringDTO eventosBaixasColetor)
        {
            var EventosBaixasColetorService = new EventosBaixasColetorService(_unit);

            string xmlError = EventosBaixasColetorService.ValidaXml(eventosBaixasColetor.ConteudoBaixa);

            if (xmlError != null)
            {
                return BadRequest("Conteúdo XML inválido: " + xmlError);
            }

            EventosBaixasColetorService.AtualizarEventosBaixasColetor(eventosBaixasColetor.ConteudoBaixa, eventosBaixasColetor.EventoBaixaColetorId);

            return Ok("Baixas atualizadas com sucesso");
        }


        [HttpPost]
        [Route("GravarFotoOrdemServico")]
        [AllowAnonymous]
        public IHttpActionResult GravarFotoOrdemServico(GravarFotoOsDTO dados)
        {
            var gravarOrdemServicoFotoService = new GravarFotoOSService(_unit);

            var nomeFoto = "FOTOCOLETOR-" + dados.Sequencia;

            if (dados.Sequencia == 11)
            {
                nomeFoto = "FOTOCOLETORASSINATURA";
            }
            else if (dados.Sequencia == 12)
            {
                nomeFoto = "FOTOCOLETORMULTA";
            }
            else if (dados.Sequencia == 13)
            {
                nomeFoto = "FOTOCOLETORENCERRAMENTO";
            }
            else if (dados.Sequencia == 1)
            {
                nomeFoto = "FOTOCOLETORINICIO";
            }

            var fotoBaixada = _unit.DocumentosLigacoes.Find(x => x.OrdemServico == dados.OrdemServicoId &&
                                                                 x.Evento == dados.EventoId &&
                                                                 x.Nome == nomeFoto);

            if (fotoBaixada.Count() == 0)
                try
                {
                    gravarOrdemServicoFotoService.ExecutarPrecedureGravarFotoOS(dados);

                }
                catch (Exception ex)
                {
                    return Ok(ex.ToString());
                }
            else
            {
                Ok("Foto já foi gravada!");
            }

            return Ok("Foto gravada com sucesso!");
        }

        [HttpGet]
        [Route("GerarCargaInicialEquipe")]
        [AllowAnonymous]
        public IHttpActionResult GerarCargaInicialEquipe(string equipeId, string equipamentoId)
        {
            try
            {
                var equipeService = new EquipesService(_unit);
                var conteudoXml = equipeService.ExecutarProcedureCargaInicialEquipe(equipeId);
                _unit.Complete();
                return Ok(conteudoXml);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException.Message + "/" + ex.InnerException.InnerException.Message);
            }

        }


        [HttpPost]
        [Route("ObterBaixas")]
        [CebiPerfilAuthorize("gServ.coletor.baixas")]

        public IHttpActionResult ObterBaixas(DadosRecursoDTO retorno)
        {
            var camposFiltro = new Atendimento.Domain.DTO.CamposFiltroColetorBaixasDTO();
            bool isEmpty = true;

            foreach (var dados in retorno.DadosCampos)
            {
                var campo = _unit.Campos.Get(dados.Id);

                switch (campo.Tabela.Nome)
                {
                    case "Filtros":
                        var tipo = typeof(Atendimento.Domain.DTO.CamposFiltroColetorBaixasDTO);
                        PropertyInfo novoFiltro = tipo.GetProperty(campo.CampoTabelaClasse);

                        if (!string.IsNullOrEmpty(dados.Dados))
                        {
                            if (novoFiltro.PropertyType == typeof(bool?) || novoFiltro.PropertyType == typeof(bool))
                            {
                                bool valorBooleano = Convert.ToBoolean(dados.Dados);
                                if (!valorBooleano) // Se for false, tratamos como nulo e continuamos para a próxima iteração
                                {
                                    continue;
                                }
                            }

                            isEmpty = false;

                            if (novoFiltro.PropertyType == typeof(int) || novoFiltro.PropertyType == typeof(int?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(string))
                            {
                                novoFiltro.SetValue(camposFiltro, dados.Dados);
                            }
                            else if (novoFiltro.PropertyType == typeof(DateTime?) || novoFiltro.PropertyType == typeof(DateTime))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToDateTime(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(bool?) || novoFiltro.PropertyType == typeof(bool))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToBoolean(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(Equipe))
                            {
                                var equipeId = Convert.ToInt32(dados.Dados);
                                var equipe = _unit.Equipes.Get(equipeId);
                                if (equipe != null)
                                {
                                    novoFiltro.SetValue(camposFiltro, equipe);
                                }
                            }
                        }
                        // Caso a propriedade seja null, ignoramos e prosseguimos para a próxima iteração do loop
                        else
                        {
                            continue;
                        }
                        break;
                }
            }

            List<EventosBaixasColetor> baixas;

            if (isEmpty)
            {
                baixas = (List<EventosBaixasColetor>)_unit.EventosBaixasColetor.GetAll();
            }
            else
            {
                baixas = _unit.EventosBaixasColetor.ObterEventosBaixasColetor(camposFiltro);
            }

            foreach (var baixa in baixas)
            {
                baixa.Equipe = _unit.Equipes.Get(baixa.EquipeId);
            }

            return Ok(baixas);
        }

        [HttpGet]
        [Route("ObterBaixa")]
        [CebiPerfilAuthorize("gServ.coletor.baixas")]
        public IHttpActionResult ObterBaixa(int id)
        {
            var EventosBaixasColetorService = new EventosBaixasColetorService(_unit);
            EventosBaixasColetor baixa = _unit.EventosBaixasColetor.Get(id);
            EventosBaixasColetorStringDTO result = EventosBaixasColetorService.ConvertToEventosBaixasColetorStringDTO(baixa);
            return Ok(result);
        }

        [HttpPut]
        [Route("AtribuirOrdemServicoEquipe")]
        [AllowAnonymous]
        public IHttpActionResult AtribuirOrdemServicoEquipe(string equipeId, string equipamentoId)
        {
            try
            { 
                var ordensServicoColetorService = new OrdensServicoColetorService(_unit);

                var result = ordensServicoColetorService.ExecutarProcedureEProcessarResultado(equipeId, equipamentoId);

                if (result != null) 
                { 
                    return Ok(result); 
                }
                else
                {
                    return BadRequest("Não foi possível completar o seu registro: dados nulos ou inválidos");
                };
               
            }
            catch (Exception ex)
            {
                var result = new OrdensServicoColetorResult
                {
                    EquipeId = equipeId,
                    EquipamentoId = equipamentoId,
                    DataRegistro = DateTime.Now,
                    MensagemErro = ex.Message
                };
                return Ok(result);
            }
        }

    }
}
