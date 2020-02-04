from django.db.models import Q, F
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny

from .serializers import *
from .models import Comment


class CommentViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    # permission_classes = (AllowAny,)
    serializer_class = CommentSerializer

    # HTTP GET /comment/
    # HTTP GET /comment/?user=
    def get_queryset(self):
        user = self.request.query_params.get('user', '')
        study = self.request.query_params.get('study', '')
        question = self.request.query_params.get('question', '')

        criteria_user = Q()
        criteria_study = Q()
        criteria_question = Q()

        if user:
            if self.request.user.is_superuser:
                criteria_user = (Q(user__name=user))
            else:
                criteria_user = (Q(user__name=user) & Q(is_public=True))
        else:
            criteria_user = (Q(user=self.request.user))

        if study:
            criteria_study = (criteria_user & Q(study__pk__exact=study))

        if question:
            criteria_question = (criteria_user & Q(question__pk__exact=question))

        queryset = Comment.objects.filter(criteria_study).filter(criteria_question).annotate(child=F('parent_comment')).order_by('created_date')

        return queryset
