using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cebi.Atendimento.Domain.Entities
{
    public class EventosBaixasColetor
    {
        public int EventoBaixaColetorId { get; set; }

        public DateTime DataRegistro { get; set; }
        public int EventoId { get; set; }

        public virtual Equipe Equipe { get; set; }
        public  string EquipeId { get; set; }
        public string EquipamentoId { get; set; }
        public int OrdemServicoId { get; set; }
        public byte[] ConteudoBaixa { get; set; }
        public string MensagemErro { get; set; }

    }
}
