<template>
    <body>
        <!-- CRIA UM CABEÇALHO PARA SELEÇÃO DE MÊS E UM BOTÃO PARA EXIBIR O ANO TODO -->
        <div class="form-check cabecalho">
            <button v-b-tooltip.hover title="Ano inteiro!" class="botoes"
                @click="getPropostaComercialAno(), getTicketsAno(), getProdutosAno(), getClienteAno()">
                <i class="bi bi-calendar-minus"></i>
            </button>
            <div v-for="i in nomeDosMeses" :key="i">
                <input @change="igualameses(), getPropostaComercialMes(), getTicketsMes(), getProdutosMes()" type="radio"
                    class="btn-check botoes" name="options-base" :id=i.id :value=i.id v-model="mes" autocomplete="off">
                <label style="color: rgba(255, 255, 255, 1);margin-left: 0.5rem; font-size: large;" class="btn botoes"
                    :for=i.id>{{ i.nome }}</label>
            </div>
            <select class="botoes ano" v-model="ano"
                @change="getProdutosAno(), getPropostaComercialAno(), getTicketsAno(), getClienteAno()"
                style="width: 4rem; margin-left: 0.5em;margin-right: 0.5em  ;border: none; background-color: rgba(33, 37, 41, 1)">
                <option>2023</option>
                <option>2024</option>
            </select>
            <div style="border-left: solid 1px white;">
                <input @change="getPropostaComercialAno(), getProdutosAno(), getTicketsAno(), getClienteAno()" type="radio"
                    class="btn-check botoes" name="tipodegrafico" id="barra" value="bar" v-model="tipodegrafico"
                    autocomplete="off">
                <label style="color: rgba(255, 255, 255, 1);margin-left: 0.5rem; font-size: medium;" class="btn botoes"
                    for="barra"><i class="bi bi-bar-chart-line-fill"></i></label>

                <input @change="getPropostaComercialAno(), getProdutosAno(), getTicketsAno(), getClienteAno()" type="radio"
                    class="btn-check botoes" name="tipodegrafico" id="linha" value="line" v-model="tipodegrafico"
                    autocomplete="off">
                <label style="color: rgba(255, 255, 255, 1);margin-left: 0.5rem; font-size: medium;" class="btn botoes"
                    for="linha"><i class="bi bi-graph-up"></i></label>
            </div>

        </div>

        <!-- CRIA DIV'S COM CANVAS QUE SERÃO PREENCHIDOS COM OS GRAFICOS GERADOS NOS METHODS SENDO IDENTIFICADOS POR ID -->
        <div style="display: flex;flex-flow: column ;width: 100%;padding: 1rem;">
            <div class="card mb-3" style="max-width: 100%; border: 1px solid rgb(0, 0, 0); margin-top: 4rem;">
                <div @click="mostrarComercial()" style="background-color: rgba(255, 167, 38, 1);"
                    class="card-header titulo"><i id="iconeComercial" style="margin-right: 0.5rem;"
                        class="bi bi-arrow-right"></i>Comercial
                </div>
                <div id="Comercial" style="display: none;">

                    <!-- Using value -->
                    <div style="margin-top: 1rem;">
                        <div style="padding: 0.5rem;">
                            <BButton v-b-toggle="'collapse'" class="m-1"
                                style=" position: absolute;width: min-content; height: min-content; background-color: transparent; border: none; border-radius: 100px;">
                                <i style="color: black; font-size: 15px;" class="bi bi-info-circle-fill"></i>
                            </BButton>
                        </div>

                        <!-- Element to collapse -->
                        <BCollapse id="collapse" class="position-absolute" style="margin-left: 4rem; margin-top: 0.2rem;">
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
                    <div style="margin-top: 1rem;">
                        <div style="padding: 0.5rem;">
                            <!-- Detalhes -->
                            <BButton v-b-toggle="'collapse-2'" class="m-1"
                                style="position: absolute;width: min-content; height: min-content; background-color: transparent; border: none; border-radius: 100px; margin-bottom: 0.5rem;">
                                <i style="color: black; font-size: 15px;" class="bi bi-info-circle-fill"></i>
                            </BButton>
                        </div>

                        <!-- Element to collapse -->
                        <BCollapse id="collapse-2" class="position-absolute" style="margin-left: 4rem">
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
                            <option v-for=" p in listaProdutos" :key="p">{{ p.familia_nome }}</option>
                        </select>
                    </div>

                    <div style="margin-top: 1rem;">
                        <div style="padding: 0.5rem;">
                            <BButton v-b-toggle.collapse-3 class="m-1" id="descrição3"
                                style="position: absolute ;width: min-content; height: min-content; background-color: transparent; border: none; border-radius: 100px">
                                <i style="color: black; font-size: 15px;" class="bi bi-info-circle-fill"></i>
                            </BButton>
                        </div>

                        <BCollapse :visible="this.visibilidadeDetalhe3" id="collapse-3" class="position-absolute"
                            style="margin-left: 4rem;">
                            <BCard>
                                <div style="max-width: 30rem; max-height: min-content;">
                                    <b>Fórmula:</b> Soma das oportunidades quando o motivo é igual a "oportunidade
                                    conquistada".
                                    <br>
                                    <b>Polaridade:</b> Quanto maior, melhor. <br>
                                    <b>Fonte:</b> OMIE > Oportunidade quando tipo é igual a PropostaComercial novo,
                                    PropostaComercial reciclado e
                                    PropostaComercial recorrente. <br>
                                    <b>Descrição:</b> Quantidade de oportunidades conquistas classificadas por tipo de
                                    Proposta Comercial.<br>
                                </div>
                            </BCard>

                        </BCollapse>

                        <canvas id="ChartClientes"></canvas>
                    </div>


                </div>
            </div>

            <!-- 
            <div class="card mb-3" style="max-width: 100%; border: 1px solid rgb(0, 0, 0);">
                <div @click="mostrarFinanceiro()" style="background-color: rgba(129, 199, 132, 1);"
                    class="card-header titulo"><i id="iconeFinanceiro" style="margin-right: 0.5rem;"
                        class="bi bi-arrow-right"></i>Financeiro</div>
                <div id="Financeiro" style="display: none;">
                    <div v-b-tooltip.hover.right title="my title" style="width: fit-content; margin-left: 1rem;">
                        <i style="color: black; font-size: small;" class="bi bi-info-circle-fill"></i>
                    </div>

                    <canvas id="ChartTickets"></canvas>
                </div>
            </div> -->


            <div class="card mb-3" style="max-width: 100%; border: 1px solid rgb(0, 0, 0);">
                <div @click="mostrarProdução()" style="background-color: rgba(244, 67, 54, 1);" class="card-header titulo">
                    <i id="iconeProdução" style="margin-right: 0.5rem;" class="bi bi-arrow-right"></i>Produção
                </div>
                <div id="Produção" style="display: none;">
                    <BButton v-b-toggle="'collapse-4'" class="m-1"
                        style="width: min-content; height: min-content; background-color: transparent; border: none; border-radius: 100px;">
                        <i style="color: black; font-size: 15px;" class="bi bi-info-circle-fill"></i>
                    </BButton>

                    <!-- Element to collapse -->
                    <BCollapse id="collapse-4" class="position-absolute" style="margin-left: 4rem; margin-top: 1rem">
                        <BCard>
                            <div style="max-width: 23rem;">
                                <b>Fórmula:</b> Quantidade de produtos acabados (excluido o tipo: 'conjunto') e etapa =
                                disponível / 22. <br>
                                <b>Polaridade:</b> Quanto maior, melhor. <br>
                                <b>Fonte:</b> OMIE > Produção > Produto acabado. <br>
                                <b>Descrição:</b> Quantidade de produtos acabados feitos diariamente.<br>
                            </div>
                        </BCard>

                    </BCollapse>
                    <!-- Quantidade Diaria de Produtos Acabados -->
                    <canvas id="ChartQuantidadeDiariaPA"></canvas>
                </div>
            </div>


            <!-- <div class="card mb-3" style="max-width: 100%; border: 1px solid rgb(0, 0, 0);">
                <div @click="mostrarInjeção()" style="background-color: rgba(66, 165, 245, 1);" class="card-header titulo">
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

    </body>
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';

