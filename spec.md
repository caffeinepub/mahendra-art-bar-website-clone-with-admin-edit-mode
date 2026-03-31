# Mahendra Art Bar Website Clone with Admin Edit Mode

## Overview
An exact clone of the Mahendra Art Bar website (https://mahendraart-bar.caffeine.xyz) that replicates all design elements, layout, styling, images, and visual structure with complete fidelity to the original site, but with all textual content translated to English. The application includes an Internet Identity authentication system with comprehensive edit mode functionality for content management.

## Core Features
- Pixel-perfect replication of the original website design and layout
- Identical navigation structure and menu system with additional Admin option
- All pages and sections matching the source site structure exactly
- Same color scheme, typography, and visual styling
- Interactive elements functioning as in the original
- Content displayed in English language (translated from original Hindi)
- Responsive design matching original mobile and desktop layouts
- Internet Identity authentication system for admin access
- Admin Edit Mode with inline content editing capabilities for all text and images

## Navigation Structure
- Home, About, Gallery, Contact (matching original site)
- Admin navigation option added next to Contact
- Admin option opens Internet Identity login flow
- Post-login redirect to current page with edit mode automatically activated

## Authentication System
- Internet Identity integration for admin authentication
- Principal-based authorization for admin access
- Session management for admin access
- Secure authentication flow using Internet Identity
- Access control for admin-only areas and edit mode
- Admin principal verification for edit permissions

## Admin Edit Mode
- Automatic activation of edit mode immediately upon successful admin login
- No "Coming Soon" or read-only states - edit mode must be fully functional
- "Editing Active" visual indicator badge prominently displayed when editing is active
- All text content rendered using EditableText components for inline editing
- All images rendered using EditableImage components with upload overlay functionality
- Image upload overlay appears on hover or click for each image when in edit mode
- "Edit Image" or upload button overlay displayed on all images during edit mode
- Direct image replacement functionality with drag-and-drop or file selection
- Save Changes button that calls updateWebsiteContent function to persist all modifications to backend
- Cancel button to discard all unsaved changes and revert to original content
- Real-time preview of edits before saving
- Protected editing functions accessible only to logged-in admin principals
- Edit mode overlay or visual indicators for all editable elements
- Click-to-edit functionality for all text elements using EditableText
- Image upload interface for replacing existing images using EditableImage
- Immediate edit mode activation without any placeholder or delay states

## Content Management
- Backend storage of all website content in websiteContent data structure
- updateWebsiteContent function for persisting all content changes including image uploads to backend
- All content changes immediately reflected for all users after saving
- Image upload handling and storage for all site images with file management
- Image file processing and optimization for web display
- Text content stored as editable fields in backend
- Content retrieval and display system for both public and edit modes
- Real-time content updates across all user sessions
- EditableText components for all text content when admin is authenticated
- EditableImage components with upload overlay for all images when admin is authenticated
- Image replacement system that updates image references in websiteContent

## Image Upload System
- Upload overlay displayed on all images when admin is in edit mode
- Support for common image formats (JPG, PNG, GIF, WebP)
- Image file validation and size restrictions
- Real-time image preview before saving changes
- Image optimization and resizing for web performance
- Secure image upload handling in backend
- Image file storage and retrieval system
- Image URL management and reference updates in websiteContent
- Drag-and-drop image upload functionality
- File browser selection for image uploads
- Image replacement confirmation and preview system

## Content Requirements
- Translate all text content from Hindi to English while maintaining meaning and context
- Preserve identical page structure and information hierarchy
- Maintain original styling including fonts, colors, spacing, and layout
- Include all sections, headers, footers, and content blocks with English translations
- Translate any forms, buttons, or interactive element text to English
- Match original image placements and sizing
- Ensure navigation labels, headings, descriptions, and all user-facing text are in English

## Admin Features
- Internet Identity login integration
- Authentication validation against authorized admin principals
- Automatic edit mode activation immediately after successful login with no delays
- Inline text editing using EditableText components with save and cancel functionality
- Image upload and replacement using EditableImage components with upload overlays for all site images
- Content management interface with real-time editing capabilities
- Logout functionality
- Protected admin routes and edit capabilities
- Prominent "Editing Active" visual indicator for admin users
- Save and Cancel buttons that properly interact with updateWebsiteContent backend function
- Full edit functionality without any placeholder content, "Coming Soon" messages, or read-only states
- Image change functionality with upload overlays and real-time preview

## Visual Requirements
- Exact color matching from the original site
- Identical typography and font styling
- Same spacing, margins, and padding throughout
- Matching image layouts and positioning
- Preserve original visual hierarchy and design elements
- All visual elements remain unchanged except text content language
- Edit mode indicators that don't disrupt original design
- Clear "Editing Active" badge visible when admin is editing
- Edit mode styling that maintains site consistency
- Prominent visual emphasis on active editing state
- Upload overlay styling that integrates seamlessly with existing design
- Image edit indicators that are visible but non-intrusive

## Technical Requirements
- Internet Identity authentication integration
- Backend content management system for storing websiteContent
- updateWebsiteContent function for persisting content changes including image uploads
- Image upload and storage system with file handling capabilities
- Frontend routing for admin functionality
- Dynamic content rendering with EditableText and EditableImage components
- Navigation between sections matching original functionality
- Responsive breakpoints matching original site behavior
- Performance optimization while maintaining visual fidelity
- Session management for Internet Identity authentication
- Real-time content updates and persistence to backend using updateWebsiteContent
- Immediate edit mode activation upon admin login without any intermediate states
- Image processing and optimization for uploaded files
- Secure file upload handling and validation

## Deployment Requirements
- Proper frontend routing configuration for all pages (Home, About, Gallery, Contact, Admin)
- Correct asset path resolution for all images and static files in production environment
- Proper bundling and serving of React components and dependencies
- Correct API endpoint configuration for backend communication
- Proper CORS and network configuration for frontend-backend communication
- Asset serving configuration to ensure all images load correctly from deployed URLs
- Production build optimization and proper entry point configuration
- Route handling for single-page application navigation in production
- Internet Identity integration configuration for production environment
- File upload configuration for production deployment

## Data Storage
- Backend stores authorized admin principals
- Internet Identity session data managed in frontend
- All website content stored as websiteContent in backend
- updateWebsiteContent function handles all content persistence including image data
- Image files stored and managed in backend with proper file handling
- Content versioning and edit history
- Persistent storage of all admin modifications
- Content structure sourced from the referenced website but translated to English
- Image metadata and references stored in websiteContent structure

## Implementation Notes
- All styling and layout must match the source site exactly
- Only textual content should be changed (translated to English)
- Maintain visual consistency across all pages and sections
- Ensure responsive behavior matches the original site
- Preserve all interactive functionality while updating text to English
- Admin functionality should maintain visual consistency with main site design
- Secure handling of admin authentication through Internet Identity
- Edit mode must be immediately functional upon login with no placeholder states
- All text content must use EditableText components when admin is authenticated
- All images must use EditableImage components with upload overlay when admin is authenticated
- Save and Cancel buttons must properly call updateWebsiteContent function
- All content modifications must be immediately reflected and persisted to websiteContent
- Deployment configuration must ensure proper asset loading and API connectivity
- Production environment must serve all routes and assets correctly
- Edit mode restricted to authenticated admin principals only
- No "Coming Soon" messages, placeholder content, or read-only states in admin functionality
- Immediate edit mode activation upon successful admin authentication with full functionality
- Image upload overlays must be intuitive and accessible for admin users
- Image changes must be saved permanently and visible to all users after publishing
