from django.db.models import Q
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response

from .serializers import *
from .models import Study


class StudyViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    # permission_classes = (AllowAny,)
    serializer_class = StudySerializer

    # HTTP GET /study/
    # HTTP GET /study/?search=
    def get_queryset(self):
        search = self.request.query_params.get('search', '')
        tag = self.request.query_params.get('tag', '')

        if search:
            if self.request.user.is_superuser:
                criteria = (
                        Q(title__icontains=search) |
                        Q(body__icontains=search)
                )
            else:
                criteria = (
                        (Q(title__icontains=search) | Q(body__icontains=search)) &
                        (Q(is_public=True) | Q(user_id=self.request.user.id))
                )
        else:
            if self.request.user.is_superuser:
                criteria = Q()
            else:
                criteria = (Q(is_public=True) | Q(user_id=self.request.user.id))
                print(tag)

        if tag:
            queryset = Study.objects.filter(criteria, Q(tags__name__exact=tag)).order_by('-registered_date')
        else:
            queryset = Study.objects.filter(criteria).order_by('-registered_date')

        return queryset

    # After DRF 3.8, list_route and detail_route have been merge into a single action decorator.
    # Replace detail_route uses with @action(detail=True).
    # Replace list_route uses with @action(detail=False).

    # HTTP GET /study/public/
    @action(detail=False)
    def public(self, request):
        queryset = Study.objects.filter(is_public=True).order_by('-registered_date')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # HTTP GET /study/private/
    @action(detail=False)
    def private(self, request):
        queryset = self.get_queryset().filter(is_public=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # HTTP GET /study/last/
    @action(detail=False)
    def last(self, request):
        """
            Most recent study written by request user
        """
        queryset = self.get_queryset().filter(user=self.request.user).order_by('-registered_date').first()
        serializer = self.get_serializer(queryset, many=False)
        return Response(serializer.data)

    # HTTP GET /study/latest/
    @action(detail=False)
    def latest(self, request):
        """
            Latest public study
        """
        queryset = self.get_queryset().filter(is_public=True).order_by('-registered_date').first()
        serializer = self.get_serializer(queryset, many=False)
        return Response(serializer.data)

    # HTTP GET /tag/question/
    @action(detail=False)
    def recent(self, request):
        """
            Multiple questions ordered by registered date
        """
        queryset = self.get_queryset().order_by('-registered_date')
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = StudySummarySerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)

        serializer = StudySummarySerializer(queryset, many=True, context={'request': request})

        return Response(serializer.data)
