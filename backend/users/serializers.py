from allauth.account.adapter import get_adapter
from allauth.utils import email_address_exists
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_jwt.settings import api_settings

User = get_user_model()


class UserSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='users-detail', source='profile', )

    class Meta:
        model = User
        fields = ['id', 'url', 'email', 'nickname']


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
    nickname = serializers.CharField(required=True, allow_blank=False, max_length=20)
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def get_token(self, obj):
        """serializer method field for jwt token"""
        jwt_payload_handler = api_settings.JWT_RESPONSE_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)

        return token

    def validate_email(self, email):
        """custom email validation using allauth utils"""
        if email and email_address_exists(email):
            raise serializers.ValidationError(
                "A user is already registered with this e-mail address.")

        return email

    def validate_nickname(self, nickname):
        """custom nickname validation filtering special characters"""
        for char in nickname:
            if not char.isdigit() and not char.isalpha():
                raise serializers.ValidationError("Nickname contains characters that are not numbers nor letters.")

        return nickname

    def validate_password1(self, password):
        """password1 validation via default allauth adapter"""
        return get_adapter().clean_password(password)

    def validate(self, data):
        """password fields and match validation"""
        password1 = data.get('password1')
        password2 = data.get('password2')

        if password1 is None:
            raise serializers.ValidationError("KeyError: password1 does not exist.")

        if password2 is None:
            raise serializers.ValidationError("KeyError: password2 does not exist")

        if password1 != password2:
            raise serializers.ValidationError("The two password fields didn't match.")
        return data

    def get_cleaned_data(self):
        print(self.validated_data)
        return {
            'email': self.validated_data.get('email', ''),
            'nickname': self.validated_data.get('nickname', ''),
            'password1': self.validated_data.get('password1', '')
        }

    def save(self, request):
        """ Instantiates a new User instance. """
        user = get_user_model()()
        cleaned_data = self.get_cleaned_data()
        email = cleaned_data.get('email')
        nickname = cleaned_data.get('nickname')

        user.email = email
        user.nickname = nickname

        if 'password1' in cleaned_data:
            user.set_password(cleaned_data["password1"])
        else:
            user.set_unusable_password()

        user.save()

        return user

    class Meta:
        model = User
        fields = ('token', 'email', 'nickname', 'password1', 'password2')
