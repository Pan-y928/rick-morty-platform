FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY RickMorty.Api/RickMorty.Api.csproj RickMorty.Api/
RUN dotnet restore RickMorty.Api/RickMorty.Api.csproj

COPY RickMorty.Api/ RickMorty.Api/
WORKDIR /src/RickMorty.Api
RUN dotnet publish -c Release -o /app/publish --no-restore /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 10000
ENTRYPOINT ["dotnet", "RickMorty.Api.dll"]
