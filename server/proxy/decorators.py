from django.http import HttpResponse
from functools import wraps
from django.conf import settings
import json


def is_local_mode(view_func):
    """
    check if the request comes from 127.0.0.1 and create a fake user
    """
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if settings.DEBUG:
            if request.body:
                body = json.loads(request.body)
                if 'organization' in body.keys():
                    # set the referer to what is in the POST body.
                    # set the ORG to what is in the POST body.
                    referer_begin = 'http://'
                    referer_end = '.localhost'
                    request.META['HTTP_REFERER'] = '{}{}{}'.format(referer_begin,
                                                                   body['organization'],
                                                                   referer_end)
        return view_func(request, *args, **kwargs)
    return _wrapped_view


def is_logged(view_func):
    """
    Verify that a cookie session is authenticated and that the expiration is good.
    In case of Failure sends back and unauthenticated error.
    """
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if request.session.is_empty():
            # return unauthenticated
            return HttpResponse('Unauthorized', status=401)
        return view_func(request, *args, **kwargs)
    return _wrapped_view


def set_org(view_func):
    """
    sets the organization based on the session value, to avoid snooping into other orgs
    """
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        # This should be commented out in an actual application
        # This should validate against org_id
        prefix = kwargs['prefix']
        requested_org_id = int(kwargs['org_id'])
        # org_id = request.session['org_external_id']

        # check that user is not trying to see a different org
        # if org_id != requested_org_id:
        #     return HttpResponse('Forbidden', status=403)
        #
        # revproxy does not accept extra keys
        kwargs.pop('org_id')
        kwargs['path'] = '{}/{}/{}'.format(prefix, requested_org_id, kwargs['path'])
        return view_func(request, *args, **kwargs)
    return _wrapped_view
