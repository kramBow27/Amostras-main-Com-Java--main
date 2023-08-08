using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cebi.Atendimento.Domain.DTO
{
    public class GravarFotoOsDTO
    {
        public string EquipeId { get; set; }
        public string EquipamentoId { get; set; }

        public int EventoId { get; set; }
        public int OrdemServicoId { get; set; }
        public int Sequencia { get; set; }
        public string XmlFoto { get; set; }
    }
}
