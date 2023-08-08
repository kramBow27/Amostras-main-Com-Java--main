pacakge amostras.entities.dto;

{
    private class InformacaoAdicionalColetorDTO
    {
       
            private Integer informacaoAdicionalColetorId ;

            private Integer eventoId ;
            @OneToMany
            @JoinColumn(name = "EVENTO_ID")
            private  Evento evento ;

            private Integer campoColetorId ;
            private CampoColetor campoColetor ;

            private String valor ;

            private Integer ordem ;

        
    }
}
