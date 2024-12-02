# Organization Management System with Document module with React.js and DRF Backend

Welcome to our Organization Management System! This application provides comprehensive features for managing documents within an organization. With intuitive interfaces and robust functionalities, user can efficiently handle various tasks related to document management.

## Project Structure
```
client/
├── public
└── src
    ├── Assets
    │   ├── Css
    │   ├── Fonts
    │   │   └── feather
    │   └── Images
    ├── Components
    │   ├── Core
    │   │   ├── DashboardModule
    │   │   │   └── Documents
    │   │   │       ├── AddDocument
    │   │   │       └── UpdateDocument
    │   │   └── HeaderComponent
    │   └── UI
    │       ├── Button
    │       ├── Filter
    │       │   ├── PersonFilterDropdown
    │       │   └── PersonFilterIcon
    │       ├── Image
    │       └── Select
    ├── Config
    ├── Hooks
    ├── Library
    │   └── Utils
    ├── Network
    │   └── Core
    ├── Pages
    │   └── DashBoardModule
    │       └── Dashboard
    ├── Resources
    │   ├── Languages
    │   └── Statics
    ├── Store
    │   └── Reducers
    │       └── AuthModule
    └── types
```

## Features

### Document Management Features

- **Adding Document:** Users can upload document files or link to existing documents. They can provide a title, set priority to high, medium, or low, and assign a status like shared or private.
- **Document Listings:** Users can see a list of documents with sorting, pagination, and filtering options available. This facilitates efficient organization and navigation of documents.
- **Edit Document:** Users have the ability to edit document details, including title, priority, and status, ensuring accurate and up-to-date information.
- **Deletion of Document:** Users can delete documents when necessary, providing control over document management and data organization.

## Technologies Used

- **React.js**: Frontend framework for building the user interface, providing a responsive and intuitive user experience.
- **DRF Backend**: Backend environment for handling server-side logic and database operations, ensuring efficient data management and retrieval.
- **React Router**: Handling routing and navigation within the application, enabling seamless transitions between different views.
- **CSS Modules**: Scoped styling for better organization and maintainability, ensuring a consistent and visually appealing user interface.

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository to your local machine:

    ```
    git clone https://github.com/Rachitcitrusbug/drf-and-react-sample.git
    ```

2. Navigate to the project directory:

    ```
    cd drf-and-react-sample/client
    ```

3. Install dependencies using npm or yarn:

    ```
    npm install
    ```

    or

    ```
    yarn install
    ```

4. Start the development server:

    ```
    npm start
    ```

    or

    ```
    yarn start
    ```

5. Open your browser and navigate to `http://localhost:3000` to view the application.
