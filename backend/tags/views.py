from django.db.models import Count, F, Q
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response

from .serializers import *
from .models import Tag

from studies.serializers import StudySummarySerializer
from questions.serializers import QuestionSummarySerializer


from itertools import chain


class TagPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100000


class TagViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    # permission_classes = (AllowAny,)
    serializer_class = TagSerializer

    pagination_class = TagPagination

    # HTTP GET /tag/
    # HTTP GET /tag/?search=
    def get_queryset(self):
        search = self.request.query_params.get('search', '')

        if search:
            criteria = (Q(name__icontains=search) | Q(body__icontains=search))
        else:
            if self.request.user.is_superuser:
                criteria = Q()
            else:
                criteria = (Q(is_public=True))

        queryset = Tag.objects.filter(criteria).order_by('name')

        return queryset

    # HTTP GET /tag/popular/
    # return popular tags (at most 5)
    @action(detail=False)
    def popular(self, request):
        count = 5
        queryset = self.get_queryset()\
                       .filter(is_public=True)\
                       .annotate(study_count=Count('studies')) \
                       .annotate(question_count=Count('questions')) \
                       .annotate(total_count=F('study_count') + F('question_count')) \
                       .order_by('-total_count')[:count]

        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)

    # HTTP GET /tag/random/
    @action(detail=False)
    def random(self, request):
        count = self.request.query_params.get('count', '')

        if count:
            count = min(max(0, int(count)), 20)
        else:
            count = 10

        queryset = self.get_queryset().filter(is_public=True).order_by('?')[:count]

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # HTTP GET /tag/related/
    @action(detail=False)
    def related(self, request):
        tag_name = self.request.query_params.get('tag', '')
        tag = self.get_queryset().get(name=tag_name, is_public=True)
        if tag:
            studies = tag.studies.all()
            questions = tag.questions.all()
            study_serializer = StudySummarySerializer(studies, many=True, context={'request': request})
            question_serializer = QuestionSummarySerializer(questions, many=True, context={'request': request})

            return Response({"study": study_serializer.data, "question": question_serializer.data})
        else:
            return Response(chain([{"study": []}], [{"question": []}]))

    # HTTP GET /tag/study/
    @action(detail=False)
    def study(self, request):
        tag_name = self.request.query_params.get('tag', '')
        tag = self.get_queryset().get(name=tag_name, is_public=True)

        queryset = None

        if tag:
            queryset = tag.studies.all().order_by('-registered_date')

        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = StudySummarySerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)

        serializer = StudySummarySerializer(many=True, context={'request': request})

        return Response(serializer.data)

    # HTTP GET /tag/question/
    @action(detail=False)
    def question(self, request):
        tag_name = self.request.query_params.get('tag', '')
        tag = self.get_queryset().get(name=tag_name, is_public=True)

        queryset = None

        if tag:
            queryset = tag.questions.all().order_by('-registered_date')

        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = QuestionSummarySerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)

        serializer = QuestionSummarySerializer(many=True, context={'request': request})

        return Response(serializer.data)
