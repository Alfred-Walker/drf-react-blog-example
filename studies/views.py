from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .serializers import *
from .models import Study


class StudyViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)

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

    serializer_class = StudySerializer
