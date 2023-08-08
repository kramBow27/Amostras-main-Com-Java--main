using System.Data.Entity.ModelConfiguration;
using Cebi.Atendimento.Domain.Entities;

namespace Cebi.Atendimento.Dal.Config
{
    public class EventosBaixasColetorEfConfig : EntityTypeConfiguration<EventosBaixasColetor>
    {
        public EventosBaixasColetorEfConfig()
        {
            ToTable("EVENTOS_BAIXAS_COLETOR", "CEBI")
                .HasKey(x => x.EventoBaixaColetorId);

            Property(x => x.EventoBaixaColetorId)
                .HasColumnName("EVENTO_BAIXA_COLETOR_ID");

            Property(x => x.DataRegistro)
                .HasColumnName("DATA_REGISTRO");

            Property(x => x.EventoId)
                .HasColumnName("EVENTOID");

            Property(x => x.OrdemServicoId)
                .HasColumnName("OSID");
           
            Property(x => x.EquipeId)
                .HasColumnName("EQUIPE_ID");

            Property(x => x.EquipamentoId)
                .HasColumnName("EQUIPAMENTO_ID");

            Property(x => x.ConteudoBaixa)
                .HasColumnName("CONTEUDO_BAIXA");

            Property(x => x.MensagemErro)
                .HasColumnName("MENSAGEM_ERRO");

        }
    }
}
