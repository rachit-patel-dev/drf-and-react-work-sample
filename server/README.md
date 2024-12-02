# Organization Management System with Domain-Driven Rest-API

![alt text](./static/app-logo.png)

## Project Structure
```
├── domain_driven_api
│   ├── application
│   │   ├── company
│   │   ├── direct_report
│   │   ├── division
│   │   ├── document
│   │   ├── file
│   │   ├── roles
│   │   └── user
│   ├── domain
│   │   ├── company
│   │   │   ├── company_division
│   │   │   │   └── migrations
│   │   │   └── migrations
│   │   ├── direct_report
│   │   │   └── migrations
│   │   ├── division
│   │   │   ├── migrations
│   │   │   └── user_division
│   │   │       └── migrations
│   │   ├── document
│   │   │   └── migrations
│   │   ├── file
│   │   │   └── migrations
│   │   ├── role
│   │   │   ├── company_role
│   │   │   │   └── migrations
│   │   │   ├── migrations
│   │   │   └── user_role
│   │   │       └── migrations
│   │   └── user
│   │       ├── migrations
│   │       └── reportee_tracker
│   │           └── migrations
│   ├── drivers
│   ├── infrastructure
│   │   ├── custom_response
│   │   ├── emailer
│   │   ├── logger
│   │   ├── middlewares
│   │   ├── storages
│   │   └── translator
│   └── interface
│       └── document
├── scripts
├── static
└── utils
    ├── data_manipulation
    ├── django
    │   └── dto
    ├── global_methods
    └── open_api
```
## Requirements

- Python 3.9.16
- pipenv
- Postgres 13

## Features

### Document Management Features

- **Adding Document:** Users can upload document files or link to existing documents. They can provide a title, set priority to high, medium, or low, and assign a status like shared or private.
- **Document Listings:** Users can see a list of documents with sorting, pagination, and filtering options available. This facilitates efficient organization and navigation of documents.
- **Edit Document:** Users have the ability to edit document details, including title, priority, and status, ensuring accurate and up-to-date information.
- **Deletion of Document:** Users can delete documents when necessary, providing control over document management and data organization.

## Quickstart

Copy the `.example.env` file to `.env` inside the root directory and customize it.

```bash
mkdir logs logs/db_query logs/debug logs/warning logs/error logs/info
touch sendgrid_templates.json # to add the template data with versions
pipenv shell # If your env file is named `.env`  pipenv will load it automatically, otherwise manually load the variables into your shell
pipenv install
./manage.py migrate
./manage.py sync_pgviews --force
./manage.py createsuperuser
./manage.py runscript calender_generator
./manage.py runscript populate_roles_and_division
./manage.py runserver
```

## Running all tests locally

```bash
./manage.py test
./manage.py test --verbosity=3 --exclude-tag=extended_slow --parallel (To run it parallel)

```

## Updating PG Views

The project makes use of django-pgviews-redux, a module that assists in the creation of Postgres Views.
Whenever migrations are run for the first time or DB views require an update the following command should be executed from the project's root directory:

```bash
./manage.py sync_pgviews --force
```

## Development guidelines

### Tests

- Every module must include unit tests
- Tests should consider success and failure scenarios
- During the first development phase, code coverage should be at least of 80% per module, it should eventually be expanded to 100%

### Architecture

- Apps should be isolated
  - Each layer can only include direct calls to functions in lower layers (Interface > Application > Domain > Infrastructure)
  - The application layer is the main point of integration of domain APIs.
  - Django apps should not include foreign keys to other django apps.
  - Interactions should be modelled as API/function calls.
  - Django signals can be used to decouple applications.
  - When using Django signals, handlers should be registered in the application layer, avoiding direct calls from one domain module to another.
  - When modules depend on each other directly use dependency inversion.

### Sendgrid Templates

- Create a file named `sendgrid_templates.json` at the root directory.
- Specify email templates in the file, categorized by different languages.

### Database

- Do not use DB generated ids for entities, use uuid4 instead
- Create model ids in the application, not the database
- For any given operation perform all DB writes atomically in a single transaction

### API Calls

- We are using access-token and refresh-token to make api calls.

### Style

- Throughout the code we use the word **build** to refer to methods that create objects in memory only and the word **create** to refer to methods that create objects in memory and write them to a storage medium.
- Do not add carriage returns to the end of files; Windows does this by default. Please configure your editor so they aren't saved into files.

### Database diagram creation

The Domain-Driven Rest API has multiple apps which interact with each other, being convenient, at some point, to know what is the status of the API's apps interactions. For this purpose, we can use the next commands for python-django to draw a UML diagram of the Domain-Driven Rest-API:

```bash
#Include only some applications
$ ./manage.py graph_models <app_name_1> ... <app_name_n> -o <image_name>.<format: png | jpg>
```

For more information check the [django-extensions](https://django-extensions.readthedocs.io/en/latest/graph_models.html) documentation.

**Using MinIO Object Storage with Python to mimicking aws S3 in local**

This repository provides a guide on how to set up and use MinIO, an open-source object storage server, in combination with Python. MinIO is an excellent solution for creating your own object storage service that is compatible with the Amazon S3 API.

**Prerequisites**

    - Python 3.x installed (https://www.python.org/downloads/)
    - MinIO server running (Installation steps provided below)
    - minio Python library (pip install minio)

**Setting Up MinIO Server**

    **Installation**

    *To set up a MinIO server locally for testing, you can follow these steps:*

        - Download the MinIO server binary for your platform from: https://min.io/download

        - Run the MinIO server with the following command:

        ./minio server /path/to/data

**Access and Secret Keys**

    While running the MinIO server, you'll be provided with access and secret keys. Make note of these, as they will be required to interact with the server.


### [MinIO](https://docs.min.io/)

MinIO is an open-source object storage server designed for large-scale data infrastructure projects. It offers high performance and scalability, serving as an alternative to AWS S3 with compatibility for its API. Users can deploy MinIO locally or in the cloud, gaining greater control and flexibility over their data storage needs.
- Explore the documentation to discover how MinIO can empower your project.


### **Periodic tasks**

Periodic tasks are scheduled tasks at specific time intervals, which don't require to be called directly by any method or class created in the domain_driven_api project. Thus, those task requires to run celery in "beat" mode and in "worker" mode. This can be achieved by running the next two commands on the terminal (read [Celery](https://docs.celeryq.dev/en/stable/) documentation for more information):

```bash
celery --app=domain_driven_api.celery worker --pool=solo --loglevel=DEBUG
celery --app=domain_driven_api.celery beat --loglevel=DEBUG
```
