import re
from decimal import Decimal, InvalidOperation

import requests

# Ordered by how commonly each pattern appears in URLs copied from Google Maps.
COORDINATE_PATTERNS = [
    re.compile(r'@(-?\d+\.\d+),(-?\d+\.\d+)'),          # .../@25.2048,55.2708,15z
    re.compile(r'[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)'),      # ?q=25.2048,55.2708
    re.compile(r'[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)'),     # ?ll=25.2048,55.2708
    re.compile(r'!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)'),       # .../data=...!3d25.2048!4d55.2708
]

# Google's "Share" button on mobile hands out one of these short links by
# default — they're redirects with no coordinates embedded in the URL itself,
# so they have to be resolved to the full maps.google.com URL first.
SHORT_LINK_HOSTS = ('goo.gl', 'maps.app.goo.gl')


def resolve_maps_url(url, timeout=5):
    """If url is a Google Maps short link, follow the redirect chain and
    return the resolved long URL. Returns the original url unchanged for
    anything else, or on any network failure — this must never raise, since
    it runs inline in Property.save()."""
    if not url or not any(host in url for host in SHORT_LINK_HOSTS):
        return url
    try:
        resp = requests.head(url, allow_redirects=True, timeout=timeout)
        return resp.url or url
    except requests.RequestException:
        return url


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
