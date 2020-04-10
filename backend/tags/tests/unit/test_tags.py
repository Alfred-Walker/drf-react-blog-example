import pytest

from tags.tests.factories import TagFactory


class TestTags:
    @pytest.mark.django_db
    def test_tag(self):
        """Tests that we can obtain factory generated tag"""
        factory_generated = TagFactory()
        print(factory_generated)

        assert factory_generated is not None
        # assert False, "dumb assert to make PyTest print my stuff"
