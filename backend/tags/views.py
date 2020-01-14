from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny

from .serializers import *
from .models import Tag


class TagViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    # permission_classes = (AllowAny,)
    serializer_class = TagSerializer

    # HTTP GET /tag/list/
    # HTTP GET /tag/list/?search=
    def get_queryset(self):
        search = self.request.query_params.get('search', '')

        if search:
            criteria = (Q(name__icontains=search) | Q(body__icontains=search))
        else:
            if self.request.user.is_superuser:
                criteria = Q()
            else:
                criteria = (Q(is_public=True))

        queryset = Tag.objects.filter(criteria).order_by('name')

        return queryset
