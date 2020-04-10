from django.urls import reverse

import pytest

from rest_framework.test import APITestCase, force_authenticate
from rest_framework.test import APIRequestFactory

from tags.views import TagViewSet
from tags.tests.factories import TagFactory


class TestTagViewSet(APITestCase):
    """Test of the TagViewSet"""
    @pytest.mark.django_db
    def test_get_tag_list(self):
        # prepare user test data
        tag_generated = TagFactory()

        # ready for the request
        factory = APIRequestFactory()

        # https://www.django-rest-framework.org/api-guide/routers/#simplerouter
        tag_list = TagViewSet.as_view({'get': 'list'})

        url = "".join([
            reverse('users-list')
        ])
        request = factory.get(url)
        response = tag_list(request)
        response_data = response.data

        print(response_data)
        assert response.status_code == 200, "HTTP status code 200"
        assert len(response_data['results']) > 0, "a tag generated for the test"

        # test fields key check
        assert 'name' in response_data['results'][0].keys(), "name field test."
        assert 'is_public' in response_data['results'][0].keys(), "is_public field test."

        # read only fields check
        assert 'study_count' not in response_data['results'][0].keys(), "study_count field test."
        assert 'question_count' not in response_data['results'][0].keys(), "question_count field test."
        assert 'total_count' not in response_data['results'][0].keys(), "total_count field test."

        # assert False, "dumb assert to make PyTest print my stuff"

        # FIXME: core api dependency warning related with 'itypes'
        # https://github.com/axnsan12/drf-yasg/issues/473
