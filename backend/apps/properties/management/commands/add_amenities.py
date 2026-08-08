from django.core.management.base import BaseCommand
from apps.properties.models import Amenity

AMENITIES = [
    ("Jame'e Mosque", 'religious'), ('Mosque', 'religious'),
    ('Community Centre', 'community'), ('Community Gardening', 'community'),
    ('Greenhouse', 'community'), ('Vegetable Gardening', 'community'),
    ('Pet Park', 'community'), ('Community Facilities', 'community'),
    ('Picnic Areas', 'outdoor'), ('Boulevard', 'outdoor'), ('Spine Park', 'outdoor'),
    ('Green Gate Park', 'outdoor'), ('Landscape Parks', 'outdoor'), ('Central Plaza', 'outdoor'),
    ('Ghaf Forest', 'outdoor'), ('Botanical Garden', 'outdoor'), ('Lush Gardens', 'outdoor'),
    ('Landscaped Links', 'outdoor'), ('Gazebo', 'outdoor'), ('Terrace', 'outdoor'),
    ('Sunken Seating', 'outdoor'), ('Outdoor Seating', 'outdoor'),
    ('Shaded Seating Area', 'outdoor'), ('Outdoor Shower', 'outdoor'),
    ('Outdoor Showers', 'outdoor'), ('Changing Room', 'outdoor'),
    ('Gas Station', 'retail'), ('Mall', 'retail'), ('Neighbourhood Mall', 'retail'),
    ('Retail / F&B', 'retail'), ('Retail Spaces', 'retail'),
    ('Medical Clinic', 'services'), ('Healthcare Centre', 'services'),
    ('Hospital', 'services'), ('School', 'services'), ('Business Park', 'services'),
    ('Outdoor Dining', 'dining'), ('Private Dinning', 'dining'),
    ('Island Restaurant', 'dining'), ('Portofino Restaurant', 'dining'),
    ('Live Cooking Classes / BBQ', 'dining'), ('Cafe', 'dining'),
    ('Private Dining Area', 'dining'), ('Elegant Banquet Venue', 'dining'),
    ('Signature Bar', 'dining'), ('Cigar Lounge', 'dining'),
    ('Opera', 'entertainment'), ('Floating Opera', 'entertainment'),
    ('Floating Cinema', 'entertainment'), ('Open Sky Cinema', 'entertainment'),
    ('Open-Air Cinema', 'entertainment'), ('Amphitheatre / Lawn', 'entertainment'),
    ('Vibrant Deck', 'entertainment'), ('Opal Chess Haven', 'entertainment'),
    ('Gaming Lounge', 'entertainment'), ('Ping Pong', 'entertainment'),
    ('Table Tennis', 'entertainment'), ('Golf Simulator Suite', 'entertainment'),
    ('Skate Park', 'sports'), ('Multi-Sport Courts', 'sports'), ('Sports Court', 'sports'),
    ('Sports Club', 'sports'), ('Callisthenics Stations', 'sports'),
    ('Open-Air Workout Area', 'sports'), ('Open-Air Workout Areas', 'sports'),
    ('Outdoor CrossFit', 'sports'), ('Hydroponic Farm', 'sports'),
    ('Kidz Adventure Land', 'sports'),
    ('Private Infinity Pool', 'pool'), ('The Canal Pool', 'pool'), ('Kids Pool', 'pool'),
    ('Spa Pool', 'pool'), ('Aqua Oasis', 'pool'), ('Malibu Cove', 'pool'),
    ('Water Slide', 'pool'), ('Pool Deck with Sun Loungers', 'pool'),
    ('Floating Cabanas', 'pool'), ('Sand Oasis', 'pool'),
    ('Waterfront Promenade', 'waterfront'), ('Marina Promenade', 'waterfront'),
    ('Waterway', 'waterfront'), ('Lagoon', 'waterfront'), ('Marina', 'waterfront'),
    ('Beach Town', 'waterfront'), ('Queen Elizabeth 2', 'waterfront'),
    ('5 Star Resort', 'waterfront'),
    ('Spa', 'wellness'), ('Spa & Wellness Centre', 'wellness'), ('Steam Room', 'wellness'),
    ('Sauna / Steam', 'wellness'), ('Zen Garden', 'wellness'),
    ('Meditation Nest', 'wellness'), ('Zen Meditation Pavilion', 'wellness'),
    ('Essential Oils Lake', 'wellness'),
    ('Clubhouse', 'clubhouse'), ("Owner's Lounge", 'clubhouse'),
    ('Private Lounge', 'clubhouse'), ('Meeting Room', 'clubhouse'),
]


class Command(BaseCommand):
    help = 'Add all project amenities to the database (idempotent).'

    def handle(self, *args, **options):
        created_count = 0
        for name, category in AMENITIES:
            _, created = Amenity.objects.get_or_create(name=name, defaults={'category': category})
            if created:
                created_count += 1
        self.stdout.write(self.style.SUCCESS(
            f'Done. {created_count} new amenities added, {len(AMENITIES) - created_count} already existed.'
        ))
