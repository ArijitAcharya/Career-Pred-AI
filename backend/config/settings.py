import os


env = os.getenv("DJANGO_SETTINGS_MODULE", "config.settings.dev")

if env.endswith("prod"):
    from .settings.prod import *  # noqa
elif env.endswith("dev"):
    from .settings.dev import *  # noqa
else:
    from .settings.base import *  # noqa
