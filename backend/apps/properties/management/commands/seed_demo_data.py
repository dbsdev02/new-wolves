import random
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.agents.models import Agent, AgentReview
from apps.blogs.models import Blog, BlogCategory, BlogTag
from apps.communities.models import Community
from apps.developers.models import Developer
from apps.faqs.models import FAQ
from apps.projects.models import Project
from apps.properties.models import (
    Amenity, NearbyPlace, PaymentPlan, Property,
)
from apps.settings_app.models import SiteSettings
from apps.testimonials.models import Testimonial
from apps.seo.models import SEOPage, Redirect

User = get_user_model()

STAFF_USERS = [
    ('marketing@wolvesintl.com', 'marketing', 'Layla', 'Marketing'),
    ('sales@wolvesintl.com', 'sales', 'Omar', 'Sales'),
    ('agent@wolvesintl.com', 'agent', 'Noura', 'Agent'),
    ('editor@wolvesintl.com', 'editor', 'James', 'Editor'),
    ('viewer@wolvesintl.com', 'viewer', 'Elena', 'Viewer'),
]

SEO_PAGES = [
    ('home', 'Wolves International — Luxury Dubai Real Estate', 'A private Dubai real estate consultancy. Curated villas, penthouses and off-plan investments across Palm Jumeirah, Downtown, Emirates Hills and beyond.'),
    ('about', 'About Us | Wolves International', 'A private Dubai real estate consultancy founded on discretion, expertise and long-term stewardship.'),
    ('properties', 'Properties for Sale & Rent in Dubai | Wolves International', 'Browse curated villas, penthouses, and off-plan investments across Dubai.'),
    ('contact', 'Contact Us | Wolves International', 'Book a private consultation with a senior Dubai real estate advisor.'),
    ('blogs', 'Insights & Market Notes | Wolves International', 'Expert insights, market trends, and investment guides for Dubai real estate.'),
]

REDIRECTS = [
    ('/old-listings', '/properties', '301'),
    ('/properties-for-sale', '/properties?purpose=sale', '301'),
]

COMMUNITIES = [
    ('Downtown Dubai', 'Dubai', 'Home to the Burj Khalifa and Dubai Mall, Downtown Dubai is the epicenter of luxury urban living.'),
    ('Dubai Marina', 'Dubai', 'A stunning waterfront community with high-rise towers, a scenic promenade, and vibrant nightlife.'),
    ('Palm Jumeirah', 'Dubai', 'The iconic man-made island offering exclusive beachfront villas and premium apartments.'),
    ('Business Bay', 'Dubai', 'A thriving business and residential hub along the Dubai Canal.'),
    ('Jumeirah Village Circle', 'Dubai', 'A family-friendly community offering affordable luxury villas and apartments.'),
    ('Arabian Ranches', 'Dubai', 'A premier villa community with golf courses and family amenities.'),
    ('Dubai Hills Estate', 'Dubai', 'A master-planned community centered around an 18-hole championship golf course.'),
    ('Jumeirah Beach Residence', 'Dubai', 'Beachfront living with direct access to JBR Beach and The Walk.'),
]

DEVELOPERS = [
    ('Emaar Properties', 1997, 'Dubai', 'The developer behind Burj Khalifa, Dubai Mall, and Downtown Dubai.'),
    ('DAMAC Properties', 2002, 'Dubai', 'Luxury property developer known for branded residences across the region.'),
    ('Nakheel', 2000, 'Dubai', 'Master developer of Palm Jumeirah and other iconic waterfront destinations.'),
    ('Sobha Realty', 1976, 'Dubai', 'Premium real estate developer known for meticulous craftsmanship.'),
    ('Meraas', 2007, 'Dubai', 'Holistic developer of lifestyle destinations across Dubai.'),
]

AMENITIES = [
    ('Swimming Pool', 'pool'), ('Gymnasium', 'gym'), ('Covered Parking', 'parking'),
    ('24/7 Security', 'security'), ('Kids Play Area', 'kids'), ('BBQ Area', 'bbq'),
    ('Concierge Service', 'concierge'), ('Private Beach Access', 'beach'),
    ('Sauna & Steam Room', 'sauna'), ('Landscaped Gardens', 'garden'),
    ('Retail Outlets', 'retail'), ('Pet Friendly', 'pets'), ('Smart Home System', 'smart'),
    ('Business Center', 'business'), ('Tennis Court', 'tennis'),
]

