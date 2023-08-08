using Cebi.Atendimento.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cebi.Atendimento.Domain.Entities
{
    public partial class CampoInformacoes
    {
        public string NomeCampo { get; set; }
        public int? ListaOpcaoId { get; set; }

        public int? CampoColetorId { get; set; }
        public virtual Evento Evento { get; set; }

        public int InformacaoAdicionalColetorId { get; set; }
        public virtual CampoColetor Campo { get; set; }
        public int? Ordem { get; set; }

        public int? EventoId { get; set; }
        public string Valor { get; set; }

        public int? Tamanho { get; set; }
        public string ValorCheckbox { get; set; }
        public TipoCamposColetorEnum? Tipo { get; set; }

        public string DescricaoTipo { get; set; }

        public virtual OpcaoListaColetor OpcaoLista { get; set; }

        public List<OpcaoListaColetor> ListaOpcoes { get; set; }

    }
}
