### Db migration Script

```dotnet ef migrations add InitalOne --project Csandun.TaskManagerApi --startup-project Csandun.TaskManagerApi --output-dir Infrastructure/Migrations```

### Database update

```dotnet ef database update --project Csandun.TaskManagerApi --startup-project Csandun.TaskManagerApi```

### TODOs
- [ ] Authorization
- [ ] Add Fluent validation
- [ ] Add services 