from django.db import models
from users.models import User
from studies.models import Study
from questions.models import Question


# Create your models here.
class Comment(models.Model):
    # author
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # password (for anonymous user)
    # password = forms.CharField(widget=forms.PasswordInput)

    # comment contents
    text = models.TextField(blank=False)

    # commented date
    created_date = models.DateTimeField(auto_now_add=True)

    # is active or not (False when deleted)
    is_active = models.BooleanField(default=True)

    # is public or not
    # (if a comment is not public, only the parent object's author and comment's author can read)
    is_public = models.BooleanField(default=False)

    parent_study = models.ForeignKey(Study, null=True, blank=True, on_delete=models.CASCADE, related_name="comment")
    parent_question = models.ForeignKey(Question, null=True, blank=True, on_delete=models.CASCADE, related_name="comment")
    parent_comment = models.ForeignKey("self", null=True, blank=True, on_delete=models.CASCADE, related_name="child_comment")

    class Meta:
        ordering = ['created_date']

    def __str__(self):
        return self.text