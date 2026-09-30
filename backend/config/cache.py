from functools import wraps

from django.views.decorators.cache import cache_page


def public_cache_page(seconds):
    """Like Django's cache_page, but only for anonymous requests.

    Several viewsets show more (e.g. drafts) to staff than to the public, so
    caching indiscriminately risks serving an admin's draft-inclusive
    response to the next anonymous visitor. Skipping the cache whenever a
    user is authenticated means the admin/editor UI always sees live data,
    while public traffic — the overwhelming majority of requests — gets
    served from cache.
    """
    cached = cache_page(seconds)

    def decorator(view_func):
        cached_view_func = cached(view_func)

        @wraps(view_func)
        def wrapped(request, *args, **kwargs):
            if request.user.is_authenticated:
                return view_func(request, *args, **kwargs)
            return cached_view_func(request, *args, **kwargs)

        return wrapped

    return decorator
