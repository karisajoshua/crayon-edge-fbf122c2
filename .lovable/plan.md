
## Rich Text Editor Enhancements Plan

This plan adds two improvements to the blog post editor:
1. **Visual link styling** - Links will appear in a distinct blue color so you can easily identify them while editing
2. **Resizable images** - Images inserted in the content can be resized by dragging corner handles

---

### Changes Overview

#### 1. Add Link Color Styling in Editor

**What will change:**
- Links in the editor will display in a blue color (similar to standard web links)
- When you click on linked text, it will be clearly visible as a link

**How it works:**
- Add CSS styles to the editor content area that target anchor tags
- Links will appear blue with an underline in the editor

---

#### 2. Add Resizable Image Support

**What will change:**
- When you insert an image, you can click on it to select it
- Drag handles will appear at the corners
- Drag any corner to resize the image to your preferred size
- The image size will be saved with the post content

**How it works:**
- Install a TipTap image resize extension (`tiptap-extension-resize-image`)
- Replace the standard Image extension with the resizable version
- Add necessary CSS for resize handles and selection styling

---

### Technical Details

#### Files to Modify

**1. `package.json`**
- Add dependency: `tiptap-extension-resize-image`

**2. `src/components/admin/RichTextEditor.tsx`**
- Replace `Image` import with `ImageResize` from the new package
- Update extensions array to use the resizable image extension

**3. `src/index.css`**
- Add editor-specific styles for:
  - Link color (blue with underline)
  - Image resize handles styling
  - Selected image border styling

---

### Visual Preview

After implementation:

**Links:**
- Normal text appears in default color
- Linked text appears in blue (#3b82f6) with underline
- Easy to distinguish at a glance

**Images:**
- Click an image to select it (shows border)
- Drag any corner handle to resize
- Release to set the new size
- Size is preserved when saving

---

### Implementation Steps

1. Add the `tiptap-extension-resize-image` package
2. Update RichTextEditor to use the resizable image extension
3. Add CSS styles for link coloring and image resize handles
