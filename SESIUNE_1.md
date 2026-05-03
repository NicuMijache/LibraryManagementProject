# Sesiunea 1 — Library Management Project
**Data:** 3 Mai 2026

---

## Ce am construit

Un proiect full-stack complet de la zero, în VS Code:

- **Backend:** ASP.NET Core 10 Web API (port 5079)
- **Frontend:** React + TypeScript + Vite (port 5173)
- **Baza de date:** SQL Server LocalDB cu Entity Framework Core 10

---

## Structura proiectului

```
LibraryManagement/
├── LibraryManagement.API/         ← backend
│   ├── Controllers/               ← HTTP endpoints
│   ├── Services/                  ← logica de business
│   ├── Models/                    ← entitati EF
│   ├── DTOs/                      ← Request + Response DTOs
│   │   ├── Requests/
│   │   └── Responses/
│   ├── Filters/ActionFilters/     ← validari reutilizabile
│   ├── Common/HttpContextKeys.cs  ← constante string tipizate
│   ├── Data/LibraryContext.cs     ← DbContext
│   └── Program.cs
└── library-frontend/              ← frontend React
    └── src/
        ├── pages/                 ← BooksPage, AuthorsPage, etc.
        ├── api/                   ← clienti Axios
        ├── types/index.ts         ← interfete TypeScript
        └── index.css              ← design complet
```

---

## Ce probleme am corectat fata de proiectul vechi

Toate problemele din REVIEW.md au fost rezolvate:

| Problema veche | Solutia aplicata |
|---|---|
| DbContext direct in controller | Service layer — fiecare controller foloseste un service |
| Fara Response DTOs | DTOs separate pentru request/response (nu expune modelul direct) |
| `DateTime.Now` (timezone bug) | `DateTime.UtcNow` peste tot |
| Fara `AsNoTracking` | Adaugat pe toate query-urile read-only |
| Fara `CancellationToken` | Propagat prin toate metodele async |
| CORS deschis (`AllowAnyOrigin`) | `WithOrigins()` din `appsettings.json` |
| `AllowedHosts: *` | Schimbat in `localhost` |
| Fara global exception handler | `app.UseExceptionHandler(...)` in Program.cs |
| Fara `[ProducesResponseType]` | Adaugat pe fiecare actiune din controllere |
| DELETE returna 200 | Schimbat in `NoContent()` (204) |
| Duplicate check cu `.ToLower()` | `EF.Functions.Like` — comparatie case-insensitive la nivel de DB |
| PUT duplicate check era stricat | Trimitem `excludeId` ca sa nu se blocheze pe sine |
| Stergere in cascada | `DeleteBehavior.Restrict` + guard explicit in controller |
| String-uri hardcodate in HttpContext | Clasa `HttpContextKeys` cu constante tipizate |

---

## Concepte importante invatate

### Backend

**Primary constructor** (C# 12):
```csharp
public class AuthorService(LibraryContext context) : IAuthorService { }
```

**EF.Functions.Like** pentru comparatie case-insensitive la nivel de DB:
```csharp
EF.Functions.Like(a.FirstName, firstName)
```

**DeleteBehavior.Restrict** — previne stergerea unui autor care are carti:
```csharp
modelBuilder.Entity<Book>()
    .HasOne(b => b.Author)
    .OnDelete(DeleteBehavior.Restrict);
```

**Action Filters cu DI** (`[TypeFilter]`) — logica de validare scoasa din controller.

**Response DTOs** — computed properties direct in DTO:
```csharp
public string FullName => $"{FirstName} {LastName}";
public bool IsReturned => ReturnDate.HasValue;
```

### Frontend

**CRITIC — `import type` in Vite/TypeScript:**
```ts
import type { Author } from '../types';   // CORECT
import { Author } from '../types';        // EROARE la runtime!
```
Vite/esbuild sterge `export interface` la compilare. Daca folosesti `import` normal
pentru tipuri, aplicatia crapa cu eroare de modul la runtime.

**React Router v7** — redirect implicit de pe `/` pe `/books`:
```tsx
<Route path="/" element={<Navigate to="/books" replace />} />
```

---

## Design frontend

- Sidebar inchis navy (`#0f172a`) cu logo verde cu glow
- Fundal `#f0f4f8`, carduri albe cu shadow
- Font Inter (Google Fonts)
- Stat cards cu gradient bar colorat (verde, albastru, rosu, amber, violet)
- Badges cu dot luminos
- Butoane cu gradient verde + hover lift

---

## Date de test adaugate

**Categorii:** Roman, Stiinta, Istorie, Fictiune, Biografie

**Autori:** Mihai Eminescu, Ion Creanga, Liviu Rebreanu, George Calinescu, Jules Verne, George Orwell

**Carti:** Luceafarul, Poezii, Amintiri din Copilarie, Ion, Enigma Otiliei, 20000 de Leghe sub Mari, Ocolul Pamantului in 80 de Zile, 1984, Ferma Animalelor

---

## Cum pornesti proiectul

```bash
# Terminal 1 — backend
cd LibraryManagement.API
dotnet run

# Terminal 2 — frontend
cd library-frontend
npm run dev
```

Apoi deschide: http://localhost:5173

---

## GitHub

Proiectul este conectat la GitHub. Pentru a face push dupa modificari:
```bash
git add .
git commit -m "mesajul tau"
git push
```
