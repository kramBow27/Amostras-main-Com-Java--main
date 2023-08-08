package amostras.domain.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import javax.persistence.*;
@Entity
@Table(name = "EQUIPE_COORDENADAS", schema = "CEBI")
   public class EquipeCoordenadas {
    @Id
    @Column(name = "EQUIPE_COORDENADA_ID")
        private Integer equipeCoordenadaId;
    @Column(name = "DATA_CRIACAO")
        private LocalDateTime dataCriacao;
    @Column(name = "DATA_REGISTRO")     
        private LocalDateTime dataRegistro; 
    @Column(name = "EQUIPE_ID")
        private String equipeId; 
    @Column(name = "EQUIPAMENTO_ID")
        private String equipamentoId; 
    @Column(name = "LATITUDE")
        private String latitude;
    @Column(name = "LONGITUDE") 
        private String longitude;
    @Column(name = "OBSERVACAO") 
        private String observacao; 

        public Integer getEquipeCorodenadaId() {
            return equipeCoordenadaId;
        }

        public void setEquipeCoordenadaId(Integer equipeCoordenadaId) {
            this.equipeCoordenadaId = equipeCoordenadaId;

        }

        public LocalDateTime getDataCriacao() {
            return dataCriacao;
        }

        public void setDataCriacao(LocalDateTime dataCriacao) {
            this.dataCriacao = dataCriacao;
        }

        public LocalDateTime getDataRegistro() {
            return dataRegistro;
        }

        public void setDataRegistro(LocalDateTime dataRegistro) {
            this.dataRegistro = dataRegistro;
        }

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
            this.equipamentoId = equipamentoId;
        }

        public String getLatitude() {
            return latitude;

        }

        public void setLatitude(String latitude) {
            this.latitude = latitude;
        }

        public String getLongitude() {
            return longitude;
        }

        public void setLongitude(String longitude) {
            this.longitude = longitude;
        }

        public String getObservacao() {
            return observacao;
        }

        public void setObservacao(String observacao) {
            this.observacao = observacao;
        }

    }

