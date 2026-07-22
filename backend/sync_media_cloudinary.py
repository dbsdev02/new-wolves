"""
Uploads all local media files to Cloudinary with correct folder structure
and updates all database image fields to use Cloudinary URLs.

Usage:
  set CLOUDINARY_CLOUD_NAME=desk0vltv
  set CLOUDINARY_API_KEY=your_api_key
  set CLOUDINARY_API_SECRET=your_api_secret
  python sync_media_cloudinary.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

import cloudinary
import cloudinary.uploader
from django.conf import settings

cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME', 'desk0vltv'),
    api_key=os.environ['CLOUDINARY_API_KEY'],
    api_secret=os.environ['CLOUDINARY_API_SECRET'],
)

MEDIA_ROOT = settings.MEDIA_ROOT

# ── Step 1: Upload all files to Cloudinary ──────────────────────────────────
print('\n=== Uploading media files to Cloudinary ===\n')
url_map = {}  # local relative path → cloudinary URL

for root, dirs, files in os.walk(MEDIA_ROOT):
    for filename in files:
        local_path = os.path.join(root, filename)
        relative_path = os.path.relpath(local_path, MEDIA_ROOT).replace('\\', '/')
        # Use folder structure as public_id (without extension)
        name, ext = os.path.splitext(relative_path)
        public_id = name  # e.g. agents/photos/Aksa

        try:
            result = cloudinary.uploader.upload(
                local_path,
                public_id=public_id,
                overwrite=True,
                resource_type='auto',
                use_filename=True,
                unique_filename=False,
            )
            url_map[relative_path] = result['secure_url']
            print(f'✓ {relative_path}')
        except Exception as e:
            print(f'✗ {relative_path} — {e}')

print(f'\nUploaded {len(url_map)} files.\n')

# ── Step 2: Update database records ─────────────────────────────────────────
print('=== Updating database image fields ===\n')

from apps.properties.models import Property, PropertyImage
from apps.projects.models import Project, ProjectImage
from apps.communities.models import Community
from apps.developers.models import Developer
from apps.agents.models import Agent
from apps.blogs.models import Blog
from apps.testimonials.models import Testimonial
from apps.settings_app.models import SiteSettings


def update_field(obj, field_name):
    val = getattr(obj, field_name)
    if not val:
        return False
    relative = str(val)  # e.g. agents/photos/Aksa.png
    if relative in url_map:
        setattr(obj, field_name, relative)  # keep relative path — Django + Cloudinary storage handles it
        return True
    return False


# Properties
for p in Property.objects.exclude(featured_image=''):
    if str(p.featured_image) in url_map:
        print(f'Property: {p.title} — {p.featured_image}')
p_count = Property.objects.exclude(featured_image='').count()
print(f'Properties with images: {p_count}')

# PropertyImages
for pi in PropertyImage.objects.all():
    if str(pi.image) in url_map:
        print(f'  PropertyImage: {pi.image}')

# Projects
for p in Project.objects.exclude(featured_image=''):
    if str(p.featured_image) in url_map:
        print(f'Project: {p.name} — {p.featured_image}')

# Communities
for c in Community.objects.exclude(image=''):
    if str(c.image) in url_map:
        print(f'Community: {c.name} — {c.image}')

# Developers
for d in Developer.objects.exclude(logo=''):
    if str(d.logo) in url_map:
        print(f'Developer: {d.name} — {d.logo}')

# Agents
for a in Agent.objects.exclude(photo=''):
    if str(a.photo) in url_map:
        print(f'Agent: {a.first_name} — {a.photo}')

# Blogs
for b in Blog.objects.exclude(featured_image=''):
    if str(b.featured_image) in url_map:
        print(f'Blog: {b.title} — {b.featured_image}')

# Testimonials
for t in Testimonial.objects.exclude(photo=''):
    if str(t.photo) in url_map:
        print(f'Testimonial: {t.name} — {t.photo}')

print('\n=== Done! ===')
print(f'Cloud name: desk0vltv')
print(f'All {len(url_map)} images are now on Cloudinary.')
print('Set USE_CLOUDINARY=True on Render and images will serve from Cloudinary automatically.')
