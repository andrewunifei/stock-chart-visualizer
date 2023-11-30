$(document).ready(async () => {
    let parsed
    let res

    try{
        res = await fetch('/get_stock_data/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'symbol': 'NVDA'
            }) 
        })
    } catch(err){
        console.log(err)
    }
    
    if(res.status === 200){
        parsed = await res.json()
    }
    else{
        console.log(res.status)
        process.exit(1)
    }

    const ticker = parsed['prices']['Meta Data']['2. Symbol']
    const chartTitle = ticker + ': dados dos últimos 100 dias.'
    const priceSeries = parsed['prices']['Time Series (Daily)']
    let dailyAdjustedClose = []
    let dates = []

    const priceDataParser = () => {
        for(const [key, value] of Object.entries(priceSeries)){
            dailyAdjustedClose.push(Number(value['4. close']))
            dates.push(String(key))
        }
    }
    priceDataParser()

    const SMASeries = parsed['sma']['Technical Analysis: SMA']
    let SMAData = []

    const SMADataParser = () => {
        for(const [key, value] of Object.entries(SMASeries)){
            SMAData.push(Number(value['SMA']))
        }
    }
    SMADataParser()

    // Estamos interessados apenas nos preços dos últimos 500 dias, então vamos fatiar o array
    dailyAdjustedClose.reverse()
    SMAData.reverse()
    dates.reverse()

    // Usando Chart.js para plotar o gráfico
    const context = document.getElementById('chart').getContext('2d')
    const chart = new Chart(context, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Fechamento diário',
                    data: dailyAdjustedClose.slice(-100),
                    backgroundColor: [
                        'black',
                    ],
                    borderColor: [
                        'black',
                    ],
                    borderWidth: 1
                },
                {
                    label: 'Média Móvel Simples (SMA)',
                    data: SMAData.slice(-100),
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
})

$('#ticker-submit').click(async () => {
    const tickerSelected = $('#ticker-input').val()
    let parsed
    let res

    try{
        res = await fetch('/get_stock_data/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'symbol': tickerSelected
            }) 
        })
    } catch(err){
        console.log(err)
    }
    
    if(res.status === 200){
        parsed = await res.json()
    }
    else{
        console.log(res.status)
        process.exit(1)
    }

    const ticker = parsed['prices']['Meta Data']['2. Symbol']
    const chartTitle = ticker + ': dados dos últimos 100 dias.'
    const priceSeries = parsed['prices']['Time Series (Daily)']
    let dailyAdjustedClose = []
    let dates = []

    const priceDataParser = () => {
        for(const [key, value] of Object.entries(priceSeries)){
            dailyAdjustedClose.push(Number(value['4. close']))
            dates.push(String(key))
        }
    }
    priceDataParser()

    const SMASeries = parsed['sma']['Technical Analysis: SMA']
    let SMAData = []

    const SMADataParser = () => {
        for(const [key, value] of Object.entries(SMASeries)){
            SMAData.push(Number(value['SMA']))
        }
    }
    SMADataParser()

    // Estamos interessados apenas nos preços dos últimos 500 dias, então vamos fatiar o array
    dailyAdjustedClose.reverse()
    SMAData.reverse()
    dates.reverse()

    $('#chart').remove()
    $('#chart-container').append('<canvas id="chart"></canvas>')
    const context = document.getElementById('chart').getContext('2d')

    const chart = new Chart(context, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Fechamento diário',
                    data: dailyAdjustedClose.slice(-100),
                    backgroundColor: [
                        'black',
                    ],
                    borderColor: [
                        'black',
                    ],
                    borderWidth: 1
                },
                {
                    label: 'Média Móvel Simples (SMA)',
                    data: SMAData.slice(-100),
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
})