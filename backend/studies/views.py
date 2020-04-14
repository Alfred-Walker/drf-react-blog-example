from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response

from .serializers import *
from .models import Study


class IsDeleteStudy(permissions.BasePermission):
    def has_permission(self, request, view):
        # can write custom code
        try:
            study = Study.objects.get(pk=view.kwargs['pk'])
        except ObjectDoesNotExist:
            return False

        if request.user.is_superuser or request.user == study.user:
            return True

        return False


class IsUpdateStudy(permissions.BasePermission):
    def has_permission(self, request, view):
        # can write custom code
        try:
            study = Study.objects.get(pk=view.kwargs['pk'])
        except ObjectDoesNotExist:
            return False

        if request.user.is_superuser or request.user == study.user:
            return True

        return False


class StudyViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = StudySerializer

    def get_permissions(self):
        if self.request.method == 'DELETE':
            self.permission_classes = (IsDeleteStudy, )

        if self.request.method == 'PUT' or self.request.method == 'PATCH':
            self.permission_classes = (IsUpdateStudy, )

        return super(StudyViewSet, self).get_permissions()

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

        if tag:
            queryset = Study.objects.filter(criteria, Q(tags__name__exact=tag)).order_by('-registered_date')
        else:
            queryset = Study.objects.filter(criteria).order_by('-registered_date')

        return queryset

    # HTTP GET /study/123456(id)
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    # After DRF 3.8, list_route and detail_route have been merge into a single action decorator.
    # Replace detail_route uses with @action(detail=True).
    # Replace list_route uses with @action(detail=False).

    # HTTP GET /study/public/
    @action(detail=False)
    def public(self, request):
        """
            A whole public studies
        """
        queryset = Study.objects.filter(is_public=True).order_by('-registered_date')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # HTTP GET /study/private/
    @action(detail=False)
    def private(self, request):
        """
            A list of non-public studies written by request user
        """
        if not request.user.is_authenticated:
            return Response('Unauthorized request.', status=401)

        queryset = self.get_queryset().filter(is_public=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # HTTP GET /study/last/
    @action(detail=False)
    def last(self, request):
        """
            Most recent study written by request user
        """
        if not request.user.is_authenticated:
            return Response('Unauthorized request.', status=401)

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

    # HTTP GET /study/recent/
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

    # HTTP GET /study/my/
    @action(detail=False)
    def my(self, request):
        """
            Studies written by the request user
        """
        if not request.user.is_authenticated:
            return Response('Unauthorized request.', status=401)

        queryset = self.get_queryset().filter(user=request.user).order_by('-registered_date')
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = StudySummarySerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)

        serializer = StudySummarySerializer(queryset, many=True, context={'request': request})

        return Response(serializer.data)

    # HTTP GET /study/12345(id)/edit/
    @action(detail=True)
    def edit(self, request, pk):
        """
            Retrieve instance to edit
        """
        if not request.user.is_authenticated:
            return Response('Unauthorized request.', status=401)

        try:
            instance = Study.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response('Internal server error. Object to edit not found.', status=500);

        serializer = self.get_serializer(instance)

        if request.user == instance.user or request.user.is_superuser:
            return Response(serializer.data)

        return Response('Access forbidden.', status=403)
