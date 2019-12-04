"""
Django settings for configs project.

Generated by 'django-admin startproject' using Django 2.2.6.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""
import json
import os

from django.core.exceptions import ImproperlyConfigured

with open("configs/privates.json") as f:
    privates = json.loads(f.read())


# keep secret keys in secrets.json
def get_private(key, privates_json=privates):
    try:
        return privates_json[key]
    except KeyError:
        error_msg = "Set the {0} environment variable".format(key)
        raise ImproperlyConfigured(error_msg)


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = get_private("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',

    # for custom widgets
    'django.forms',

    # django-rest-framework modules
    'rest_framework',
    'rest_framework.authtoken',

    # # django-rest-auth modules
    'rest_auth',
    'rest_auth.registration',

    # swagger for api documentation
    'rest_framework_swagger',

    # django-allauth modules
    'allauth',
    'allauth.account',
    'allauth.socialaccount',

    # django-allauth providers
    'allauth.socialaccount.providers.kakao',
    'allauth.socialaccount.providers.google',

    # custom user app
    'users',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'configs.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'configs.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_URL = '/static/'

# pagination
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_SCHEMA_CLASS': 'rest_framework.schemas.coreapi.AutoSchema',
}

# default site of the project
# ('django.contrib.sites' requires SITE_ID)
SITE_ID = 1

# use email as authentication method
# (you can use 'name')
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False

# custom user model
AUTH_USER_MODEL = 'users.User'

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',

    # 'allauth' specific authentication method
    'allauth.account.auth_backends.AuthenticationBackend',
]

# redirect config for sign-in and sign-out authentication
#ACCOUNT_AUTHENTICATED_LOGIN_REDIRECTS = True
#ACCOUNT_AUTHENTICATED_LOGOUT_REDIRECTS = True
#LOGIN_REDIRECT_URL = "/"
#ACCOUNT_LOGOUT_REDIRECT_URL = "/"

# email verification
# ('none' or 'optional')
ACCOUNT_EMAIL_VERIFICATION = 'none'

# custom signin / signup form
ACCOUNT_FORMS = {
    'login': 'users.forms.CustomLoginForm',
    'signup': 'users.forms.CustomSignupForm',
    'change_password': 'users.forms.CustomChangePasswordForm',
    'set_password': 'users.forms.CustomSetPasswordForm',
    'reset_password': 'users.forms.CustomResetPasswordForm',
    'reset_password_from_key': 'users.forms.CustomResetPasswordKeyForm',
}