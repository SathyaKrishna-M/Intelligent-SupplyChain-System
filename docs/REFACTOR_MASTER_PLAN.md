# Refactor Master Plan

## 1. Files to Delete
**Total Expected Removals**: 7 dead files.
See `DEAD_CODE_REPORT.md` for exact targets.

## 2. Files to Merge
- Merge all `XHandler.java` classes into `GenericApiHandler.java`.
- Merge repetitive DTOs into a single generic `ResponseDTO`.

## 3. Structural Shifts
- **Database**: Replace `FileManager.java` with SQLite/PostgreSQL to fix scalability blocks.
- **Routing**: Introduce a proper router layer in Java instead of `ApiServer` massive context list.

## Expected Benefits
- **30% Code Reduction**: Eliminating pass-through services and genericizing handlers.
- **Cloud Scalability**: Moving away from `txt` files allows Docker clustering.

## Potential Risks
- Removing artificial DSAs (AVL/BST) will drop the "Faculty Evaluation Value". Keep them if this project is strictly for grading!
