import factory
from django.utils import timezone

from questions.models import Question
from users.tests.factories import UserFactory


class QuestionFactory(factory.django.DjangoModelFactory):
    """Test via factory - https://aalvarez.me/posts/testing-django-and-drf-with-pytest/"""
    class Meta:
        model = Question

    user = factory.SubFactory(UserFactory)

    @factory.post_generation
    def tags(self, create, extracted, **kwargs):
        if not create:
            # Simple build, do nothing.
            return

        if extracted:
            # A list of tags were passed in, use them
            for tag in extracted:
                self.tags.add(tag)

    title = factory.Faker('sentence')

    body = factory.Faker('paragraph')

    registered_date = factory.LazyFunction(timezone.localtime)
