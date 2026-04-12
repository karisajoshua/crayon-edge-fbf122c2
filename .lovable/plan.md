

## Plan: Parent Toolkit Page, Mobile Article Improvements, and Category Featured Images

### 1. Parent Toolkit Page

**What it is:** A new "Parent Toolkit" page accessible from the main navigation bar. It displays downloadable parenting resources (checklists, guides, printables) as visually appealing flip cards — front shows a generated 2D cartoon-style image, back shows description and download button. Cards are filterable by category.

**Database changes:**
- New `toolkit_items` table: `id`, `title`, `description`, `category` (text), `image_url`, `file_url`, `created_at`, `is_active`
- RLS: public SELECT for active items, admin ALL for management

**New files:**
- `src/pages/ParentToolkit.tsx` — Public page with flip cards grid, category filter chips, and download buttons
- `src/pages/admin/ToolkitManager.tsx` — Admin CRUD page: upload image + downloadable file, set title/description/category

**Modified files:**
- `src/components/Navigation.tsx` — Add "Parent Toolkit" link between Blog and Contact
- `src/components/admin/AdminLayout.tsx` — Add Toolkit nav item
- `src/App.tsx` — Add routes for `/toolkit` and `/admin/toolkit`

**Design:** Flip cards with CSS 3D transform. Front: image with title overlay. Back: description + "Download" button. Mobile: 1 column, tablet: 2 columns, desktop: 3 columns. Filter bar at top with category chips.

---

### 2. Improve Mobile Article Readability

**Modified files:**
- `src/pages/BlogPost.tsx` — Adjust padding, font sizes, spacing for mobile:
  - Reduce `px-4` to tighter content margins on small screens
  - Scale heading from `text-4xl` to `text-2xl` on mobile
  - Add `text-base md:text-lg` to content prose
  - Improve excerpt and meta spacing
- `src/index.css` — Add mobile-specific blog content styles:
  - Smaller paragraph spacing on mobile
  - Better image sizing within content on small screens
  - Ensure inline images don't overflow

---

### 3. Category Featured Image Upload in Admin

**Modified file:**
- `src/pages/admin/Categories.tsx` — Add image upload field to the category creation form:
  - File input for image upload to `blog-images` storage bucket
  - Preview of uploaded image
  - Display current image in the existing categories list
  - Upload image on form submit, store URL in `image_url` column (already exists on `categories` table)

No database changes needed — `categories.image_url` column already exists.

---

### Technical Summary

| Change | Files | DB Migration |
|--------|-------|-------------|
| Parent Toolkit page | 3 new, 3 modified | Yes — `toolkit_items` table |
| Mobile article readability | 2 modified | No |
| Category featured image | 1 modified | No |

