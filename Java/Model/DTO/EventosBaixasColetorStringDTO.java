package amostras.domain.entities;


public class EventosBaixasColetorStringDTO {


    private Integer eventoBaixaColetorId;


    private LocalDateTime dataRegistro;

    private Integer eventoId;

    private Equipe equipe;

    private String equipamentoId;

    private Integer ordemServicoId;


    private String conteudoBaixa;


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

    public String getConteudoBaixa() {
        return conteudoBaixa;
    } 

    public void setConteudoBaixa(String conteudoBaixa) 
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
