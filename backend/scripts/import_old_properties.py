"""
Import properties from the old wolvesint backend export into the live
(new) backend, via its REST API — not direct DB writes, so all the normal
validation, slug/reference-number generation, etc. still applies.

Two-step process:
  1. On the OLD server (where properties_export.json's source DB lives),
     run:   python manage.py export_properties
     and copy the resulting properties_export.json here, next to this
     script (or pass --export-file).
  2. Make sure the old media folder is available locally, e.g.
     D:\\DBS\\old-wolves-backend\\media\\property_images\\*  — this script
     reads image bytes from there and uploads them.

Usage:
    python import_old_properties.py --dry-run
    python import_old_properties.py

Credentials: set WOLVES_ADMIN_EMAIL / WOLVES_ADMIN_PASSWORD env vars, or
you'll be prompted. The account needs an editor-or-above role.

Safe to re-run: successfully imported properties are recorded in
import_log.json (keyed by the old custom_id) and skipped on subsequent
runs, so a partial failure part-way through doesn't create duplicates.
"""
import argparse
import getpass
import json
import mimetypes
import os
import sys
import time
from pathlib import Path

import requests

SCRIPT_DIR = Path(__file__).resolve().parent
DEFAULT_API_BASE = 'https://backend.wolvesint.org/api/v1'
DEFAULT_EXPORT_FILE = SCRIPT_DIR / 'properties_export.json'
DEFAULT_OLD_MEDIA_ROOT = Path(r'D:\DBS\old-wolves-backend\media')
DEFAULT_LOG_FILE = SCRIPT_DIR / 'import_log.json'

SQM_TO_SQFT = 10.7639

# Old SubType.name values we've seen line up 1:1 with the new TYPE_CHOICES
# labels already — anything not in here falls back to 'apartment'.
PROPERTY_TYPE_MAP = {
    'apartment': 'apartment', 'flat': 'apartment',
    'villa': 'villa',
    'townhouse': 'townhouse',
    'penthouse': 'penthouse',
    'duplex': 'duplex',
    'studio': 'studio',
    'office': 'office',
    'retail': 'retail', 'shop': 'retail',
    'warehouse': 'warehouse',
    'land': 'land', 'plot': 'land',
    'building': 'building',
}


def guess_property_type(sub_types: list[str]) -> str:
    for name in sub_types:
        key = name.strip().lower()
        if key in PROPERTY_TYPE_MAP:
            return PROPERTY_TYPE_MAP[key]
    return 'apartment'


def guess_flags(status_name: str, actual_type_name: str, rank: int) -> dict:
    text = f'{status_name} {actual_type_name}'.lower()
    return {
        'is_new_launch': 'new launch' in text or 'new-launch' in text,
        'is_hot': 'hot' in text or 'trending' in text,
        'is_luxury': 'luxury' in text,
        'is_exclusive': 'exclusive' in text,
        'is_featured': rank is not None and rank <= 2,
    }


def build_description(item: dict) -> str:
    parts = [item.get('description') or '']
    if item.get('sub_title'):
        parts.append(f"\n\n{item['sub_title']}")
    highlights = item.get('key_highlights') or []
    if highlights:
        bullet_list = '\n'.join(f'- {h}' for h in highlights)
        parts.append(f'\n\nKey Highlights:\n{bullet_list}')
    if item.get('handover_date'):
        parts.append(f"\n\nHandover date: {item['handover_date']}")
    return ''.join(parts).strip()


