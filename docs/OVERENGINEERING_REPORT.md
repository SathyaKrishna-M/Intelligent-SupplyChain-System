# Over-Engineering Report

## Architectural Bloat
- **Excess Abstraction Layers**: The Java backend uses a full Controller/Service/Storage structure but implements no database, only relying on `FileManager.java`. This makes the Service layer mostly pass-throughs for `FileManager`.
- **Redundant Handlers**: Every entity has a separate HTTP handler (ProductHandler, OrderHandler) which duplicates standard CRUD logic. A generic REST controller pattern could reduce 10 handlers to 1.
- **Frontend Over-componentization**: Many React components simply wrap single elements or render single static charts without props.

## Recommendations
- Merge repetitive handlers into a generic `EntityHandler<T>`.
- Eliminate pure pass-through methods in Services.
