from django.core.management.base import BaseCommand
from apps.communities.models import Community

COMMUNITIES = [
    'Palm Jumeirah',
    'Palm Jebel Ali',
    'Jumeirah Garden Estate',
    'District 1',
    'Sobha Hartland 1',
    'Dubai Hills Estate',
    'Nad Al Sheba',
    'City Walk',
    'Bluewaters Island',
    'Emaar Beachfront',
    'Emirates Hills',
    'Damac Hills 1',
    'Tilal Al Ghaf',
]


class Command(BaseCommand):
    help = 'Add the given list of communities to the database (idempotent).'

    def handle(self, *args, **options):
        created_count = 0
        for name in COMMUNITIES:
            _, created = Community.objects.get_or_create(name=name)
            if created:
                created_count += 1
        self.stdout.write(self.style.SUCCESS(
            f'Done. {created_count} new communities added, {len(COMMUNITIES) - created_count} already existed.'
        ))
