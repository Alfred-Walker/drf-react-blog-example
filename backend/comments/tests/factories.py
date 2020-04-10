import factory
from django.utils import timezone

from comments.models import Comment

from questions.tests.factories import QuestionFactory
from studies.tests.factories import StudyFactory
from users.tests.factories import UserFactory


class CommentFactory(factory.django.DjangoModelFactory):
    """Test via factory - https://aalvarez.me/posts/testing-django-and-drf-with-pytest/"""
    class Meta:
        model = Comment

    user = factory.SubFactory(UserFactory)

    text = factory.Faker('sentence')

    created_date = factory.LazyFunction(timezone.localtime)

    is_active = True

    is_public = True

    parent_comment = factory.LazyAttribute(lambda c: CommentFactory(parent_comment=None))
    parent_question = factory.SubFactory(QuestionFactory)
    parent_study = factory.SubFactory(StudyFactory)
