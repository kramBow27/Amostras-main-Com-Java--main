using Cebi.Atendimento.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cebi.Atendimento.Domain.DTO
{
    public class InformacaoAdicionalColetorDTO
    {
       
            public int InformacaoAdicionalColetorId { get; set; }

            public int? EventoId { get; set; }
            public virtual Evento Evento { get; set; }

            public int? CampoColetorId { get; set; }
            public virtual CampoColetor CampoColetor { get; set; }

            public string Valor { get; set; }

            public int? Ordem { get; set; }

        
    }
}
