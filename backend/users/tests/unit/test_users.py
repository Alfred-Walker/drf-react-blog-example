import pytest

from users.tests.factories import UserFactory


class TestUsers:
    @pytest.mark.django_db
    def test_user(self):
        """Tests that we can obtain factory generated user"""
        factory_generated = UserFactory()
        print(factory_generated)

        assert factory_generated is not None
        # assert False, "dumb assert to make PyTest print my stuff"
