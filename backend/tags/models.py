from django.db import models


# Create your models here.
class Tag(models.Model):
    name = models.CharField(
        max_length=255,
        blank=False,
        default="default tag"
    )
    is_public = models.BooleanField(default=False)

    def __str__(self):
        return self.name
