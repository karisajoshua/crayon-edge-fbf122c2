## Plan: Editable Toolkit Resources

Currently the admin toolkit page only supports adding and deleting resources. This plan adds inline editing so admins can modify existing resources without deleting and recreating them.

### Changes

**File: `src/pages/admin/ToolkitManager.tsx`**

1. **Add edit state**
   - `editingId` — tracks which resource is in edit mode
   - `editFormData` — holds the form values while editing

2. **Add edit actions**
   - `handleEdit(item)` — populates the edit form with the selected resource's data
   - `handleUpdate(id)` — submits changes to `toolkit_items` via Supabase `update()`
   - `cancelEdit()` — clears edit state

3. **UI updates for existing resources**
   - Each resource card gets an "Edit" (pencil) button alongside the Delete button
   - When a resource is in edit mode, inline form fields replace the read-only display:
     - Title input
     - Description textarea
     - Category input
     - Image URL input with live preview
     - File URL input
   - "Save" and "Cancel" buttons shown while editing

4. **Imports**
   - Add `Pencil`, `X`, and `Save` icons from `lucide-react`

### No database changes needed
The `toolkit_items` table already supports `UPDATE` for admins via existing RLS policy.
