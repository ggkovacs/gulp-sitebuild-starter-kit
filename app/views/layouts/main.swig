<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
    <title>Gulp sitebuild starter kit - {% block title %}{% endblock %}</title>
    <!-- build:css(.tmp) css/main.css -->
    <!-- bower:css -->
    <!-- endinject -->
    <link rel="stylesheet" href="css/main.css">
    {% block after-main-css %}{% endblock %}
    <!-- endbuild -->
</head>
<body>
    <!--[if lt IE 9]>
        <p class="browser-upgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->

    {% block content %}{% endblock %}

    <!-- build:js(.) scripts/vendors.js -->
    <!-- bower:js -->
    <!-- endinject -->
    {% block after-vendors-js %}{% endblock %}
    <!-- endbuild -->

    <!-- build:js(app) scripts/main.js -->
    <script src="scripts/main.js"></script>
    {% block after-main-js %}{% endblock %}
    <!-- endbuild -->
</body>
</html>
