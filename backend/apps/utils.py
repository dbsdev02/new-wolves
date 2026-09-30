def get_image_url(image_field):
    """Serialize an ImageField the same way DRF's UPLOADED_FILES_USE_URL does:
    the bare relative storage path (e.g. "developers/logos/1.png") for the
    frontend to resolve against its configured media base."""
    if not image_field:
        return None
    try:
        return image_field.name
    except Exception:
        return None
