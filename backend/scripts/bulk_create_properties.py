"""
Create properties on the live backend from a JSON file you write by hand —
each object uses the same field names/format as the live API (see
properties_example.json next to this script for a starting template).

This does NOT touch images — featured_image/gallery photos can't travel as
JSON (they're binary). Add photos afterward through the admin panel's Edit
screen for each property, or via propertyService.uploadImages() if you're
scripting that separately.

Usage:
    python bulk_create_properties.py --dry-run
    python bulk_create_properties.py
    python bulk_create_properties.py --file my_properties.json

Credentials: set WOLVES_ADMIN_EMAIL / WOLVES_ADMIN_PASSWORD env vars, or
you'll be prompted. The account needs an editor-or-above role.

Safe to re-run: successfully created properties are recorded in
bulk_create_log.json (keyed by each object's "_id", or its "title" if you
didn't set one) and skipped on subsequent runs, so a partial failure
part-way through doesn't create duplicates.
"""
import argparse
import getpass
import json
import os
import sys
import time
from pathlib import Path

import requests

SCRIPT_DIR = Path(__file__).resolve().parent
DEFAULT_API_BASE = 'https://backend.wolvesint.org/api/v1'
DEFAULT_INPUT_FILE = SCRIPT_DIR / 'properties_example.json'
DEFAULT_LOG_FILE = SCRIPT_DIR / 'bulk_create_log.json'

# Fields the API doesn't accept from the client — strip these if present
# rather than erroring, so you can keep bookkeeping fields in the JSON.
IGNORED_KEYS = {'_id', 'slug', 'reference_number'}


class Creator:
    def __init__(self, api_base: str, log_file: Path, dry_run: bool):
        self.api_base = api_base.rstrip('/')
        self.log_file = log_file
        self.dry_run = dry_run
        self.session = requests.Session()
        self.created: dict[str, str] = self._load_log()

    def _load_log(self) -> dict:
        if self.log_file.exists():
            return json.loads(self.log_file.read_text(encoding='utf-8'))
        return {}

    def _save_log(self):
        self.log_file.write_text(json.dumps(self.created, indent=2), encoding='utf-8')

    def login(self, email: str, password: str):
        if self.dry_run:
            print('[dry-run] skipping login')
            return
        resp = self.session.post(f'{self.api_base}/auth/login/', json={'email': email, 'password': password}, timeout=30)
        resp.raise_for_status()
        token = resp.json()['access']
        self.session.headers.update({'Authorization': f'Bearer {token}'})

    def create_one(self, item: dict, index: int) -> bool:
        key = str(item.get('_id') or item.get('title') or f'item-{index}')
        if key in self.created:
            print(f'- {key}: already created as {self.created[key]}, skipping')
            return True

        payload = {k: v for k, v in item.items() if k not in IGNORED_KEYS}

        if self.dry_run:
            print(f"[dry-run] would create '{key}'")
            return True

        resp = self.session.post(f'{self.api_base}/properties/', json=payload, timeout=30)
        if not resp.ok:
            print(f'  X {key}: create failed {resp.status_code}: {resp.text[:500]}')
            return False

        slug = resp.json()['slug']
        print(f'+ {key} -> {slug}')
        self.created[key] = slug
        self._save_log()
        return True

    def run(self, items: list[dict]):
        ok, failed = 0, 0
        for i, item in enumerate(items):
            try:
                if self.create_one(item, i):
                    ok += 1
                else:
                    failed += 1
            except requests.HTTPError as e:
                failed += 1
                print(f'  X item {i}: {e}')
            time.sleep(0.2)  # gentle on shared hosting
        print(f'\nDone. {ok} succeeded, {failed} failed. Log: {self.log_file}')
        if ok:
            print('Now add photos for the created properties via the admin panel (Edit -> Photo / Gallery Photos).')


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--file', default=str(DEFAULT_INPUT_FILE), help='JSON file: an array of property objects')
    parser.add_argument('--api-base', default=DEFAULT_API_BASE)
    parser.add_argument('--log-file', default=str(DEFAULT_LOG_FILE))
    parser.add_argument('--dry-run', action='store_true', help='Print what would happen without creating anything')
    args = parser.parse_args()

    input_path = Path(args.file)
    if not input_path.exists():
        print(f'Input file not found: {input_path}\n'
              f'Copy properties_example.json to your own file and edit it, then pass --file yourfile.json')
        sys.exit(1)

    items = json.loads(input_path.read_text(encoding='utf-8'))
    if not isinstance(items, list):
        print('Input JSON must be an array of property objects — see properties_example.json')
        sys.exit(1)
    print(f'Loaded {len(items)} properties from {input_path}')

    creator = Creator(api_base=args.api_base, log_file=Path(args.log_file), dry_run=args.dry_run)

    if not args.dry_run:
        email = os.environ.get('WOLVES_ADMIN_EMAIL') or input('Admin email: ')
        password = os.environ.get('WOLVES_ADMIN_PASSWORD') or getpass.getpass('Admin password: ')
        creator.login(email, password)

    creator.run(items)


if __name__ == '__main__':
    main()
