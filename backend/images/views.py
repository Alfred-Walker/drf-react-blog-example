from rest_framework import viewsets
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .serializers import *
from .models import Image


class ImageViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = ImageListSerializer
    parser_classes = (FormParser, MultiPartParser,)
    queryset = Image.objects.all()
