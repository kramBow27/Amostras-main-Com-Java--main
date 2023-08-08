using Cebi.Atendimento.Domain.DTO;
using Cebi.Atendimento.Domain.Entities;
using Cebi.Util.Domain.Interfaces;
using System.Collections.Generic;

namespace Cebi.Atendimento.Domain.Interfaces
{
    public partial interface IInformacaoAdicionalColetorRepository : IRepository<InformacaoAdicionalColetor>
    {
        int? ObterCamposInformacoesAdicionais(int? eventoId);
        //void AtualizarCamposInformacoesAdicionais(int eventoId, InformacaoAdicionalColetor model);
    }
}