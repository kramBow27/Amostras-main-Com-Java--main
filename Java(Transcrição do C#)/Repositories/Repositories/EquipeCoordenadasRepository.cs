using Cebi.Atendimento.Domain.Interfaces;
using Cebi.Atendimento.Domain.Entities;
using Cebi.Util.Dal;

namespace Cebi.Atendimento.Dal.Repositories
{
    public partial class EquipeCoordenadasRepository : Repository<EquipeCoordenadas>, IEquipeCoordenadasRepository
    {
        private readonly AtendimentoContext _context;
        public EquipeCoordenadasRepository(AtendimentoContext context)
          : base(context)
        {
            _context = context;
        }
    }
}
