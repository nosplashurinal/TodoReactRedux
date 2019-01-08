# -*- coding: utf-8 -*-

from django.conf.urls import *
from .views import *

urlpatterns = [
    # Hello, world!
    url(r'^healthcheck/$', healthCheck),
    # Normally should be a separate api/server but to demonstrate proxy behavior
    url(r'^api/v1/todos$', todos),
    url(r'^api/v1/badrequest$', badrequest),
    url(r'', include('proxy.urls')),
    url(r'', index),
]
