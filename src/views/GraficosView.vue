<template>
<body>
    <!-- CRIA UM CABEÇALHO PARA SELEÇÃO DE MÊS E UM BOTÃO PARA EXIBIR O ANO TODO -->
    <div class="form-check cabecalho">
        <button v-b-tooltip.hover title="Ano inteiro!" class="botoes" @click="getClienteAno(), getTicketsAno(), getProdutosAno()">
            <i class="bi bi-calendar-minus"></i>
        </button>
        <div v-for="i in nomeDosMeses" :key="i">
            <input @change="igualameses(), getClienteMes(), getTicketsMes(), getProdutosMes()" type="radio" class="btn-check botoes"
                name="options-base" :id=i.id :value=i.id v-model="mes" autocomplete="off">
            <label style="color: rgba(255, 255, 255, 1);margin-left: 0.5rem; font-size: large;" class="btn botoes" :for=i.id>{{ i.nome }}</label>
        </div>
        <select class="botoes ano" v-model="ano" @change="getProdutosAno(), getClienteAno(), getTicketsAno()"
                    style="width: 4rem; margin-left: 0.5em;margin-right: 0.5em  ;border: none; background-color: rgba(33, 37, 41, 1)">
                    <option>2023</option>
                    <option>2024</option>
        </select>
        <div style="border-left: solid 1px white;">
            <input @change="getClienteAno(), getProdutosAno(), getTicketsAno()" type="radio" class="btn-check botoes"
                    name="tipodegrafico" id="barra" value="bar" v-model="tipodegrafico" autocomplete="off">
                    <label style="color: rgba(255, 255, 255, 1);margin-left: 0.5rem; font-size: medium;" class="btn botoes" for="barra"><i class="bi bi-bar-chart-line-fill"></i></label>
                    
            <input @change="getClienteAno(), getProdutosAno(), getTicketsAno()" type="radio" class="btn-check botoes"
                    name="tipodegrafico" id="linha" value="line" v-model="tipodegrafico" autocomplete="off">
                    <label style="color: rgba(255, 255, 255, 1);margin-left: 0.5rem; font-size: medium;" class="btn botoes" for="linha"><i class="bi bi-graph-up"></i></label>
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

                <canvas id="ChartClientes"></canvas>
                <canvas id="ChartProdutos"></canvas>
                <select v-model="familiaProdutos" @change="getProdutosAno()"
                    style="width: 10rem; margin: 0.2rem 0 0.5rem 1rem; border-radius: 10px;">
                    <option v-for=" p in listaProdutos" :key="p">{{ capitalize(p.familia_nome) }}</option>
                </select>
            </div>
        </div>


        <div class="card mb-3" style="max-width: 100%; border: 1px solid rgb(0, 0, 0);">
            <div @click="mostrarFinanceiro()" style="background-color: rgba(129, 199, 132, 1);"
            class="card-header titulo"><i id="iconeFinanceiro" style="margin-right: 0.5rem;"
                    class="bi bi-arrow-right"></i>Financeiro</div>
            <div id="Financeiro" style="display: none;">
                <canvas id="ChartTickets"></canvas>
            </div>
        </div>

        
        <div class="card mb-3" style="max-width: 100%; border: 1px solid rgb(0, 0, 0);">
            <div @click="mostrarProdução()" style="background-color: rgba(244, 67, 54, 1);"
                class="card-header titulo"><i id="iconeProdução" style="margin-right: 0.5rem;"
                    class="bi bi-arrow-right"></i>Produção</div>
            <div id="Produção" style="display: none;">
                <canvas id=""></canvas>
            </div>
        </div>
        

        <div class="card mb-3" style="max-width: 100%; border: 1px solid rgb(0, 0, 0);">
            <div @click="mostrarInjeção()" style="background-color: rgba(66, 165, 245, 1);"
                class="card-header titulo"><i id="iconeInjeção" style="margin-right: 0.5rem;"
                    class="bi bi-arrow-right"></i>Injeção</div>
                    <div id="Injeção" style="display: none;">
                <canvas id=""></canvas>
            </div>
        </div>
        


    </div>
    
    <div style="overflow: auto" class="modal-mask" v-if="showModal" @click="fecharModalFora">
        <div style="max-height: 70%" class="modal-container">
            <div class="conteudomodal">
                <h1 style="text-align: center;">Clientes:
                    <hr>
                </h1>
                <ul>
                    <li style="margin-top: 0.5rem;margin-right: 1rem;" v-for="c in clientes" :key="c">
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
            listaProdutos: [
                {
                    "familia_nome": "ACESSÓRIOS"
                },
                {
                    "familia_nome": "ADAPTADOR"
                },
                {
                    "familia_nome": "Autocolantes"
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
                    "familia_nome": "CONJUNTO"
                },
                {
                    "familia_nome": "CONVERSOR"
                },
                {
                    "familia_nome": "DOCK"
                },
                {
                    "familia_nome": "Eletroeletrônicos"
                },
                {
                    "familia_nome": "HUB"
                },
                {
                    "familia_nome": "Importados"
                },
                {
                    "familia_nome": "Injetados Externos"
                },
                {
                    "familia_nome": "Injetados Internos"
                },
                {
                    "familia_nome": "Montados"
                },
                {
                    "familia_nome": "Peça Mecânica"
                },
                {
                    "familia_nome": "PLUG"
                },
                {
                    "familia_nome": "Preparados"
                },
                {
                    "familia_nome": "PROJETO"
                },
                {
                    "familia_nome": "Resinados"
                },
                {
                    "familia_nome": "SUPORTES"
                },
                {
                    "familia_nome": "TABLET"
                }
            ],
            familiaProdutos: "Acessórios",
            dadosFormatadosC: [],
            dadosFormatadosT: [],
            dadosFormatadosP: [],
            showModal: false,
            clientes: "",
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
        }
    },
    mounted() {
        this.getClienteAno()
        this.getTicketsAno()
        this.getProdutosAno()
    },
    methods: {
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
            this.clientes = "",
                axios.post('http://192.168.0.6:8000/api/omie/oportunidade/cliente-conquistado/detalhe', {
                    anoSemana: this.ano + this.semana,
                })
                    .then((response) => {
                        this.clientes = response.data;
                        this.clientes = this.clientes.map((item) => item.cDesOp);
                        console.log(response);
                        console.log(this.clientes);
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
        getClienteMes() {
            // PUXA OS DADOS DO BACKEND PASSANDO MES E ANO
            axios.post('http://192.168.0.6:8000/api/omie/oportunidade/cliente-conquistado', {
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

        // getClienteAno() {
        //     // PUXA OS DADOS PASSANDO APENAS ANO
        //     this.mes = ""
        //     axios.post('http://192.168.0.6:8000/api/omie/oportunidade/cliente-conquistado', {
        //         ano: this.ano,
        //     })
        //         .then((response) => {
        //             this.dados = response.data;
        //             // RETIRA AS 4 PRIMEIRAS LETRAS QUE SÃO O ANO, DEIXANDO APENAS AS DUAS ULTIMAS QUE SÃO A SEMANA DO ANO
        //             this.dados.forEach((item) => {
        //                 item.semana = item.semana.toString().substring(4);
        //             });
        //             // CRIA UMA SEGUNDA ARRAY E CONVERTE AS STRINGS EM NUMEROS INTEIROS
        //             this.dadosFormatadosC = this.dados.map((item) => parseInt(item.semana, 10));
        //             //TRANSFORMA O NUMERO DA SEMANA NO NUMERO DO MES QUE ELA CORRESPONDE: EXEMPLO 04(SEMANA 04) RETORNA 01(JANEIRO)
        //             this.dadosFormatadosC = this.dadosFormatadosC.map((semana) => {
        //                 const data = new Date(this.ano, 0, 1);
        //                 data.setDate(data.getDate() + (semana - 1) * 7);
        //                 return data.getMonth() + 1;
        //             });
        //             // TRANASFORMA OS NUMEROS DOS MESES EM STRINGS COM OS NOMES DOS MESES
        //             this.dadosFormatadosC = this.dadosFormatadosC.map((numero) => this.nomesDosMesessemid[numero - 1])


        //             // DEFINE AS VARIAVEIS NECESSARIAS PARA CONSTRUIR O GRÁFICO: LABELS, DATASETS
        //             this.dataGrafico = this.dados.map((item) => item.regSemana);

        //             this.labels = this.dadosFormatadosC
        //             this.datasets = [];
        //             this.datasets.push({
        //                 data: this.dataGrafico,
        //                 type: 'bar',
        //                 label: 'Clientes Conquistados',
        //                 backgroundColor: 'rgba(255, 167, 38, 1)',
        //                 borderColor: 'rgba(255, 167, 38, 1)',
        //                 borderWidth: 1.5,
        //                 tension: 0.3,
        //                 pointRadius: 2.2,
        //                 pointHoverRadius: 5,
        //             })
        //             // CHAMA A FUNÇÃO QUE CRIA O GRÁFICO
        //             this.renderChartClientes()
        //         })
        //         .catch((error) => {
        //             console.error(error);
        //         });
        // },

//CRIA O GRÁFICO BASEANDO NAS VÁRIAVEIS DEFINIDAS NA FUNÇÃO QUE CHAMOU ESTA
        
        getClienteAno() {
            this.mes = ""
            axios.post('http://192.168.0.6:8000/api/omie/oportunidade/cliente-conquistado-mes', {
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
                    this.datasets.push({
                        data: this.dataGrafico,
                        type: this.tipodegrafico,
                        label: 'Clientes Conquistados',
                        backgroundColor: 'rgba(255, 167, 38, 1)',
                        borderColor: 'rgba(255, 167, 38, 1)',
                        borderWidth: 1.5,
                        tension: 0.3,
                        pointRadius: 2.2,
                        pointHoverRadius: 5,
                    })
                    // CHAMA A FUNÇÃO QUE CRIA O GRÁFICO
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
                            this.getClienteMes();
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
                        data: [1000000, 1000000, 1000000, 1000000, 1000000,1000000,1000000,1000000,1000000,1000000,1000000,1000000]
                    },{
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
                        type: 'line',
                        label: 'Meta',
                        backgroundColor: 'black',
                        borderColor: 'black',
                        pointRadius: 0,
                        borderWidth: 1,
                        data: [100, 100, 100, 100, 100]
                    }, {
                        data: this.dataGraficoProdutos,
                        type: this.tipodegrafico,
                        label: 'Tickets',
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
                        label: 'Produtos Vendidos',
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