export default {
    data() {
        return {
            tipodegrafico: "bar",
            listaProdutos: [{
                "familia_nome": "ACESSÓRIOS"
            },
            {
                "familia_nome": "ADAPTADOR"
            },
            {
                "familia_nome": "BASES"
            },
            {
                "familia_nome": "BRAÇO"
            },
            {
                "familia_nome": "CABOS"
            },
            {
                "familia_nome": "CASE"
            },
            {
                "familia_nome": "CASE 9-10,1\""
            },
            {
                "familia_nome": "CONVERSOR"
            },
            {
                "familia_nome": "DOCK"
            },
            {
                "familia_nome": "HUB"
            },
            {
                "familia_nome": "PLUG"
            },
            {
                "familia_nome": "PROJETO"
            },
            {
                "familia_nome": "SUPORTES"
            },
            {
                "familia_nome": "TABLET"
            },
            {
                "familia_nome": "TODOS"
            },
            ],
            familiaProdutos: "TODOS",
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
            visibilidadeDetalhe3: false,

        }
    },
    mounted() {
        this.getPropostaComercialAno()
        this.getTicketsAno()
        this.getProdutosAno()
        this.getClienteAno()
    },
    methods: {

        mostrarDetalhes3() {
            document.getElementById('descrição3').click();
        },
        // FUNÇÃO PARA OCULTAR/MOSTRAR E MODIFICAR O ICONE DA DIV EM QUE ESTÁ O GRAFICO
        mostrarComercial() {
            if (document.getElementById('Comercial').style.display != "none") {
                document.getElementById('Comercial').style.display = "none";
                document.getElementById('iconeComercial').className = "bi bi-arrow-right"
            } else {
                document.getElementById('Comercial').style.display = "grid"
                document.getElementById('iconeComercial').className = "bi bi-arrow-return-right"
            }
        },

        mostrarFinanceiro() {
            if (document.getElementById('Financeiro').style.display != "none") {
                document.getElementById('Financeiro').style.display = "none";
                document.getElementById('iconeFinanceiro').className = "bi bi-arrow-right"
            } else {
                document.getElementById('Financeiro').style.display = "grid"
                document.getElementById('iconeFinanceiro').className = "bi bi-arrow-return-right"
            }
        },

        mostrarProdução() {
            if (document.getElementById('Produção').style.display != "none") {
                document.getElementById('Produção').style.display = "none";
                document.getElementById('iconeProdução').className = "bi bi-arrow-right"
            } else {
                document.getElementById('Produção').style.display = "grid"
                document.getElementById('iconeProdução').className = "bi bi-arrow-return-right"
            }
        },

        mostrarInjeção() {
            if (document.getElementById('Injeção').style.display != "none") {
                document.getElementById('Injeção').style.display = "none";
                document.getElementById('iconeInjeção').className = "bi bi-arrow-right"
            } else {
                document.getElementById('Injeção').style.display = "grid"
                document.getElementById('iconeInjeção').className = "bi bi-arrow-return-right"
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
                this.showModalSprint = false;
            }
        },

        // OS DADOS TEMPORAIS VEM DO END POINT EM FORMATO DE SEMANA DO ANO, ESTÁ FUNÇÃO DIZ A QUAL MES A SEMANA CORRESPONDE
        calcularMesDaSemana() {
            const data = new Date(this.ano, 0, 1);
            data.setDate(data.getDate() + (this.semana - 1) * 7);
            this.mesSemana = data.getMonth() + 1;
        },

        capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        },

        // IGUALA OS MESES PARA QUANDO O BOTÃO DO MES QUE ESTÁ NO CABEÇALHO SEJA CLICADO TODOS OS GRAFICOS MOSTREM O MES SELECIONADO
        igualameses() {
            this.mesTickets = this.mes;
            this.mesProdutos = this.mes
        },

        // GERA UM GRÁFICO
        getPropostaComercialMes() {
            // PUXA OS DADOS DO BACKEND PASSANDO MES E ANO
            axios.post('http://192.168.0.6:8000/api/omie/oportunidade/proposta-viabilizada', {
                mes: this.mes,
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
                        backgroundColor: 'rgba(255, 167, 38, 1)',
                        borderColor: 'rgba(255, 167, 38, 1)',
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
                        backgroundColor: 'rgba(255, 167, 38, 1)',
                        borderColor: 'rgba(255, 167, 38, 1)',
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
                        if (this.mes == "") {
                            const canvasPosition = getRelativePosition(e, canvas.chart);
                            const dataX = canvas.chart.scales.x.getValueForPixel(canvasPosition.x);

                            this.mes = this.dadosFormatadosC[dataX]
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
                        backgroundColor: 'rgba(255, 167, 38, 1)',
                        borderColor: 'rgba(255, 167, 38, 1)',
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
                        backgroundColor: 'rgba(255, 167, 38, 1)',
                        borderColor: 'rgba(255, 167, 38, 1)',
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
            axios.post('http://192.168.0.6:8000/api/omie/oportunidade/proposta-viabilizada', {
                mes: this.mes,
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
                        label: 'Clientes Conquistados',
                        backgroundColor: 'rgba(255, 167, 38, 1)',
                        borderColor: 'rgba(255, 167, 38, 1)',
                        borderWidth: 2,
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
            axios.post('http://192.168.0.6:8000/api/omie/oportunidade/cliente-alcancado-mes', {
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
                            backgroundColor: '#001449',
                            borderColor: '#001449',
                            borderWidth: 1.5,
                            tension: 0.3,
                            pointRadius: 2.2,
                            pointHoverRadius: 5,
                        }, {
                        data: this.dataGraficoClientesRecorrente,
                        type: this.tipodegrafico,
                        label: 'Clientes Recorrentes',
                        backgroundColor: '#005bc5',
                        borderColor: '#005bc5',
                        borderWidth: 1.5,
                        tension: 0.3,
                        pointRadius: 2.2,
                        pointHoverRadius: 5,
                    },
                        {
                            data: this.dataGraficoClientesReciclado,
                            type: this.tipodegrafico,
                            label: 'Clientes Reciclados',
                            backgroundColor: '#17f9ff',
                            borderColor: '#17f9ff',
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
                            onHover: this.mostrarDetalhes3,
                            onLeave: this.mostrarDetalhes3,
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
                    // onClick: (e) => {
                    //         const canvasPosition = getRelativePosition(e, canvas.chart);
                    //         const dataX = canvas.chart.scales.x.getValueForPixel(canvasPosition.x);

                    //         this.mesCliente = this.dadosFormatadosClientes[dataX]
                    //         this.getClienteMes();

                    //  }
                },
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
}</style>