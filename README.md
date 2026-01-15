# Proximo Brand Muscle

A web-based platform that empowers field teams and national account teams to adapt approved brand creative to fit their specific market or store while maintaining brand integrity.

## Overview

Brand Muscle enables Proximo's regional and field teams to:
- Easily customize core brand creative (SKU swaps, copy changes, pricing)
- Work quickly and independently in-market
- Maintain strict adherence to brand guidelines, layouts, and quality standards

## Features

### Template System
- **Locked Templates**: Brand-approved layouts with protected elements
- **Editable Zones**: Designated areas for customization (SKUs, pricing, copy)
- **Real-time Preview**: See changes instantly as you customize
- **Format Support**: Shelf talkers, end caps, floor displays, digital screens, and more

### Asset Library
- **Product SKUs**: All approved product images organized by brand
- **Logos**: Brand-approved logo variations (full color, white, etc.)
- **Backgrounds**: Approved textures and imagery
- **Badges**: Promotional badges (New, Sale, Limited Edition, Award Winner)

### Approval Workflow
- **Submit for Review**: Send customized assets to brand managers
- **Review Queue**: Brand managers approve or request revisions
- **Audit Trail**: Complete history of approvals and changes
- **Notifications**: Real-time updates on asset status

### Export
- **Multiple Formats**: PNG, JPG, PDF
- **Resolution Options**: Web (72 DPI) or Print (300 DPI)
- **POS Ready**: Optimized for retail point-of-sale materials

### User Roles
- **Admin**: Full system access and configuration
- **Brand Manager**: Template approval and asset review
- **Field Team**: Create and customize assets for assigned brands/markets
- **National Accounts**: Similar to field team with account-specific access

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Export**: html2canvas, jsPDF
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run type-check # Run TypeScript type checking
```

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx         # Dashboard
│   ├── templates/       # Template gallery
│   ├── editor/          # Template editor
│   ├── assets/          # My assets
│   ├── approvals/       # Approval queue
│   └── library/         # Asset library
├── components/
│   ├── layout/          # Sidebar, Header, MainLayout
│   ├── templates/       # TemplateCard, TemplateGallery
│   ├── editor/          # Canvas, Toolbar, Properties, Export
│   ├── approval/        # ApprovalModal, ApprovalQueue
│   └── dashboard/       # Stats, Activity, QuickActions
├── store/               # Zustand state management
├── types/               # TypeScript type definitions
└── data/                # Sample data for demo
```

## Supported Brands

- Jose Cuervo
- 1800 Tequila
- Kraken Black Spiced Rum
- Three Olives Vodka

## Supported Formats

| Format | Dimensions | Use Case |
|--------|-----------|----------|
| Shelf Talker | 4" x 3" | On-shelf pricing/promo |
| End Cap | 24" x 36" | End-of-aisle displays |
| Floor Display | 18" x 24" | Floor standing displays |
| Digital Screen | 1920 x 1080px | In-store digital signage |
| Poster | 18" x 24" | Wall-mounted posters |
| Price Card | 3.5" x 2" | Shelf pricing labels |

## Key Concepts

### Locked vs Editable Elements

Templates contain two types of elements:
- **Locked Elements**: Cannot be modified (logos, disclaimers, brand elements)
- **Editable Elements**: Can be customized within constraints (SKUs, pricing, headlines)

### Constraints

Editable elements have built-in constraints to maintain brand integrity:
- Maximum character counts for text
- Allowed font size ranges
- Pre-approved SKU selections
- Color restrictions

### Markets & Retailers

Assets are organized by:
- **Market**: Regional territories (Southwest, West Coast, etc.)
- **Retailer**: Store chains within markets (Walmart, Total Wine, etc.)

## Success Metrics

The platform delivers local relevance at scale by:
- Allowing markets to show up with the right product
- In the right store
- At the right time
- While protecting brand strength

## License

Proprietary - Proximo Spirits
