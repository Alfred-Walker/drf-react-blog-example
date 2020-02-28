from django.urls import reverse

import pytest

from rest_framework.test import APITestCase, force_authenticate
from rest_framework.test import APIRequestFactory

from studies.views import StudyViewSet
from studies.tests.factories import StudyFactory


class TestStudyViewSet(APITestCase):
    """Test of the TagViewSet"""
    @pytest.mark.django_db
    def test_get_study_list(self):
        # prepare user test data
        study_generated = StudyFactory()

        # ready for the request
        factory = APIRequestFactory()

        # https://www.django-rest-framework.org/api-guide/routers/#simplerouter
        study_list = StudyViewSet.as_view({'get': 'list'})

        url = "".join([
            reverse('study-list')
        ])
        request = factory.get(url)
        response = study_list(request)
        response_data = response.data

        print(response_data)
        assert response.status_code == 200, "HTTP status code 200"
        assert len(response_data['results']) > 0, "a study generated for the test"

        # test fields key check
        assert 'id' in response_data['results'][0].keys(), "id field test."
        assert 'url' in response_data['results'][0].keys(), "url field test."
        assert 'user' in response_data['results'][0].keys(), "user field test."
        assert 'title' in response_data['results'][0].keys(), "title field test."
        assert 'body' in response_data['results'][0].keys(), "body field test."
        assert 'tags' in response_data['results'][0].keys(), "tags field test."
        assert 'review_cycle_in_minute' in response_data['results'][0].keys(), "review_cycle_in_minute field test."
        assert 'notification_enabled' in response_data['results'][0].keys(), "notification_enabled field test."
        assert 'is_public' in response_data['results'][0].keys(), "is_public field test."
        assert 'registered_date' in response_data['results'][0].keys(), "registered_date field test."
        assert 'last_review_date' in response_data['results'][0].keys(), "last_review_date field test."

        # assert False, "dumb assert to make PyTest print my stuff"

        # FIXME: core api dependency warning related with 'itypes'
        # https://github.com/axnsan12/drf-yasg/issues/473
