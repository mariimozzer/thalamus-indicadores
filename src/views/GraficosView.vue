<template>
    <div class="form-check cabecalho">
        <button v-b-tooltip.hover title="Ano inteiro!" class="botoes" @click="getClienteAno(), getTicketsAno(), getProdutosAno()">
            <i class="bi bi-calendar-minus"></i>
        </button>
        <div v-for="i in nomeDosMeses" :key="i">
            <input @change="igualameses(), getClienteMes(), getTicketsMes(), getProdutosMes()" type="radio" class="btn-check botoes"
                name="options-base" :id=i.id :value=i.id v-model="mes" autocomplete="off">
            <label style="font-family:Verdana; margin-left: 0.5rem;" class="btn botoes" :for=i.id>{{ i.nome }}</label>
        </div>
    </div>
    <div style="display: flex;flex-flow: column ;width: 100%;padding: 1rem;">


        <div class="card mb-3" style="max-width: 100%; border: 1px solid rgb(0, 0, 0); margin-top: 4rem;">
            <div @click="mostrarComercial()" style="background-color: rgba(255, 153, 0, 0.863);"
            class="card-header titulo"><i id="iconeComercial" style="margin-right: 0.5rem;" 
                class="bi bi-arrow-right"></i>Comercial</div>
            <div id="Comercial" style="display: none;">
                <canvas id="ChartClientes"></canvas>
                <canvas id="ChartProdutos"></canvas>
                <select v-model="familiaProdutos" @change="getProdutosAno()"
                    style="width: 10rem; margin: 0.2rem 0 0.5rem 1rem; border-radius: 10px;">
                    <option v-for=" p in listaProdutos" :key="p">{{ p.familia_nome }}</option>
                </select>
            </div>
        </div>


        <div class="card mb-3" style="max-width: 100%; border: 1px solid rgb(0, 0, 0);">
            <div @click="mostrarFinanceiro()" style="background-color: rgba(26, 206, 35, 0.863);"
                class="card-header titulo"><i id="iconeFinanceiro" style="margin-right: 0.5rem;"
                    class="bi bi-arrow-right"></i>Financeiro</div>
            <div id="Financeiro" style="display: none;">
                <canvas id="ChartTickets"></canvas>
            </div>
        </div>

        <div class="card mb-3" style="max-width: 100%; border: 1px solid rgb(0, 0, 0);">
            <div @click="mostrarProdução()" style="background-color: rgba(250, 0, 0, 0.863);"
                class="card-header titulo"><i id="iconeProdução" style="margin-right: 0.5rem;"
                    class="bi bi-arrow-right"></i>Produção</div>
            <div id="Produção" style="display: none;">
                <canvas id=""></canvas>
            </div>
        </div>

        <div class="card mb-3" style="max-width: 100%; border: 1px solid rgb(0, 0, 0);">
            <div @click="mostrarInjeção()" style="background-color: rgb(0, 158, 250);"
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
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';

