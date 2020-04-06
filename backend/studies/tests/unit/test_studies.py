import pytest

from studies.tests.factories import StudyFactory


class TestStudies:
    @pytest.mark.django_db
    def test_study(self):
        """Tests that we can obtain factory generated study"""
        factory_generated = StudyFactory()
        print(factory_generated)
        print("registered_date: ", factory_generated.registered_date)

        assert factory_generated is not None
        # assert False, "dumb assert to make PyTest print my stuff"
