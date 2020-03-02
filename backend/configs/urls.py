"""configs URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
# from rest_auth.views import LoginView, LogoutView
from rest_framework import permissions, routers
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token

from users import views
from .views import GoogleLogin, KakaoLogin


# In the latest DRF, you need to explicitly set base_name in your viewset url
# (if you don't have queryset defined)
router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet, basename='users')

schema_view = get_schema_view(
   openapi.Info(
      title="StudyReview API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="studio.alfred.walker@gmail.com"),
      license=openapi.License(name="MIT License"),
   ),
   validators=['flex'],     # JSON schema validator package
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # 4 endpoints for drf-yasg
    #    1. A JSON view of your API specification at /swagger.json
    #    2. A YAML view of your API specification at /swagger.yaml
    #    3. A swagger-ui view of your API specification at /swagger/
    #    4. A ReDoc view of your API specification at /redoc/
    url(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    url(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    url(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    # DO NOT INCLUDE WHOLE REST_AUTH ALL URLS. An error will happen. (1. ~ 3. belows, rest-auth issue?)
    # => django.core.exceptions.ImproperlyConfigured: Field name `username` is not valid for model `User`.
    # 1. url(r'^rest-auth/', include('rest_auth.urls')),
    # 2. url(r'^rest-auth/login/$', LoginView.as_view(), name='rest_login'),
    # 3. url(r'^rest-auth/logout/$', LogoutView.as_view(), name='rest_logout'),

    url(r'^rest-auth/registration/', include('rest_auth.registration.urls')),
    url(r'^rest-auth/login/google/', GoogleLogin.as_view(), name='google_login'),
    url(r'^rest-auth/login/kakao/', KakaoLogin.as_view(), name='kakao_login'),

    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('study/', include('studies.urls')),
    path('tag/', include('tags.urls')),
    path('question/', include('questions.urls')),
    path('comment/', include('comments.urls')),
    path('indicator/', include('indicators.urls')),

    url(r'^jwt-auth/$', obtain_jwt_token),
    url(r'^jwt-auth/refresh/$', refresh_jwt_token),
    url(r'^jwt-auth/verify/$', verify_jwt_token),
]
