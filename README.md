# Task Manager API

A full-stack task management application built with ASP.NET Core Web API and Angular.

## Authentication

The API uses Basic Authentication. A default user is seeded in the database:
- **Username**: `csandun`
- **Password**: `123`

## Technologies Used

### Backend
- **ASP.NET Core 9.0** 
- **Entity Framework Core Code First** 
- **SQL Server** 
- **AutoMapper** 
- **Swagger/OpenAPI** 
- **Basic Authentication** 

### Frontend
- **Angular** 
- **TypeScript** 
- **SCSS** 


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

4. **Create and update database migrations**
   ```bash
   
   dotnet ef database update
   ```

5. **Run the API**
   ```bash
   dotnet run
   ```
   - API will be available at `http://localhost:5062`
   - Swagger documentation at `http://localhost:5062/swagger`

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



