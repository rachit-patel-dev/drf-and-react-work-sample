import os
import sys
from celery.schedules import crontab
from django.conf import settings
from celery import Celery


# set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "domain_driven_api.settings")
BROKER_BACKEND = settings.CELERY_BROKER_URL

if "test" in sys.argv[1:]:
    BROKER_BACKEND = "memory://localhost"

app = Celery(
    "domain_driven_api",
    broker=BROKER_BACKEND,
    backend="redis://",
    include=[
        "domain_driven_api.application.recurring_activities.tasks",
    ],
    task_acks_late=True,
    task_acks_on_failure_or_timeout=False,
    task_reject_on_worker_lost=True,
)

app.config_from_object("django.conf:settings")
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

app.conf.beat_schedule = {
    "run-at-every-day": {
        "task": "domain_driven_api.application.recurring_activities.tasks.create_activity_records_for_never_ending_activity",
        "schedule": crontab(
            minute="*",
            hour="*",
            day_of_week="*",
        ),
    }
}

if __name__ == "__main__":
    app.start()
