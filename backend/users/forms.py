from allauth.account.adapter import get_adapter
from django import forms
from allauth.account.forms import SignupForm, PasswordField, ChangePasswordForm, ResetPasswordForm, \
    ResetPasswordKeyForm, SetPasswordForm
from allauth.account.forms import LoginForm
from allauth.account import app_settings
from allauth.account.app_settings import AuthenticationMethod


class CustomPasswordField(forms.CharField):
    def __init__(self, placeholder="Password", *args, **kwargs):
        render_value = kwargs.pop(
            'render_value',
            app_settings.PASSWORD_INPUT_RENDER_VALUE
        )

        kwargs['widget'] = forms.PasswordInput(
            render_value=render_value,
            attrs={
                'placeholder':
                    placeholder
            }
        )

        super(CustomPasswordField, self).__init__(*args, **kwargs)


class CustomSetPasswordField(CustomPasswordField):
    def __init__(self, *args, **kwargs):
        super(CustomSetPasswordField, self).__init__(*args, **kwargs)
        self.user = None

    def clean(self, value):
        value = super(CustomSetPasswordField, self).clean(value)
        value = get_adapter().clean_password(value, user=self.user)
        return value


class CustomSignupForm(SignupForm):
    def __init__(self, *args, **kwargs):
        super(CustomSignupForm, self).__init__(*args, **kwargs)

        self.email_required = kwargs.pop(
            'email_required',
            app_settings.EMAIL_REQUIRED
        )
        self.username_required = kwargs.pop(
            'username_required',
            app_settings.USERNAME_REQUIRED
        )

        # email_required = kwargs.pop('email_required', app_settings.EMAIL_REQUIRED)
        if self.username_required:
            self.fields['username'].label = ''
            self.fields['username'].attrs = {
                'class': 'form-control signupform',
                'placeholder':'name',
                'autofocus': 'autofocus'
            }

        if self.email_required:
            self.fields['email'].label = ''
            self.fields['email'].widget.attrs['type'] = 'email'
            self.fields['email'].widget.attrs['placeholder'] = 'E-mail'
            self.fields['email'].widget.attrs['class'] = 'form-control signupform'

            if app_settings.SIGNUP_EMAIL_ENTER_TWICE:
                self.fields['email2'].label = ''
                self.fields['email2'].attrs = {
                    'class': 'form-control signupform',
                    'type': 'email',
                    'placeholder': 'E-mail (confirm)'
                }

        self.fields['password1'] = CustomPasswordField(
            label='',
            placeholder="password"
        )
        self.fields['password2'] = CustomPasswordField(
            label='',
            placeholder="password (again)"
        )
        self.fields['password1'].widget.attrs['class'] = 'form-control signupform'
        self.fields['password2'].widget.attrs['class'] = 'form-control signupform'


class CustomLoginForm(LoginForm):
    def __init__(self, *args, **kwargs):
        super(CustomLoginForm, self).__init__(*args, **kwargs)

        if app_settings.AUTHENTICATION_METHOD == AuthenticationMethod.EMAIL:
            self.fields['login'].label = ''
            self.fields['login'].widget.attrs['type'] = 'email'
            self.fields['login'].widget.attrs['placeholder'] = 'E-mail'
            self.fields['login'].widget.attrs['autofocus'] = 'autofocus'
            self.fields['login'].widget.attrs['class'] = 'form-control signupform'

        self.fields['password'] = CustomPasswordField(
            label='',
            placeholder='password'
        )
        self.fields['password'].widget.attrs['class'] = 'form-control loginform'


class CustomChangePasswordForm(ChangePasswordForm):
    def __init__(self, *args, **kwargs):
        super(CustomChangePasswordForm, self).__init__(*args, **kwargs)
        self.fields['oldpassword'] = CustomPasswordField(
            label='',
            placeholder='current password'
        )
        self.fields['password1'] = CustomSetPasswordField(
            label='',
            placeholder='password'
        )
        self.fields['password2'] = CustomPasswordField(
            label='',
            placeholder='password (again)'
        )
        self.fields['oldpassword'].widget.attrs['class'] = 'form-control loginform'
        self.fields['password1'].widget.attrs['class'] = 'form-control loginform'
        self.fields['password2'].widget.attrs['class'] = 'form-control loginform'


class CustomSetPasswordForm(SetPasswordForm):
    def __init__(self, *args, **kwargs):
        super(CustomSetPasswordForm, self).__init__(*args, **kwargs)
        self.fields['password1'] = CustomSetPasswordField(
            label='',
            placeholder='password'
        )
        self.fields['password2'] = CustomPasswordField(
            label='',
            placeholder='password (again)'
        )
        self.fields['password1'].widget.attrs['class'] = 'form-control loginform'
        self.fields['password2'].widget.attrs['class'] = 'form-control loginform'


class CustomResetPasswordForm(ResetPasswordForm):
    def __init__(self, *args, **kwargs):
        super(CustomResetPasswordForm, self).__init__(*args, **kwargs)
        self.fields['email'].label = ''
        self.fields['email'].widget.attrs['class'] = 'form-control loginform'


class CustomResetPasswordKeyForm(ResetPasswordKeyForm):
    def __init__(self, *args, **kwargs):
        super(CustomResetPasswordKeyForm, self).__init__(*args, **kwargs)
        self.fields['password1'] = CustomSetPasswordField(
            label='',
            placeholder='password'
        )
        self.fields['password2'] = CustomPasswordField(
            label='',
            placeholder='password (again)'
        )
        self.fields['password1'].widget.attrs['class'] = 'form-control loginform'
        self.fields['password2'].widget.attrs['class'] = 'form-control loginform'
