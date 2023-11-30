from django.db import models

# Create your models here.
class StockData(models.Model):
    ticker = models.TextField(null=True)
    data = models.TextField(null=True)