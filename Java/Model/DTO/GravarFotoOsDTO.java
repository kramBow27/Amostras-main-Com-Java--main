package amostras.domain.entities;


{
    public class GravarFotoOsDTO
    {
        private String equipeId ;
        private String equipamentoId ;
        private Integer eventoId ;
        private Integer ordemServicoId ;
        private Integer sequencia ;
        private String xmlFoto ;

        public String getEquipeId() {
            return equipeId;
        }

        public void setEquipeId(String equipeId) {
            this.equipeId = equipeId;
        }

        public String getEquipamentoId() {
            return equipamentoId;
        }

        public void setEquipamentoId(String equipamentoId) {
            this.equipamentoId = equipamentoId
        }

        public Integer getEventoId() {
            return eventoId;
        }

        public void setEventoId(Integer eventoId) {
            this.eventoId = eventoId;
        }

        public Integer getOrdemServicoId() {
            return ordemServicoId;
        }

        public void setOrdemServicoId(Integer ordemServicoId) 
        {
            this.ordemServicoId = ordemServicoId;
        }

        public Integer getSequencia() {
            return sequencia;
        }

        public void setSequencia(Integer sequencia)
        {
            this.sequencia = sequencia;
        }

        public String getXmlFoto() {
            return xmlFoto;
        }

        public void setXmlFoto(String xmlFoto) 
        {
            this.xmlFoto = xmlFoto;
        }
    }
}
