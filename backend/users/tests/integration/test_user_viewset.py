from django.urls import reverse

import pytest

from rest_framework.test import APITestCase, force_authenticate
from rest_framework.test import APIRequestFactory

from users.views import UserViewSet
from users.tests.factories import UserFactory


class TestUserViewSet(APITestCase):
    """Test of the UserViewSet"""
    @pytest.mark.django_db
    def test_get_user_list(self):
        # prepare user test data
        test_user = UserFactory(
            email="abcd@efg.com",
            nickname="tester",
            is_active=True,
            is_admin=True
        )

        # ready for the request
        factory = APIRequestFactory()

        # https://www.django-rest-framework.org/api-guide/routers/#simplerouter
        user_list = UserViewSet.as_view({'get': 'list'})

        url = "".join([
            reverse('users-list')
        ])
        request = factory.get(url)
        force_authenticate(request, user=test_user)
        response = user_list(request)
        response_data = response.data

        print(response_data)
        assert response.status_code == 200, "HTTP status code 200"
        assert len(response_data['results']) == 1, "single user data of the request user"

        # test fields must exist
        assert response_data['results'][0]['email'] == "abcd@efg.com", "email field test."
        assert response_data['results'][0]['nickname'] == "tester", "nickname field test."

        # test fields key check
        assert 'date_joined' not in response_data['results'][0].keys(), "date_joined field test."
        assert 'is_active' not in response_data['results'][0].keys(), "is_active field test."
        assert 'is_admin' not in response_data['results'][0].keys(), "is_admin field test."

        # assert False, "dumb assert to make PyTest print my stuff"

        # FIXME: core api dependency warning related with 'itypes'
        # https://github.com/axnsan12/drf-yasg/issues/473
