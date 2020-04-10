from django.db import models
from users.models import User
from tags.models import Tag
from images.models import Image


# Create your models here.
class Study(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tags = models.ManyToManyField(Tag, blank=True, related_name="studies")
    images = models.ManyToManyField(Image, blank=True, related_name="studies")

    title = models.CharField(
        max_length=255,
        blank=False,
        default="your study title"
    )

    # studied contents
    body = models.TextField(blank=False)

    # the day registered study
    registered_date = models.DateTimeField(auto_now_add=True)

    # last edit date
    last_edit_date = models.DateTimeField(auto_now=True)

    is_public = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['registered_date']
