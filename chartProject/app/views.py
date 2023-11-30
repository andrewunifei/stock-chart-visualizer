from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import stockData

import requests
import json

# Create your views here.
API_KEY = 'M6JBT0DHBK3W9NDA'
DATABASE_ACCESS = True 

def index(request):
    return render(request, 'index.html', {})

@csrf_exempt
def get_stock_data(request):
    if request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
        symbol = request.POST.get('symbol', 'null')
        symbol = symbol.upper()

        if DATABASE_ACCESS:
            # Verifica se o valor do ticker já está presente no banco de dados
            if stockData.objects.filter(ticker=symbol).exists():
                entry = stockData.objects.filter(ticker=symbol)[0]

                return HttpResponse(entry.data, content_type='application/json')
        
        price_series = requests.get(f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol={symbol}&apikey={API_KEY}&outputsize=full').json()
        sma_series = requests.get(f'https://www.alphavantage.co/query?function=SMA&symbol={symbol}&interval=daily&time_period=10&series_type=close&apikey={API_KEY}').json()

        raw_dict = {}
        raw_dict['prices'] = price_series
        raw_dict['sma'] = sma_series

        db_controller = stockData(ticker=symbol, data=json.dumps(raw_dict))
        db_controller.save()

        return HttpResponse(json.dumps(raw_dict), content_type='application/json')
    
    else:
        return HttpResponse('Use AJAX')