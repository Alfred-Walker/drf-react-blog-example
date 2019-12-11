from django.db.models import Q
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from .serializers import *
from .models import Study


class StudyViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = StudySerializer

    # HTTP GET /study/list/
    # HTTP GET /study/list/?search=
    def get_queryset(self):
        search = self.request.query_params.get('search', '')

        if search:
            if self.request.user.is_superuser:
                criteria = (Q(title__icontains=search) | Q(body__icontains=search))
            else:
                criteria = ((Q(title__icontains=search) | Q(body__icontains=search)) & (Q(is_public=True) | Q(user=self.request.user)))
        else:
            if self.request.user.is_superuser:
                criteria = Q()
            else:
                criteria = (Q(is_public=True) | Q(user=self.request.user))

        queryset = Study.objects.filter(criteria).order_by('-registered_date')

        return queryset

    # After DRF 3.8, list_route and detail_route have been merge into a single action decorator.
    # Replace detail_route uses with @action(detail=True).
    # Replace list_route uses with @action(detail=False).

    # HTTP GET /study/list/public/
    @action(detail=False)
    def public(self, request):
        queryset = Study.objects.filter(is_public=True).order_by('-registered_date')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # HTTP GET /study/list/private/
    @action(detail=False)
    def private(self, request):
        queryset = self.get_queryset().filter(is_public=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
