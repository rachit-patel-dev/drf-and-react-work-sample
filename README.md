# Organization Management System with Document module : [DRF](./server/README.md) + [React](./client/README.md) Sample Codebase
![DRF](./media/rsz_1download_1.png) ![+](./media/plus.png) ![React](./media/react.png)
- This project is a sample application demonstrating the integration of Django Rest Framework (DRF) with ReactJS. It follows a domain-driven structure on the backend and utilizes React for the frontend.

# Description

 ## [Document Management Features](./server/README.md#L68)

### [Django Rest Framework (DRF) with Domain Driven Structure](./server/README.md)

[Django Rest Framework](https://www.django-rest-framework.org/) is a powerful and flexible toolkit for building Web APIs in Django. In this project, DRF is utilized with a Domain Driven Design (DDD) structure, which is an architectural approach that emphasizes organizing code around business domain concepts.

#### Key Components of DDD in DRF:

1. **Domain Entities**: Representing core business objects or concepts, such as User, Product, Order, etc. These entities encapsulate both data and behavior relevant to the domain.

2. **Value Objects**: Immutable objects representing attributes or characteristics of domain entities. Value objects are often used for modeling concepts like money, addresses, dates, etc.

3. **Repositories**: Abstracting away the persistence logic and providing an interface for accessing and manipulating domain entities. Repositories facilitate decoupling of domain logic from data storage details.

4. **Services**: Implementing domain-specific business logic that doesn't naturally fit within the scope of a single entity. Services orchestrate interactions between multiple entities or perform complex operations.

5. **Aggregates**: Consisting of one or more related entities and ensuring consistency and transactional integrity within a boundary. Aggregates enforce business rules and invariants across their constituent entities.

#### Benefits of DDD in DRF:

- **Improved Maintainability**: Organizing code around domain concepts enhances readability and maintainability by aligning with the mental model of the business domain.

- **Flexibility and Scalability**: DDD encourages a modular and flexible architecture, allowing the system to evolve and scale more easily as business requirements change.

- **Testability**: By isolating domain logic from infrastructure concerns, such as database access or external services, DDD enables comprehensive testing of business rules and behaviors.

- **Clearer Communication**: DDD promotes a common language and understanding between domain experts and developers, fostering effective communication and collaboration.

#### Example Structure:

```
├── domain_driven_api
│   ├── application
│   │   └── document
│   ├── domain
│   │   └── document
│   │       └── migrations
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
    └── open_api
```

### [ReactJS](./client/README.md)

[ReactJS](https://reactjs.org/) is a JavaScript library for building user interfaces, particularly single-page applications. It allows developers to create reusable UI components and efficiently update the UI in response to data changes. React follows a component-based architecture, making it easier to manage and maintain complex UIs.

Key features of ReactJS include:
- Component-based architecture: Encouraging the creation of reusable UI components for better code organization and maintainability.
- Virtual DOM: Optimizing UI updates by only re-rendering components that have changed, resulting in improved performance.
- JSX: A syntax extension for JavaScript that allows developers to write HTML-like code within JavaScript files, making it easier to define UI components.
- State management: Facilitating the management of application state using React's built-in state management capabilities or external libraries like Redux.

## Quick Start

### Backend (Django Rest Framework)

1. Clone the repository:
   ```bash
   git clone https://github.com/rachit-patel-dev/drf-and-react-work-sample.git
   ```

2. Navigate to the backend directory:
   ```bash
   cd server
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Apply database migrations:
   ```bash
   python manage.py migrate
   ```

5. Run the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend (ReactJS)

1. Navigate to the frontend directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## License

This project is licensed under the [MIT License](LICENSE).
