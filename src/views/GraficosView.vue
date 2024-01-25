<template>
    <body>
        <!-- CRIA UM CABEÇALHO PARA SELEÇÃO DE MÊS E UM BOTÃO PARA EXIBIR O ANO TODO -->
        <div class="form-check cabecalho" style="align-items: center;">
            <button v-b-tooltip.hover title="Ano inteiro!" class="botoes"
                @click="getPropostaComercialAno(), getTicketsAno(), getProdutosAno(), getClienteAno(), getClienteAno(), getProdutosAcabadosAno()">
                <i class="bi bi-calendar-minus"></i>
            </button>
            <div v-for="i in nomeDosMeses" :key="i">
                <input
                    @change="igualameses(), getPropostaComercialMes(), getTicketsMes(), getProdutosMes(), getClienteMes(), getProdutosAcabadosMes()"
                    type="radio" class="btn-check botoes" name="options-base" :id=i.id :value=i.id v-model="mes"
                    autocomplete="off">
                <label style="color: rgba(255, 255, 255, 1);margin-left: 0.5rem; font-size: large;" class="btn botoes"
                    :for=i.id>{{ i.nome }}</label>
            </div>
            <select class="botoes ano" v-model="ano"
                @change="getProdutosAno(), getPropostaComercialAno(), getTicketsAno(), getClienteAno(), getProdutosAcabadosAno()"
                style="width: 4rem; margin-left: 0.5em;margin-right: 0.5em  ;border: none; background-color: rgba(33, 37, 41, 1)">
                <option>2023</option>
                <option>2024</option>
            </select>
            <div style="border-left: solid 1px white;">
                <input
                    @change="getPropostaComercialAno(), getProdutosAno(), getTicketsAno(), getClienteAno(), getProdutosAcabadosAno(), definirListaDeProjetos()"
                    type="radio" class="btn-check botoes" name="tipodegrafico" id="barra" value="bar"
                    v-model="tipodegrafico" autocomplete="off">
                <label style="color: rgba(255, 255, 255, 1);margin-left: 0.5rem; font-size: medium;" class="btn botoes"
                    for="barra"><i class="bi bi-bar-chart-line-fill"></i></label>

                <input
                    @change="getPropostaComercialAno(), getProdutosAno(), getTicketsAno(), getClienteAno(), getProdutosAcabadosAno(), definirListaDeProjetos()"
                    type="radio" class="btn-check botoes" name="tipodegrafico" id="linha" value="line"
                    v-model="tipodegrafico" autocomplete="off">
                <label style="color: rgba(255, 255, 255, 1);margin-left: 0.5rem; font-size: medium;" class="btn botoes"
                    for="linha"><i class="bi bi-graph-up"></i></label>
            </div>

        </div>

        <!-- CRIA DIV'S COM CANVAS QUE SERÃO PREENCHIDOS COM OS GRAFICOS GERADOS NOS METHODS SENDO IDENTIFICADOS POR ID -->
        <div style="display: flex;flex-flow: column ;width: 100%;padding: 1rem;">
            <div class="card mb-3" style="max-width: 100%; border: 1px solid rgb(0, 0, 0); margin-top: 4rem;">
                <div @click="mostrarClasse('Comercial', 'iconeComercial')" style="background-color: #3571CD;"
                    class="card-header titulo"><i id="iconeComercial" style="margin-right: 0.5rem;"
                        class="bi bi-arrow-right"></i>Comercial
                </div>
                <div id="Comercial" style="display: none;">



                    <div class="form-check form-switch" style="margin-left: 0.5rem;">
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked
                            @change="mostrarGrafico('canvaPropostaComercial')">
                        <label class="form-check-label" for="flexSwitchCheckChecked">Propostas Comerciais</label>
                    </div>

                    <div id="canvaPropostaComercial">
                        <div>
                            <BButton v-b-toggle="'collapse'" class="m-1"
                                style=" position: absolute;width: min-content; height: min-content; background-color: transparent; border: none; border-radius: 100px;">
                                <i style="color: black; font-size: 15px;" class="bi bi-info-circle-fill"></i>
                            </BButton>
                        </div>

                        <!-- Element to collapse -->
                        <BCollapse id="collapse" class="position-absolute" style="margin-left: 3rem">
                            <BCard>
                                <div style="max-width: 23rem;">
                                    <b>Fórmula:</b> Soma das oportunidade no status de "conquistados" por mês. <br>
                                    <b>Polaridade:</b> Quanto maior, melhor. <br>
                                    <b>Fonte:</b> OMIE > CRM > Oportunidades. <br>
                                    <b>Descrição:</b> Quantidade de oportunidades que foram conquistadas em determinado
                                    mês.<br>
                                </div>
                            </BCard>

                        </BCollapse>


                        <canvas id="ChartPropostaComercial"></canvas>
                    </div>

                    <div class="form-check form-switch" style="margin-left: 0.5rem;">
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked"
                            @change="mostrarGrafico('ProdutosVendido')">
                        <label class="form-check-label" for="flexSwitchCheckChecked" style="color: black;">Produtos
                            Vendidos</label>
                    </div>
                    <div style="margin-top: 1rem; display: none;" id="ProdutosVendido">
                        <div style="padding-bottom: 0.5rem;">
                            <!-- Detalhes -->
                            <BButton v-b-toggle="'collapse-2'" class="m-1"
                                style="position: absolute;width: min-content; height: min-content; background-color: transparent; border: none; border-radius: 100px; margin-bottom: 0.5rem;">
                                <i style="color: black; font-size: 15px;" class="bi bi-info-circle-fill"></i>
                            </BButton>
                        </div>

                        <!-- Element to collapse -->
                        <BCollapse id="collapse-2" class="position-absolute" style="margin-left: 3rem">
                            <BCard>
                                <div style="max-width: 23rem;">
                                    <b>Fórmula:</b> Soma da quantidade de itens vendidos em um mês. <br>
                                    <b>Polaridade:</b> Quanto maior, melhor. <br>
                                    <b>Fonte:</b> OMIE > Produtos > Pedido-Compra e Codigo de etapa é igual a "faturado".
                                    <br>
                                    <b>Descrição:</b> Quantidade de produtos vendidos em um mês.<br>
                                </div>
                            </BCard>

                        </BCollapse>


                        <canvas id="ChartProdutos"></canvas>
                        <select v-model="familiaProdutos" @change="getProdutosAno()"
                            style="width: 10rem; margin: 0.2rem 0 0.5rem 1rem; border-radius: 10px;">
                            <option v-for=" p in listaProdutos" :key="p">{{ p }}</option>
                        </select>
                    </div>

                    <div class="form-check form-switch" style="margin-left: 0.5rem;">
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked"
                            @change="mostrarGrafico('Clientes')">
                        <label class="form-check-label" for="flexSwitchCheckChecked">Clientes</label>
                    </div>


                    <div style="margin-top: 1rem; display: none;" id="Clientes">
                        <div>
                            <BButton v-b-toggle.collapse-3 class="m-1" id="descrição3"
                                style="position: absolute ;width: min-content; height: min-content; background-color: transparent; border: none; border-radius: 100px">
                                <i style="color: black; font-size: 15px;" class="bi bi-info-circle-fill"></i>
                            </BButton>
                        </div>

                        <BCollapse id="collapse-3" class="position-absolute" style="margin-left: 3rem;">
                            <BCard>
                                <div style="max-width: 30rem; max-height: min-content;">
                                    <b>Fórmula:</b> Soma das oportunidades quando o motivo é igual a "oportunidade
                                    conquistada" e tipo corresponde a "Cliente novo", "Cliente reciclado" e "Cliente
                                    recorrente".
                                    <br>
                                    <b>Polaridade:</b> Quanto maior, melhor. <br>
                                    <b>Fonte:</b> OMIE > Oportunidade quando tipo é igual a Cliente novo,
                                    Cliente reciclado e Cliente recorrente. <br>
                                    <b>Descrição:</b> Quantidade de oportunidades conquistas classificadas por tipo de
                                    Proposta Comercial.<br>
                                </div>
                            </BCard>

                        </BCollapse>


                        <canvas id="ChartClientes"></canvas>
                    </div>


                </div>
            </div>


            <div class="card mb-3" style="max-width: 100%; border: 1px solid rgb(0, 0, 0);">
                <div @click="mostrarClasse('Financeiro', 'iconeFinanceiro')"
                    style="background-color: rgba(129, 199, 132, 1);" class="card-header titulo"><i id="iconeFinanceiro"
                        style="margin-right: 0.5rem;" class="bi bi-arrow-right"></i>Financeiro</div>
                <div id="Financeiro" style="display: none;">

                    <div class="form-check form-switch" style="margin-left: 0.5rem;">
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked
                            @change="mostrarGrafico('Projetos')">
                        <label class="form-check-label" for="flexSwitchCheckChecked">Custo de projetos</label>
                    </div>

                    <transition name="slide-fade">
                        <div id="Projetos">
                            <!-- v-if="show == true" -->

                            <BButton v-b-toggle="'collapse-5'" class="m-1"
                                style="position: absolute;width: min-content; height: min-content; background-color: transparent; border: none; border-radius: 100px;">
                                <i style="color: black; font-size: 15px;" class="bi bi-info-circle-fill"></i>
                            </BButton>


                            <!-- Element to collapse -->
                            <BCollapse id="collapse-5" class="position-absolute" style="margin-left: 3rem;">
                                <BCard>
                                    <div style="max-width: 23rem;">
                                        <b>Fórmula:</b> Somatória dos valores de requisições vinculadas a cada projeto. <br>
                                        <b>Polaridade:</b> Quanto menor, melhor. <br>
                                        <b>Fonte:</b> SGI <br>
                                        <b>Descrição:</b> Valores em R$ gastos em cada projeto registrado.<br>
                                    </div>
                                </BCard>

                            </BCollapse>
                            <div
                                style="display: flex; justify-content: flex-end; align-items: center; height: 2rem; text-align: center; margin-right: 0.5rem">
                                <div
                                    style="border: 2px rgba(129, 199, 132, 1) solid ; border-radius: 10px; padding: 0.2em ">
                                    Filtrar valores acima de:<br>
                                    <money3 v-model="linhaDeCorte" v-bind="config"
                                        style="width: 8rem;border: none; border-bottom: 1px black solid; outline: none;"
                                        @keyup.enter="definirListaDeProjetos"></money3>
                                </div>
                            </div>

                            <canvas id="chartProjetos"></canvas>
                        </div>
                    </transition>

                </div>
            </div>


            <div class="card mb-3" style="max-width: 100%; border: 1px solid rgb(0, 0, 0);">
                <div @click="mostrarClasse('Produção', 'iconeProdução')" style="background-color: #d50000;"
                    class="card-header titulo">
                    <i id="iconeProdução" style="margin-right: 0.5rem;" class="bi bi-arrow-right"></i>Produção
                </div>
                <div id="Produção" style="display: none;">

                    <div class="form-check form-switch" style="margin-left: 0.5rem;">
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked
                            @change="mostrarGrafico('ProdutosAcabados')">
                        <label class="form-check-label" for="flexSwitchCheckChecked">Produção Diária</label>
                    </div>

                    <transition name="slide-fade">
                        <div id="ProdutosAcabados">
                            <!-- v-if="show == true" -->
                            <div style="margin-bottom: 1rem;">
                                <BButton v-b-toggle="'collapse-4'" class="m-1"
                                    style="position: absolute;width: min-content; height: min-content; background-color: transparent; border: none; border-radius: 100px;">
                                    <i style="color: black; font-size: 15px;" class="bi bi-info-circle-fill"></i>
                                </BButton>
                            </div>

                            <!-- Element to collapse -->
                            <BCollapse id="collapse-4" class="position-absolute" style="margin-left: 3rem">
                                <BCard>
                                    <div style="max-width: 23rem;">
                                        <b>Fórmula:</b> Quantidade de produtos acabados (excluido o tipo: 'conjunto') e
                                        etapa =
                                        disponível / 22. <br>
                                        <b>Polaridade:</b> Quanto maior, melhor. <br>
                                        <b>Fonte:</b> OMIE > Produção > Produto acabado. <br>
                                        <b>Descrição:</b> Quantidade de produtos acabados feitos diariamente.<br>
                                    </div>
                                </BCard>

                            </BCollapse>
                            <!-- Quantidade Diaria de Produtos Acabados -->


                            <canvas id="ChartProdutosAcabados"></canvas>

                            <select v-model="produto" @change="getProdutosAcabadosAno()"
                                style="width: 10rem; margin: 0.2rem 0 0.5rem 1rem; border-radius: 10px;">
                                <option v-for=" p in listaProdutos" :key="p">{{ p }}</option>
                            </select>
                        </div>
                    </transition>

                    <!-- <canvas id="ChartTeste"></canvas>
                    <button @click="producaoTeste" style="color: black;">
                        teste
                    </button> -->

                </div>
            </div>

            <!-- <div class="card mb-3" style="max-width: 100%; border: 1px solid rgb(0, 0, 0);">
                <div @click="mostrarClasse('Injeção','iconeInjeção')" style="background-color: rgba(66, 165, 245, 1);" class="card-header titulo">
                    <i id="iconeInjeção" style="margin-right: 0.5rem;" class="bi bi-arrow-right"></i>Injeção
                </div>
                <div id="Injeção" style="display: none;">
                    <canvas id=""></canvas>
                </div>
            </div> -->

        </div>


        <div style="overflow: auto" class="modal-mask" v-if="showModal" @click="fecharModalFora">
            <div style="max-height: 70%" class="modal-container">
                <div class="conteudomodal">
                    <h1 style="text-align: center;">Propostas Viabilizadas:
                        <hr>
                    </h1>
                    <ul>
                        <li style="margin-top: 0.5rem;margin-right: 1rem;" v-for="c in PropostaComercial" :key="c">
                            {{ c }}
                        </li>
                    </ul>

                </div>
            </div>
        </div>


        <div style="overflow: auto" class="modal-mask" v-if="modalDetalheProjeto" @click="fecharModalFora">
            <div style="max-height: 70%;" class="modal-container">
                <div class="conteudomodal" style="width: 50rem;">
                    <div style="text-align: center;">
                        <h1>
                            {{ nomeModal }} - {{ detalheProjeto[0].Projeto }}
                        </h1>
                        Valor total do projeto: {{ real(parseInt(detalheProjeto[0].ValorTotalProjeto)) }}
                    </div>
                    <br>

                    <div style="position: absolute; margin-left: 41rem; margin-top: 4rem;">
                        <input @change="this.detalheProjeto = this.detalheProjeto.sort((a, b) => parseFloat(b.ValorTotal) - parseFloat(a.ValorTotal))" type="radio" class="btn-check botoes" name="ordenação" id="decrescente" value="decrescente"
                            v-model="ordenacaoModal" autocomplete="off">
                        <label style="color: rgb(0, 0, 0);font-size: 25px;" class="btn botoes"
                            for="decrescente"><i class="bi bi-sort-numeric-down-alt"></i></label>

                        <input @change="this.detalheProjeto = this.detalheProjeto.sort((a, b) => parseFloat(a.ValorTotal) - parseFloat(b.ValorTotal))" type="radio" class="btn-check botoes" name="ordenação" id="crescente" value="crescente"
                            v-model="ordenacaoModal" autocomplete="off">
                        <label style="color: rgb(0, 0, 0);margin-left: 0.5rem; font-size: 25px;" class="btn botoes"
                            for="crescente"><i class="bi bi-sort-numeric-up-alt"></i></label>
                    </div>

                    <div v-for="i in detalheProjeto" :key="i">
                        <hr>
                        <div>
                            <h3>
                                Requisição: {{ i.Requisição }} <h4>Valor total: {{ real(parseInt(i.ValorTotal)) }}</h4>
                            </h3>
                            <b>Solicitante:</b> {{ i.Solicitante }} <br>
                            <b>Aprovação:</b> {{ i.Aprovação }} <br>
                            <b>Data:</b> {{ extrairHoraDeString(i.Data) }} <br>
                            <b>Fornecedor:</b> {{ i.Fornecedor }} <br><br>
                            <h5><b>Item(s):</b></h5>
                            <div v-for="item in i.itens" :key="item.Nome">
                                <b>Nome:</b> {{ item.Nome }} <br>
                                <b>Valor:</b> {{ real(parseInt(item.Valor)) }} <br>
                                <br>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';
