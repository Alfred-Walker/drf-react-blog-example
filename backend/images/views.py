from django.core.exceptions import ObjectDoesNotExist
from rest_framework import viewsets, permissions
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .serializers import *
from .models import Image


class IsDeleteImage(permissions.BasePermission):
    def has_permission(self, request, view):
        # can write custom code
        try:
            image = Image.objects.get(pk=view.kwargs['pk'])
        except ObjectDoesNotExist:
            return False

        if request.user.is_superuser or request.user == image.user:
            return True

        return False


class IsUpdateImage(permissions.BasePermission):
    def has_permission(self, request, view):
        # can write custom code
        try:
            image = Image.objects.get(pk=view.kwargs['pk'])
        except ObjectDoesNotExist:
            return False

        if request.user.is_superuser or request.user == image.user:
            return True

        return False


class ImageViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = ImageListSerializer
    parser_classes = (FormParser, MultiPartParser,)
    queryset = Image.objects.all()

    def get_permissions(self):
        if self.request.method == 'DELETE':
            self.permission_classes = (IsDeleteImage, )

        if self.request.method == 'PUT' or self.request.method == 'PATCH':
            self.permission_classes = (IsUpdateImage, )

        return super(ImageViewSet, self).get_permissions()
