from django.urls import reverse

import pytest

from rest_framework.test import APITestCase, force_authenticate
from rest_framework.test import APIRequestFactory

from comments.views import CommentViewSet
from comments.tests.factories import CommentFactory


class TestCommentViewSet(APITestCase):
    """Test of the TagViewSet"""
    @pytest.mark.django_db
    def test_get_comment_list(self):
        # prepare user test data
        comment_generated = CommentFactory()

        # ready for the request
        factory = APIRequestFactory()

        # https://www.django-rest-framework.org/api-guide/routers/#simplerouter
        comment_list = CommentViewSet.as_view({'get': 'list'})

        url = "".join([
            reverse('comment-list')
        ])
        request = factory.get(url)
        response = comment_list(request)
        response_data = response.data

        print(response_data)
        assert response.status_code == 200, "HTTP status code 200"
        assert len(response_data['results']) > 0, "a comment generated for the test"

        # test fields key check
        assert 'id' in response_data['results'][0].keys(), "id field test."
        assert 'user' in response_data['results'][0].keys(), "user field test."
        assert 'text' in response_data['results'][0].keys(), "text field test."
        assert 'created_date' in response_data['results'][0].keys(), "created_date field test."
        assert 'parent_comment' in response_data['results'][0].keys(), "parent_comment field test."
        assert 'is_active' in response_data['results'][0].keys(), "is_active field test."
        assert 'is_public' in response_data['results'][0].keys(), "is_public field test."

        # assert False, "dumb assert to make PyTest print my stuff"

        # FIXME: core api dependency warning related with 'itypes'
        # https://github.com/axnsan12/drf-yasg/issues/473