import { Money3Component } from 'v-money3'

export default {
    components: { money3: Money3Component },
    data() {
        return {
            ordenacaoModal: "decrescente",
            nomeModal: "",
            linhaDeCorte: 1500000,
            modalDetalheProjeto: false,
            detalheProjeto: [],
            tipodegrafico: "bar",
            listaProdutos: [],
            produto: "Todos",
            familiaProdutos: "Todos",
            dadosFormatadosC: [],
            dadosFormatadosT: [],
            dadosFormatadosP: [],
            showModal: false,
            PropostaComercial: "",
            mesSemana: "",
            semana: "",
            data: "",
            dataX: "",
            mes: "",
            mesPropostasViabilizadas: "",
            mesTickets: "",
            mesProdutos: "",
            ano: "2023",
            dados: '',
            dadostickets: '',
            dadosProdutos: '',
            nomeDosMeses: [{ "id": 1, "nome": 'Janeiro' },
            { "id": 2, "nome": 'Fevereiro' },
            { "id": 3, "nome": 'Março' },
            { "id": 4, "nome": 'Abril' },
            { "id": 5, "nome": 'Maio' },
            { "id": 6, "nome": 'Junho' },
            { "id": 7, "nome": 'Julho' },
            { "id": 8, "nome": 'Agosto' },
            { "id": 9, "nome": 'Setembro' },
            { "id": 10, "nome": 'Outubro' },
            { "id": 11, "nome": 'Novembro' },
            { "id": 12, "nome": 'Dezembro' }],
            nomesDosMesessemid: [
                "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
            ],
            dataGrafico: {},
            dataGraficoTickets: {},
            dataGraficoProdutos: {},
            labels: [],
            labelsTickets: [],
            labelsProdutos: [],
            datasets: [],
            datasetsTickets: [],
            datasetsProdutos: [],
            mesCliente: "",
            dadosClientes: [],
            dadosFormatadosClientes: [],
            labelsclientes: [],
            dataGraficoClientesNovos: [],
            dataGraficoClientesRecorrente: [],
            dataGraficoClientesReciclado: [],
            datasetsClientes: [],

            mesProdutosAcabados: "",
            dadosProdutosAcabados: [],
            dadosFormatadosProdutosAcabados: [],
            labelsProdutosAcabados: [],
            datasetsProdutosAcabados: [],
            dataGraficoProdutosAcabadosTotal: [],
            dataGraficoProdutosAcabadosMediaDia: [],


            listaDeProjetos: [],
            custoDeProjetos: [],
            nomesDosProjetos: [],

            config: {
                masked: false,
                prefix: 'R$ ',
                thousands: '.',
                decimal: ',',
                precision: 2,
            }
        }
    },

    mounted() {
        this.definirListaProdutos()
        this.getPropostaComercialAno()
        this.getProdutosAno()
        this.getClienteAno()
        this.getProdutosAcabadosAno()
        this.definirListaDeProjetos()
    },

    methods: {
        extrairHoraDeString(dataString) {
            const data = new Date(dataString);
            const dia = (data.getDate() + 1);
            const mes = (data.getMonth() + 1);
            const ano = (data.getFullYear());
            return `${dia}/${mes}/${ano}`;
        },

        real(num) {
            return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        },

        definirListaProdutos() {
            axios.get('http://192.168.0.6:8000/api/buscar/familia-produto-vendido', {

            })
                .then((response) => {
                    this.listaProdutos = response.data
                    this.listaProdutos = this.listaProdutos.map((item) => item.familia_nome.charAt(0).toUpperCase() + item.familia_nome.slice(1).toLowerCase());
                    this.listaProdutos.push("Todos")
                })
                .catch((error) => {
                    console.error(error);
                });
        },

        mostrarGrafico(id) {
            var element = document.getElementById(id);
            if (element.style.display == "none") {
                element.style.display = ""
            } else {
                element.style.display = "none";
            }
        },

        // FUNÇÃO PARA OCULTAR/MOSTRAR E MODIFICAR O ICONE DA DIV EM QUE ESTÁ O GRAFICO
        mostrarClasse(id, icone) {
            var setor = document.getElementById(id)
            var icon = document.getElementById(icone)
            if (setor.style.display != "none") {
                setor.style.display = "none";
                icon.className = "bi bi-arrow-right"
            } else {
                setor.style.display = "grid"
                icon.className = "bi bi-arrow-return-right"
            }
        },

        abrirModal() {
            this.PropostaComercial = "",
                axios.post('http://192.168.0.6:8000/api/omie/oportunidade/proposta-viabilizada/detalhe', {
                    anoSemana: this.ano + this.semana,
                })
                    .then((response) => {
                        this.PropostaComercial = response.data;
                        this.PropostaComercial = this.PropostaComercial.map((item) => item.cDesOp.slice(1).slice(0, -1));
                        console.log(response);
                        console.log(this.PropostaComercial);
                    })

                    .catch((error) => {
                        console.error(error);
                    });
            this.showModal = !this.showModal;
        },

        fecharModalFora(event) {
            if (event.target.classList.contains('modal-mask')) {
                this.showModal = false;
                this.modalDetalheProjeto = false
            }
        },

        // OS DADOS TEMPORAIS VEM DO END POINT EM FORMATO DE SEMANA DO ANO, ESTÁ FUNÇÃO DIZ A QUAL MES A SEMANA CORRESPONDE
        calcularMesDaSemana() {
            const data = new Date(this.ano, 0, 1);
            data.setDate(data.getDate() + (this.semana - 1) * 7);
            this.mesSemana = data.getMonth() + 1;
        },

        // IGUALA OS MESES PARA QUANDO O BOTÃO DO MES QUE ESTÁ NO CABEÇALHO SEJA CLICADO TODOS OS GRAFICOS MOSTREM O MES SELECIONADO
        igualameses() {
            this.mesTickets = this.mes;
            this.mesProdutos = this.mes;
            this.mesCliente = this.mes;
            this.mesProdutosAcabados = this.mes;
            this.mesPropostasViabilizadas = this.mes
        },

        // GERA UM GRÁFICO
        getPropostaComercialMes() {
            // PUXA OS DADOS DO BACKEND PASSANDO MES E ANO
            this.mes = this.mesPropostasViabilizadas
            axios.post('http://192.168.0.6:8000/api/omie/oportunidade/proposta-viabilizada', {
                mes: this.mesPropostasViabilizadas,
                ano: this.ano,
            })
                .then((response) => {
                    this.dados = response.data;
                    this.dados.forEach((item) => {
                        item.semana = item.semana.toString().substring(4);
                    });

                    this.dadosFormatadosC = this.dados.map((item) => parseInt(item.semana, 10));

                    this.labels = this.dadosFormatadosC.map((value, index) => {
                        return `${index + 1}º semana`;
                    });

                    this.dataGrafico = this.dados.map((item) => item.regSemana);
                    this.datasets = [];
                    this.datasets.push({
                        type: 'line',
                        label: 'Meta',
                        backgroundColor: 'black',
                        borderColor: 'black',
                        pointRadius: 0,
                        borderWidth: 1,
                        data: [10, 10, 10, 10, 10]
                    }, {
                        data: this.dataGrafico,
                        type: this.tipodegrafico,
                        label: 'Propostas Comerciais Viabilizadas',
                        backgroundColor: '#3571CD',
                        borderColor: '#3571CD',
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 2.2,
                        pointHoverRadius: 5,
                    })

                    this.renderChartPropostaComercial();
                })
                .catch((error) => {
                    console.error(error);
                });
        },

        getPropostaComercialAno() {
            this.mes = ""
            this.mesPropostasViabilizadas = ""
            axios.post('http://192.168.0.6:8000/api/omie/oportunidade/proposta-viabilizada-mes', {
                ano: this.ano,
            })
                .then((response) => {
                    this.dados = response.data;

                    this.dadosFormatadosC = this.dados.map((item) => item.mes);
                    // DEFINE AS VARIAVEIS NECESSARIAS PARA CONSTRUIR O GRÁFICO: LABELS, DATASETS
                    this.labels = this.dados.map((item) => item.mes);
                    this.labels = this.labels.map((numero) => this.nomesDosMesessemid[numero - 1])

                    this.dataGrafico = this.dados.map((item) => item.valor);
                    this.datasets = [];
                    this.datasets.push(
                        {
                            data: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
                            type: 'line',
                            label: 'Meta',
                            backgroundColor: 'rgba(0, 0, 0, 1)',
                            borderColor: 'rgba(0, 0, 0, 1)',
                            borderWidth: 1.5,
                            tension: 0.3,
                            pointRadius: 0,
                            pointHoverRadius: 0,
                        }, {
                        data: this.dataGrafico,
                        type: this.tipodegrafico,
                        label: 'Propostas Comerciais Viabilizadas',
                        backgroundColor: '#3571CD',
                        borderColor: '#3571CD',
                        borderWidth: 1.5,
                        tension: 0.3,
                        pointRadius: 2.2,
                        pointHoverRadius: 5,
                    })
                    this.renderChartPropostaComercial()
                })
                .catch((error) => {
                    console.error(error);
                });
        },

        renderChartPropostaComercial() {
            // DEFINE O CANVA QUE O GRÁFICO SERÁ GERADO
            const canvas = document.getElementById('ChartPropostaComercial');
            const ctx = canvas.getContext('2d');
            // LIMPA O CANVA CASO ELE ESTEJA PREENCHIDO (PREVENÇÃO DE ERRO)
            if (canvas.chart) {
                canvas.chart.destroy();
            }

            canvas.chart = new Chart(ctx, {
                data: {
                    labels: this.labels,
                    datasets: this.datasets,
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                boxWidth: 15,
                                boxHeight: 15,
                                color: 'rgb(0, 0, 0)',
                                font: {
                                    size: 20,
                                    weight: 'bolder'
                                }
                            }
                        }
                    },
                    // FUNÇÃO ENTRA EM AÇÃO AO CLICAR EM ALGUM DADO DO GRÁFICO
                    onClick: (e) => {
                        if (this.mesPropostasViabilizadas == "") {
                            const canvasPosition = getRelativePosition(e, canvas.chart);
                            const dataX = canvas.chart.scales.x.getValueForPixel(canvasPosition.x);

                            this.mesPropostasViabilizadas = this.dadosFormatadosC[dataX]
                            this.getPropostaComercialMes();
                        } else {
                            const canvasPosition = getRelativePosition(e, canvas.chart);
                            const dataX = canvas.chart.scales.x.getValueForPixel(canvasPosition.x);

                            this.semana = "";
                            this.semana = this.dados[dataX];
                            this.semana = this.semana.semana

                            this.abrirModal()
                        }
                    }
                },
            });
        },

        getTicketsMes() {
            this.mes = this.mesTickets;
            axios.post('http://192.168.0.6:8000/api/omie/oportunidade/ticket', {
                mes: this.mesTickets,
                ano: this.ano,
            })
                .then((response) => {
                    this.dadosTickets = response.data;
                    this.dadosTickets.forEach((item, index) => {
                        item.semana = index + 1 + "º Semana";
                    });

                    this.labelsTickets = this.dadosTickets.map((item) => item.semana);
                    this.dataGraficoTickets = this.dadosTickets.map((item) => item.regSemana);
                    this.datasetsTickets = [];
                    this.datasetsTickets.push({
                        type: 'line',
                        label: 'Meta',
                        backgroundColor: 'black',
                        borderColor: 'black',
                        pointRadius: 0,
                        borderWidth: 1,
                        data: [1000000, 1000000, 1000000, 1000000, 1000000]
                    }, {
                        data: this.dataGraficoTickets,
                        type: this.tipodegrafico,
                        label: 'Tickets',
                        backgroundColor: 'rgba(129, 199, 132, 1)',
                        borderColor: 'rgba(129, 199, 132, 1)',
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 2.2,
                        pointHoverRadius: 5,
                    })

                    this.renderChartTickets();
                    this.semana = "";
                })
                .catch((error) => {
                    console.error(error);
                });
        },

        getTicketsAno() {
            this.mesTickets = ""
            axios.post('http://192.168.0.6:8000/api/omie/oportunidade/ticket-mes', {
                ano: this.ano,
            })
                .then((response) => {
                    this.dadosTickets = response.data;

                    this.dadosFormatadosT = this.dadosTickets.map((item) => item.mes)
                    this.labelsTickets = this.dadosFormatadosT
                    this.labelsTickets = this.labelsTickets.map((numero) => this.nomesDosMesessemid[numero - 1])

                    this.dataGraficoTickets = this.dadosTickets.map((item) => item.regMes);
                    this.datasetsTickets = [];
                    this.datasetsTickets.push({
                        type: 'line',
                        label: 'Meta',
                        backgroundColor: 'black',
                        borderColor: 'black',
                        pointRadius: 0,
                        borderWidth: 1,
                        data: [1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000]
                    }, {
                        data: this.dataGraficoTickets,
                        type: this.tipodegrafico,
                        label: 'Tickets',
                        backgroundColor: 'rgba(129, 199, 132, 1)',
                        borderColor: 'rgba(129, 199, 132, 1)',
                        borderWidth: 1.5,
                        tension: 0.3,
                        pointRadius: 2.2,
                        pointHoverRadius: 5,
                    })
                    this.renderChartTickets()
                })
                .catch((error) => {
                    console.error(error);
                });
        },

        renderChartTickets() {
            const canvas = document.getElementById('ChartTickets');
            const ctx = canvas.getContext('2d');

            if (canvas.chart) {
                canvas.chart.destroy();
            }

            canvas.chart = new Chart(ctx, {
                data: {
                    labels: this.labelsTickets,
                    datasets: this.datasetsTickets,
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                boxWidth: 15,
                                boxHeight: 15,
                                color: 'rgb(0, 0, 0)',
                                font: {
                                    size: 20,
                                    weight: 'bolder'
                                }
                            }
                        }
                    },
                    onClick: (e) => {
                        if (this.mesTickets == "") {
                            const canvasPosition = getRelativePosition(e, canvas.chart);
                            const dataX = canvas.chart.scales.x.getValueForPixel(canvasPosition.x);

                            this.mesTickets = this.dadosFormatadosT[dataX]
                            this.getTicketsMes();
                        }
                    }

                },
            });
        },

        getProdutosMes() {
            this.mes = this.mesProdutos
            axios.post('http://192.168.0.6:8000/api/indicador/produto-vendido', {
                nome: this.familiaProdutos,
                ano: this.ano,
                mes: this.mesProdutos
            })
                .then((response) => {
                    this.dadosProdutos = response.data;
                    this.dadosProdutos.forEach((item, index) => {
                        item.semana = index + 1 + "º Semana";
                    });
                    this.labelsProdutos = this.dadosProdutos.map((item) => item.semana);
                    this.dataGraficoProdutos = this.dadosProdutos.map((item) => item.regSemana);
                    this.datasetsProdutos = [];
                    this.datasetsProdutos.push({
                        data: this.dataGraficoProdutos,
                        type: this.tipodegrafico,
                        label: 'Quantidade de Produtos Vendidos',
                        backgroundColor: '#db6363',
                        borderColor: '#db6363',
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 2.2,
                        pointHoverRadius: 5,
                    })

                    this.renderChartProdutos();
                })
                .catch((error) => {
                    console.error(error);
                });
        },

        getProdutosAno() {
            this.mesProdutos = ""
            axios.post('http://192.168.0.6:8000/api/indicador/produto-vendido-mes', {
                nome: this.familiaProdutos,
                ano: this.ano,
            })
                .then((response) => {
                    this.dadosProdutos = response.data
                    this.dadosFormatadosP = this.dadosProdutos.map((item) => item.mes)
                    this.labelsProdutos = this.dadosFormatadosP
                    this.labelsProdutos = this.labelsProdutos.map((numero) => this.nomesDosMesessemid[numero - 1])
                    this.dataGraficoProdutos = this.dadosProdutos.map((item) => item.regMes);
                    this.datasetsProdutos = [];
                    this.datasetsProdutos.push({
                        data: this.dataGraficoProdutos,
                        type: this.tipodegrafico,
                        label: 'Quantidade de Produtos Vendidos',
                        backgroundColor: '#db6363',
                        borderColor: '#db6363',
                        borderWidth: 1.5,
                        tension: 0.3,
                        pointRadius: 2.2,
                        pointHoverRadius: 5,
                    })
                    this.renderChartProdutos()
                })
                .catch((error) => {
                    console.error(error);
                });
        },

        renderChartProdutos() {

            const canvas = document.getElementById('ChartProdutos');
            const ctx = canvas.getContext('2d');


            if (canvas.chart) {
                canvas.chart.destroy();
            }

            canvas.chart = new Chart(ctx, {
                data: {
                    labels: this.labelsProdutos,
                    datasets: this.datasetsProdutos,
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                boxWidth: 15,
                                boxHeight: 15,
                                color: 'rgb(0, 0, 0)',
                                font: {
                                    size: 20,
                                    weight: 'bolder'
                                }
                            }
                        }
                    },
                    onClick: (e) => {
                        if (this.mesProdutos == "") {
                            const canvasPosition = getRelativePosition(e, canvas.chart);
                            const dataX = canvas.chart.scales.x.getValueForPixel(canvasPosition.x);

                            this.mesProdutos = this.dadosFormatadosP[dataX]
                            this.getProdutosMes();
                        }
                    }

                },
            });
        },

        getClienteMes() {
            // PUXA OS DADOS DO BACKEND PASSANDO MES E ANO
            this.mes = this.mesCliente
            axios.post('http://192.168.0.6:8000/api/omie/oportunidade/cliente-alcancado', {
                mes: this.mesCliente,
                ano: this.ano,
            })
                .then((response) => {
                    this.dadosClientes = response.data;
                    this.dadosClientes.forEach((item) => {
                        item.semana = item.semana.toString().substring(4);
                    });

                    this.dadosFormatadosClientes = this.dadosClientes.map((item) => parseInt(item.semana, 10));

                    this.labelsclientes = this.dadosFormatadosClientes.map((value, index) => {
                        return `${index + 1}º semana`;
                    });

                    this.dataGraficoClientesNovos = this.dadosClientes.map((item) => item.cliente_novo);
                    this.dataGraficoClientesRecorrente = this.dadosClientes.map((item) => item.cliente_recorrente);
                    this.dataGraficoClientesReciclado = this.dadosClientes.map((item) => item.cliente_reciclado);

                    this.datasetsClientes = [];
                    this.datasetsClientes.push(
                        {
                            data: this.dataGraficoClientesNovos,
                            type: this.tipodegrafico,
                            label: 'Clientes Novos',
                            backgroundColor: '#3571cd',
                            borderColor: '#3571cd',
                            borderWidth: 1.5,
                            tension: 0.3,
                            pointRadius: 2.2,
                            pointHoverRadius: 5,
                        }, {
                        data: this.dataGraficoClientesRecorrente,
                        type: this.tipodegrafico,
                        label: 'Clientes Recorrentes',
                        backgroundColor: '#1d467b',
                        borderColor: '#1d467b',
                        borderWidth: 1.5,
                        tension: 0.3,
                        pointRadius: 2.2,
                        pointHoverRadius: 5,
                    },
                        {
                            data: this.dataGraficoClientesReciclado,
                            type: this.tipodegrafico,
                            label: 'Clientes Reciclados',
                            backgroundColor: '#00b4fc',
                            borderColor: '#00b4fc',
                            borderWidth: 1.5,
                            tension: 0.3,
                            pointRadius: 2.2,
                            pointHoverRadius: 5,
                        })

                    this.renderChartClientes();
                })
                .catch((error) => {
                    console.error(error);
                });
        },

        getClienteAno() {
            this.mesCliente = ""
            axios.post('http://192.168.0.6:8000/api/omie/oportunidade/cliente-alcancado', {
                ano: this.ano,
            })
                .then((response) => {
                    this.dadosClientes = response.data;

                    this.dadosFormatadosClientes = this.dadosClientes.map((item) => item.mes);
                    this.labelsclientes = this.dadosClientes.map((item) => item.mes);
                    this.labelsclientes = this.labelsclientes.map((numero) => this.nomesDosMesessemid[numero - 1])

                    this.dataGraficoClientesNovos = this.dadosClientes.map((item) => item.cliente_novo);
                    this.dataGraficoClientesRecorrente = this.dadosClientes.map((item) => item.cliente_recorrente);
                    this.dataGraficoClientesReciclado = this.dadosClientes.map((item) => item.cliente_reciclado);
                    this.datasetsClientes = [];
                    this.datasetsClientes.push(
                        {
                            data: this.dataGraficoClientesNovos,
                            type: this.tipodegrafico,
                            label: 'Clientes Novos',
                            backgroundColor: '#3571CD',
                            borderColor: '#3571CD',
                            borderWidth: 1.5,
                            tension: 0.3,
                            pointRadius: 2.2,
                            pointHoverRadius: 5,
                        }, {
                        data: this.dataGraficoClientesRecorrente,
                        type: this.tipodegrafico,
                        label: 'Clientes Recorrentes',
                        backgroundColor: '#1d467b',
                        borderColor: '#1d467b',
                        borderWidth: 1.5,
                        tension: 0.3,
                        pointRadius: 2.2,
                        pointHoverRadius: 5,
                    },
                        {
                            data: this.dataGraficoClientesReciclado,
                            type: this.tipodegrafico,
                            label: 'Clientes Reciclados',
                            backgroundColor: '#00b4fc',
                            borderColor: '#00b4fc',
                            borderWidth: 1.5,
                            tension: 0.3,
                            pointRadius: 2.2,
                            pointHoverRadius: 5,
                        })
                    this.renderChartClientes()
                })
                .catch((error) => {
                    console.error(error);
                });
        },

        renderChartClientes() {
            // DEFINE O CANVA QUE O GRÁFICO SERÁ GERADO
            const canvas = document.getElementById('ChartClientes');
            const ctx = canvas.getContext('2d');
            // LIMPA O CANVA CASO ELE ESTEJA PREENCHIDO (PREVENÇÃO DE ERRO)
            if (canvas.chart) {
                canvas.chart.destroy();
            }

            canvas.chart = new Chart(ctx, {
                data: {
                    labels: this.labelsclientes,
                    datasets: this.datasetsClientes,
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                boxWidth: 15,
                                boxHeight: 15,
                                color: 'rgb(0, 0, 0)',
                                font: {
                                    size: 20,
                                    weight: 'bolder'
                                }
                            }
                        },
                    },
                    onClick: (e) => {
                        if (this.mesCliente == "") {
                            const canvasPosition = getRelativePosition(e, canvas.chart);
                            const dataX = canvas.chart.scales.x.getValueForPixel(canvasPosition.x);

                            this.mesCliente = this.dadosFormatadosC[dataX]
                            this.getClienteMes();
                        }

                    }
                },
            });
        },

        getProdutosAcabadosMes() {
            this.mes = this.mesProdutosAcabados
            axios.post('http://192.168.0.6:8000/api/indicador/produto-produzido', {
                mes: this.mesProdutosAcabados,
                ano: this.ano,
                produto: this.produto
            })
                .then((response) => {
                    this.dadosProdutosAcabados = response.data;
                    this.dadosProdutosAcabados.forEach((item) => {
                        item.semana = item.semana.toString().substring(4);
                    });

                    this.dadosFormatadosProdutosAcabados = this.dadosProdutosAcabados.map((item) => parseInt(item.semana, 10));

                    this.labelsProdutosAcabados = this.dadosFormatadosProdutosAcabados.map((value, index) => {
                        return `${index + 1}º semana`;
                    });

                    this.dataGraficoProdutosAcabadosTotal = this.dadosProdutosAcabados.map((item) => item.total);
                    this.dataGraficoProdutosAcabadosMediaDia = this.dadosProdutosAcabados.map((item) => item.mediaDia);

                    this.datasetsProdutosAcabados = [];
                    this.datasetsProdutosAcabados.push(
                        {
                            data: this.dataGraficoProdutosAcabadosTotal,
                            type: this.tipodegrafico,
                            label: 'Total',
                            backgroundColor: '#d50000',
                            borderColor: '#d50000',
                            borderWidth: 1.5,
                            tension: 0.3,
                            pointRadius: 2.2,
                            pointHoverRadius: 5,
                            hidden: true
                        }, {
                        data: this.dataGraficoProdutosAcabadosMediaDia,
                        type: this.tipodegrafico,
                        label: 'Produção Diária',
                        backgroundColor: '#fc4b2a',
                        borderColor: '#fc4b2a',
                        borderWidth: 1.5,
                        tension: 0.3,
                        pointRadius: 2.2,
                        pointHoverRadius: 5,
                    })
                    this.renderChartProdutosAcabados()
                })
                .catch((error) => {
                    console.error(error);
                });
        },

        getProdutosAcabadosAno() {
            this.mesProdutosAcabados = ""
            axios.post('http://192.168.0.6:8000/api/indicador/produto-produzido', {
                ano: this.ano,
                produto: this.produto
            })
                .then((response) => {
                    this.dadosProdutosAcabados = response.data;

                    this.dadosFormatadosProdutosAcabados = this.dadosProdutosAcabados.map((item) => item.mes);
                    this.labelsProdutosAcabados = this.dadosProdutosAcabados.map((item) => item.mes);
                    this.labelsProdutosAcabados = this.labelsProdutosAcabados.map((numero) => this.nomesDosMesessemid[numero - 1])

                    this.dataGraficoProdutosAcabadosTotal = this.dadosProdutosAcabados.map((item) => item.total);
                    this.dataGraficoProdutosAcabadosMediaDia = this.dadosProdutosAcabados.map((item) => item.mediaDia);

                    this.datasetsProdutosAcabados = [];
                    this.datasetsProdutosAcabados.push(
                        {
                            data: this.dataGraficoProdutosAcabadosTotal,
                            type: this.tipodegrafico,
                            label: 'Total',
                            backgroundColor: '#d50000',
                            borderColor: '#d50000',
                            borderWidth: 1.5,
                            tension: 0.3,
                            pointRadius: 2.2,
                            pointHoverRadius: 5,
                            hidden: true
                        }, {
                        data: this.dataGraficoProdutosAcabadosMediaDia,
                        type: this.tipodegrafico,
                        label: 'Produção Diária',
                        backgroundColor: '#fc4b2a',
                        borderColor: '#fc4b2a',
                        borderWidth: 1.5,
                        tension: 0.3,
                        pointRadius: 2.2,
                        pointHoverRadius: 5,
                    })
                    this.renderChartProdutosAcabados()
                })
                .catch((error) => {
                    console.error(error);
                });
        },

        renderChartProdutosAcabados() {
            // DEFINE O CANVA QUE O GRÁFICO SERÁ GERADO
            const canvas = document.getElementById('ChartProdutosAcabados');
            const ctx = canvas.getContext('2d');
            // LIMPA O CANVA CASO ELE ESTEJA PREENCHIDO (PREVENÇÃO DE ERRO)
            if (canvas.chart) {
                canvas.chart.destroy();
            }

            canvas.chart = new Chart(ctx, {
                data: {
                    labels: this.labelsProdutosAcabados,
                    datasets: this.datasetsProdutosAcabados,
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                boxWidth: 15,
                                boxHeight: 15,
                                color: 'rgb(0, 0, 0)',
                                font: {
                                    size: 20,
                                    weight: 'bolder'
                                }
                            }
                        },
                    },
                    onClick: (e) => {
                        if (this.mesProdutosAcabados == "") {
                            const canvasPosition = getRelativePosition(e, canvas.chart);
                            const dataX = canvas.chart.scales.x.getValueForPixel(canvasPosition.x);

                            this.mesProdutosAcabados = this.dadosFormatadosProdutosAcabados[dataX]
                            this.getProdutosAcabadosMes();
                        }

                    }
                },
            });
        },

        producaoTeste() {

            const canvas = document.getElementById('ChartTeste');
            const ctx = canvas.getContext('2d');

            if (canvas.chart) {
                canvas.chart.destroy();
            }

            canvas.chart = new Chart(ctx, {
                data: {
                    labels: ['jan', 'fev', 'mar', 'abr', 'mai'],
                    datasets: [{
                        data: [10, 20, 10, 5, 14],
                        type: "bar",
                        label: 'Recebido',
                        backgroundColor: 'green',
                        borderColor: "black",
                        borderWidth: 0,
                        tension: 0.3,
                    },
                    {
                        data: [1, 10, 5, 1, 9],
                        type: "bar",
                        label: 'Pago',
                        backgroundColor: 'red',
                        borderColor: "black",
                        borderWidth: 0,
                        tension: 0.3,
                    },

                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        stacked: true
                    }
                },
            });
        },

        definirListaDeProjetos() {
            this.linhaDeCorte = parseInt(this.linhaDeCorte);
            this.listaDeProjetos = [],
                this.nomesDosProjetos = [],
                this.custoDeProjetos = [],
                axios.get('http://192.168.0.6:8000/api/sgi/projeto/lista', {
                })
                    .then((response) => {
                        let dadosProjetos = response.data.filter((item) => item.ValorTotal < this.linhaDeCorte);


                        this.nomesDosProjetos = dadosProjetos.map((item) => item.Nome);
                        this.custoDeProjetos = dadosProjetos.map((item) => item.ValorTotal);
                        this.listaDeProjetos = dadosProjetos.map((item) => item.Projeto);
                        this.renderChartProjetos();
                    })
                    .catch((error) => {
                        console.error(error);
                    });
        },

        renderChartProjetos() {

            const canvas = document.getElementById('chartProjetos');
            const ctx = canvas.getContext('2d');

            if (canvas.chart) {
                canvas.chart.destroy();
            }

            canvas.chart = new Chart(ctx, {
                data: {
                    labels: this.listaDeProjetos,
                    datasets: [{
                        data: this.custoDeProjetos,
                        type: this.tipodegrafico,
                        label: 'Custo do projeto',
                        backgroundColor: 'rgba(129, 199, 132, 1)',
                        borderColor: 'rgba(129, 199, 132, 1)',
                        borderWidth: 1.5,
                        tension: 0.3,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                boxWidth: 15,
                                boxHeight: 15,
                                color: 'rgb(0, 0, 0)',
                                font: {
                                    size: 20,
                                    weight: 'bolder'
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                title: (tooltipItems) => {
                                    // O código para personalizar o título aqui
                                    // let title = tooltipItems[0].text;
                                    let nome = this.nomesDosProjetos[tooltipItems[0].dataIndex];
                                    return nome
                                },
                                //  label: (tooltipItem) => {
                                //      // O código para personalizar o rótulo aqui
                                //      return tooltipItem.formattedValue;
                                //  },
                                // label: function (context) {
                                //     let label = context.dataIndex || '';

                                //     return label;
                                // }
                            },
                        },
                    },
                    onClick: (e) => {
                        const canvasPosition = getRelativePosition(e, canvas.chart);
                        const dataX = canvas.chart.scales.x.getValueForPixel(canvasPosition.x);


                        this.nomeModal = this.nomesDosProjetos[dataX];
                        this.detalhesDeProjeto(this.listaDeProjetos[dataX]);


                    }
                },
            });
        },

        detalhesDeProjeto(num) {
            axios.post('http://192.168.0.6:8000/api/indicador/projeto/custo', {
                codProjeto: num,
            })
                .then((response) => {
                    //const decrescente = (a, b) => parseFloat(b.ValorTotal) - parseFloat(a.ValorTotal);
                    //const crescente  = (a, b) => parseFloat(a.ValorTotal) - parseFloat(b.ValorTotal);

                    this.detalheProjeto = response.data;
                    this.detalheProjeto = this.detalheProjeto.sort((a, b) => parseFloat(b.ValorTotal) - parseFloat(a.ValorTotal));
                    this.modalDetalheProjeto = !this.modalDetalheProjeto
                })

                .catch((error) => {
                    console.error(error);
                });
        },

    }
}
</script>

