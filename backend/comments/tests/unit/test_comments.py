import pytest

from comments.tests.factories import CommentFactory


class TestComments:
    @pytest.mark.django_db
    def test_comment(self):
        """Tests that we can obtain factory generated comment"""
        factory_generated = CommentFactory()
        print(factory_generated)

        assert factory_generated is not None
        # assert False, "dumb assert to make PyTest print my stuff"
