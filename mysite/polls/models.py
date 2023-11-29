from django.utils import timezone
from datetime import timedelta
from django.db import models

# Create your models here.


class Question(models.Model):
    text = models.CharField(max_length=200)
    date = models.DateTimeField("date published")

    def was_published_recently(self):
        now = timezone.now()
        return now - timedelta(days=1) <= self.date <= now

    def __str__(self):
        return self.text

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)

    def __str__(self):
        return self.text
