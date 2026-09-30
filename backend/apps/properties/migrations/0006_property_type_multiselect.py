# Converts property_type from a single CharField value to a JSON list, so a
# property can be tagged with more than one type (e.g. "villa" + "duplex").
# Done as add-new / copy-data / drop-old / rename rather than a plain
# AlterField so existing rows keep their current type instead of the ALTER
# choking on non-JSON string data already in the column.
from django.db import migrations, models


def copy_property_type_to_list(apps, schema_editor):
    Property = apps.get_model('properties', 'Property')
    for prop in Property.objects.all():
        prop.property_type_new = [prop.property_type] if prop.property_type else []
        prop.save(update_fields=['property_type_new'])


def copy_property_type_back_to_single(apps, schema_editor):
    Property = apps.get_model('properties', 'Property')
    for prop in Property.objects.all():
        prop.property_type = prop.property_type_new[0] if prop.property_type_new else ''
        prop.save(update_fields=['property_type'])


class Migration(migrations.Migration):

    dependencies = [
        ('properties', '0005_property_handover_date_property_nearby_area'),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='property_type_new',
            field=models.JSONField(default=list, blank=True),
        ),
        migrations.RunPython(copy_property_type_to_list, copy_property_type_back_to_single),
        migrations.RemoveIndex(
            model_name='property',
            name='properties_propert_f38ecc_idx',
        ),
        migrations.RemoveField(
            model_name='property',
            name='property_type',
        ),
        migrations.RenameField(
            model_name='property',
            old_name='property_type_new',
            new_name='property_type',
        ),
    ]
