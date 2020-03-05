import factory
import pytest

from comments.serializers import (CommentSerializer, CommentChildSerializer)
from comments.tests.factories import CommentFactory

# The serializer.data property is only valid if you have a saved instance to serializer.
# Either call serializer.save() or use serializer.validated_data to access date prior to saving.
# https://github.com/encode/django-rest-framework/issues/2964#issuecomment-138396361
@pytest.mark.django_db
class TestCommentSerializer:
    def test_expected_fields(self):
        """Tests expected serializer fields
        'text',
        'parent_study',
        'parent_question',
        'parent_comment',
        'is_active',
        'is_public'
        """
        comment_data = factory.build(dict, FACTORY_CLASS=CommentFactory)
        comment_data['parent_study'] = comment_data['parent_study'].pk
        comment_data['parent_question'] = comment_data['parent_question'].pk
        comment_data['parent_comment'] = comment_data['parent_comment'].pk

        serializer = CommentSerializer(data=comment_data)
        is_valid = serializer.is_valid()
        print("Keys: ", serializer.validated_data.keys())
        print("Errors: ", serializer.errors)
        assert is_valid, "serializer validation test"
        assert serializer.validated_data.keys() == set(['text',
                                                        'parent_study',
                                                        'parent_question',
                                                        'parent_comment',
                                                        'is_active',
                                                        'is_public'])
        # assert False, "dumb assert to make PyTest print my stuff"


@pytest.mark.django_db
class TestCommentChildSerializer:
    def test_expected_fields(self):
        """Tests expected serializer fields
        'text',
        'parent_comment',
        'is_active',
        'is_public'
        """
        comment_data = factory.build(dict, FACTORY_CLASS=CommentFactory)
        comment_data['parent_study'] = comment_data['parent_study'].pk
        comment_data['parent_question'] = comment_data['parent_question'].pk
        comment_data['parent_comment'] = comment_data['parent_comment'].pk

        serializer = CommentChildSerializer(data=comment_data)
        is_valid = serializer.is_valid()
        print("Keys: ", serializer.validated_data.keys())
        print("Errors: ", serializer.errors)
        assert is_valid, "serializer validation test"
        assert serializer.validated_data.keys() == set(['text',
                                                        'parent_comment',
                                                        'is_active',
                                                        'is_public'])
        # assert False, "dumb assert to make PyTest print my stuff"
