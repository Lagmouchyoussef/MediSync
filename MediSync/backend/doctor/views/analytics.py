from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from django.db.models.functions import TruncMonth
from django.utils import timezone
from api.models import Patient, Appointment, Activity

class AnalyticsView(APIView):
    """
    View to provide consolidated clinical and financial analytics for the doctor dashboard.
    Calculates summary statistics, monthly performance metrics, and patient demographics.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Summary Stats
        patients_count = Patient.objects.all().count()
        appointments_count = Appointment.objects.filter(doctor=user).count()
        history_count = Activity.objects.filter(user=user).count()
        
        # Upcoming appointments for today
        today = timezone.now().date()
        upcoming_today = Appointment.objects.filter(
            doctor=user, 
            date=today,
            status='Pending'
        ).count()

        # Revenue/Consultation Data (Monthly)
        monthly_stats = Appointment.objects.filter(
            doctor=user,
            date__year=today.year
        ).annotate(month=TruncMonth('date')).values('month').annotate(
            count=Count('id')
        ).order_by('month')

        # Format for charts
        chart_data = []
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        
        # Initialize with zero for each month
        stats_map = {i: 0 for i in range(1, 13)}
        for entry in monthly_stats:
            stats_map[entry['month'].month] = entry['count']
            
        for i in range(1, 13):
            chart_data.append({
                'month': months[i-1],
                'visits': stats_map[i],
                'revenue': stats_map[i] * 50 # Example: 50 per visit
            })

        # Patient Demographics (Gender)
        gender_stats = Patient.objects.all().values('gender').annotate(count=Count('id'))

        return Response({
            'summary': {
                'total_patients': patients_count,
                'total_appointments': appointments_count,
                'total_history': history_count,
                'upcoming_today': upcoming_today
            },
            'charts': {
                'performance': chart_data,
                'demographics': list(gender_stats)
            }
        })
