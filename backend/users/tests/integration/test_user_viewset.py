from django.urls import reverse

import pytest


from rest_framework.test import APITestCase, force_authenticate
from rest_framework.test import APIRequestFactory

from users.views import UserViewSet
from users.tests.factories import UserFactory


class TestUserViewSet(APITestCase):
    """Test of the UserViewSet"""
    @pytest.mark.django_db
    def test_get_user(self):
        """non-admin user(s) only can get data of their own"""
        # prepare user test data
        test_user = UserFactory(
            email="abcd@efg.com",
            nickname="tester",
            is_active=True,
            is_admin=False
        )

        dummy_user = UserFactory()
        dummy_user = UserFactory()
        dummy_user = UserFactory()

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
        assert response_data['count'] == 1, "single user data of the request user"

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

    @pytest.mark.django_db
    def test_get_user_by_admin(self):
        """admin user(s) can get a complete list of users"""
        # prepare user test data
        administrator = UserFactory(
            email="abcd@efg.com",
            nickname="tester",
            is_active=True,
            is_admin=True
        )

        dummy_user = UserFactory()
        dummy_user = UserFactory()
        dummy_user = UserFactory()

        # ready for the request
        factory = APIRequestFactory()

        # https://www.django-rest-framework.org/api-guide/routers/#simplerouter
        user_list = UserViewSet.as_view({'get': 'list'})

        url = "".join([
            reverse('users-list')
        ])
        request = factory.get(url)
        force_authenticate(request, user=administrator)
        response = user_list(request)
        response_data = response.data

        print(response_data)
        assert response.status_code == 200, "HTTP status code 200"
        assert response_data['count'] == 4, "whole user data including dummy users"

        # test fields must exist
        assert 'email' in response_data['results'][0].keys(), "email field test."
        assert 'nickname' in response_data['results'][0].keys(), "nickname field test."

        # test fields key check
        assert 'date_joined' not in response_data['results'][0].keys(), "date_joined field test."
        assert 'is_active' not in response_data['results'][0].keys(), "is_active field test."
        assert 'is_admin' not in response_data['results'][0].keys(), "is_admin field test."

        # assert False, "dumb assert to make PyTest print my stuff"

        # FIXME: core api dependency warning related with 'itypes'
        # https://github.com/axnsan12/drf-yasg/issues/473
