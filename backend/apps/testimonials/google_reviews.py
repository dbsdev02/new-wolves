"""Live Google reviews for the business, via the Places API "Place Details"
endpoint — https://developers.google.com/maps/documentation/places/web-service/details

Requires two settings (env vars), neither of which this code can supply:
  GOOGLE_PLACES_API_KEY — a Google Cloud API key with the Places API enabled
                           (billed by Google; there's a monthly free credit).
  GOOGLE_PLACE_ID        — the specific Place ID for this business's Google
                            Business Profile listing. Find it by searching the
                            business at https://developers.google.com/maps/documentation/places/web-service/place-id
                            (the "Place ID Finder" tool on that page), or from
                            the "Share" link on the listing in Google Maps.

Google's API returns at most the 5 "most relevant" reviews for a place —
that's a hard cap Google imposes, not something this code or a paid plan
can raise.
"""
import requests
from django.conf import settings
from django.core.cache import cache
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

CACHE_KEY = 'google_reviews'
CACHE_TTL = 60 * 60 * 6  # 6 hours — fresh enough, well within Google's usage terms, easy on quota/cost
PLACE_DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json'


@api_view(['GET'])
@permission_classes([AllowAny])
def google_reviews(request):
    cached = cache.get(CACHE_KEY)
    if cached is not None:
        return Response(cached)

    api_key = getattr(settings, 'GOOGLE_PLACES_API_KEY', '')
    place_id = getattr(settings, 'GOOGLE_PLACE_ID', '')
    if not api_key or not place_id:
        # Not configured yet — fail quiet so the frontend section just
        # doesn't render, instead of erroring the whole page.
        return Response({'configured': False, 'rating': None, 'user_ratings_total': 0, 'reviews': [], 'url': None})

    try:
        resp = requests.get(PLACE_DETAILS_URL, params={
            'place_id': place_id,
            'fields': 'rating,user_ratings_total,reviews,url,name',
            'key': api_key,
        }, timeout=10)
        resp.raise_for_status()
        body = resp.json()
    except requests.RequestException:
        return Response({'configured': True, 'rating': None, 'user_ratings_total': 0, 'reviews': [], 'url': None})

    if body.get('status') != 'OK':
        return Response({'configured': True, 'rating': None, 'user_ratings_total': 0, 'reviews': [], 'url': None,
                          'error': body.get('status')})

    result = body.get('result', {})
    data = {
        'configured': True,
        'name': result.get('name'),
        'rating': result.get('rating'),
        'user_ratings_total': result.get('user_ratings_total', 0),
        'url': result.get('url'),
        'reviews': [
            {
                'author_name': r.get('author_name'),
                'author_url': r.get('author_url'),
                'profile_photo_url': r.get('profile_photo_url'),
                'rating': r.get('rating'),
                'text': r.get('text'),
                'relative_time_description': r.get('relative_time_description'),
                'time': r.get('time'),
            }
            for r in result.get('reviews', [])
        ],
    }
    cache.set(CACHE_KEY, data, CACHE_TTL)
    return Response(data)
