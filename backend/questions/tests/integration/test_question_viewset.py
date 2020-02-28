from django.urls import reverse

import pytest

from rest_framework.test import APITestCase, force_authenticate
from rest_framework.test import APIRequestFactory

from questions.views import QuestionViewSet
from questions.tests.factories import QuestionFactory


class TestQuestionViewSet(APITestCase):
    """Test of the TagViewSet"""
    @pytest.mark.django_db
    def test_get_question_list(self):
        # prepare user test data
        question_generated = QuestionFactory()

        # ready for the request
        factory = APIRequestFactory()

        # https://www.django-rest-framework.org/api-guide/routers/#simplerouter
        question_list = QuestionViewSet.as_view({'get': 'list'})

        url = "".join([
            reverse('question-list')
        ])
        request = factory.get(url)
        response = question_list(request)
        response_data = response.data

        print(response_data)
        assert response.status_code == 200, "HTTP status code 200"
        assert len(response_data['results']) > 0, "a question generated for the test"

        # test fields key check
        assert 'id' in response_data['results'][0].keys(), "id field test."
        assert 'url' in response_data['results'][0].keys(), "url field test."
        assert 'user' in response_data['results'][0].keys(), "user field test."
        assert 'title' in response_data['results'][0].keys(), "title field test."
        assert 'body' in response_data['results'][0].keys(), "body field test."
        assert 'tags' in response_data['results'][0].keys(), "tags field test."
        assert 'comment' in response_data['results'][0].keys(), "comment field test."
        assert 'registered_date' in response_data['results'][0].keys(), "registered_date field test."

        # assert False, "dumb assert to make PyTest print my stuff"

        # FIXME: core api dependency warning related with 'itypes'
        # https://github.com/axnsan12/drf-yasg/issues/473
