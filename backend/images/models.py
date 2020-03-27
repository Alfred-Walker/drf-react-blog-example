from django.db import models
from users.models import User

from .storages import MediaFileSystemStorage

import hashlib


def file_path(instance, filename):
    # http://johnnykims.blogspot.com/2016/05/django-imagefield-uploadto.html
    """file will be uploaded to MEDIA_ROOT/0 ~ f/0 ~ f/checksum.extension"""
    checksum = instance.md5sum
    extension = filename.split('.')[-1]

    #  distribution to different directories /0/0/ - /f/f/
    return '%s/%s/%s.%s' % (checksum[0:1], checksum[1:2], checksum, extension.lower())


# Create your models here.
class Image(models.Model):
    """use the custom storage class fo the ImageField"""
    file = models.ImageField(upload_to=file_path, storage=MediaFileSystemStorage())
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    md5sum = models.CharField(max_length=36)

    upload_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['upload_date']

    def save(self, *args, **kwargs):
        if not self.pk:  # file is new
            md5 = hashlib.md5()
            for chunk in self.file.chunks():
                md5.update(chunk)
            self.md5sum = md5.hexdigest()
        super(Image, self).save(*args, **kwargs)