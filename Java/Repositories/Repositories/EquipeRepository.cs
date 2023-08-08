using Cebi.Atendimento.Domain.Interfaces;
using Cebi.Atendimento.Domain.Entities;
using Cebi.Util.Dal;
using Cebi.Atendimento.Domain.DTO;
using Cebi.Atendimento.Domain.Services.OrdensServico;
using System.Collections.Generic;
using Cebi.Atendimento.Domain.Services.Equipes;
using System.Linq;
using Oracle.ManagedDataAccess.Client;
using System.Data;
using System;
using Oracle.ManagedDataAccess.Types;

namespace Cebi.Atendimento.Dal.Repositories
{
    public partial class EquipeRepository : Repository<Equipe>, IEquipeRepository
    {
        private readonly AtendimentoContext _context;

        public EquipeRepository(AtendimentoContext context)
            : base(context)
        {
            _context = context;
        }

        public List<EquipesResult> ObterEquipes(CamposFiltroEquipeDTO filtros)
        {
            var query = _context.Equipes.AsQueryable();

            if (filtros.EquipeId != null)
            {
                query = query.Where(e => e.EquipeId == filtros.EquipeId);
            }

            if (filtros.CentroCustoId != null)
            {
                query = query.Where(e => e.CentroCustoId == filtros.CentroCustoId);
            }

            query = query.Where(e => e.UsaColetor == true);

            query = query.Where(e => e.UltimaColeta != null);

            var result = query
                .Join(_context.CentrosCusto,
                      equipe => equipe.CentroCustoId,
                      centroCusto => centroCusto.CentroCustoId,
                      (equipe, centroCusto) => new { Equipe = equipe, CentroCusto = centroCusto })
                .Select(e => new EquipesResult
                {
                   
                    CargaColetor = e.Equipe.CargaColetor,
                    CargaHoraria = e.Equipe.CargaHoraria,
                    EquipeId = e.Equipe.EquipeId,
                    CentroCustoId = e.Equipe.CentroCustoId,
                    Descricao = e.Equipe.Descricao,
                    AreaManutencaoId = e.Equipe.AreaManutencaoId,
                    GrupoId = e.Equipe.GrupoId,
                    Preco = e.Equipe.Preco,
                    Inutilizada = e.Equipe.Inutilizada,
                    TipoOcorrenciasColetor = e.Equipe.TipoOcorrenciasColetor,
                    TipoMaoDeObraColetor = e.Equipe.TipoMaoDeObraColetor,
                    TipoMateriaisColetor = e.Equipe.TipoMateriaisColetor,
                    UltimaColeta =e.Equipe.UltimaColeta,
                    UltimaLatitude = e.Equipe.UltimaLatitude,
                    UltimaLongitude = e.Equipe.UltimaLongitude,
                    DataStatus = e.Equipe.DataStatus,
                    UsaColetor = e.Equipe.UsaColetor,
                    
                    CentroCustoDescricao = e.CentroCusto.Descricao,
                })
                .ToList();

            return result;
        }

        public EquipesResult ObterEquipe(string id)
        {
            var query = from e in _context.Equipes
                        where e.EquipeId == id

                        select new EquipesResult
                        {

                            CargaColetor = e.CargaColetor,
                            CargaHoraria = e.CargaHoraria,
                            EquipeId = e.EquipeId,
                            CentroCustoId = e.CentroCustoId,
                            Descricao = e.Descricao,
                            AreaManutencaoId = e.AreaManutencaoId,
                            GrupoId = e.GrupoId,
                            Preco = e.Preco,
                            Inutilizada = e.Inutilizada,
                            TipoOcorrenciasColetor = e.TipoOcorrenciasColetor,
                            TipoMaoDeObraColetor = e.TipoMaoDeObraColetor,
                            TipoMateriaisColetor = e.TipoMateriaisColetor,
                            UltimaColeta = e.UltimaColeta,
                            UltimaLatitude = e.UltimaLatitude,
                            UltimaLongitude = e.UltimaLongitude,
                            DataStatus = e.DataStatus,
                            UsaColetor = e.UsaColetor,


                        };


            return (EquipesResult)query;
        }

        public string CargaInicialEquipe(string equipeId)
        {
            try
            {
                var cmd = (_context.Database.Connection.CreateCommand() as OracleCommand);
                _context.Database.Connection.Open();
                int nivelLog = 0;
            
                cmd.CommandText = "CEBI.PCK_AVL_195_CAMPOS_DINAMICOS.CargaInicialEquipe";
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

    }
}