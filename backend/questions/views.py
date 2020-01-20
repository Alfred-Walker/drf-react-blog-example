from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny

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
            criteria = (
                    Q(title__icontains=search) |
                    Q(body__icontains=search)
            )
        else:
            criteria = Q()
            # criteria = (Q(user_id=self.request.user.id))

        queryset = Question.objects.filter(criteria).order_by('-registered_date')

        return queryset
