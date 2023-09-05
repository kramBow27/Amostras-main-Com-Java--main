using Cebi.Atendimento.Domain.Entities;
using Cebi.Util.Domain.Exceptions;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;

namespace Cebi.Atendimento.Dal.Repositories
{
    public partial class AtendimentoRepository
    {
        public IEnumerable<AtendimentoCampo> LocalizarAtendimentoPasso(int atendimentoId)
        {
            var query = from c in _context.AtendimentosCampos
                        where c.AtendimentoCampoId == atendimentoId
                        select c;

            return query.ToList();
        }

        public string ImportarConfiguracaoAtendimento(string origemAtendimentoId, string destinoAtendimentoId)
        {
            var conexao = new OracleConnection(ConfigurationManager.ConnectionStrings["CebiContext"].ToString());
            if (conexao.State == ConnectionState.Closed)
                conexao.Open();

            var result = "";

            try
            {
                var command = new OracleCommand
                {
                    Connection = conexao,
                    CommandText = "CEBI.FNC_DUPLICA_CONF_ATENDIMENTO",
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.Add("result", OracleDbType.Varchar2).Direction = ParameterDirection.ReturnValue;
                command.Parameters["result"].Size = 2;

                command.Parameters.Add("ATENDIMENTOORIGEM", OracleDbType.Varchar2).Value = origemAtendimentoId.ToString();
                command.Parameters.Add("ATENDIMENTODESTINO", OracleDbType.Varchar2).Value = destinoAtendimentoId.ToString();

                command.ExecuteNonQuery();
                result = command.Parameters["result"].Value.ToString();
            }

            catch (Exception ex)
            {
                throw new CebiException(ex.Message);
            }

            finally
            {
                conexao.Close();
            }

            return result;
        }
    }
}
