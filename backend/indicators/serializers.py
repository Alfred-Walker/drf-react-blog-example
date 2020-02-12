from rest_framework import serializers


class IndicatorSerializer(serializers.Serializer):
    all_user_count = serializers.IntegerField(read_only=True)
    all_study_count = serializers.IntegerField(read_only=True)
    all_question_count = serializers.IntegerField(read_only=True)
    all_comment_count = serializers.IntegerField(read_only=True)
    all_tag_count = serializers.IntegerField(read_only=True)

    class Meta:
        fields = [
            'all_user_count',
            'all_study_count',
            'all_question_count',
            'all_comment_count',
            'all_tag_count',
        ]