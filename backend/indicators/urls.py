from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register('', views.IndicatorViewSet, base_name='indicator')

urlpatterns = [
    path('', include(router.urls))
]
