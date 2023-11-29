from django.db import models

# Create your models here.
class stockData(models.Model):
    ticker = models.TextField(null=True)
    data = models.TextField(null=True)