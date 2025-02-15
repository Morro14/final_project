# проект "Электронная справочная книжка Силант"
## запуск:
### клиент:
    /client/app
    npm install 
    npm start
### сервер:
    /server
    создать окружение (напр. py -m venv venv) и активировать его (/venv/Scripts/activate)
    pip install -r requirements.txt
    /server/app
    py manage.py runserver 

### данные авторизации для тестирования:
    роль администратора и менеджера
        email: test@email.com 
        password: admin
    роль клиента
        email: client@email.com
        password: testuser
    роль сервисной компании
        email: client@email.com
        password: testuser

### реализванные функции на сайте:
- получение, добавление и изменение данных в соответствии с правами пользователя 
- получение данных машины по ид. номеру для авторизованных и неавт. пользователей 
- сортировка и фильтрация данных в таблице
- ссылки на справочные данные в таблице
- (дополнительно) возможность экспортировать данные таблицы в xls формате

### основные библиотеки: 
- react
- react-dom-router
- Django
- django-rest-framework

### api:
    схема c SwaggerUI интерфейсом по пути /api/scheme/swagger-ui

вёрстка адаптивна требуемым разрешениям 
реализована валидация форм при создании и редактировании данных







         
