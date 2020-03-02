import factory
import pytest

from users.serializers import (UserSerializer,
                               UserNicknameSerializer,
                               UserDetailSerializer,
                               UserRegistrationSerializerWithToken,
                               )

from users.tests.factories import UserFactory


@pytest.mark.django_db
class TestUserSerializer:
    def test_expected_fields(self):
        """Tests expected serializer fields
        email, nickname
        (id and url are for HyperlinkedModelSerializer, not included in validated_data.keys())
        """
        user_data = factory.build(dict, FACTORY_CLASS=UserFactory)
        serializer = UserSerializer(data=user_data, context={'request': None})
        is_valid = serializer.is_valid()

        # The serializer.data property is only valid if you have a saved instance to serializer.
        # Either call serializer.save() or use serializer.validated_data to access date prior to saving.
        # https://github.com/encode/django-rest-framework/issues/2964#issuecomment-138396361

        print("Errors: ", serializer.errors)
        assert is_valid, "serializer validation test"
        assert serializer.validated_data.keys() == set(['email', 'nickname'])
        # assert False, "dumb assert to make PyTest print my stuff"


@pytest.mark.django_db
class TestUserNicknameSerializer:
    def test_expected_fields(self):
        """Tests expected serializer fields for validated data
        nickname
        """
        user_data = factory.build(dict, FACTORY_CLASS=UserFactory)
        serializer = UserNicknameSerializer(data=user_data)
        is_valid = serializer.is_valid()

        # The serializer.data property is only valid if you have a saved instance to serializer.
        # Either call serializer.save() or use serializer.validated_data to access date prior to saving.
        # https://github.com/encode/django-rest-framework/issues/2964#issuecomment-138396361

        print("Errors: ", serializer.errors)
        assert is_valid, "serializer validation test"
        assert serializer.validated_data.keys() == set(['nickname'])
        # assert False, "dumb assert to make PyTest print my stuff"


@pytest.mark.django_db
class TestUserDetailSerializer:
    def test_expected_fields(self):
        """Tests expected serializer fields for validated data
        email
        """
        user_data = factory.build(dict, FACTORY_CLASS=UserFactory)
        serializer = UserDetailSerializer(data=user_data)
        is_valid = serializer.is_valid()

        # The serializer.data property is only valid if you have a saved instance to serializer.
        # Either call serializer.save() or use serializer.validated_data to access date prior to saving.
        # https://github.com/encode/django-rest-framework/issues/2964#issuecomment-138396361

        print("Errors: ", serializer.errors)
        assert is_valid, "serializer validation test"
        assert serializer.validated_data.keys() == set(['email'])
        # assert False, "dumb assert to make PyTest print my stuff"


@pytest.mark.django_db
class TestUserRegistrationSerializerWithToken:
    def test_expected_fields(self):
        """Tests expected serializer fields for validated data
        email, nickname
        (id and url are for HyperlinkedModelSerializer, not included in validated_data.keys())
        """
        user_data ={'password1': 'qwqert13', 'password2': 'qwqert13', 'email': "test@test.com"}
        serializer = UserRegistrationSerializerWithToken(data=user_data)
        is_valid = serializer.is_valid()

        # The serializer.data property is only valid if you have a saved instance to serializer.
        # Either call serializer.save() or use serializer.validated_data to access date prior to saving.
        # https://github.com/encode/django-rest-framework/issues/2964#issuecomment-138396361

        print("Errors: ", serializer.errors)
        assert is_valid, "serializer validation test"
        assert serializer.validated_data.keys() == set(['email', 'password1', 'password2'])
        # assert False, "dumb assert to make PyTest print my stuff"

    def test_password_common(self):
        """Passwords validation (common and unsafe combination of characters)"""
        user_data = {'password1': 'abcdefgh', 'password2': 'abcdefgh', 'email': "test@test.com"}
        serializer = UserRegistrationSerializerWithToken(data=user_data)
        is_valid = serializer.is_valid()

        # The serializer.data property is only valid if you have a saved instance to serializer.
        # Either call serializer.save() or use serializer.validated_data to access date prior to saving.
        # https://github.com/encode/django-rest-framework/issues/2964#issuecomment-138396361

        print("Errors: ", serializer.errors)
        assert not is_valid, "serializer validation test"
        # assert False, "dumb assert to make PyTest print my stuff"

    def test_password_length(self):
        """Passwords validation (short length of characters)"""
        user_data = {'password1': 'ab', 'password2': 'ab', 'email': "test@test.com"}
        serializer = UserRegistrationSerializerWithToken(data=user_data)
        is_valid = serializer.is_valid()

        # The serializer.data property is only valid if you have a saved instance to serializer.
        # Either call serializer.save() or use serializer.validated_data to access date prior to saving.
        # https://github.com/encode/django-rest-framework/issues/2964#issuecomment-138396361

        print("Errors: ", serializer.errors)
        assert not is_valid, "serializer validation test"
        # assert False, "dumb assert to make PyTest print my stuff"

    def test_password_match(self):
        """Passwords validation (the match of password 1 and password 2)"""
        user_data = {'password1': 'qwqert13', 'password2': 'qwqert1444', 'email': "test@test.com"}
        serializer = UserRegistrationSerializerWithToken(data=user_data)
        is_valid = serializer.is_valid()

        # The serializer.data property is only valid if you have a saved instance to serializer.
        # Either call serializer.save() or use serializer.validated_data to access date prior to saving.
        # https://github.com/encode/django-rest-framework/issues/2964#issuecomment-138396361

        print("Errors: ", serializer.errors)
        assert not is_valid, "serializer validation test"
        # assert False, "dumb assert to make PyTest print my stuff"
