from django.db.models import Q
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response

from .serializers import *
from .models import Question


class QuestionViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    # permission_classes = (AllowAny,)
    serializer_class = QuestionSerializer

    # HTTP GET /question/list/
    # HTTP GET /question/list/?search=
    def get_queryset(self):
        search = self.request.query_params.get('search', '')

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

        queryset = Question.objects.filter(criteria).order_by('-registered_date')

        return queryset

    # After DRF 3.8, list_route and detail_route have been merge into a single action decorator.
    # Replace detail_route uses with @action(detail=True).
    # Replace list_route uses with @action(detail=False).

    # HTTP GET /question/list/public/
    @action(detail=False)
    def public(self, request):
        queryset = Question.objects.filter(is_public=True).order_by('-registered_date')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # HTTP GET /question/list/private/
    @action(detail=False)
    def private(self, request):
        queryset = self.get_queryset().filter(is_public=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