<style>
.botoes:hover {
    transition: 50ms linear;
    transform: scale(1.1);
}

.conteudomodal {
    display: flex;
    flex-flow: column;
    background-color: rgb(255, 255, 255);
    height: fit-content;
    width: fit-content;
    padding: 1rem;
    border-radius: 10px;
}

canvas {
    max-width: 100%;
    max-height: 200px;
}

.titulo {
    color: white;
    font-size: larger;
}

.titulo:hover {
    cursor: pointer;
    transition: 50ms linear;
    box-shadow: rgba(26, 26, 26, 0.200) 3px 3px 6px 0px inset, rgba(26, 26, 26, 0.200) -3px -3px 6px 1px inset;
}

button {
    color: rgba(255, 255, 255, 1);
    background-color: transparent;
    border: none;
    font-size: larger;
}

.ano {
    color: rgba(255, 255, 255, 1);
    background-color: transparent;
    border: none;
    font-size: larger;
}

.cabecalho {
    color: rgba(255, 255, 255, 1);
    display: flex;
    flex-flow: row;
    align-content: center;
    padding: 0.5rem;
    justify-content: center;
    width: 100%;
    position: fixed;
    z-index: 999999;
    background-color: rgba(33, 37, 41, 1);
    border-bottom: 1px solid black;
}

.modal-mask {
    position: fixed;
    z-index: 9997;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(65, 62, 62, 0.7);
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    scroll-behavior: auto;
}

::-webkit-scrollbar {
    width: 0px;
}
</style>