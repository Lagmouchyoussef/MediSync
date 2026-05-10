try:
    import sib_api_v3_sdk  # type: ignore
except ImportError:
    sib_api_v3_sdk = None
from django.conf import settings
from django.utils.html import strip_tags
import logging
import base64
import os

logger = logging.getLogger(__name__)

class BrevoEmailService:
    """
    Professional service for sending emails via Brevo API (v3).
    Now fully translated to English with premium HTML design.
    """
    
    def __init__(self):
        if sib_api_v3_sdk is None:
            logger.error("Brevo SDK (sib_api_v3_sdk) is not installed. Emails will not be sent.")
            return

        self.configuration = sib_api_v3_sdk.Configuration()
        self.configuration.api_key['api-key'] = getattr(settings, 'BREVO_API_KEY', '')
        self.api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(self.configuration))

        default_from = getattr(settings, 'DEFAULT_FROM_EMAIL', 'medisyncpy@gmail.com')
        # Handle formats like "Name <email@test.com>"
        sender_email = default_from
        if '<' in default_from and '>' in default_from:
            sender_email = default_from.split('<')[1].split('>')[0]
            
        self.sender = {
            "name": "MediSync",
            "email": sender_email
        }
        
        # Official Logo: Using a relative path for Docker compatibility
        logo_path = os.path.join(settings.BASE_DIR, "static", "images", "Logo_Medisync.png")
        self.logo_url = ""
        
        if os.path.exists(logo_path):
            try:
                with open(logo_path, "rb") as image_file:
                    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                    self.logo_url = f"data:image/png;base64,{encoded_string}"
            except Exception as e:
                logger.error(f"Critical error loading official logo: {e}")
        
        # Fallback to a very simple text-based placeholder ONLY if the file is missing
        if not self.logo_url:
            self.logo_url = "https://placehold.co/600x150/2da0a8/ffffff?text=MediSync+Clinical+Systems"

    def _get_html_wrapper(self, title, content):
        """Standardizes the look and feel of all transactional emails."""
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .email-container {{
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.6;
                    color: #1e293b;
                    max-width: 600px;
                    margin: 0 auto;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    overflow: hidden;
                }}
                .header {{
                    background-color: #f8fafc;
                    padding: 30px;
                    text-align: center;
                    border-bottom: 1px solid #e2e8f0;
                }}
                .logo {{
                    max-width: 140px;
                    height: auto;
                    margin-bottom: 10px;
                }}
                .content {{
                    padding: 40px 30px;
                    background-color: #ffffff;
                }}
                .footer {{
                    background-color: #f1f5f9;
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #64748b;
                }}
                .button {{
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #2563eb;
                    color: #ffffff !important;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 600;
                    margin-top: 20px;
                }}
                .highlight {{
                    color: #2563eb;
                    font-weight: 600;
                }}
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <img src="{self.logo_url}" alt="MediSync Logo" class="logo">
                    <h1 style="margin:0; font-size: 20px; color: #0f172a;">{title}</h1>
                </div>
                <div class="content">
                    {content}
                </div>
                <div class="footer">
                    &copy; 2026 MediSync Clinical Systems. All rights reserved.<br>
                    This is an automated message, please do not reply.
                </div>
            </div>
        </body>
        </html>
        """

    def send_transactional_email(self, to_email, subject, html_content, text_content=None):
        """Sends an email via Brevo Transactional API."""
        if sib_api_v3_sdk is None:
            logger.error("Cannot send email: Brevo SDK not available.")
            return False

        if not to_email:
            logger.error("Recipient email missing.")
            return False

        if not text_content:
            # Provide a fallback plain text version for email clients that do not render HTML.
            text_content = strip_tags(html_content)
            text_content = text_content.replace('\n\n', '\n').strip()

        send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
            to=[{"email": to_email}],
            subject=subject,
            html_content=html_content,
            text_content=text_content,
            sender=self.sender
        )

        try:
            api_response = self.api_instance.send_transac_email(send_smtp_email)
            logger.info(f"SUCCESS: Email sent to {to_email}. ID: {api_response.message_id}")
            return True
        except Exception as e:
            logger.error(f"ERROR: Brevo API failed: {e}")
            return False

    def notify_doctor_new_request(self, doctor, patient, appointment):
        """Workflow: Patient -> Doctor : New Appointment Request"""
        to_email = doctor.email
        patient_name = patient.get_full_name() or patient.username
        subject = f"New Appointment Request - {patient_name}"
        
        content = f"""
            <p>Hello <span class="highlight">Dr. {doctor.get_full_name() or doctor.username}</span>,</p>
            <p>A patient has submitted a new appointment request through the portal:</p>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Patient:</strong> {patient_name}</p>
                <p style="margin: 5px 0;"><strong>Date:</strong> {appointment.date}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> {appointment.time}</p>
            </div>
            <p>Please log in to your dashboard to review and confirm this request.</p>
            <a href="{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/doctor/appointments" class="button">View Request</a>
        """
        html = self._get_html_wrapper("Appointment Request", content)
        return self.send_transactional_email(to_email, subject, html)

    def notify_patient_new_request(self, patient, doctor, appointment):
        """Workflow: Confirmation to patient after they request an appointment"""
        to_email = patient.email
        doctor_name = doctor.get_full_name() or doctor.username
        subject = "Appointment Request Received"
        
        content = f"""
            <p>Hello <span class="highlight">{patient.first_name or patient.username}</span>,</p>
            <p>Your appointment request for <span class="highlight">Dr. {doctor_name}</span> has been successfully received.</p>
            <p>The appointment is tentatively scheduled for <strong>{appointment.date}</strong> at <strong>{appointment.time}</strong>.</p>
            <p>We will notify you as soon as the doctor confirms the slot.</p>
        """
        html = self._get_html_wrapper("Request Received", content)
        return self.send_transactional_email(to_email, subject, html)

    def notify_patient_invitation(self, patient, doctor, appointment):
        """Workflow: Doctor -> Patient : New Invitation"""
        to_email = patient.email
        doctor_name = doctor.get_full_name() or doctor.username
        subject = f"Medical Invitation - Dr. {doctor_name}"
        
        content = f"""
            <p>Hello <span class="highlight">{patient.first_name or patient.username}</span>,</p>
            <p>Dr. <span class="highlight">{doctor_name}</span> has invited you for a consultation.</p>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Date:</strong> {appointment.date}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> {appointment.time}</p>
            </div>
            <p>Please log in to your portal to accept or decline this invitation.</p>
            <a href="{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/appointments" class="button">View Invitation</a>
        """
        html = self._get_html_wrapper("New Invitation", content)
        return self.send_transactional_email(to_email, subject, html)

    def notify_patient_response(self, patient, doctor, appointment):
        """Workflow: Doctor -> Patient : Update (Accept/Reject)"""
        to_email = patient.email
        status = appointment.status
        doctor_name = doctor.get_full_name() or doctor.username
        subject = f"Appointment Update - Dr. {doctor_name}"
        
        status_color = "#10b981" if status == 'Accepted' else "#ef4444"
        
        content = f"""
            <p>Hello <span class="highlight">{patient.first_name or patient.username}</span>,</p>
            <p>Dr. {doctor_name} has updated the status of your appointment on <strong>{appointment.date}</strong>.</p>
            <p style="font-size: 18px; font-weight: bold; color: {status_color}; text-align: center; padding: 15px; background-color: #f8fafc; border-radius: 8px;">
                Status: {status.upper()}
            </p>
            <p>Log in to your health portal for more details.</p>
            <a href="{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/dashboard" class="button">Go to Portal</a>
        """
        html = self._get_html_wrapper("Appointment Update", content)
        return self.send_transactional_email(to_email, subject, html)

    def notify_doctor_confirmation(self, doctor, patient, appointment, action):
        """Workflow: Patient accepts/rejects the proposed slot"""
        to_email = doctor.email
        action_text = "ACCEPTED" if action == "Accepted" else "DECLINED"
        patient_name = patient.get_full_name() or patient.username
        subject = f"Patient Response: Appointment {action_text}"
        
        content = f"""
            <p>Hello <span class="highlight">Dr. {doctor.get_full_name() or doctor.username}</span>,</p>
            <p>The patient <span class="highlight">{patient_name}</span> has <strong>{action_text.lower()}</strong> the proposed appointment for {appointment.date}.</p>
            <p>Your calendar has been updated accordingly.</p>
        """
        html = self._get_html_wrapper("Patient Feedback", content)
        return self.send_transactional_email(to_email, subject, html)

    def notify_welcome_user(self, user):
        """Workflow: Welcome & Onboarding after registration"""
        to_email = user.email
        role = getattr(user.profile, 'role', 'patient')
        first_name = user.first_name or user.username
        subject = "Welcome to MediSync"
        
        welcome_msg = (
            f"Welcome Dr. {user.get_full_name()}! You can now manage your patients and schedule seamlessly."
            if role == 'doctor' else
            f"Welcome {first_name}! You can now book appointments and track your health history."
        )

        content = f"""
            <p>Hello <span class="highlight">{first_name}</span>,</p>
            <p>{welcome_msg}</p>
            <p>We are excited to have you on board. MediSync is designed to make healthcare management simple and efficient.</p>
            <p>Click the button below to complete your profile.</p>
            <a href="{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/configuration" class="button">Get Started</a>
        """
        html = self._get_html_wrapper("Welcome Onboard", content)
        return self.send_transactional_email(to_email, subject, html)
