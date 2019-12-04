from django.contrib.auth.base_user import BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, nickname="User", **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            nickname=nickname,
            **extra_fields
        )
        user.is_admin = False
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password, nickname="Admin", **extra_fields):
        user = self.create_user(
            email,
            password=password,
            nickname=nickname,
            **extra_fields
        )
        user.is_admin = True
        user.save(using=self._db)

        return user
