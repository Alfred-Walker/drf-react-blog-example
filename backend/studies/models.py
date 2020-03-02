from django.db import models
from users.models import User
from tags.models import Tag


# Create your models here.
class Study(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tags = models.ManyToManyField(Tag, blank=True, related_name="studies")

    title = models.CharField(
        max_length=255,
        blank=False,
        default="your study title"
    )

    # studied contents
    body = models.TextField(blank=False)

    # the day registered study
    registered_date = models.DateTimeField(auto_now_add=True)

    # last notification date
    last_review_date = models.DateTimeField(blank=True, null=True)

    # review notification count
    review_count = models.PositiveIntegerField(default=0)

    # review notification cycle in minute
    review_cycle_in_minute = models.PositiveIntegerField(default=0)

    notification_enabled = models.BooleanField(blank=False, null=False, default=True)

    is_public = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['registered_date']
