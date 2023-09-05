using System.Data.Entity.ModelConfiguration;
using Cebi.Atendimento.Domain.Entities;

namespace Cebi.Atendimento.Dal.Config
{
    public class OrdensServicoColetorEfConfig : EntityTypeConfiguration<OrdensServicoColetor>
    {
        public OrdensServicoColetorEfConfig()
        {
            ToTable("ORDENS_SERVICO_COLETOR", "CEBI")
                .HasKey(x => x.OrdemServicoColetorId);

            Property(x => x.OrdemServicoColetorId)
                .HasColumnName("ORDEM_SERVICO_COLETOR_ID");

            Property(x => x.DataRegistro)
                .HasColumnName("DATA_REGISTRO");

            Property(x => x.EventoId)
                .HasColumnName("EVENTOID");

            Property(x => x.Osid)
                .HasColumnName("OSID");

            Property(x => x.EquipeId)
                .HasColumnName("EQUIPE_ID");

            Property(x => x.EquipamentoId)
                .HasColumnName("EQUIPAMENTO_ID");

            Property(x => x.ConteudoOs)
                .HasColumnName("CONTEUDO_OS");

            Property(x => x.MensagemErro)
                .HasColumnName("MENSAGEM_ERRO");

        }
    }
}
