  public void GravarFotoEvento(GravarFotoOsDTO dados) 
  {
      try
      {
          var cmd = (_context.Database.Connection.CreateCommand() as OracleCommand);
          _context.Database.Connection.Open();
          
          int nivelLog = 0;
          cmd.CommandText = "NomeOcultado.GravarFotoEventoOs";
          cmd.Parameters.Add("nivelLog", OracleDbType.Int32, nivelLog, ParameterDirection.Input);
          cmd.Parameters.Add("sequencia", OracleDbType.Int32, dados.Sequencia, ParameterDirection.Input);
          cmd.Parameters.Add("os", OracleDbType.Int32, dados.OrdemServicoId, ParameterDirection.Input);
          cmd.Parameters.Add("evento", OracleDbType.Int32, dados.EventoId, ParameterDirection.Input);
          cmd.Parameters.Add("foto", OracleDbType.Clob, dados.XmlFoto, ParameterDirection.InputOutput);

          cmd.CommandType = CommandType.StoredProcedure;
          cmd.ExecuteNonQuery();



      }
      catch (Exception ex)
      {
          throw ex;
      }
  }

   public void GravarBaixaOS(string xml)
 {
     try
     {
         var cmd = (_context.Database.Connection.CreateCommand() as OracleCommand);

       
         if (_context.Database.Connection.State != ConnectionState.Open)
         {
             _context.Database.Connection.Open();
         }

         int? codigo = null;
         int nivelLog = 0;
         cmd.CommandText = "NomeOcultado.DINAMICOS.GRAVARBAIXASOS";
         cmd.Parameters.Add("nivelLog", OracleDbType.Int32, nivelLog, ParameterDirection.Input);
         cmd.Parameters.Add("codigo", OracleDbType.Int32, codigo, ParameterDirection.InputOutput);
         cmd.Parameters.Add("conteudo", OracleDbType.Clob, xml, ParameterDirection.InputOutput);

         cmd.CommandType = CommandType.StoredProcedure;
         cmd.ExecuteNonQuery();
     }
     catch (Exception ex)
     {
         throw ex;
     }
     finally
     {
         
         if (_context.Database.Connection.State == ConnectionState.Open)
         {
             _context.Database.Connection.Close();
         }
     }
 }

   public string CargaInicialEquipe(string equipeId)
  {
      try
      {
          var cmd = (_context.Database.Connection.CreateCommand() as OracleCommand);
          _context.Database.Connection.Open();
          int nivelLog = 0;
      
          cmd.CommandText = "NomeOcultado.CargaInicialEquipe";
          cmd.Parameters.Add("nivelLog", OracleDbType.Int32, nivelLog, ParameterDirection.Input);
          cmd.Parameters.Add("equipeId", OracleDbType.Varchar2, equipeId, ParameterDirection.Input);
          cmd.Parameters.Add("conteudo_xml", OracleDbType.Clob, null, ParameterDirection.InputOutput);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.ExecuteNonQuery();
          OracleClob clob = (OracleClob)cmd.Parameters["conteudo_xml"].Value;
          var conteudoXml = clob.Value;

          return conteudoXml;
      }
      catch (Exception ex)
      {
          throw ex;
      }
  }

  
        public OrdensServicoColetorResult AtribuirOrdemServicoEquipe(string idEquipe, string idEquipamento)
        {

            var cmd = (_context.Database.Connection.CreateCommand() as OracleCommand);

            if (_context.Database.Connection.State != ConnectionState.Open)
            {
                _context.Database.Connection.Open();
            }

            cmd.CommandText = "NomeOcultado.DINAMICOS.AtribuirOSEquipe";
            cmd.Parameters.Add("nivelLog", OracleDbType.Int32, 0, ParameterDirection.Input);
            cmd.Parameters.Add("equipeId", OracleDbType.Varchar2, idEquipe, ParameterDirection.Input);
            cmd.Parameters.Add("equipamentoId", OracleDbType.Varchar2, idEquipamento, ParameterDirection.Input);

            var pConteudo = cmd.Parameters.Add("conteudo", OracleDbType.Clob, null, ParameterDirection.InputOutput);
            var pNumeroOsId = cmd.Parameters.Add("numeroOsId", OracleDbType.Int32, null, ParameterDirection.InputOutput);
            var pNumeroEventoId = cmd.Parameters.Add("numeroEventoId", OracleDbType.Int32, null, ParameterDirection.InputOutput);
            var pOsPendentes = cmd.Parameters.Add("osPendentes", OracleDbType.Int32, null, ParameterDirection.InputOutput);
            try
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.ExecuteNonQuery();
                var resultadoOrdemServicoEquipe = new OrdensServicoColetorResult
                {
                    EquipeId = idEquipe,
                    EquipamentoId = idEquipamento,
                    DataRegistro = DateTime.Now,
                    MensagemErro = null
                };
                OracleClob clob = (OracleClob)pConteudo.Value;
                resultadoOrdemServicoEquipe.ConteudoOs = clob.Value;
                resultadoOrdemServicoEquipe.Osid = ((Oracle.ManagedDataAccess.Types.OracleDecimal)pNumeroOsId.Value).ToInt32();
                resultadoOrdemServicoEquipe.EventoId = ((Oracle.ManagedDataAccess.Types.OracleDecimal)pNumeroEventoId.Value).ToInt32();
                resultadoOrdemServicoEquipe.OsPendentes = ((Oracle.ManagedDataAccess.Types.OracleDecimal)pOsPendentes.Value).ToInt32();

                return resultadoOrdemServicoEquipe;
            }
            catch (Exception ex)
            {
                var resultadoOrdemServicoEquipeErro = new OrdensServicoColetorResult
                {
                    EquipeId = idEquipe,
                    EquipamentoId = idEquipamento,
                    DataRegistro = DateTime.Now,
                    MensagemErro = ex.Message
                };

                string conteudoOs = "";

                if (pConteudo.Value is OracleClob clob)
                {
                    conteudoOs = clob.Value;
                }
                resultadoOrdemServicoEquipeErro.ConteudoOs = conteudoOs;

                if (pNumeroOsId.Value is Oracle.ManagedDataAccess.Types.OracleDecimal decimalOsId)
                {
                    resultadoOrdemServicoEquipeErro.Osid = decimalOsId.ToInt32();
                }

                if (pNumeroEventoId.Value is Oracle.ManagedDataAccess.Types.OracleDecimal decimalEventoId)
                {
                    resultadoOrdemServicoEquipeErro.EventoId = decimalEventoId.ToInt32();
                }

                if (pOsPendentes.Value is Oracle.ManagedDataAccess.Types.OracleDecimal decimalOsPendentes)
                {
                    resultadoOrdemServicoEquipeErro.OsPendentes = decimalOsPendentes.ToInt32();
                }

                return resultadoOrdemServicoEquipeErro;

                throw;
            }
        }