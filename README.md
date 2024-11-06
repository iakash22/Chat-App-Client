# Chat Application

A modern chat application frontend built with React, Material-UI, and Redux for state management. This app allows users to log in, register, chat with friends, and manage user profiles. It also includes admin features to manage groups, add/remove members, and more. The app has a fully responsive layout with material design components and routing using `react-router-dom`.

## Features

### User Features
- User authentication (Login & Register)
- Profile management (Update Avatar, Username, Bio)
- Chat interface with friend selection
- Error handling and validation
- Loading states for better UX

### Admin Features
- **Group Management**: Admin can manage groups, delete groups, and add/remove members.
- **User Management**: Admin can view and manage user profiles.
- **Admin Dashboard**: Admin can view all users, groups, and activity.

## Technologies Used

- **React** - For building the user interface.
- **Material-UI (MUI)** - For component library and styling.
- **Redux** - For state management.
- **React-Router** - For client-side routing.
- **Axios** - For API calls.
- **React-Hot-Toast** - For toast notifications.
- **React Hook Form** - For form management and validation.
- **MUI Icons** - For Material Design icons.

## Setup and Installation

### 1. Clone the Repository

First, clone the repository to your local machine.

```bash
git clone https://github.com/iakash22/Chat-App-Client.git
```

### 2. Install Dependencies

Navigate to the project folder and install all the required dependencies.

```bash 
cd chat-App-Client
npm install
```

### 3. Run the Development Server

Start the development server to view the application in your browser.

```bash 
npm start
```

This will run the application on http://localhost:3000.

## Environment Variables

Make sure to create a .env file at the root of your project to store sensitive information like the API base URL and authentication tokens.

Example:
```bash
REACT_APP_API_BASE_URL=http://localhost:5000/api
```



## Project Structure

```

├── src
│   ├── components
│   │   ├── layouts          # Layout components (e.g., AppLayout)
│   │   ├── styles           # Styled components (e.g., VisuallyHiddenInput)
│   │   └── ...              # Other UI components (e.g., AvatarCard, ButtonGroup)
│   ├── pages
│   │   ├── Admin # Admin functionality for managing
│   │   │     ├── AdminLogin.jsx                # Admin Login
│   │   │     ├── ChatMangement.jsx             # Groups and Chats (Manage
│   │   │     ├── UserManagement.jsx            # User (Manage
│   │   │     ├── MessageMangement.jsx          # Message (Manage
│   │   │     └── Dashboard.jsx                 # DashBoard (Manage  
│   │   ├── Home.jsx         # Home page (friend selection)
│   │   ├── Login.jsx        # Login/Register page
│   │   ├── Chat.jsx         # Chat with friends
│   │   ├── Group.jsx        # Managing Groups
│   │   ├── NotFound.jsx     # 404 error page
│   ├── redux
│   │   ├── reducers
│   │   │   └── slice
│   │   ├── actions
│   │   └── store.js
│   ├── services
│   │   ├── api.js           # API endpoints
│   │   └── operations
│   ├── utils                # Utility functions (validators, helpers)
│   ├── App.js               # Main entry point
│   └── index.js             # ReactDOM render
├── public
├── package.json
└── .env


```

## Usage

### 1. Login / Register

- **Login:** Enter your username and password to log in. If you don't have an account, click the "Register" link.

- **Register:** You need to provide a name, username, password, and optional bio and avatar to register.


### 2. Chat Interface

Once logged in, you can start chatting by selecting a friend from your contacts list. The app allows you to see real-time conversations with any selected user.


### 3. Admin Dashboard

- If the logged-in user is an admin, they can access the Admin Dashboard where they can manage groups and users.

- Admins can:
    -   **View Groups:** View and list all chat groups.
    -   **Delete Groups:** Remove any group.
    -   **Add/Remove Members:** Manage group members.
    -   **View Users:** List and manage user profiles.

To access the Admin Dashboard, admins can simply navigate to the Admin Dashboard route.


## Admin Features

### Group Management
- Admin can view a list of groups.

### Message Management
- Admin can view a list of messages.

### User Management
- Admin can view a list of Users.


## Contributing

Contributions are welcome! 

Please feel free to submit a Pull Request or open an Issue if you have any suggestions or improvements.

    1. Fork the repository
    2. Create a new branch (git checkout -b feature-xyz)
    3. Make changes and commit (git commit -am 'Add feature xyz')
    4. Push to the branch (git push origin feature-xyz)
    5. Create a new pull request
## Additional Notes

- Make sure you have Node.js and npm installed on your machine.
- The application uses a RESTful API backend, so ensure the backend server is running and accessible for API calls.
- You can check for available API documentation in the backend repository (if available).


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
