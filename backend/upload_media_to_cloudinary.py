"""
Run once to upload all local media files to Cloudinary.
Usage: python upload_media_to_cloudinary.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Set Cloudinary env vars before django setup
os.environ['USE_CLOUDINARY'] = 'True'

django.setup()

import cloudinary
import cloudinary.uploader
from django.conf import settings

cloudinary.config(
    cloud_name=os.environ['CLOUDINARY_CLOUD_NAME'],
    api_key=os.environ['CLOUDINARY_API_KEY'],
    api_secret=os.environ['CLOUDINARY_API_SECRET'],
)

MEDIA_ROOT = settings.MEDIA_ROOT
uploaded = 0
failed = 0

for root, dirs, files in os.walk(MEDIA_ROOT):
    for filename in files:
        local_path = os.path.join(root, filename)
        # Build the relative path (e.g. properties/featured/1.webp)
        relative_path = os.path.relpath(local_path, MEDIA_ROOT).replace('\\', '/')
        public_id = os.path.splitext(relative_path)[0]  # remove extension

        try:
            cloudinary.uploader.upload(
                local_path,
                public_id=public_id,
                overwrite=True,
                resource_type='auto',
            )
            print(f'✓ {relative_path}')
            uploaded += 1
        except Exception as e:
            print(f'✗ {relative_path} — {e}')
            failed += 1

print(f'\nDone. Uploaded: {uploaded}, Failed: {failed}')
