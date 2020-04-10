import factory
import pytest

from studies.serializers import (StudySerializer, StudySummarySerializer)
from studies.tests.factories import StudyFactory

# The serializer.data property is only valid if you have a saved instance to serializer.
# Either call serializer.save() or use serializer.validated_data to access date prior to saving.
# https://github.com/encode/django-rest-framework/issues/2964#issuecomment-138396361
@pytest.mark.django_db
class TestStudySerializer:
    def test_expected_fields(self):
        """Tests expected serializer fields
        'title',
        'body',
        'is_public',
        """
        study_data = factory.build(dict, FACTORY_CLASS=StudyFactory)
        serializer = StudySerializer(data=study_data)
        is_valid = serializer.is_valid()
        print("Keys: ", serializer.validated_data.keys())
        print("Errors: ", serializer.errors)
        assert is_valid, "serializer validation test"
        assert serializer.validated_data.keys() == set(['title',
                                                        'body',
                                                        'is_public',
                                                        ])
        # assert False, "dumb assert to make PyTest print my stuff"


@pytest.mark.django_db
class TestStudySummarySerializer:
    def test_expected_fields(self):
        """Tests expected serializer fields
        'title',
        'is_public',
        """
        study_data = factory.build(dict, FACTORY_CLASS=StudyFactory)
        serializer = StudySummarySerializer(data=study_data)
        is_valid = serializer.is_valid()
        print("Keys: ", serializer.validated_data.keys())
        print("Errors: ", serializer.errors)
        assert is_valid, "serializer validation test"
        assert serializer.validated_data.keys() == set(['title', 'is_public'])
        # assert False, "dumb assert to make PyTest print my stuff"
