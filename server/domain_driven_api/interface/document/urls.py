from .views import DocumentViewSet
from rest_framework import routers

router = routers.SimpleRouter()
router.register(r"document", DocumentViewSet, basename="document")
