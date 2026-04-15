

## Plan: Editable Categories with Image Management

### Problem
Currently, categories can only be created or deleted — there's no way to edit a category's name, description, color, or image after creation.

### Solution
Refactor `src/pages/admin/Categories.tsx` to support inline editing of each category, including:

1. **Edit mode per category** — Click an "Edit" button on any category card to expand an edit form inline
2. **Upload/replace featured image** — File input to upload a new image (replaces existing one)
3. **Remove featured image** — Button to clear the image (sets `image_url` to null) without deleting the category
4. **Edit name, description, color** — All fields editable inline
5. **Save changes** — Updates the category via Supabase `update()`

### Changes

**File: `src/pages/admin/Categories.tsx`**
- Add `editingId` state to track which category is being edited
- Add `editFormData` state for the editing form fields
- For each category card, add Edit (pencil) button next to the Delete button
- When editing, show inline form with name, description, color, and image fields
- Add "Upload Image" / "Remove Image" / "Save" / "Cancel" buttons
- `handleUpdate` function: uploads new image if provided, then calls `supabase.from("categories").update(...)` 
- `handleRemoveImage` function: sets `image_url` to null via update
- Import `Pencil`, `X`, `Upload` icons from lucide-react

No database changes needed — the `categories` table already supports `UPDATE` for admins via existing RLS policy.

