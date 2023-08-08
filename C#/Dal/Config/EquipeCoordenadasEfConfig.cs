using Cebi.Atendimento.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cebi.Atendimento.Dal.Config.Gerados
{
    public partial class EquipeCoordenadasEfConfig : EntityTypeConfiguration<EquipeCoordenadas>
    {
        public EquipeCoordenadasEfConfig()
        {
            ToTable("EQUIPE_COORDENADAS", "CEBI")
                .HasKey(x => x.EquipeCoordenadaId);

            Property(x => x.DataCriacao)
               .HasColumnName("DATA_CRIACAO");

            Property(x => x.DataRegistro)
                .HasColumnName("DATA_REGISTRO");

            Property(x => x.EquipeId)
                .HasColumnName("EQUIPE_ID");

            Property(x => x.EquipamentoId)
                .HasColumnName("EQUIPAMENTO_ID");
           
            Property(x => x.Latitude)
               .HasColumnName("LATITUDE");
            
            Property(x => x.Longitude)
               .HasColumnName("LONGITUDE");
            
            Property(x => x.Observacao)
               .HasColumnName("OBSERVACAO");
        }
    }
}
