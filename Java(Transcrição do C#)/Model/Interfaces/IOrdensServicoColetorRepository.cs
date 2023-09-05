using Cebi.Atendimento.Domain.DTO;
using Cebi.Atendimento.Domain.Entities;
using Cebi.Atendimento.Domain.Services.Equipes;
using Cebi.Atendimento.Domain.Services.OrdensServicoColetor;
using Cebi.Util.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cebi.Atendimento.Domain.Interfaces
{
    public interface IOrdensServicoColetorRepository : IRepository<OrdensServicoColetor>
    {
       

        OrdensServicoColetorResult AtribuirOrdemServicoEquipe(string equipeId, string equipamentoId);
    }
}
