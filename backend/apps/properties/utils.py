import re
from decimal import Decimal, InvalidOperation

# Ordered by how commonly each pattern appears in URLs copied from Google Maps.
# Short links (maps.app.goo.gl/...) are redirects with no embedded coordinates
# and can't be parsed this way — that's an inherent limitation, not a bug.
COORDINATE_PATTERNS = [
    re.compile(r'@(-?\d+\.\d+),(-?\d+\.\d+)'),          # .../@25.2048,55.2708,15z
    re.compile(r'[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)'),      # ?q=25.2048,55.2708
    re.compile(r'[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)'),     # ?ll=25.2048,55.2708
    re.compile(r'!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)'),       # .../data=...!3d25.2048!4d55.2708
]


def extract_coordinates_from_maps_url(url):
    """Best-effort extraction of (latitude, longitude) Decimals from a Google
    Maps URL. Returns None if the URL doesn't contain a recognizable pattern."""
    if not url:
        return None
    for pattern in COORDINATE_PATTERNS:
        match = pattern.search(url)
        if match:
            try:
                return Decimal(match.group(1)), Decimal(match.group(2))
            except InvalidOperation:
                continue
    return None
