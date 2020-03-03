import factory
import pytest

from questions.serializers import (QuestionSerializer, QuestionSummarySerializer)
from questions.tests.factories import QuestionFactory

# The serializer.data property is only valid if you have a saved instance to serializer.
# Either call serializer.save() or use serializer.validated_data to access date prior to saving.
# https://github.com/encode/django-rest-framework/issues/2964#issuecomment-138396361
@pytest.mark.django_db
class TestQuestionSerializer:
    def test_expected_fields(self):
        """Tests expected serializer fields
        'title',
        'body'
        """
        question_data = factory.build(dict, FACTORY_CLASS=QuestionFactory)
        serializer = QuestionSerializer(data=question_data)
        is_valid = serializer.is_valid()
        print("Keys: ", serializer.validated_data.keys())
        print("Errors: ", serializer.errors)
        assert is_valid, "serializer validation test"
        assert serializer.validated_data.keys() == set(['title', 'body'])
        # assert False, "dumb assert to make PyTest print my stuff"


@pytest.mark.django_db
class TestQuestionSummarySerializer:
    def test_expected_fields(self):
        """Tests expected serializer fields
        'title'
        """
        question_data = factory.build(dict, FACTORY_CLASS=QuestionFactory)
        serializer = QuestionSummarySerializer(data=question_data)
        is_valid = serializer.is_valid()
        print("Keys: ", serializer.validated_data.keys())
        print("Errors: ", serializer.errors)
        assert is_valid, "serializer validation test"
        assert serializer.validated_data.keys() == set(['title'])
        # assert False, "dumb assert to make PyTest print my stuff"
