// MUDAR DE AJAX PARA FETCH
// PROCURAR SE EXISTEM ALTERNATIVAS PARA JQUERY
// DEBUGAR A LEITURA DOS DADOS
// ELE CONSEGUE BUSCAR OS DADOS COM SUCESSO DA API ALPHAVANTAGE,
// PORÉM ELES MUDARAM A ESTRUTURA DE DADOS DA COISA

$(document).ready(() => {
    $.ajax({
        // Envia um símbolo de ativo e recebe dados de preços e da Média Móvel Simples (SMA)
        type: 'POST',
        url: '/get_stock_data/',
        data: {
            'symbol': 'NVDA',
        },
        success: (res, status) => {
            console.log(res) 
            // const ticker = res['prices']['Meta Data']['2. Symbol']
            // const chartTitle = ticker + ': dados dos últimos 500 dias.'
            // const priceSeries = res['prices']['Time Series (Daily)']
            // let dailyAdjustedClose = []
            // let dates = []

            // const priceDataParser = () => {
            //     for(const key of priceSeries){
            //         dailyAdjustedClose.push(Number(priceSeries[key]['5. adjusted close']))
            //         dates.push(String(key))
            //     }
            // }
            // priceDataParser()

            // const SMASeries = res['sma']['Technical Analysis: SMA']
            // let SMAData = []

            // const SMADataParser = () => {
            //     for(const key of SMASeries){
            //         SMAData.push(Number(SMASeries[key]['SMA']))
            //     }
            // }
            // SMADataParser()

            // // Estamos interessados apenas nos preços dos últimos 500 dias, então vamos fatiar o array
            // dailyAdjustedClose.reverse().slice(500)
            // SMAData.reverse().slice(500)
            // dates.reveser().slice(500)

            // // Usando Chart.js para plotar o gráfico
            // const context = $('#chart').getContext('2d')
            // const chart = new Chart(context, {
            //     type: 'line',
            //     data: {
            //         labels: dates.slice,
            //         datasets: [
            //             {
            //                 labels: 'Fechamento diário ajustado',
            //                 data: dailyAdjustedClose,
            //                 backgroundColor: [
            //                     'black',
            //                 ],
            //                 borderColor: [
            //                     'black',
            //                 ],
            //                 borderWidth: 1
            //             },
            //             {
            //                 labels: 'Média Móvel Simples (SMA)',
            //                 data: SMAData,
            //                 backgroundColor: [
            //                     'purple',
            //                 ],
            //                 borderColor: [
            //                     'purple',
            //                 ],
            //                 borderWidth: 1
            //             }
            //         ]
            //     },
            //     options: {
            //         responsive: true,
            //         scale: {
            //             y: {

            //             }
            //         },
            //         plugins: {
            //             legend: {
            //                 position: 'top',
            //             },
            //             title: {
            //                 display: true,
            //                 text: chartTitle, 
            //             }
            //         }
            //     }
            // })
        }
    })
})

$('#ticker-submit').click(() => {
    const tickerSelected = $('#ticker-input').val()

    $.ajax({
        type: 'POST',
        url: '/get_stock_data/',
        data: {
            'symbol': tickerSelected,
        },
        success: () => {
            const ticker = res['prices']['Meta Data']['2. Symbol']
            const chartTitle = ticker + ': dados dos últimos 500 dias.'
            const priceSeries = res['prices']['Time Series (Daily)']
            let dailyAdjustedClose = []
            let dates = []

            const priceDataParser = () => {
                for(const key of priceSeries){
                    dailyAdjustedClose.push(Number(priceSeries[key]['5. adjusted close']))
                    dates.push(String(key))
                }
            }
            priceDataParser()

            const SMASeries = res['sma']['Technical Analysis: SMA']
            let SMAData = []

            const SMADataParser = () => {
                for(const key of SMASeries){
                    SMAData.push(Number(SMASeries[key]['SMA']))
                }
            }
            SMADataParser()

            // Estamos interessados apenas nos preços dos últimos 500 dias, então vamos fatiar o array
            dailyAdjustedClose.reverse().slice(500)
            SMAData.reverse().slice(500)
            dates.reveser().slice(500)

            $('chart').remove()
            $('chart-container').append('<canvas id="chart">')
            const context = $('chart').getContext('2d')
            const chart = new Chart(context, {
                type: 'line',
                data: {
                    labels: dates.slice,
                    datasets: [
                        {
                            labels: 'Fechamento diário ajustado',
                            data: dailyAdjustedClose,
                            backgroundColor: [
                                'black',
                            ],
                            borderColor: [
                                'black',
                            ],
                            borderWidth: 1
                        },
                        {
                            labels: 'Média Móvel Simples (SMA)',
                            data: SMAData,
                            backgroundColor: [
                                'purple',
                            ],
                            borderColor: [
                                'purple',
                            ],
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scale: {
                        y: {

                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: chartTitle, 
                        }
                    }
                }
            })
        }
    })
})