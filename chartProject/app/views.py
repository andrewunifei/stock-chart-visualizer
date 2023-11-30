from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import StockData

import requests
import json
import sys

# Create your views here.
API_KEY = 'M6JBT0DHBK3W9NDA'
DATABASE_ACCESS = True 

def index(request):
    return render(request, 'index.html', {})

@csrf_exempt
def get_stock_data(request):
    if(request.body):
        parsed_req_body = json.loads(request.body)

    # print(parsed_req_body, file=sys.stderr)
    
    symbol = parsed_req_body['symbol']
    symbol = symbol.upper()

    price_series_url = f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={API_KEY}&outputsize=full'
    sma_series_url = f'https://www.alphavantage.co/query?function=SMA&symbol={symbol}&interval=daily&time_period=10&series_type=close&apikey={API_KEY}'

    if DATABASE_ACCESS:
        # Verifica se o valor do ticker já está presente no banco de dados
        if StockData.objects.filter(ticker=symbol).exists():
            entry = StockData.objects.filter(ticker=symbol)[0]

            return HttpResponse(entry.data, content_type='application/json')
    
    price_series = requests.get(price_series_url).json()
    sma_series = requests.get(sma_series_url).json()

    raw_dict = {}
    raw_dict['prices'] = price_series
    raw_dict['sma'] = sma_series

    db_controller = StockData(ticker=symbol, data=json.dumps(raw_dict))
    db_controller.save()

    return HttpResponse(json.dumps(raw_dict), content_type='application/json')