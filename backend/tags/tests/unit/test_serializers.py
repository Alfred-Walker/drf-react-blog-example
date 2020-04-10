import factory
import pytest

from tags.serializers import (TagSerializer, )
from tags.tests.factories import TagFactory

# The serializer.data property is only valid if you have a saved instance to serializer.
# Either call serializer.save() or use serializer.validated_data to access date prior to saving.
# https://github.com/encode/django-rest-framework/issues/2964#issuecomment-138396361
@pytest.mark.django_db
class TestTagSerializer:
    def test_expected_fields(self):
        """Tests expected serializer fields
        name, is_public
        (id and url are for HyperlinkedModelSerializer, not included in validated_data.keys())
        """
        tag_data = factory.build(dict, FACTORY_CLASS=TagFactory)
        serializer = TagSerializer(data=tag_data, context={'request': None})
        is_valid = serializer.is_valid()

        print("Errors: ", serializer.errors)
        assert is_valid, "serializer validation test"
        assert serializer.validated_data.keys() == set(['name', 'is_public'])
        # assert False, "dumb assert to make PyTest print my stuff"
