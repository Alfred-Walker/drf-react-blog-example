from rest_framework import serializers
from users.serializers import UserSerializer
from .models import Study


class StudySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        url = serializers.HyperlinkedIdentityField(view_name='study-detail')

        model = Study
        fields = [
            'url',
            'title',
            'body',
            'category',
            'registered_date',
            'review_cycle_in_minute',
            'notification_enabled',
            'is_public'
        ]
        # fields = '__all__'

    def create(self, validated_data):
        user = None

        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user

        if request and hasattr(request, "review_cycle_in_minute"):
            study = Study.objects.create(
                user=user,
                title=validated_data['title'],
                body=validated_data['body'],
                category=validated_data['category'],
                review_cycle_in_minute=validated_data['review_cycle_in_minute'],
                notification_enabled=validated_data['notification_enabled'],
                is_public=validated_data['is_public'],
            )
        else:
            study = Study.objects.create(
                user=user,
                title=validated_data['title'],
                body=validated_data['body'],
                category=validated_data['category'],
                notification_enabled=validated_data['notification_enabled'],
                is_public=validated_data['is_public'],
            )

        return study
