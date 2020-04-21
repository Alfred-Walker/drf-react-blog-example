# drf-react-blog-example


[![django-image]][django-url]
[![drf-image]][drf-url]
[![python-image]][python-url]
[![pytest-image]][pytest-url]
[![react-image]][react-url]


<!-- ABOUT THE PROJECT -->
## About

[**drf-react-blog-example**](https://github.com/Alfred-Walker/drf-react-blog-example/) is an example project for Django backend with React frontend.

It contains:
* django rest framework based backend REST API supports
  - ModelViewSet based Django REST framework functionalities
  - Customized serializers for Django Models
  - JWT based authentication
  - rest-auth based social account authentication (Google, Kakao, without frontend page)
  - [**ReDoc**](https://github.com/Redocly/redoc) support via [**drf-yasg**](https://github.com/axnsan12/drf-yasg) :warning: (swagger pages are disabled for jwt auth issues)
* React based frontend blog services 
  - CRUD of rich text based contents
  - basic auth
  - comments
  - tagged contents

<br/>

## Main End-points
* Study & Question <br/>
 (just replace all 'study' in path with 'question' to access end-points for `Question` instead `Study`.

|  HTTP |  Path |  Method |  Purpose |
| --- | --- | --- | --- |
|**POST** |/study|Create|Create new Study item|
|**GET** |/study|List|Get a list of Study item(s) readable|
|**GET** |/study/{id}|Read|Retrieve Study item corresponds to id|
|**PUT** |/study/{id}|Update|Update Study item corresponds to id|
|**DELETE** |/study/{id}|Delete|Delete Study item corresponds to id|

* Tag <br/>

|  HTTP |  Path |  Method |  Purpose |
| --- | --- | --- | --- |
|**POST** |/tag|Create|Create new Tag item(s)|
|**GET** |/tag|List|Get a list of Tag items used in public contents|
|**GET** |/tag/study/?tag={tag_name}|Read|Retrieve paginated Study item(s) tagged as tag_name|
|**GET** |/tag/study/?tag={tag_name}|Read|Retrieve paginated Question item(s) tagged as tag_name|
|**GET** |/tag/popular|Read|Retrieve 5 most used Tag items with used count info|
|**GET** |/tag/random|Read|Retrieve random tag items (0~20 items, default: 10 items)|
|**GET** |/tag/related/?tag={tag_name}|Read|Retrieve Study & Question items including specific tag|
<br/>

* Image <br/>

|  HTTP |  Path |  Method |  Purpose |
| --- | --- | --- | --- |
|**POST** |/image|Create|Upload file(s) and create new Image item(s)|
<br/>

## Getting Started
<!-- GETTING STARTED -->


### Django Backend
* SECRET_KEY Setup (Required)
  * Make a file `backend\configs\privates.json` that contains secret key for Django and JWT authentication.
  * You can use 3rd party secret key generator tools such as [**Django Secret Key Generator**](https://miniwebtool.com/django-secret-key-generator/).
  * Be careful not to upload the privates.json file to public repositories.
```sh
{
  "SECRET_KEY": "m2q%2w48r((om88cgqn4ti3chvsl4w2*$yi=fc)0m@dcjtyq%g",
  "SECRET_KEY_JWT": "gtw7p$(g8s@%bf2s1af%wa)pdrliak7@#c_26e)d3o6"
}
```
  
* Install dependencies and do migration:
```sh
pip install -r requirements.txt
```

* Do migration at `\backend\`:
```sh
python manage.py makemigrations
python manage.py migrate
```

* Make an administrator account at `\backend\`:
```sh
python manage.py createsuperuser
```

* Run developement server at `\backend\`:
```sh
python manage.py runserver # starts the server
```
(Above steps does not include Python virtual environment setup and activation.)


* If `no such table: users_user` error happens, see [**this page**](https://stackoverflow.com/questions/25771755/django-operationalerror-no-such-table/37799885) and try below commands:
```sh
python manage.py makemigrations
python manage.py migrate --run-syncdb
python manage.py runserver # starts the server
```

* [**Another case of 'error-no-such-table'**](https://stackoverflow.com/questions/24912173/django-1-7-makemigrations-not-detecting-changes/46362750#46362750)


### React Frontend
* Install yarn (if necessary):
```sh
sudo apt-get install yarn
```

* Install dependencies before first run (at `\frontend\`)
```sh
yarn install  # install dependencies
yarn start
```

* Change Base Url of /src/pages/Urls.js
```sh
export const URL_BASE = "http://alfredwalker.pythonanywhere.com/";
```

## Example

* Auto-generated ReDoc & drf site on [**pythonanywherer**](https://www.pythonanywhere.com/)<br/>
http://alfredwalker.pythonanywhere.com/redoc/v1/  <br/>
http://alfredwalker.pythonanywhere.com/  <br/>

* blog service example with nginx, and [**pythonanywhere**](https://www.pythonanywhere.com/) (stopped)<br/>
https://alfred-walker.duckdns.org/ <br/>

:x: Not available until the [**mixed contents issue**](https://github.com/Alfred-Walker/drf-react-blog-example/issues/6) is resolved. 
<br/>

## Others
### CORS_ORIGIN_WHITELIST Setup
* Adjust CORS whitelist setup in `backend\configs\settings.py` if necessary.
```sh
CORS_ORIGIN_WHITELIST = (
    'http://localhost:3000',
    'http://127.0.0.1:3000',
)
```


### JWT Configs
* If you need more detailed configs for JWT setup, please see [**Django REST framework JWT Auth**](https://jpadilla.github.io/django-rest-framework-jwt/#usage) page.


### Open API Info
* Change open API status at `backend\configs\urls.py` with your own.
```sh
schema_view = get_schema_view(
   openapi.Info(
      title="My Study Blog API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="studio.alfred.walker@gmail.com"),
      license=openapi.License(name="MIT License"),
   ),
   ...
)
```


### Social Account Login (Google & Kakao)
* Add social application setup to Django default admin page.
* Kakao example:
```sh
Provider: Kakao
Name: kakao
Client id: YOUR_REST_API_KEY (can get from Kakao developer page)
Secret key: None
```


<!-- REQUIREMENTS -->
## Requirements
* Please see `requirements.txt` for Python package requirements information.


<!-- ISSUES -->
## Issues
* Default REST API page and Swagger page are having trouble with rest-auth based authentication.
* Session based authentication disabled
* jwt based auth not working with swagger pages


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


<!-- LICENSE -->
## License
Distributed under the Unlicense License. See `LICENSE` for more information.


<!-- CONTACT -->
## Contact

studio.alfred.walker@gmail.com


<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [othneildrew/Best-README-Template](https://github.com/othneildrew/Best-README-Template)
* [Img Shields](https://shields.io)


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[django-image]: https://img.shields.io/badge/django-v3.0.2-blue
[django-url]: https://www.djangoproject.com/
[drf-image]: https://img.shields.io/badge/django_rest_framework-v3.11.0-blue
[drf-url]: https://www.django-rest-framework.org/
[python-image]: https://img.shields.io/badge/python-v3.8.0-blue
[python-url]: https://www.python.org/
[pytest-image]: https://img.shields.io/badge/pytest_django-v3.8.0-blue
[pytest-url]: https://pytest-django.readthedocs.io/en/latest/
[react-image]: https://img.shields.io/badge/react_scripts-v3.3.0-blue
[react-url]: https://reactjs.org/

[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=flat-square
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
