from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny

from .serializers import *
from .models import Comment


class CommentViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    # permission_classes = (AllowAny,)
    serializer_class = CommentSerializer

    # HTTP GET /comment/list/
    # HTTP GET /comment/list/?user=
    def get_queryset(self):
        name = self.request.query_params.get('user', '')

        if name:
            if self.request.user.is_superuser:
                criteria = (Q(user__name=name))
            else:
                criteria = (Q(user__name=name) & Q(is_public=True))
        else:
            criteria = (Q(user=self.request.user))

        queryset = Comment.objects.filter(criteria).order_by('created_date')

        return queryset
