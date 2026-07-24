from django.conf import settings


def get_image_url(image_field):
    """Serialize an ImageField the same way DRF's UPLOADED_FILES_USE_URL does:
    an absolute Cloudinary URL when USE_CLOUDINARY is on, otherwise the bare
    relative storage path (e.g. "developers/logos/1.png") for the frontend to
    resolve against its own /public/media copy."""
    if not image_field:
        return None
    try:
        return image_field.url if settings.USE_CLOUDINARY else image_field.name
    except Exception:
        return None
