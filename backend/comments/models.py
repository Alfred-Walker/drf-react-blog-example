from django import forms
from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from users.models import User


# Create your models here.
class Comment(models.Model):
    # generic foreign key over multiple models (Study, Question, and Comment)
    parent_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    parent_id = models.PositiveIntegerField()
    parent_object = GenericForeignKey('parent_type', 'parent_id')

    # author
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # password (for anonymous user)
    # password = forms.CharField(widget=forms.PasswordInput)

    # comment contents
    body = models.TextField(blank=False)

    # commented date
    created_date = models.DateTimeField(auto_now_add=True)

    # is public or not
    # (if a comment is not public, only the parent object's author and comment's author can read)
    is_public = models.BooleanField(default=False)

    class Meta:
        ordering = ['created_date']
