using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cebi.Atendimento.Domain.DTO
{
    public class EquipeCoordenadasDTO
    {
      
            public int EquipeCoordenadaId { get; set; }
            public DateTime DataCriacao { get; set; }
            public DateTime DataRegistro { get; set; }
            public string EquipeId { get; set; }
            public string EquipamentoId { get; set; }
            public string Latitude { get; set; }
            public string Longitude { get; set; }
            public string Observacao { get; set; }

       
    }

}
