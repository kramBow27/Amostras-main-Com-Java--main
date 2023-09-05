using System.Web.Http;
using System.Linq;

namespace Cebi.Atendimento.Api.Controllers
{
    public partial class OpcoesListaColetorController : ApiController
    {
        [Route("ObterOpcoesListaColetor")]
        public IHttpActionResult GetOpcoesListaColetor(int listaOpcaoId)
        {
            var registros = _unit.OpcoesListaColetor.Find(x=>x.ListaOpcaoColetorId == listaOpcaoId).ToList();

            return Ok(registros);
        }
       

    }
}