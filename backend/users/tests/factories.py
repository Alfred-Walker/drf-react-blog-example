import datetime
import factory

from users.models import User


class UserFactory(factory.django.DjangoModelFactory):
    """Test via factory - https://aalvarez.me/posts/testing-django-and-drf-with-pytest/"""
    class Meta:
        model = User

    nickname = factory.Faker('last_name')
    email = factory.Faker('email')
    # email = factory.LazyAttribute(lambda u: '{0}@example.com'.format(u.nickname).lower())

    date_joined = factory.LazyFunction(datetime.datetime.now)

    is_active = True
    is_admin = False
