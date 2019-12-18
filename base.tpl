{% load staticfiles %}
<!DOCTYPE html>
<html ng-app='openexo'>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'>
        <link rel="icon" type="image/x-icon" href="/assets/header/favicon.ico">
        <!-- Page title set in pageTitle directive -->
        <title>{% block title %}OpenExO{% endblock %}</title>
        <!-- build:css(.) styles/vendor-base.css -->
        <!-- bower:css -->
        <!-- run `gulp inject` to automatically populate bower styles dependencies -->
        <!-- endbower -->
        <!-- endbuild -->

        <!-- build:css({.tmp/serve,src}) styles/app-base.css -->
        <!-- inject:css -->
        <!-- css files will be automatically insert here -->
        <!-- endinject -->
        <!-- endbuild -->
        {% block styles %}{% endblock %}
        <!-- Make sure to deactivate html auto-escaping -->
        {% autoescape off %}{{ woopra_code }}{% endautoescape %}
    </head>
    <body class="md-skin fixed-sidebar fixed-nav {% block body_class %}{% endblock %}" id="page-top" data-jwt="{{jwt}}" data-inbox="{{inbox_url}}" data-uuid="{{user.uuid}}">
        <div class='hide' data-code="{{analytic_code}}" id='dev__analytics'></div>
        {% block content %}{% endblock %}

        <!-- build:js(.) scripts/vendor-base.js -->
        <!-- bower:js -->
        <!-- run `gulp inject` to automatically populate bower script dependencies -->
        <!-- endbower -->
        <!-- endbuild -->

        <!-- build:js(.tmp/serve) scripts/app-templates.js -->
        <script type="text/javascript" src="templates/templates.js"></script>
        <!-- endbuild -->

        <!-- build:js(src) scripts/app-base.js -->
        <!-- inject:js -->
        <!-- js files will be automatically insert here -->
        <!-- endinject -->
        <!-- endbuild -->
        {% block js %}{% endblock %}
</body>
</html>
