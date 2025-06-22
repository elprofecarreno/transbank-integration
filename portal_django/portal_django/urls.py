"""
URL configuration for portal_django project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from portal_django.views import view_transbank_pay
from portal_django.views import view_commit_pay

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', view_transbank_pay.transbank_pay_view, name='transbank-pay'),
    path('commit-pay/', view_commit_pay.commit_pay_view, name='commit-pay'),

]
