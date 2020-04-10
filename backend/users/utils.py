from .serializers import UserSerializer


# custom JWT response response handler
def jwt_payload_handler(token, user=None, request=None):
    return {
        'token': token,
        'user': UserSerializer(user, context={'request': request}).data
    }