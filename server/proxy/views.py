from revproxy.views import ProxyView
from django.http import HttpResponse
from django.conf import settings

class OrganizationProxyView(ProxyView):
    # Normally this should be a settings variable
    # You will want to include any internal service you may use here
    upstream = "http://localhost:8000/api/v1/"
