from django.utils.cache import patch_cache_control
from django.views.static import serve

# django.views.static.serve already handles conditional GETs (ETag /
# Last-Modified), but it sets no Cache-Control header, so browsers revalidate
# every request instead of skipping it outright. Media files are uploaded
# once and rarely change in place, so it's safe to let browsers cache them
# for a day without asking the server first.
MEDIA_CACHE_SECONDS = 60 * 60 * 24


def cached_serve(request, path, document_root=None, show_indexes=False):
    response = serve(request, path, document_root=document_root, show_indexes=show_indexes)
    if response.status_code == 200:
        patch_cache_control(response, public=True, max_age=MEDIA_CACHE_SECONDS)
    return response
