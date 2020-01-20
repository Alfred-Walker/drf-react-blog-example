from django.db import models
from datetime import datetime
from users.models import User
from tags.models import Tag


# Create your models here.
class Question(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tags = models.ManyToManyField(Tag, blank=True)

    title = models.CharField(
        max_length=255,
        blank=False,
        default="your question title"
    )

    # question contents
    body = models.TextField(blank=False)

    # the day question registered
    registered_date = models.DateTimeField(auto_now_add=True)

    # last edit date
    last_edit_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
