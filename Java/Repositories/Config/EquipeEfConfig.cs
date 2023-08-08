using System.Data.Entity.ModelConfiguration;
using Cebi.Atendimento.Domain.Entities;

namespace Cebi.Atendimento.Dal.Config
{
    public partial class EquipeEfConfig : EntityTypeConfiguration<Equipe>
    {
        public EquipeEfConfig()
        {
            ToTable("EQUIPE", "CEBI")
                .HasKey(x => x.EquipeId);

            Property(x => x.EquipeId)
                .HasColumnName("CODEQUIPEID");

            Property(x => x.Descricao)
                .HasMaxLength(50);

            Property(x => x.AreaManutencaoId)
                .IsOptional()
                .HasColumnName("AREAMANUTENCAO");

            Property(x => x.GrupoId)
                .IsOptional()
                .HasColumnName("GRUPOID");

            Property(x => x.CargaHoraria)
                .IsOptional()
                .HasColumnName("CARGAHORARIA");

            Property(x => x.Preco)
                .IsOptional()
                .HasPrecision(14,2);

            Property(x => x.UsaColetor)
                .IsOptional()
                .HasColumnName("USACOLETOR");

            Property(x => x.CargaColetor)
                .IsOptional()
                .HasColumnName("CARGACOLETOR");

            Property(x => x.DataStatus)
                .IsOptional()
                .HasColumnName("DATASTATUS");

            Property(x => x.CentroCustoId)
                .IsOptional()
                .HasColumnName("CUSTOID");

            Property(x => x.TipoMaoDeObraColetor)
                .IsOptional()
                .HasColumnName("TIPOMAODEOBRACOLETOR");

            Property(x => x.TipoMateriaisColetor)
                .IsOptional()
                .HasColumnName("TIPOMATERIAISCOLETOR");

            Property(x => x.TipoOcorrenciasColetor)
                .IsOptional()
                .HasColumnName("TIPOOCORRENCIASCOLETOR");
            Property(x => x.UltimaLongitude)
                .IsOptional()
                .HasColumnName("ULTIMA_LONGITUDE")
                .HasMaxLength(30);
            Property(x=> x.UltimaLatitude)
                .IsOptional()
                .HasColumnName("ULTIMA_LATITUDE")
                .HasMaxLength(30);
            Property(x => x.UltimaColeta)
                .IsOptional()
                .HasColumnName("ULTIMA_COLETA");
                
        }
    }
}