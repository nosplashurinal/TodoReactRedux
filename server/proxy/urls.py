from .views import OrganizationProxyView
from django.conf.urls import *
from .decorators import *

# Most proxy patterns will need to use an org_id for authentication
# See decorators for authenticating before going to internal endpoints
urlpatterns = [
    url(r'^api/(?P<path>.*)$',
        OrganizationProxyView.as_view())
]
