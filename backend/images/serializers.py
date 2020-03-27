from rest_framework import serializers, status
from .models import Image


class ImageSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField('get_file_url')

    class Meta:
        model = Image

        fields = [
            'file_url'
        ]
        # fields = '__all__'

    def get_file_url(self, instance):
        return instance.file.url


# https://stackoverflow.com/questions/50397954/multiple-file-uploads-django
class ImageListSerializer (serializers.Serializer):
    def create(self, validated_data):
        user = None
        request = self.context['request']
        images = []

        if request and hasattr(request, "user"):
            user = request.user

        if request and request.FILES:
            files = request.FILES.getlist('images')
            # print("request.FILES: ", request.FILES)

            for file in files:
                img = Image.objects.create(user=user, file=file, **validated_data)
                images.append(img)

        serializer = ImageSerializer(images, many=True, context={'request': request})

        return serializer.data

    def to_representation(self, instance):
        ret = super(ImageListSerializer, self).to_representation(instance)
        ret['images'] = instance

        return ret