export default {
    data() {
        return {
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
            familiaProdutos: "ACESSÓRIOS",
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
                "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
                "Jul", "Ago", "Set", "Out", "Nov", "Dez"
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

        calcularMesDaSemana() {
            const data = new Date(this.ano, 0, 1);
            data.setDate(data.getDate() + (this.semana - 1) * 7);
            this.mesSemana = data.getMonth() + 1;
        },

        igualameses() {
            this.mesTickets = this.mes;
            this.mesProdutos = this.mes
        },

        getClienteMes() {
            axios.post('http://192.168.0.6:8000/api/omie/oportunidade/cliente-conquistado', {
                mes: this.mes,
                ano: this.ano,
            })
                .then((response) => {
                    this.dados = response.data;
                    this.dados.forEach((item) => {
                        item.semana = item.semana.toString().substring(4);
                    });
                    this.labels = this.dados.map((item) => item.semana);
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
                        type: 'line',
                        label: 'Clientes Conquistados',
                        backgroundColor: 'rgb(255, 123, 0)',
                        borderColor: 'rgb(255, 123, 0)',
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
            this.mes = ""
            axios.post('http://192.168.0.6:8000/api/omie/oportunidade/cliente-conquistado', {
                ano: this.ano,
            })
                .then((response) => {
                    this.dados = response.data;
                    this.dados.forEach((item) => {
                        item.semana = item.semana.toString().substring(4);
                    });

                    this.dadosFormatadosC = this.dados.map((item) => parseInt(item.semana, 10));
                    this.dadosFormatadosC = this.dadosFormatadosC.map((semana) => {
                        const data = new Date(this.ano, 0, 1);
                        data.setDate(data.getDate() + (semana - 1) * 7);
                        return data.getMonth() + 1;
                    });
                    this.dadosFormatadosC = this.dadosFormatadosC.map((numero) => this.nomesDosMesessemid[numero - 1])



                    this.labels = this.dadosFormatadosC
                    this.dataGrafico = this.dados.map((item) => item.regSemana);
                    this.datasets = [];
                    this.datasets.push({
                        data: this.dataGrafico,
                        type: 'line',
                        label: 'Clientes Conquistados',
                        backgroundColor: 'rgb(255, 123, 0)',
                        borderColor: 'rgb(255, 123, 0)',
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
            const canvas = document.getElementById('ChartClientes');
            const ctx = canvas.getContext('2d');

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
                    onClick: (e) => {
                        if (this.mes == "") {
                            const canvasPosition = getRelativePosition(e, canvas.chart);
                            const dataX = canvas.chart.scales.x.getValueForPixel(canvasPosition.x);

                            this.semana = this.dados[dataX]
                            this.semana = this.semana.semana
                            this.calcularMesDaSemana();
                            this.mes = this.mesSemana;
                            this.getClienteMes();
                        } else {
                            const canvasPosition = getRelativePosition(e, canvas.chart);
                            const dataX = canvas.chart.scales.x.getValueForPixel(canvasPosition.x);

                            this.semana = this.dados[dataX]
                            this.semana = this.semana.semana

                            this.abrirModal()
                        }
                    }
                },
            });
        },

        getTicketsMes() {
            this.mesTickets = this.mes
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
                        type: 'line',
                        label: 'Tickets',
                        backgroundColor: 'rgba(26, 206, 35, 0.863)',
                        borderColor: 'rgb(26, 206, 35)',
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
            axios.post('http://192.168.0.6:8000/api/omie/oportunidade/ticket', {
                ano: this.ano,
            })
                .then((response) => {
                    this.dadosTickets = response.data;
                    this.dadosTickets.forEach((item) => {
                        item.semana = item.semana.toString().substring(4);
                    });


                    this.dadosFormatadosT = this.dadosTickets.map((item) => parseInt(item.semana, 10));
                    this.dadosFormatadosT = this.dadosFormatadosT.map((semana) => {
                        const data = new Date(this.ano, 0, 1);
                        data.setDate(data.getDate() + (semana - 1) * 7);
                        return data.getMonth() + 1;
                    });
                    this.dadosFormatadosT = this.dadosFormatadosT.map((numero) => this.nomesDosMesessemid[numero - 1])

                    this.labelsTickets = this.dadosFormatadosT
                    this.dataGraficoTickets = this.dadosTickets.map((item) => item.regSemana);
                    this.datasetsTickets = [];
                    this.datasetsTickets.push({
                        data: this.dataGraficoTickets,
                        type: 'line',
                        label: 'Tickets',
                        backgroundColor: 'rgb(26, 206, 35)',
                        borderColor: 'rgb(26, 206, 35)',
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

                            this.semana = this.dados[dataX]
                            this.semana = this.semana.semana
                            this.calcularMesDaSemana();
                            this.mes = this.mesSemana;
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
                        type: 'line',
                        label: 'Tickets',
                        backgroundColor: 'rgb(255, 123, 0)',
                        borderColor: 'rgb(255, 123, 0)',
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
            axios.post('http://192.168.0.6:8000/api/indicador/produto-vendido', {
                nome: this.familiaProdutos,
                ano: this.ano,
            })
                .then((response) => {
                    this.dadosProdutos = response.data
                    this.dadosProdutos.forEach((item) => {
                        item.semana = item.semana.toString().substring(4);
                    });


                    this.dadosFormatadosP = this.dadosProdutos.map((item) => parseInt(item.semana, 10));
                    this.dadosFormatadosP = this.dadosFormatadosP.map((semana) => {
                        const data = new Date(this.ano, 0, 1);
                        data.setDate(data.getDate() + (semana - 1) * 7);
                        return data.getMonth() + 1;
                    });
                    this.dadosFormatadosP = this.dadosFormatadosP.map((numero) => this.nomesDosMesessemid[numero - 1])

                    this.labelsProdutos = this.dadosFormatadosP
                    this.dataGraficoProdutos = this.dadosProdutos.map((item) => item.regSemana);
                    this.datasetsProdutos = [];
                    this.datasetsProdutos.push({
                        data: this.dataGraficoProdutos,
                        type: 'line',
                        label: 'Produtos Vendidos',
                        backgroundColor: 'rgb(255, 123, 0)',
                        borderColor: 'rgb(255, 123, 0)',
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

                            this.semana = this.dadosProdutos[dataX]
                            this.semana = this.semana.semana
                            this.calcularMesDaSemana();
                            this.mesProdutos = this.mesSemana;
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
    font-family: Verdana;
    border-bottom: 1px solid rgb(0, 0, 0);
}

.titulo:hover {
    cursor: pointer;
    transition: 50ms linear;
    box-shadow: rgba(26, 26, 26, 0.200) 3px 3px 6px 0px inset, rgba(26, 26, 26, 0.200) -3px -3px 6px 1px inset;
}
button {
    background-color: transparent;
    border: none;
    font-size: larger;
}

.cabecalho {
    display: flex;
    flex-flow: row;
    align-content: center;
    padding: 0.5rem;
    justify-content: center;
    width: 100%;
    position: fixed;
    z-index: 999999;
    background-color: white;
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