# Create your views here.
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly
from .serializers import UserSerializer
from .models import User


class IsDeleteUser(permissions.BasePermission):
    def has_permission(self, request, view):
        # can write custom code
        try:
            user = User.objects.get(pk=view.kwargs['pk'])
        except ObjectDoesNotExist:
            return False

        if request.user.is_superuser or request.user == user:
            return True

        return False


class IsUpdateUser(permissions.BasePermission):
    def has_permission(self, request, view):
        # can write custom code
        try:
            user = User.objects.get(pk=view.kwargs['pk'])
        except ObjectDoesNotExist:
            return False

        if request.user.is_superuser or request.user == user:
            return True

        return False


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get_permissions(self):
        if self.request.method == 'DELETE':
            self.permission_classes = (IsDeleteUser, )

        if self.request.method == 'PUT' or self.request.method == 'PATCH':
            self.permission_classes = (IsUpdateUser, )

        return super(UserViewSet, self).get_permissions()

    def get_queryset(self):
        if self.request.user.is_admin:
            return User.objects.all().order_by('-date_joined')
        else:
            return User.objects.filter(id=self.request.user.id).order_by('-date_joined')

    serializer_class = UserSerializer