PROPERTY_TITLES = [
    'Luxury Waterfront Apartment', 'Modern Downtown Penthouse', 'Elegant Beachfront Villa',
    'Spacious Family Townhouse', 'Contemporary High-Rise Studio', 'Exclusive Skyline Duplex',
    'Premium Garden Villa', 'Stylish Marina View Apartment', 'Grand Golf-Course Villa',
    'Sleek Business Bay Suite', 'Serene Community Townhouse', 'Opulent Palm Villa',
]

FIRST_NAMES = ['Ahmed', 'Sara', 'Omar', 'Fatima', 'James', 'Elena', 'Raj', 'Layla', 'Michael', 'Noura']
LAST_NAMES = ['Al Maktoum', 'Khan', 'Smith', 'Hassan', 'Johnson', 'Petrova', 'Sharma', 'Ali', 'Brown', 'Rashid']

BLOG_CATEGORIES = ['Market Insights', 'Buying Guide', 'Investment Tips', 'Lifestyle', 'Off-Plan Projects']
BLOG_TAGS = ['dubai', 'investment', 'luxury', 'off-plan', 'mortgage', 'golden-visa', 'market-trends']

FAQS = [
    ('Can foreigners buy property in Dubai?', 'Yes, foreigners can buy freehold property in designated areas across Dubai with full ownership rights.'),
    ('What is the Golden Visa and how do I qualify?', 'The UAE Golden Visa is a long-term residency visa. Property investors purchasing AED 2 million or more in real estate typically qualify.'),
    ('What are the additional costs when buying property in Dubai?', 'Buyers should budget for the 4% Dubai Land Department transfer fee, agency commission (typically 2%), and mortgage registration fees if applicable.'),
    ('How does the off-plan payment plan work?', 'Off-plan payment plans typically involve a down payment followed by installments tied to construction milestones, with a final payment on handover.'),
    ('Can I get a mortgage as a non-resident?', 'Yes, several UAE banks offer mortgages to non-residents, typically financing up to 50-60% of the property value.'),
    ('What is the rental yield in Dubai?', 'Dubai offers competitive rental yields, typically ranging from 5-9% depending on the community and property type.'),
    ('Is there property tax in Dubai?', 'Dubai has no annual property tax. Owners only pay a one-time transfer fee and periodic service charges.'),
    ('How long does the buying process take?', 'A standard resale transaction typically takes 2-4 weeks from offer acceptance to title deed transfer.'),
]

TESTIMONIALS = [
    ('Michael Thompson', 'CEO', 'Thompson Holdings', 'Wolves International made my property investment journey seamless. Their market knowledge is unmatched.', 5),
    ('Aisha Al Rashid', 'Investor', '', 'Professional, transparent, and always available. I could not have asked for a better team.', 5),
    ('David Chen', 'Business Owner', 'Chen Enterprises', 'From viewing to handover, the team guided us through every step of buying our first villa in Dubai.', 5),
    ('Fatima Hassan', 'Homeowner', '', 'Exceptional service and attention to detail. Highly recommend for anyone looking to invest in Dubai.', 4),
    ('Robert Williams', 'Investor', 'Williams Capital', 'Their off-plan project recommendations delivered excellent returns. A trusted partner for real estate investment.', 5),
    ('Noura Al Falasi', 'Homeowner', '', 'The agent assigned to us was knowledgeable, patient, and always responsive to our questions.', 5),
]