class Importer:
    def __init__(self, api_base: str, old_media_root: Path, log_file: Path, dry_run: bool):
        self.api_base = api_base.rstrip('/')
        self.old_media_root = old_media_root
        self.log_file = log_file
        self.dry_run = dry_run
        self.session = requests.Session()
        self.amenity_cache: dict[str, int] = {}
        self.developer_cache: dict[str, int] = {}
        self.imported: dict[str, str] = self._load_log()

    def _load_log(self) -> dict:
        if self.log_file.exists():
            return json.loads(self.log_file.read_text(encoding='utf-8'))
        return {}

    def _save_log(self):
        self.log_file.write_text(json.dumps(self.imported, indent=2), encoding='utf-8')

    def login(self, email: str, password: str):
        if self.dry_run:
            print('[dry-run] skipping login')
            return
        resp = self.session.post(f'{self.api_base}/auth/login/', json={'email': email, 'password': password}, timeout=30)
        resp.raise_for_status()
        token = resp.json()['access']
        self.session.headers.update({'Authorization': f'Bearer {token}'})

    def _get_or_create_amenity(self, name: str) -> int | None:
        if not name:
            return None
        key = name.strip().lower()
        if key in self.amenity_cache:
            return self.amenity_cache[key]
        if not self.amenity_cache:
            resp = self.session.get(f'{self.api_base}/properties/amenities/', timeout=30)
            resp.raise_for_status()
            for a in resp.json():
                self.amenity_cache[a['name'].strip().lower()] = a['id']
            if key in self.amenity_cache:
                return self.amenity_cache[key]
        if self.dry_run:
            print(f"  [dry-run] would create amenity '{name}'")
            return None
        resp = self.session.post(f'{self.api_base}/properties/amenities/', json={'name': name}, timeout=30)
        resp.raise_for_status()
        new_id = resp.json()['id']
        self.amenity_cache[key] = new_id
        return new_id

    def _get_or_create_developer(self, name: str) -> int | None:
        if not name:
            return None
        key = name.strip().lower()
        if key in self.developer_cache:
            return self.developer_cache[key]
        if not self.developer_cache:
            page = f'{self.api_base}/developers/?page_size=100'
            while page:
                resp = self.session.get(page, timeout=30)
                resp.raise_for_status()
                body = resp.json()
                for d in body['results']:
                    self.developer_cache[d['name'].strip().lower()] = d['id']
                page = body.get('next')
            if key in self.developer_cache:
                return self.developer_cache[key]
        if self.dry_run:
            print(f"  [dry-run] would create developer '{name}'")
            return None
        resp = self.session.post(f'{self.api_base}/developers/', data={'name': name}, timeout=30)
        resp.raise_for_status()
        new_id = resp.json()['id']
        self.developer_cache[key] = new_id
        return new_id

    def _resolve_images(self, relative_paths: list[str]) -> list[Path]:
        found = []
        for rel in relative_paths:
            full = self.old_media_root / rel
            if full.exists():
                found.append(full)
            else:
                print(f'  ! image missing on disk, skipping: {full}')
        return found

    @staticmethod
    def _open_file_tuple(path: Path):
        mime = mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
        return (path.name, open(path, 'rb'), mime)

    def import_one(self, item: dict) -> bool:
        custom_id = item['custom_id']
        if custom_id in self.imported:
            print(f'- {custom_id}: already imported as {self.imported[custom_id]}, skipping')
            return True

        area_sqm = item.get('area_sqm')
        if area_sqm:
            area_sqft = round(float(area_sqm) * SQM_TO_SQFT, 2)
        else:
            area_sqft = 0
            print(f"  ! {custom_id}: no area on old record, defaulting area_sqft=0 (needs manual fix)")

        purpose = 'off_plan' if item['category_type'] == 'off-plan' else 'sale'
        completion_status = 'off_plan' if item['category_type'] == 'off-plan' else 'ready'
        property_type = guess_property_type(item.get('sub_types') or [])
        flags = guess_flags(item.get('status') or '', item.get('actual_type') or '', item.get('rank'))

        address_parts = [p for p in [item.get('location'), item.get('nearby_area')] if p]
        address = ', '.join(address_parts) or 'Dubai'

        images = self._resolve_images(item.get('images') or [])

        fields = {
            'title': item['title'],
            'description': build_description(item),
            'purpose': purpose,
            'status': 'published',
            'completion_status': completion_status,
            'price': item['price'],
            'currency': 'AED',
            'address': address,
            'city': 'Dubai',
            'country': 'UAE',
            'google_maps_url': item.get('google_map') or '',
            'min_bedrooms': item['min_bedrooms'],
            'max_bedrooms': item['max_bedrooms'],
            'bathrooms': 0,  # not tracked in the old schema
            'area_sqft': area_sqft,
            'meta_title': item['title'][:255],
            'meta_description': (item.get('keywords') or '')[:500],
            **{k: str(v) for k, v in flags.items()},
        }

        developer_id = self._get_or_create_developer(item.get('developer') or '')
        if developer_id:
            fields['developer'] = developer_id

        amenity_ids = [aid for aid in (self._get_or_create_amenity(a) for a in item.get('amenities') or []) if aid]

        if self.dry_run:
            print(f"[dry-run] would create '{item['title']}' ({property_type}, {purpose}, "
                  f"{len(images)} images, {len(amenity_ids)} amenities)")
            return True

        open_files = [self._open_file_tuple(p) for p in images[:1]]  # first image -> featured_image
        try:
            multipart_fields = [(k, (None, str(v))) for k, v in fields.items()]
            # property_type is a list on the new backend (a property can have
            # more than one type) — the old schema only ever gave us one, so
            # send it as a single-item repeated field, same shape amenity_ids
            # already uses for its list.
            multipart_fields.append(('property_type', (None, property_type)))
            for aid in amenity_ids:
                multipart_fields.append(('amenity_ids', (None, str(aid))))
            if open_files:
                multipart_fields.append(('featured_image', open_files[0]))

            resp = self.session.post(f'{self.api_base}/properties/', files=multipart_fields, timeout=60)
            if not resp.ok:
                print(f"  X {custom_id}: create failed {resp.status_code}: {resp.text[:500]}")
                return False
            created = resp.json()
            slug = created['slug']
        finally:
            for _, fh, _ in open_files:
                fh.close()

        if images:
            gallery_files = []
            try:
                gallery_files = [('images', self._open_file_tuple(p)) for p in images]
                resp = self.session.post(f'{self.api_base}/properties/{slug}/upload_images/', files=gallery_files, timeout=120)
                if not resp.ok:
                    print(f"  ! {custom_id}: gallery upload failed {resp.status_code}: {resp.text[:300]}")
            finally:
                for _, (_, fh, _) in gallery_files:
                    fh.close()

        print(f"+ {custom_id} -> {slug}")
        self.imported[custom_id] = slug
        self._save_log()
        return True

    def run(self, items: list[dict]):
        ok, failed = 0, 0
        for item in items:
            try:
                if self.import_one(item):
                    ok += 1
                else:
                    failed += 1
            except requests.HTTPError as e:
                failed += 1
                print(f"  X {item['custom_id']}: {e}")
            time.sleep(0.2)  # gentle on shared hosting
        print(f'\nDone. {ok} succeeded, {failed} failed. Log: {self.log_file}')


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--export-file', default=str(DEFAULT_EXPORT_FILE))
    parser.add_argument('--old-media-root', default=str(DEFAULT_OLD_MEDIA_ROOT))
    parser.add_argument('--api-base', default=DEFAULT_API_BASE)
    parser.add_argument('--log-file', default=str(DEFAULT_LOG_FILE))
    parser.add_argument('--dry-run', action='store_true', help='Print what would happen without creating anything')
    args = parser.parse_args()

    export_path = Path(args.export_file)
    if not export_path.exists():
        print(f'Export file not found: {export_path}\n'
              f'Run "python manage.py export_properties" on the OLD server first, '
              f'then copy properties_export.json next to this script.')
        sys.exit(1)

    items = json.loads(export_path.read_text(encoding='utf-8'))
    print(f'Loaded {len(items)} properties from {export_path}')

    importer = Importer(
        api_base=args.api_base,
        old_media_root=Path(args.old_media_root),
        log_file=Path(args.log_file),
        dry_run=args.dry_run,
    )

    if not args.dry_run:
        email = os.environ.get('WOLVES_ADMIN_EMAIL') or input('Admin email: ')
        password = os.environ.get('WOLVES_ADMIN_PASSWORD') or getpass.getpass('Admin password: ')
        importer.login(email, password)

    importer.run(items)


if __name__ == '__main__':
    main()
