using System;


namespace Cebi.Atendimento.Domain.Entities
{
   public class EquipeCoordenadas
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
