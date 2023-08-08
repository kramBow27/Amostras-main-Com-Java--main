using Cebi.Atendimento.Domain.DTO;
using Cebi.Atendimento.Domain.Entities;
using Cebi.Atendimento.Domain.Services.Equipes;
using Cebi.Util.Domain.Interfaces;
using System.Collections.Generic;

namespace Cebi.Atendimento.Domain.Interfaces
{
    public partial interface IEquipeRepository : IRepository<Equipe>
    {
         List<EquipesResult> ObterEquipes(CamposFiltroEquipeDTO filtros);
        EquipesResult ObterEquipe(string id);

        string CargaInicialEquipe(string equipeId);
    }
}