

using System.Web.Http;
using Cebi.Atendimento.Domain.Entities;
using Cebi.Util.WebApi.Messaging;
using Cebi.Atendimento.Domain.Interfaces;
using Cebi.Atendimento.Dal;
using System.Linq;
using Cebi.Atendimento.Domain.DTO;
using Cebi.Util;
using System.Collections.Generic;
using Cebi.Util.WebApi.Filters;
using Cebi.Atendimento.Domain.Services.OrdensServico;
using Cebi.Atendimento.Domain.Services.ParametrosWeb;
using Cebi.Atendimento.Domain.Services.Equipes;
using System.Reflection;
using System;
using Cebi.Atendimento.Reports;

namespace Cebi.Atendimento.Api.Controllers
{
    [RoutePrefix("Equipes")]
    public partial class EquipesController : ApiController
    {
        private readonly IAtendimentoUnitOfWork _unit;

        public EquipesController()
        {
            _unit = new AtendimentoUnitOfWork();
        }

       
        [HttpPost]
        [Route("ObterEquipes")]
        //[PerfilAuthorize("gServ.consultaEquipeMapa.consulta")]
       
        public IHttpActionResult ObterEquipes(DadosRecursoDTO retorno)
        {

            var camposFiltro = new Atendimento.Domain.DTO.CamposFiltroEquipeDTO();

            foreach (var dados in retorno.DadosCampos)
            {
                var campo = _unit.Campos.Get(dados.Id);

                switch (campo.Tabela.Nome)
                {
                    case "Filtros":

                        var tipo = typeof(Atendimento.Domain.DTO.CamposFiltroEquipeDTO);

                        PropertyInfo novoFiltro = tipo.GetProperty(campo.CampoTabelaClasse);

                        if (!string.IsNullOrEmpty(dados.Dados))
                        {
                            if (novoFiltro.PropertyType == typeof(int) || novoFiltro.PropertyType == typeof(int?))
                            {
                                novoFiltro.SetValue(camposFiltro, Convert.ToInt32(dados.Dados));
                            }
                            else if (novoFiltro.PropertyType == typeof(string))
                            {
                                novoFiltro.SetValue(camposFiltro, dados.Dados);
                            }


                        }
                        else
                        {
                            novoFiltro.SetValue(camposFiltro, null);
                        }

                        break;

                }
            }
        
            List<EquipesResult> equipes = _unit.Equipes.ObterEquipes(camposFiltro);
           

            return Ok(equipes);
        }

        [HttpGet]
        [Route("Obter Equipe")]
        public IHttpActionResult ObterEquipe(string id)
        {

            EquipesResult equipe = _unit.Equipes.ObterEquipe(id);

            return Ok(equipe);
        }
    }

}
