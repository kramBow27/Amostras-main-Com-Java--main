package amostras.domain.entities;
import javax.persistance.*;
@Entity
@Table(name = "CAMPO_INFORMACOES", schema="ESQUEMA")
     public class CampoInformacoes
    {     @Column(name = "NOME_CAMPO")
         private String NomeCampo  ;
         @Column(name = "NOME_DA_COLUNA_NA_TABELA")
         private Integer ListaOpcaoId  ;
         @Id
         @Column(name = "NOME_DA_COLUNA_NA_TABELA")
         private Integer CampoColetorId  ;
        
         @ManyToOne
         @JoinColumn(name= "EVENTO_ID")
         private  Evento Evento  ;
         @Column(name = "NOME_DA_COLUNA_NA_TABELA")
         private Integer InformacaoAdicionalColetorId  ;
         @ManyToOne
         @JoinColumn(name= "CAMPO_COLETOR_ID")
         private  CampoColetor Campo  ;
         @Column(name = "NOME_DA_COLUNA_NA_TABELA")
         private Integer Ordem  ;
         @Column(name = "NOME_DA_COLUNA_NA_TABELA")
         private Integer EventoId  ;
         @Column(name = "NOME_DA_COLUNA_NA_TABELA")
         private String Valor  ;
         @Column(name = "NOME_DA_COLUNA_NA_TABELA")
         private Integer Tamanho  ;
         @Column(name = "NOME_DA_COLUNA_NA_TABELA")
         private String ValorCheckbox  ;

         @Enumerated(EnumType.STRING)
          private TipoCamposColetorEnum tipo;
         @Column(name = "NOME_DA_COLUNA_NA_TABELA")
         private String DescricaoTipo  ;

         @ManyToOne
         @JoinColumn(name= "CAMPO_COLETOR_ID")
         private OpcaoListaColetor OpcaoLista  ;

         @OneToMany(mappedBy = "campoInformacoesId", cascade = CascadeType.ALL, orphanRemoval = true)
          private List<OpcaoListaColetor> listaOpcoes = new ArrayList<>();

        //getters e setters (exemplos digitados em EventosBaixasColetor, EquipeCoordenadas e Equipe, o padrão é basicamente o mesmo)

    }

