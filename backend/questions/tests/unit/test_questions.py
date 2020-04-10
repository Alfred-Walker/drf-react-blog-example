import pytest

from questions.tests.factories import QuestionFactory


class TestQuestions:
    @pytest.mark.django_db
    def test_question(self):
        """Tests that we can obtain factory generated question"""
        factory_generated = QuestionFactory()
        print(factory_generated)

        assert factory_generated is not None
        # assert False, "dumb assert to make PyTest print my stuff"
