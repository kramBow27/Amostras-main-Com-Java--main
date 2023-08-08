using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cebi.Atendimento.Domain.DTO
{
    public class OrdensServicoColetorByteArrayDTO
    {
        public int OrdemServicoColetorId { get; set; }
        public DateTime DataRegistro { get; set; }
        public int EventoId { get; set; }
        public int Osid { get; set; }
        public string EquipeId { get; set; }
        public string EquipamentoId { get; set; }
        public byte[] ConteudoOs { get; set; }
        public string MensagemErro { get; set; }

    }
}
