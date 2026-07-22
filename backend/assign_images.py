import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.properties.models import Property, PropertyImage
from apps.projects.models import Project, ProjectImage
from apps.communities.models import Community
from apps.developers.models import Developer
from apps.agents.models import Agent
from apps.blogs.models import Blog
from apps.testimonials.models import Testimonial
from apps.settings_app.models import SiteSettings

# ── Developers ──────────────────────────────────────────────
dev_logos = [
    'developers/logos/1.png',
    'developers/logos/2.png',
    'developers/logos/3.png',
    'developers/logos/4.png',
    'developers/logos/5.png',
    'developers/logos/6.png',
    'developers/logos/7.png',
    'developers/logos/8.png',
    'developers/logos/9.png',
    'developers/logos/10.png',
]
for i, dev in enumerate(Developer.objects.all()):
    dev.logo = dev_logos[i % len(dev_logos)]
    dev.cover_image = dev_logos[(i + 1) % len(dev_logos)]
    dev.save()
print(f'Developers updated: {Developer.objects.count()}')

# ── Communities ──────────────────────────────────────────────
comm_images = [
    'communities/images/1.jpg',
    'communities/images/2.jpg',
    'communities/images/3.jpg',
    'communities/images/4.jpg',
    'communities/images/5.jpg',
    'communities/images/6.jpg',
    'communities/images/7.jpg',
    'communities/images/8.jpg',
]
for i, comm in enumerate(Community.objects.all()):
    comm.image = comm_images[i % len(comm_images)]
    comm.cover_image = comm_images[(i + 1) % len(comm_images)]
    comm.save()
print(f'Communities updated: {Community.objects.count()}')

# ── Agents ───────────────────────────────────────────────────
agent_photos = [
    'agents/photos/Aksa.png',
    'agents/photos/Anshul.png',
    'agents/photos/Anshul2.png',
    'agents/photos/Kiki.png',
    'agents/photos/Rishika.png',
    'agents/photos/Rishika2.png',
]
for i, agent in enumerate(Agent.objects.all()):
    agent.photo = agent_photos[i % len(agent_photos)]
    agent.save()
print(f'Agents updated: {Agent.objects.count()}')

# ── Properties ───────────────────────────────────────────────
prop_images = [
    'properties/featured/1.webp',
    'properties/featured/2.webp',
    'properties/featured/3.webp',
    'properties/featured/4.webp',
    'properties/featured/5.webp',
    'properties/featured/6.webp',
]
for i, prop in enumerate(Property.objects.all()):
    prop.featured_image = prop_images[i % len(prop_images)]
    prop.save()
    # Add gallery images
    if not PropertyImage.objects.filter(property=prop).exists():
        for j in range(3):
            PropertyImage.objects.create(
                property=prop,
                image=prop_images[(i + j) % len(prop_images)],
                caption=f'View {j+1}',
                is_primary=(j == 0),
                order=j,
            )
print(f'Properties updated: {Property.objects.count()}')

# ── Projects ─────────────────────────────────────────────────
proj_images = [
    'projects/featured/1.webp',
    'projects/featured/2.webp',
    'projects/featured/3.webp',
    'projects/featured/4.webp',
    'projects/featured/5.webp',
]
for i, proj in enumerate(Project.objects.all()):
    proj.featured_image = proj_images[i % len(proj_images)]
    proj.cover_image = proj_images[(i + 1) % len(proj_images)]
    proj.save()
    if not ProjectImage.objects.filter(project=proj).exists():
        for j in range(2):
            ProjectImage.objects.create(
                project=proj,
                image=proj_images[(i + j) % len(proj_images)],
                caption=f'View {j+1}',
                order=j,
            )
print(f'Projects updated: {Project.objects.count()}')

# ── Blogs ────────────────────────────────────────────────────
blog_images = [
    'blogs/featured/1.jpg',
    'blogs/featured/2.png',
    'blogs/featured/3.jpg',
]
for i, blog in enumerate(Blog.objects.all()):
    blog.featured_image = blog_images[i % len(blog_images)]
    blog.save()
print(f'Blogs updated: {Blog.objects.count()}')

# ── Testimonials ─────────────────────────────────────────────
test_photos = [
    'testimonials/1.png',
    'testimonials/2.png',
    'testimonials/3.png',
    'testimonials/4.png',
    'testimonials/5.png',
    'testimonials/6.png',
]
for i, t in enumerate(Testimonial.objects.all()):
    t.photo = test_photos[i % len(test_photos)]
    t.save()
print(f'Testimonials updated: {Testimonial.objects.count()}')

# ── Site Settings ────────────────────────────────────────────
settings = SiteSettings.get_settings()
settings.logo = 'settings/logo/logo.png'
settings.logo_dark = 'settings/logo/logo_dark.png'
settings.save()
print('Site settings logo updated.')

print('\nAll images assigned successfully!')
