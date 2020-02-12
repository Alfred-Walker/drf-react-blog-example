from allauth.account.adapter import get_adapter
from allauth.utils import email_address_exists
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework import serializers
from rest_framework_jwt.settings import api_settings


User = get_user_model()


class UserSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='users-detail', source='profile', )

    class Meta:
        model = User
        fields = ['url', 'email', 'nickname']


class UserNicknameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['nickname']


class UserDetailSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(many=False)

    class Meta:
       model = User
       fields = ['user', 'email']

    def to_representation(self, instance):
        data = super(UserDetailSerializer, self).to_representation(instance)
        return {
            'STATUS': 'SUCCESS',
            'DATA': data
        }


class UserRegistrationSerializerWithToken(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    email = serializers.EmailField(required=settings.ACCOUNT_EMAIL_REQUIRED)
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_RESPONSE_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if settings.ACCOUNT_UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    "A user is already registered with this e-mail address.")
        return email

    def validate_password1(self, password):
        return get_adapter().clean_password(password)

    def validate(self, data):
        password1 = data.get('password1')
        password2 = data.get('password2')

        if password1 is None or password2 is None:
            raise serializers.ValidationError("KeyError: password")

        if password1 != password2:
            raise serializers.ValidationError("The two password fields didn't match.")
        return data

    def get_cleaned_data(self):
        return {
            'email': self.validated_data.get('email', ''),
            'password1': self.validated_data.get('password1', '')
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        adapter.save_user(request, user, self)
        # setup_user_email(request, user, [])

        user.save()

        return user

    class Meta:
        model = User
        fields = ('token', 'email', 'password1', 'password2')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']