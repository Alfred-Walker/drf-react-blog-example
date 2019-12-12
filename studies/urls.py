from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register('list', views.StudyViewSet, base_name='study')

urlpatterns = [
    path('', include(router.urls))
]
