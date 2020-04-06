import datetime
import pytest
import unittest.mock as mock

from django.urls import reverse
from django.utils import timezone

from rest_framework.test import APITestCase, APIRequestFactory, force_authenticate

from studies.views import StudyViewSet
from studies.tests.factories import StudyFactory

from users.tests.factories import UserFactory


class TestStudyViewSet(APITestCase):
    """Test of the StudyViewSet"""
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
        assert 'is_public' in response_data['results'][0].keys(), "is_public field test."
        assert 'comment' in response_data['results'][0].keys(), "comment field test."
        assert 'registered_date' in response_data['results'][0].keys(), "registered_date field test."
        assert 'last_edit_date' in response_data['results'][0].keys(), "last_edit_date field test."

        # assert False, "dumb assert to make PyTest print my stuff"

        # FIXME: core api dependency warning related with 'itypes'
        # https://github.com/axnsan12/drf-yasg/issues/473

    @pytest.mark.django_db
    def test_public(self):
        # prepare test data
        public_study = StudyFactory(is_public=True)
        private_study = StudyFactory(is_public=False)

        # ready for the request
        factory = APIRequestFactory()

        # https://www.django-rest-framework.org/api-guide/routers/#simplerouter
        view = StudyViewSet.as_view({'get': 'public'})

        url = "".join([
            reverse('study-public')
        ])
        request = factory.get(url)

        response = view(request)
        response_data = response.data

        assert response.status_code == 200, "HTTP status code 200"

        # test fields key check
        assert 'id' in response_data[0].keys(), "id field test."
        assert 'url' in response_data[0].keys(), "url field test."
        assert 'user' in response_data[0].keys(), "user field test."
        assert 'title' in response_data[0].keys(), "title field test."
        assert 'body' in response_data[0].keys(), "body field test."
        assert 'tags' in response_data[0].keys(), "tags field test."
        assert 'comment' in response_data[0].keys(), "comment field test."
        assert 'registered_date' in response_data[0].keys(), "registered_date field test."

        # test count
        assert len(response_data) == 1, "study count test."

        # assert False, "dumb assert to make PyTest print my stuff"

        # FIXME: core api dependency warning related with 'itypes'
        # https://github.com/axnsan12/drf-yasg/issues/473

    @pytest.mark.django_db
    def test_private(self):
        # prepare test data
        correct_user = UserFactory(
            email="correct@user.com",
            nickname="correct tester",
            is_active=True,
            is_admin=False
        )
        wrong_user = UserFactory(
            email="wrong@user.com",
            nickname="wrong tester",
            is_active=True,
            is_admin=False
        )

        correct_user_public_study = StudyFactory(is_public=True, user=correct_user)
        correct_user_public_study = StudyFactory(is_public=True, user=correct_user)
        correct_user_private_study = StudyFactory(is_public=False, user=correct_user)
        correct_user_private_study = StudyFactory(is_public=False, user=correct_user)
        correct_user_private_study = StudyFactory(is_public=False, user=correct_user)
        wrong_user_study = StudyFactory(is_public=False, user=wrong_user)

        # ready for the request
        factory = APIRequestFactory()

        # https://www.django-rest-framework.org/api-guide/routers/#simplerouter
        view = StudyViewSet.as_view({'get': 'private'})

        url = "".join([
            reverse('study-private')
        ])
        request = factory.get(url)
        force_authenticate(request, user=correct_user)
        response = view(request)
        response_data = response.data

        assert response.status_code == 200, "HTTP status code 200"

        # test fields key check
        assert 'id' in response_data[0].keys(), "id field test."
        assert 'url' in response_data[0].keys(), "url field test."
        assert 'user' in response_data[0].keys(), "user field test."
        assert 'title' in response_data[0].keys(), "title field test."
        assert 'body' in response_data[0].keys(), "body field test."
        assert 'tags' in response_data[0].keys(), "tags field test."
        assert 'comment' in response_data[0].keys(), "comment field test."
        assert 'registered_date' in response_data[0].keys(), "registered_date field test."

        # test count
        assert len(response_data) == 3, "study count test."

        # assert False, "dumb assert to make PyTest print my stuff"

        # FIXME: core api dependency warning related with 'itypes'
        # https://github.com/axnsan12/drf-yasg/issues/473

    @pytest.mark.django_db
    def test_last(self):
        # prepare test data
        test_user = UserFactory(
            email="abcd@efg.com",
            nickname="tester",
            is_active=True,
            is_admin=False
        )

        # prepare timezone-aware datetime
        date_format = "%Y-%m-%d %H:%M:%S"
        oldest_datetime = datetime.datetime.strptime("2020-03-07 20:01:36", date_format)
        oldest_datetime = timezone.make_aware(oldest_datetime)

        middle_datetime = datetime.datetime.strptime("2020-03-07 20:01:37", date_format)
        middle_datetime = timezone.make_aware(middle_datetime)

        last_datetime = datetime.datetime.strptime("2020-03-07 20:01:38", date_format)
        last_datetime = timezone.make_aware(last_datetime)

        # fake current datetime with mock
        with mock.patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = oldest_datetime
            oldest_study = StudyFactory(user=test_user)

        # fake current datetime with mock
        with mock.patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = middle_datetime
            middle_study = StudyFactory(user=test_user)

        # fake current datetime with mock
        with mock.patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = last_datetime
            last_study = StudyFactory(user=test_user)

        # ready for the request
        factory = APIRequestFactory()

        # https://www.django-rest-framework.org/api-guide/routers/#simplerouter
        view = StudyViewSet.as_view({'get': 'last'})

        url = "".join([
            reverse('study-last')
        ])
        request = factory.get(url)
        force_authenticate(request, user=test_user)
        response = view(request)
        response_data = response.data

        assert response.status_code == 200, "HTTP status code 200"

        # test fields key check
        assert 'id' in response_data.keys(), "id field test."
        assert 'url' in response_data.keys(), "url field test."
        assert 'user' in response_data.keys(), "user field test."
        assert 'title' in response_data.keys(), "title field test."
        assert 'body' in response_data.keys(), "body field test."
        assert 'tags' in response_data.keys(), "tags field test."
        assert 'comment' in response_data.keys(), "comment field test."
        assert 'registered_date' in response_data.keys(), "registered_date field test."

        # test study's author
        assert test_user.__dict__['id'] == response_data['user']['id'], "valid author test."

        # test whether the study is last or not
        assert oldest_study.__dict__['id'] != response_data['id'], "first study test."
        assert middle_study.__dict__['id'] != response_data['id'], "second study test."
        assert last_study.__dict__['id'] == response_data['id'], "last study test."

        # assert False, "dumb assert to make PyTest print my stuff"

        # FIXME: core api dependency warning related with 'itypes'
        # https://github.com/axnsan12/drf-yasg/issues/473

    @pytest.mark.django_db
    def test_latest(self):
        # prepare test data
        # prepare timezone-aware datetime
        date_format = "%Y-%m-%d %H:%M:%S"
        oldest_datetime = datetime.datetime.strptime("2020-03-07 20:01:36", date_format)
        oldest_datetime = timezone.make_aware(oldest_datetime)

        middle_datetime = datetime.datetime.strptime("2020-03-07 20:01:37", date_format)
        middle_datetime = timezone.make_aware(middle_datetime)

        latest_datetime = datetime.datetime.strptime("2020-03-07 20:01:38", date_format)
        latest_datetime = timezone.make_aware(latest_datetime)

        # fake current datetime with mock
        with mock.patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = oldest_datetime
            oldest_study = StudyFactory()

        # fake current datetime with mock
        with mock.patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = middle_datetime
            middle_study = StudyFactory()

        # fake current datetime with mock
        with mock.patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = latest_datetime
            latest_study = StudyFactory()

        # ready for the request
        request_factory = APIRequestFactory()

        # https://www.django-rest-framework.org/api-guide/routers/#simplerouter
        view = StudyViewSet.as_view({'get': 'latest'})

        url = "".join([
            reverse('study-latest')
        ])
        request = request_factory.get(url)
        response = view(request)
        response_data = response.data

        assert response.status_code == 200, "HTTP status code 200"

        # test fields key check
        assert 'id' in response_data.keys(), "id field test."
        assert 'url' in response_data.keys(), "url field test."
        assert 'user' in response_data.keys(), "user field test."
        assert 'title' in response_data.keys(), "title field test."
        assert 'body' in response_data.keys(), "body field test."
        assert 'tags' in response_data.keys(), "tags field test."
        assert 'comment' in response_data.keys(), "comment field test."
        assert 'registered_date' in response_data.keys(), "registered_date field test."

        # test whether the study is latest or not
        assert oldest_study.__dict__['id'] != response_data['id'], "study order test."
        assert middle_study.__dict__['id'] != response_data['id'], "study order test."
        assert latest_study.__dict__['id'] == response_data['id'], "study order test."

        # assert False, "dumb assert to make PyTest print my stuff"

        # FIXME: core api dependency warning related with 'itypes'
        # https://github.com/axnsan12/drf-yasg/issues/473

    @pytest.mark.django_db
    def test_recent(self):
        # prepare test data
        date_format = "%Y-%m-%d %H:%M:%S"
        oldest_datetime = datetime.datetime.strptime("2020-03-07 20:01:36", date_format)
        oldest_datetime = timezone.make_aware(oldest_datetime)

        middle_datetime = datetime.datetime.strptime("2020-03-07 20:01:37", date_format)
        middle_datetime = timezone.make_aware(middle_datetime)

        latest_datetime = datetime.datetime.strptime("2020-03-07 20:01:38", date_format)
        latest_datetime = timezone.make_aware(latest_datetime)

        # fake current datetime with mock
        with mock.patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = oldest_datetime
            oldest_study = StudyFactory()

        # fake current datetime with mock
        with mock.patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = middle_datetime
            middle_study = StudyFactory()

        # fake current datetime with mock
        with mock.patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = latest_datetime
            latest_study = StudyFactory()

        # ready for the request
        request_factory = APIRequestFactory()

        # https://www.django-rest-framework.org/api-guide/routers/#simplerouter
        view = StudyViewSet.as_view({'get': 'recent'})

        url = "".join([
            reverse('study-recent')
        ])
        request = request_factory.get(url)
        response = view(request)
        response_data = response.data

        assert response.status_code == 200, "HTTP status code 200"

        print(response_data)

        # test fields key check
        assert 'id' in response_data['results'][0].keys(), "id field test."
        assert 'url' in response_data['results'][0].keys(), "url field test."
        assert 'user' in response_data['results'][0].keys(), "user field test."
        assert 'title' in response_data['results'][0].keys(), "title field test."
        assert 'tags' in response_data['results'][0].keys(), "tags field test."
        assert 'registered_date' in response_data['results'][0].keys(), "registered_date field test."

        # test count
        assert response_data['count'] == 3, "study count test."

        # test ordering
        date_first = datetime.datetime.strptime(response_data['results'][0]['registered_date'], date_format)
        date_second = datetime.datetime.strptime(response_data['results'][1]['registered_date'], date_format)
        date_third = datetime.datetime.strptime(response_data['results'][2]['registered_date'], date_format)

        assert date_first >= date_second, "first order test."
        assert date_second >= date_third, "second order test."

        # assert False, "dumb assert to make PyTest print my stuff"

        # FIXME: core api dependency warning related with 'itypes'
        # https://github.com/axnsan12/drf-yasg/issues/473

    @pytest.mark.django_db
    def test_my(self):
        # prepare test data
        correct_user = UserFactory(
            email="correct@user.com",
            nickname="correct tester",
            is_active=True,
            is_admin=False
        )

        wrong_user = UserFactory(
            email="wrong@user.com",
            nickname="wrong tester",
            is_active=True,
            is_admin=False
        )

        # user initialization
        correct_user_study = StudyFactory(user=correct_user)
        correct_user_study = StudyFactory(user=correct_user)
        wrong_user_study = StudyFactory(user=wrong_user)

        # ready for the request
        factory = APIRequestFactory()

        # https://www.django-rest-framework.org/api-guide/routers/#simplerouter
        view = StudyViewSet.as_view({'get': 'my'})

        url = "".join([
            reverse('study-my')
        ])
        request = factory.get(url)
        force_authenticate(request, user=correct_user)
        response = view(request)
        response_data = response.data

        assert response.status_code == 200, "HTTP status code 200"

        # test fields key check
        assert 'id' in response_data['results'][0].keys(), "id field test."
        assert 'url' in response_data['results'][0].keys(), "url field test."
        assert 'user' in response_data['results'][0].keys(), "user field test."
        assert 'title' in response_data['results'][0].keys(), "title field test."
        assert 'tags' in response_data['results'][0].keys(), "tags field test."
        assert 'registered_date' in response_data['results'][0].keys(), "registered_date field test."

        # test count
        assert response_data['count'] == 2, "study count test."

        # test study's author
        assert correct_user.__dict__['id'] == response_data['results'][0]['user']['id'], "valid author test."
        assert correct_user.__dict__['id'] == response_data['results'][1]['user']['id'], "valid author test."
        assert wrong_user.__dict__['id'] != response_data['results'][0]['user']['id'], "valid author test."
        assert wrong_user.__dict__['id'] != response_data['results'][1]['user']['id'], "valid author test."

        # assert False, "dumb assert to make PyTest print my stuff"

        # FIXME: core api dependency warning related with 'itypes'
        # https://github.com/axnsan12/drf-yasg/issues/473
