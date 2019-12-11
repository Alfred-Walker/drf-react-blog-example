from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .serializers import *
from .models import Study


class StudyViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Study.objects.all().order_by('-registered_date')
        else:
            return Study.objects.filter(user=self.request.user).order_by('-registered_date')

    serializer_class = StudySerializer
