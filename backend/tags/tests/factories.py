import factory

from tags.models import Tag


class TagFactory(factory.django.DjangoModelFactory):
    """Test via factory - https://aalvarez.me/posts/testing-django-and-drf-with-pytest/"""
    class Meta:
        model = Tag

    name = factory.Faker('file_extension')
    is_public = True
