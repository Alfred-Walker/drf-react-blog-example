from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response

from .serializers import *
from .models import Question


class IsDeleteQuestion(permissions.BasePermission):
    def has_permission(self, request, view):
        # can write custom code
        try:
            question = Question.objects.get(pk=view.kwargs['pk'])
        except ObjectDoesNotExist:
            return False

        if request.user.is_superuser or request.user == question.user:
            return True

        return False


class IsUpdateQuestion(permissions.BasePermission):
    def has_permission(self, request, view):
        # can write custom code
        try:
            question = Question.objects.get(pk=view.kwargs['pk'])
        except ObjectDoesNotExist:
            return False

        if request.user.is_superuser or request.user == question.user:
            return True

        return False


class QuestionViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = QuestionSerializer

    def get_permissions(self):
        if self.request.method == 'DELETE':
            self.permission_classes = (IsDeleteQuestion, )

        if self.request.method == 'PUT' or self.request.method == 'PATCH':
            self.permission_classes = (IsUpdateQuestion, )

        return super(QuestionViewSet, self).get_permissions()

    # HTTP GET /question/
    # HTTP GET /question/?search=
    def get_queryset(self):
        search = self.request.query_params.get('search', '')
        tag = self.request.query_params.get('tag', '')

        if search:
            criteria = (
                    Q(title__icontains=search) |
                    Q(body__icontains=search)
            )
        else:
            criteria = Q()
            # criteria = (Q(user_id=self.request.user.id))

        if tag:
            queryset = Question.objects.filter(criteria, Q(tags__name__exact=tag)).order_by('-registered_date')
        else:
            queryset = Question.objects.filter(criteria).order_by('-registered_date')

        return queryset

    # HTTP GET /question/123456(id)
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    # HTTP GET /question/last/
    @action(detail=False)
    def last(self, request):
        """
            Most recent question written by request user
        """
        if not request.user.is_authenticated:
            return Response('Unauthorized request.', status=401)

        queryset = self.get_queryset().filter(user=self.request.user).order_by('-registered_date').first()
        serializer = self.get_serializer(queryset, many=False)
        return Response(serializer.data)

    # HTTP GET /question/latest/
    @action(detail=False)
    def latest(self, request):
        """
            Single latest registered question
        """
        # queryset = self.get_queryset().order_by('-registered_date')[:1]
        queryset = self.get_queryset().first()
        serializer = self.get_serializer(queryset, many=False)
        return Response(serializer.data)

    # HTTP GET /question/recent/
    @action(detail=False)
    def recent(self, request):
        """
            Multiple questions ordered by registered date
        """
        queryset = self.get_queryset().order_by('-registered_date')
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = QuestionSummarySerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)

        serializer = QuestionSummarySerializer(queryset, many=True, context={'request': request})

        return Response(serializer.data)

    # HTTP GET /question/my/
    @action(detail=False)
    def my(self, request):
        """
            Questions written by the request user
        """
        if not request.user.is_authenticated:
            return Response('Unauthorized request.', status=401)

        queryset = self.get_queryset().filter(user=request.user).order_by('-registered_date')
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = QuestionSummarySerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)

        serializer = QuestionSummarySerializer(queryset, many=True, context={'request': request})

        return Response(serializer.data)

    # HTTP GET /question/12345(id)/edit/
    @action(detail=True)
    def edit(self, request, pk):
        """
            Retrieve instance to edit
        """
        if not request.user.is_authenticated:
            return Response('Unauthorized request.', status=401)

        try:
            instance = Question.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response('Internal server error. Object to edit not found.', status=500);

        serializer = self.get_serializer(instance)

        if request.user == instance.user or request.user.is_superuser:
            return Response(serializer.data)

        return Response('Access forbidden.', status=403)
