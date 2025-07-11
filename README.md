# Task Manager API

A full-stack task management application built with ASP.NET Core Web API and Angular.
<img width="811" height="563" alt="image" src="https://github.com/user-attachments/assets/9c0f3f37-c517-4c65-8a53-4f13b8f43fb3" />

<img width="1331" height="673" alt="image" src="https://github.com/user-attachments/assets/532baf1a-e306-49b6-a078-99392f8c1206" />

<img width="1320" height="665" alt="image" src="https://github.com/user-attachments/assets/23a840f5-e23f-4644-81ee-3730b3fe34c7" />


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

**If you don’t want to use your private registry**  
1. Force npm to use the default public registry
```bash
   npm config set registry https://registry.npmjs.org/
```

2. Delete lock file and reinstall dependencies
```bash
   rm package-lock.json
   rm -rf node_modules
   npm install
```

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