class Command(BaseCommand):
    help = 'Seed the database with realistic demo data for local development and demos.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--flush', action='store_true',
            help='Delete existing demo data before seeding.',
        )

    def handle(self, *args, **options):
        random.seed(42)

        if options['flush']:
            self.stdout.write('Flushing existing demo data...')
            Property.objects.all().delete()
            Project.objects.all().delete()
            Community.objects.all().delete()
            Developer.objects.all().delete()
            Agent.objects.all().delete()
            Blog.objects.all().delete()
            BlogCategory.objects.all().delete()
            BlogTag.objects.all().delete()
            Testimonial.objects.all().delete()
            FAQ.objects.all().delete()
            Amenity.objects.all().delete()

        self.create_superuser()
        self.create_staff_users()
        amenities = self.create_amenities()
        communities = self.create_communities()
        developers = self.create_developers()
        agents = self.create_agents()
        self.create_properties(communities, developers, agents, amenities)
        self.create_projects(communities, developers)
        self.create_blogs()
        self.create_testimonials()
        self.create_faqs()
        self.create_site_settings()
        self.create_seo_pages()
        self.create_redirects()

        self.stdout.write(self.style.SUCCESS('Demo data seeded successfully.'))

    def create_superuser(self):
        if not User.objects.filter(email='admin@wolvesintl.com').exists():
            User.objects.create_superuser(
                username='admin', email='admin@wolvesintl.com', password='Admin@12345',
                first_name='Wolves', last_name='Admin', role='super_admin',
            )
            self.stdout.write(self.style.SUCCESS('Created superuser: admin@wolvesintl.com / Admin@12345'))
        else:
            self.stdout.write('Superuser already exists, skipping.')

    def create_staff_users(self):
        count = 0
        for email, role, first, last in STAFF_USERS:
            _, created = User.objects.get_or_create(
                email=email,
                defaults=dict(
                    username=email.split('@')[0], first_name=first, last_name=last,
                    role=role, password=make_password('Demo@12345'),
                ),
            )
            if created:
                count += 1
        self.stdout.write(self.style.SUCCESS(f'Staff users: {count} (password: Demo@12345)'))

    def create_seo_pages(self):
        count = 0
        for identifier, title, description in SEO_PAGES:
            _, created = SEOPage.objects.get_or_create(
                page_identifier=identifier,
                defaults=dict(
                    title=title, meta_title=title, meta_description=description,
                    og_title=title, og_description=description,
                ),
            )
            if created:
                count += 1
        self.stdout.write(self.style.SUCCESS(f'SEO pages: {count}'))

    def create_redirects(self):
        count = 0
        for from_url, to_url, redirect_type in REDIRECTS:
            _, created = Redirect.objects.get_or_create(
                from_url=from_url, defaults=dict(to_url=to_url, redirect_type=redirect_type),
            )
            if created:
                count += 1
        self.stdout.write(self.style.SUCCESS(f'Redirects: {count}'))

    def create_amenities(self):
        amenities = []
        for name, category in AMENITIES:
            obj, _ = Amenity.objects.get_or_create(name=name, defaults={'category': category})
            amenities.append(obj)
        self.stdout.write(self.style.SUCCESS(f'Amenities: {len(amenities)}'))
        return amenities

    def create_communities(self):
        communities = []
        for name, city, desc in COMMUNITIES:
            obj, _ = Community.objects.get_or_create(
                name=name,
                defaults=dict(
                    city=city, description=desc, short_description=desc[:150],
                    is_featured=random.choice([True, False]),
                    nearby_schools='GEMS International School, Repton School',
                    nearby_hospitals='Mediclinic, American Hospital Dubai',
                    nearby_malls='Dubai Mall, Mall of the Emirates',
                    nearby_metro='Nearest metro station within 2km',
                    latitude=25.2 + random.uniform(-0.1, 0.1),
                    longitude=55.27 + random.uniform(-0.1, 0.1),
                    meta_title=f'{name} - Properties & Real Estate | Wolves International',
                    meta_description=desc[:160],
                ),
            )
            communities.append(obj)
        self.stdout.write(self.style.SUCCESS(f'Communities: {len(communities)}'))
        return communities

    def create_developers(self):
        developers = []
        for name, founded, hq, desc in DEVELOPERS:
            obj, _ = Developer.objects.get_or_create(
                name=name,
                defaults=dict(
                    founded_year=founded, headquarters=hq, description=desc,
                    short_description=desc[:150], is_featured=random.choice([True, False]),
                    total_projects=random.randint(5, 40), total_units=random.randint(1000, 20000),
                    meta_title=f'{name} - Developer Profile | Wolves International',
                    meta_description=desc[:160],
                ),
            )
            developers.append(obj)
        self.stdout.write(self.style.SUCCESS(f'Developers: {len(developers)}'))
        return developers

    def create_agents(self):
        agents = []
        designations = ['Senior Property Consultant', 'Real Estate Advisor', 'Sales Director', 'Property Specialist']
        for i in range(8):
            rng = random.Random(f'agent-{i}')
            first, last = FIRST_NAMES[i], LAST_NAMES[i]
            email = f'{first.lower()}.{last.lower().replace(" ", "")}@wolvesintl.com'
            obj, created = Agent.objects.get_or_create(
                email=email,
                defaults=dict(
                    first_name=first, last_name=last,
                    designation=rng.choice(designations),
                    phone=f'+9715{rng.randint(10000000, 99999999)}',
                    whatsapp=f'+9715{rng.randint(10000000, 99999999)}',
                    languages='English, Arabic' if i % 2 == 0 else 'English, Arabic, Russian',
                    bio=f'{first} is a dedicated real estate professional with deep knowledge of the Dubai property market.',
                    experience_years=rng.randint(2, 15),
                    specializations='Luxury Villas, Off-Plan Projects',
                    rera_number=f'RERA-{rng.randint(10000, 99999)}',
                    is_featured=i < 4,
                    total_properties=rng.randint(10, 150),
                    total_deals=rng.randint(20, 300),
                ),
            )
            agents.append(obj)
            if created:
                for _ in range(rng.randint(0, 3)):
                    AgentReview.objects.create(
                        agent=obj,
                        reviewer_name=rng.choice(FIRST_NAMES) + ' ' + rng.choice(LAST_NAMES),
                        rating=rng.randint(4, 5),
                        comment='Excellent service and very professional throughout the process.',
                        is_approved=True,
                    )
        self.stdout.write(self.style.SUCCESS(f'Agents: {len(agents)}'))
        return agents

    def create_properties(self, communities, developers, agents, amenities):
        property_types = ['apartment', 'villa', 'townhouse', 'penthouse', 'duplex', 'studio']
        purposes = ['sale', 'sale', 'sale', 'rent', 'off_plan']
        count = 0
        for i in range(40):
            rng = random.Random(f'property-{i}')
            title = f'{rng.choice(PROPERTY_TITLES)} {i + 1}'
            community = rng.choice(communities)
            developer = rng.choice(developers)
            agent = rng.choice(agents)
            purpose = rng.choice(purposes)
            ptype = rng.choice(property_types)
            bedrooms = 0 if ptype == 'studio' else rng.randint(1, 6)
            price = rng.randint(60, 200) * 10000 if purpose == 'rent' else rng.randint(80, 1500) * 10000

            prop, created = Property.objects.get_or_create(
                title=title,
                defaults=dict(
                    description=f'{title} located in the heart of {community.name}, offering premium finishes and stunning views.',
                    property_type=ptype,
                    purpose=purpose,
                    status='published',
                    completion_status=rng.choice(['ready', 'off_plan', 'under_construction']),
                    price=price,
                    price_per_sqft=rng.randint(800, 2500),
                    address=f'{community.name}, Dubai, UAE',
                    city='Dubai',
                    community=community,
                    developer=developer,
                    agent=agent,
                    bedrooms=bedrooms,
                    bathrooms=max(1, bedrooms),
                    area_sqft=rng.randint(500, 8000),
                    parking_spaces=rng.randint(1, 3),
                    furnishing=rng.choice(['furnished', 'semi_furnished', 'unfurnished']),
                    is_featured=i < 10,
                    is_hot=i % 7 == 0,
                    is_luxury=price > 5000000,
                    is_new_launch=purpose == 'off_plan',
                    meta_title=f'{title} in {community.name} | Wolves International',
                    meta_description=f'{title} for {purpose} in {community.name}, Dubai.',
                    published_at=timezone.now() - timedelta(days=rng.randint(0, 90)),
                ),
            )
            if created:
                prop.amenities.set(rng.sample(amenities, k=rng.randint(4, 8)))
                for j in range(rng.randint(2, 3)):
                    PaymentPlan.objects.create(
                        property=prop, title=f'Installment {j + 1}',
                        percentage=[20, 40, 40][j] if j < 3 else 10,
                        milestone='On Booking' if j == 0 else ('On Construction' if j == 1 else 'On Handover'),
                    )
                for category, dist in [('school', 1.2), ('hospital', 2.5), ('metro', 0.8), ('mall', 1.5)]:
                    NearbyPlace.objects.create(
                        property=prop, name=f'Nearby {category.title()}',
                        category=category, distance_km=dist, duration_minutes=int(dist * 3),
                    )
                count += 1
        self.stdout.write(self.style.SUCCESS(f'Properties: {count}'))

    def create_projects(self, communities, developers):
        statuses = ['upcoming', 'under_construction', 'ready']
        count = 0
        for i in range(10):
            rng = random.Random(f'project-{i}')
            name = f'{rng.choice(["The", "Grand", "Royal", "Elite"])} {rng.choice(["Residences", "Towers", "Gardens", "Heights"])} {i + 1}'
            developer = rng.choice(developers)
            community = rng.choice(communities)
            min_price = rng.randint(80, 300) * 10000
            proj, created = Project.objects.get_or_create(
                name=name,
                defaults=dict(
                    developer=developer, community=community,
                    description=f'{name} is an upcoming development by {developer.name} in {community.name}.',
                    short_description=f'Premium residences by {developer.name} in {community.name}.',
                    status=rng.choice(statuses),
                    completion_date=timezone.now().date() + timedelta(days=rng.randint(180, 1200)),
                    min_price=min_price, max_price=min_price * rng.randint(2, 5),
                    total_units=rng.randint(100, 800),
                    available_units=rng.randint(10, 300),
                    address=f'{community.name}, Dubai, UAE',
                    is_featured=i < 4,
                    meta_title=f'{name} by {developer.name} | Wolves International',
                    meta_description=f'Explore {name}, a premium off-plan project in {community.name}, Dubai.',
                ),
            )
            if created:
                count += 1
        self.stdout.write(self.style.SUCCESS(f'Projects: {count}'))

    def create_blogs(self):
        author = User.objects.filter(is_superuser=True).first()
        categories = []
        for name in BLOG_CATEGORIES:
            cat, _ = BlogCategory.objects.get_or_create(name=name)
            categories.append(cat)
        tags = []
        for name in BLOG_TAGS:
            tag, _ = BlogTag.objects.get_or_create(name=name)
            tags.append(tag)

        titles = [
            'Top 5 Communities for Real Estate Investment in Dubai',
            'A Complete Guide to Buying Off-Plan Property',
            'Understanding the UAE Golden Visa for Property Investors',
            'Dubai Real Estate Market Outlook: What to Expect',
            'How to Secure a Mortgage as a Non-Resident in Dubai',
            'Freehold vs Leasehold: What Buyers Need to Know',
            'Why Dubai Marina Remains a Top Choice for Investors',
            'The Rise of Sustainable Living in Dubai Developments',
            'Comparing Rental Yields Across Dubai Communities',
            'Step-by-Step Guide to the Dubai Property Buying Process',
        ]
        count = 0
        for i, title in enumerate(titles):
            blog, created = Blog.objects.get_or_create(
                title=title,
                defaults=dict(
                    excerpt=f'Discover key insights about {title.lower()}.',
                    content=f'<p>{title} — this is a detailed article covering everything you need to know as a buyer or investor in the Dubai real estate market.</p><p>Contact our team of experts for personalized advice tailored to your investment goals.</p>',
                    author=author,
                    category=random.choice(categories),
                    status='published',
                    is_featured=i < 3,
                    read_time=random.randint(3, 10),
                    published_at=timezone.now() - timedelta(days=random.randint(0, 60)),
                    meta_title=title,
                    meta_description=f'{title} - insights from Wolves International.',
                ),
            )
            if created:
                blog.tags.set(random.sample(tags, k=random.randint(2, 4)))
                count += 1
        self.stdout.write(self.style.SUCCESS(f'Blogs: {count}'))

    def create_testimonials(self):
        count = 0
        for i, (name, designation, company, content, rating) in enumerate(TESTIMONIALS):
            _, created = Testimonial.objects.get_or_create(
                name=name,
                defaults=dict(
                    designation=designation, company=company, content=content,
                    rating=rating, is_featured=i < 4, order=i,
                ),
            )
            if created:
                count += 1
        self.stdout.write(self.style.SUCCESS(f'Testimonials: {count}'))

    def create_faqs(self):
        count = 0
        for i, (question, answer) in enumerate(FAQS):
            _, created = FAQ.objects.get_or_create(
                question=question, defaults=dict(answer=answer, order=i),
            )
            if created:
                count += 1
        self.stdout.write(self.style.SUCCESS(f'FAQs: {count}'))

    def create_site_settings(self):
        settings = SiteSettings.get_settings()
        settings.company_name = 'Wolves International'
        settings.tagline = 'Your Trusted Partner in Dubai Real Estate'
        settings.description = 'Wolves International is a premier real estate agency in Dubai, offering an unrivaled selection of properties for sale, rent, and investment.'
        settings.email = 'info@wolvesintl.com'
        settings.phone = '+97142345678'
        settings.whatsapp = '971501234567'
        settings.address = 'Office 1201, Business Bay, Dubai, UAE'
        settings.city = 'Dubai'
        settings.country = 'UAE'
        settings.rera_number = 'RERA-00000'
        settings.working_hours = 'Sun - Thu: 9:00 AM - 6:00 PM'
        settings.save()
        self.stdout.write(self.style.SUCCESS('Site settings configured.'))
