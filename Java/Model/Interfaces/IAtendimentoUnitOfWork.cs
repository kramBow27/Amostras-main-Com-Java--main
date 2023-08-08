using Cebi.Util.Domain.Interfaces;

namespace Cebi.Atendimento.Domain.Interfaces
{
    public partial interface IAtendimentoUnitOfWork : IUnitOfWork
    {
  
        IEquipeRepository Equipes { get; }
       
        IOrdensServicoColetorRepository OrdensServicoColetor { get; }
        
        IEventosBaixasColetorRepository EventosBaixasColetor { get; }

        IEquipeCoordenadasRepository EquipeCoordenadas { get; }
       
        IInformacaoAdicionalColetorRepository InformacaoAdicionaisColetor { get; }
       
    }
}