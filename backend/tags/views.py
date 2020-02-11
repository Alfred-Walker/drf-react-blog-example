from django.db.models import Count, F, Q
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response

from .serializers import *
from .models import Tag


class TagViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    # permission_classes = (AllowAny,)
    serializer_class = TagSerializer

    # HTTP GET /tag/
    # HTTP GET /tag/?search=
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

    # HTTP GET /tag/popular/
    # return popular tags (at most 5)
    @action(detail=False)
    def popular(self, request):
        count = 5
        queryset = self.get_queryset()\
                       .filter(is_public=True)\
                       .annotate(study_count=Count('study')) \
                       .annotate(question_count=Count('question')) \
                       .annotate(total_count=F('study_count') + F('question_count')) \
                       .order_by('-total_count')[:count]

        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)

    # HTTP GET /tag/random/
    @action(detail=False)
    def random(self, request):
        count = self.request.query_params.get('count', '')

        if count:
            count = min(max(0, int(count)), 20)
        else:
            count = 10

        queryset = self.get_queryset().filter(is_public=True).order_by('?')[:count]

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
