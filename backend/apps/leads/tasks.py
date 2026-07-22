from django.core.mail import send_mail
from django.conf import settings


def send_lead_notification(lead_id):
    from .models import Lead
    try:
        lead = Lead.objects.get(id=lead_id)
        subject = f'New Lead: {lead.lead_type} - {lead.name}'
        message = f"""
New lead received:
Name: {lead.name}
Email: {lead.email}
Phone: {lead.phone}
Type: {lead.get_lead_type_display()}
Message: {lead.message}
Property: {lead.property.title if lead.property else 'N/A'}
Date: {lead.created_at.strftime('%Y-%m-%d %H:%M')}
        """
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [settings.ADMIN_EMAIL], fail_silently=True)

        # Auto-reply to lead
        auto_reply = f"""
Dear {lead.name},

Thank you for contacting Wolves International. We have received your inquiry and our team will get back to you within 24 hours.

Best regards,
Wolves International Team
        """
        send_mail('Thank you for your inquiry', auto_reply, settings.DEFAULT_FROM_EMAIL, [lead.email], fail_silently=True)
    except Exception:
        pass
