using Cebi.Atendimento.Domain.Enums;
using System;
namespace Cebi.Atendimento.Domain.Entities
{
    public partial class Equipe
    {
        public string EquipeId { get; set; }

        public string Descricao { get; set; }

        public int? AreaManutencaoId { get; set; }

        public int? GrupoId { get; set; }

        public decimal? CargaHoraria { get; set; }

        public decimal? Preco { get; set; }

        public bool? Inutilizada { get; set; }

        public bool? UsaColetor { get; set; }

        public int? CargaColetor { get; set; }

        public DateTime? DataStatus { get; set; }

        public int? CentroCustoId { get; set; }

        public ColetorMaoDeObraEnum? TipoMaoDeObraColetor { get; set; }

        public ColetorTipoMateriaisEnum? TipoMateriaisColetor { get; set; }

        public ColetorTipoOcorrenciaEnum? TipoOcorrenciasColetor { get; set; }

        public string UltimaLatitude { get; set; }

        public string UltimaLongitude { get; set; }

        public DateTime? UltimaColeta { get; set; }

    }
}