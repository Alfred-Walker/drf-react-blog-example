from django.db import models
from datetime import datetime
from users.models import User


# Create your models here.
class Study(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    title = models.CharField(
        max_length=255,
        blank=False,
        default="your study title"
    )

    # studied contents
    body = models.TextField(blank=False)

    category = models.CharField(
        max_length=20,
        unique=False,
        blank=True,
        default="Type"
    )

    # the day registered study
    registered_date = models.DateTimeField(default=datetime.now())

    # last notification date
    last_review_date = models.DateTimeField(null=True)

    # review notification count
    review_count = models.PositiveIntegerField(default=0)

    # review notification cycle in minute
    review_cycle_in_minute = models.PositiveIntegerField(default=0)

    notification_enabled = models.BooleanField(blank=False, null=False, default=True)

    def __str__(self):
        return self.title
