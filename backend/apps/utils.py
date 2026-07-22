from django.conf import settings


def get_image_url(image_field, request=None):
    """Return full URL for an ImageField — works for both Cloudinary and local media."""
    if not image_field:
        return None
    # Cloudinary storage returns full https:// URLs via .url
    try:
        url = image_field.url
        if url.startswith('http'):
            return url
        # Local dev — build absolute URI
        if request:
            return request.build_absolute_uri(url)
        base = getattr(settings, 'MEDIA_URL', '/media/')
        site = getattr(settings, 'FRONTEND_URL', 'http://localhost:8000')
        return f"{site}{base}{str(image_field)}"
    except Exception:
        return None
