package amostras.domain.entities;

import javax.persistence.*;

@Entity
@Table(name = "EVENTOS_BAIXAS_COLETOR", schema = "CEBI")
public class EventosBaixasColetor {

    @Id
    @Column(name = "EVENTO_BAIXA_COLETOR_ID")
    private Integer eventoBaixaColetorId;

    @Column(name = "DATA_REGISTRO")
    private LocalDateTime dataRegistro;

    @Column(name = "EVENTOID")
    private Integer eventoId;

    @ManyToOne
    @JoinColumn(name = "EQUIPE_ID")
    private Equipe equipe;

    @Column(name = "EQUIPAMENTO_ID")
    private String equipamentoId;

    @Column(name = "OSID")
    private Integer ordemServicoId;

    @Lob
    @Column(name = "CONTEUDO_BAIXA")
    private byte[] conteudoBaixa;

    @Column(name = "MENSAGEM_ERRO")
    private String mensagemErro;

    public  Integer getEventoBaixaColetorId() {
        return eventoBaixaColetorId;
    }

    public void setEventoBaixaColetorId(Integer eventoBaixaColetorId) 
    {
        this.eventoBaixaColetorId = eventoBaixaColetorId;
    }

    public LocalDateTime getDataRegistro() 
    {
        return dataRegistro;
    }

    public void setDataRegistro(LocalDateTime dataRegistro) 
    {
        this.dataRegistro = dataRegistro;
    }

    public Integer getEventoId() 
    {
        return eventoId;
    }

    public void setEventoId(Integer eventoId) 
    {
        this.eventoId = eventoId;
    }

    public Equipe getEquipe() 
    {
        return equipe;
    }

    public void setEquipe(Equipe equipe) 
    {
        this.equipe = equipe;
    }

    public String getEquipamentoId() {
        return equipamentoId;
    }

    public void setEquipamentoId(String equipamentoId) 
    {
        this.equipamentoId = equipamentoId;
    }

    public Integer getOrdemServicoId() {
        return ordemServicoId;
    }

    public void setOrdemServicoId(Integer ordemServicoId) {
        this.ordemServicoId = ordemServicoId;
    }

    public byte[] getConteudoBaixa() {
        return conteudoBaixa;
    } 

    public void setConteudoBaixa(byte[] conteudoBaixa) 
    {
        this.conteudoBaixa = conteudoBaixa;
    }

    public String getMensagemErro() 
    {
        return menssagemErro;
    }

    public void setMensagemErro(String mensagemErro) 
    {
        this.mensagemErro = mensagemErro;
    }

}
