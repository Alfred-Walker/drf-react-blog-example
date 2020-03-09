import datetime
import pytest
import unittest.mock as mock

from django.urls import reverse
from django.utils import timezone

from rest_framework.test import APITestCase, APIRequestFactory, force_authenticate

from questions.views import QuestionViewSet
from questions.tests.factories import QuestionFactory

from users.tests.factories import UserFactory


class TestQuestionViewSet(APITestCase):
    """Test of the QuestionViewSet"""
    @pytest.mark.django_db
    def test_get_question_list(self):
        # prepare test data
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
            oldest_question = QuestionFactory(user=test_user)

        # fake current datetime with mock
        with mock.patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = middle_datetime
            middle_question = QuestionFactory(user=test_user)

        # fake current datetime with mock
        with mock.patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = last_datetime
            last_question = QuestionFactory(user=test_user)

        # ready for the request
        factory = APIRequestFactory()

        # https://www.django-rest-framework.org/api-guide/routers/#simplerouter
        view = QuestionViewSet.as_view({'get': 'last'})

        url = "".join([
            reverse('question-last')
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

        # test question's author
        assert test_user.__dict__['id'] == response_data['user']['id'], "valid author test."

        # test whether the question is last or not
        assert oldest_question.__dict__['id'] != response_data['id'], "first question test."
        assert middle_question.__dict__['id'] != response_data['id'], "second question test."
        assert last_question.__dict__['id'] == response_data['id'], "last question test."

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
            oldest_question = QuestionFactory()

        # fake current datetime with mock
        with mock.patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = middle_datetime
            middle_question = QuestionFactory()

        # fake current datetime with mock
        with mock.patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = latest_datetime
            latest_question = QuestionFactory()

        # ready for the request
        request_factory = APIRequestFactory()

        # https://www.django-rest-framework.org/api-guide/routers/#simplerouter
        view = QuestionViewSet.as_view({'get': 'latest'})

        url = "".join([
            reverse('question-latest')
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

        # test whether the question is latest or not
        assert oldest_question.__dict__['id'] != response_data['id'], "question order test."
        assert middle_question.__dict__['id'] != response_data['id'], "question order test."
        assert latest_question.__dict__['id'] == response_data['id'], "question order test."

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
            oldest_question = QuestionFactory()

        # fake current datetime with mock
        with mock.patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = middle_datetime
            middle_question = QuestionFactory()

        # fake current datetime with mock
        with mock.patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = latest_datetime
            latest_question = QuestionFactory()

        # ready for the request
        request_factory = APIRequestFactory()

        # https://www.django-rest-framework.org/api-guide/routers/#simplerouter
        view = QuestionViewSet.as_view({'get': 'recent'})

        url = "".join([
            reverse('question-recent')
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
        assert response_data['count'] == 3, "question count test."

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
        correct_user_question = QuestionFactory(user=correct_user)
        correct_user_question = QuestionFactory(user=correct_user)
        wrong_user_question = QuestionFactory(user=wrong_user)

        # ready for the request
        factory = APIRequestFactory()

        # https://www.django-rest-framework.org/api-guide/routers/#simplerouter
        view = QuestionViewSet.as_view({'get': 'my'})

        url = "".join([
            reverse('question-my')
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
        assert response_data['count'] == 2, "question count test."

        # test question's author
        assert correct_user.__dict__['id'] == response_data['results'][0]['user']['id'], "valid author test."
        assert correct_user.__dict__['id'] == response_data['results'][1]['user']['id'], "valid author test."
        assert wrong_user.__dict__['id'] != response_data['results'][0]['user']['id'], "valid author test."
        assert wrong_user.__dict__['id'] != response_data['results'][1]['user']['id'], "valid author test."

        # assert False, "dumb assert to make PyTest print my stuff"

        # FIXME: core api dependency warning related with 'itypes'
        # https://github.com/axnsan12/drf-yasg/issues/473
