 [HttpPost]
 [Route("ProgramarColetorOrdensServico")]
 public IHttpActionResult ProgramarColetorOrdensServico(ProgramacaoColetorOsDto dadosProgramacaoColetorOs)
 {
     lock (lockObj)
     {
         var funcionarioId = CebiIdentity.ObterFuncionarioId().Value;
         foreach (var eventoId in dadosProgramacaoColetorOs.EventosId)
         {
             var eventoProgramado = _unit.Eventos.Find(x => x.EventoId == eventoId &&
                                                            x.ImpressaoInd == true).FirstOrDefault();

             if (eventoProgramado != null)
             {
                 retornoErros.UserNotification = "Ordem de Serviço número " + eventoProgramado.OrdemServicoId + " selecionada já foi programada por outro usuário.";
                 return Content(HttpStatusCode.BadRequest, retornoErros);

             }
         }

         var programarColetorOs = new ProgramacaoColetorOsService(_unit);
         programarColetorOs.Executar(dadosProgramacaoColetorOs, funcionarioId);

         _unit.Complete();

         var retorno = ApiReturnMessage.CreateUpdateOkMessage();
         return Ok(retorno);
     }
 }