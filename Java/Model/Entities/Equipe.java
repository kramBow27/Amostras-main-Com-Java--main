package amostras.domain.entities;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Equipe {

    private String equipeId;
    private String descricao;
    private Integer areaManutencaoId;
    private Integer grupoId;
    private BigDecimal cargaHoraria;
    private BigDecimal preco;
    private Boolean inutilizada;
    private Boolean usaColetor;
    private Integer cargaColetor;
    private LocalDateTime dataStatus;
    private Integer centroCustoId;
    private String ultimaLatitude;
    private String ultimaLongitude;
    private LocalDateTime ultimaColeta;

    public String getEquipeId() {
        return equipeId;
    }

    public void setEquipeId(String equipeId) {
        this.equipeId = equipeId;
    }

    public String getDescricao() {
        return equipeId;
    }

    public void setDescricao(String equipeId) {
        this.equipeId = equipeId;
    }

    public Integer getAreaManutencaoId() {
        return areaManutencaoId;
    }

    public void setAreaManutencaoId(Integer areaManutencaoId) {
        this.areaManutencaoId = areaManutencaoId;
    }

    public Integer getGrupoId() {
        return GrupoId;
    }

    public void setGrupoId(Integer grupoId) {
        this.grupoId = grupoId;
    }

    public BigDecimal getCargaHoraria() {
        return cargaHoraria;
    }

    public void setCargaHoraria(BigDecimal cargaHoraria) {
        this.cargaHoraria = cargaHoraria;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }

    public Boolean getInutilizada() {
        return inutilizada;
    }

    public void setInutilizada(Boolean inutilizada) {
        this.inutilizada = inutilizada;
    }

    public Boolean getUsaColetor() {
        return usaColetor;
    }

    public void setUsaColetor(Boolean usaColetor) {
        this.usaColetor = usaColetor;
    }

    public Integer getCargaColetor() {
        return cargaColetor;
    }

    public void  setCargaColetor(Integer cargaColetor) {
        this.cargaColetor = cargaColetor;
    }
    
    public LocalDateTime getDataStatus() {
        return dataStatus;
    }

    public void setDataStatus(LocalDateTime dataStatus) {
        this.dataStatus = dataStatus;
    }

    public Integer getCentroCustoId() {
        return centroCustoId;
    }

    public void setCentroCustoId(Integer centroCustoId) {
        this.centroCustoId = centroCustoId;
    }

    public String getUltimaLatitude() {
        return ultimaLatitude;
    }

    public void setUltimaLatitude(String ultimaLatitude) {
        this.ultimaLatitude = ultimaLatitude;
    }

    
    public String getUltimaLongitude() {
        return ultimaLongitude;
    }

    public void setUltimaLongitude(String ultimaLongitude) {
        this.ultimaLongitude = ultimaLongitude;
    }

    public LocalDateTime getUltimaColeta() {
        return ultimaColeta;
    }

    public void setUltimaColeta(LocalDateTime ultimaColeta) {
        this.ultimaColeta = ultimaColeta;
    }
}
