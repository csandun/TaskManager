# Task Manager API

A full-stack task management application built with ASP.NET Core Web API and Angular.

## Technologies Used

### Backend
- **ASP.NET Core 9.0** - Web API framework
- **Entity Framework Core** - Object-relational mapping (ORM)
- **SQL Server** - Database
- **AutoMapper** - Object-to-object mapping
- **BCrypt.Net** - Password hashing
- **Swagger/OpenAPI** - API documentation
- **Basic Authentication** - Custom authentication handler

### Frontend
- **Angular** - Frontend framework
- **TypeScript** - Programming language
- **SCSS** - CSS preprocessor

### Development Tools
- **.NET CLI** - Command-line interface
- **Entity Framework Core Tools** - Database migrations
- **Docker** - Containerization support

## Project Structure

```
TaskManager/
├── Backend/
│   └── Csandun.TaskManagerApi/
│       ├── Controllers/          # API controllers
│       ├── Models/              # Domain models
│       ├── DTOs/                # Data transfer objects
│       ├── Infrastructure/      # Data access layer
│       │   ├── DbContext/       # Entity Framework DbContext
│       │   ├── Repositories/    # Repository pattern implementation
│       │   ├── Configurations/  # Entity configurations
│       │   └── Migrations/      # Database migrations
│       ├── Services/            # Business logic layer
│       ├── Middleware/          # Custom middleware
│       ├── Handlers/            # Authentication handlers
│       ├── Exceptions/          # Custom exceptions
│       ├── Mappings/            # AutoMapper profiles
│       └── Helpers/             # Utility classes
└── Frontend/
    └── task-manager-app/        # Angular application
```

## Setup Instructions

### Prerequisites
- .NET 9.0 SDK
- Node.js (v18 or later)
- SQL Server (LocalDB or full instance)
- Visual Studio Code or Visual Studio 2022

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TaskManager/Backend/Csandun.TaskManagerApi
   ```

2. **Restore NuGet packages**
   ```bash
   dotnet restore
   ```

3. **Update database connection string**
   - Edit `appsettings.json` or `appsettings.Development.json`
   - Update the `TaskManagerConnection` connection string to match your SQL Server instance

4. **Create and run database migrations**
   ```bash
   # Create initial migration (if needed)
   dotnet ef migrations add InitialCreate --output-dir Infrastructure/Migrations
   
   # Update database
   dotnet ef database update
   ```

5. **Run the API**
   ```bash
   dotnet run
   ```
   - API will be available at `https://localhost:7071`
   - Swagger documentation at `https://localhost:7071/swagger`

### Frontend Setup

1. **Navigate to Angular project**
   ```bash
   cd ../../Frontend/task-manager-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   ng serve
   ```
   - Application will be available at `http://localhost:4200`

## Database Migration Commands

### Create a new migration
```bash
dotnet ef migrations add <MigrationName> --project Csandun.TaskManagerApi --startup-project Csandun.TaskManagerApi --output-dir Infrastructure/Migrations
```

### Update database
```bash
dotnet ef database update --project Csandun.TaskManagerApi --startup-project Csandun.TaskManagerApi
```

### Remove last migration
```bash
dotnet ef migrations remove --project Csandun.TaskManagerApi --startup-project Csandun.TaskManagerApi
```

## Authentication

The API uses Basic Authentication. A default user is seeded in the database:
- **Username**: `csandun`
- **Password**: `123`

### API Usage Example
```bash
# Get tasks (requires authentication)
curl -X GET "https://localhost:7071/api/tasks" \
  -H "Authorization: Basic Y3NhbmR1bjoxMjM="
```

## API Endpoints

### Tasks
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `GET /api/tasks/user/{userId}` - Get tasks by user
- `PATCH /api/tasks/{id}/complete` - Update task completion status

### Users
- `POST /api/users/login` - User login
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

## Features

- **CRUD operations** for tasks and users
- **Authentication and authorization** with Basic Auth
- **Global exception handling** middleware
- **Automatic password hashing** with BCrypt
- **Database seeding** for initial data
- **CORS support** for Angular frontend
- **Repository pattern** for data access
- **DTO mapping** with AutoMapper
- **API documentation** with Swagger

## Development

### Adding New Migrations
1. Make changes to your models or configurations
2. Create a new migration:
   ```bash
   dotnet ef migrations add <DescriptiveName> --output-dir Infrastructure/Migrations
   ```
3. Update the database:
   ```bash
   dotnet ef database update
   ```

### Running in Development
- Backend: `dotnet run` or `dotnet watch run` for hot reload
- Frontend: `ng serve` for development server with hot reload

## Docker Support

A Dockerfile is included for containerizing the API. To build and run:

```bash
docker build -t task-manager-api .
docker run -p 8080:80 task-manager-api
```
