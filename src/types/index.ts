// Core Types for Brand Creative Platform

export type UserRole = 'admin' | 'brand_manager' | 'field_team' | 'national_accounts';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedBrands: string[];
  assignedMarkets: string[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  colors: BrandColors;
  fonts: BrandFonts;
  guidelines: string;
}

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface BrandFonts {
  heading: string;
  body: string;
}

export interface Market {
  id: string;
  name: string;
  region: string;
  retailers: Retailer[];
}

export interface Retailer {
  id: string;
  name: string;
  logo?: string;
  formats: AssetFormat[];
}

export type AssetFormat =
  | 'shelf-talker'
  | 'end-cap'
  | 'floor-display'
  | 'digital-screen'
  | 'social-square'
  | 'social-story'
  | 'banner'
  | 'poster'
  | 'price-card'
  | 'neck-hanger';

export interface AssetDimensions {
  width: number;
  height: number;
  unit: 'px' | 'in' | 'mm';
}

export const FORMAT_DIMENSIONS: Record<AssetFormat, AssetDimensions> = {
  'shelf-talker': { width: 4, height: 3, unit: 'in' },
  'end-cap': { width: 24, height: 36, unit: 'in' },
  'floor-display': { width: 18, height: 24, unit: 'in' },
  'digital-screen': { width: 1920, height: 1080, unit: 'px' },
  'social-square': { width: 1080, height: 1080, unit: 'px' },
  'social-story': { width: 1080, height: 1920, unit: 'px' },
  'banner': { width: 728, height: 90, unit: 'px' },
  'poster': { width: 18, height: 24, unit: 'in' },
  'price-card': { width: 3.5, height: 2, unit: 'in' },
  'neck-hanger': { width: 2, height: 4, unit: 'in' },
};

export type ElementType = 'image' | 'text' | 'shape' | 'logo' | 'sku' | 'price' | 'qr';

export interface TemplateElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  locked: boolean;
  editable: boolean;
  editableProperties: EditableProperty[];
  content: ElementContent;
  style: ElementStyle;
  constraints?: ElementConstraints;
}

export type EditableProperty =
  | 'content'
  | 'image'
  | 'color'
  | 'size'
  | 'position';

export interface ElementContent {
  text?: string;
  imageUrl?: string;
  skuId?: string;
  price?: string;
  qrData?: string;
  placeholder?: string;
}

export interface ElementStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  opacity?: number;
  shadow?: boolean;
}

export interface ElementConstraints {
  minFontSize?: number;
  maxFontSize?: number;
  maxCharacters?: number;
  allowedSkus?: string[];
  allowedColors?: string[];
  maintainAspectRatio?: boolean;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  brandId: string;
  format: AssetFormat;
  dimensions: AssetDimensions;
  thumbnailUrl: string;
  elements: TemplateElement[];
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'approved' | 'archived';
  approvedBy?: string;
  version: number;
  tags: string[];
}

export interface CustomizedAsset {
  id: string;
  templateId: string;
  name: string;
  elements: TemplateElement[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'exported';
  marketId?: string;
  retailerId?: string;
  approvalHistory: ApprovalEntry[];
  exportHistory: ExportEntry[];
}

export interface ApprovalEntry {
  id: string;
  userId: string;
  userName: string;
  action: 'submitted' | 'approved' | 'rejected' | 'revision_requested';
  comment?: string;
  timestamp: string;
}

export interface ExportEntry {
  id: string;
  format: 'png' | 'pdf' | 'jpg';
  resolution: 'web' | 'print';
  downloadUrl: string;
  exportedBy: string;
  exportedAt: string;
}

export interface SKU {
  id: string;
  brandId: string;
  name: string;
  variant: string;
  imageUrl: string;
  size: string;
  upc?: string;
  tags: string[];
}

export interface AssetLibrary {
  skus: SKU[];
  logos: LibraryAsset[];
  backgrounds: LibraryAsset[];
  icons: LibraryAsset[];
  badges: LibraryAsset[];
}

export interface LibraryAsset {
  id: string;
  brandId: string;
  name: string;
  type: 'logo' | 'background' | 'icon' | 'badge' | 'graphic';
  url: string;
  thumbnailUrl: string;
  tags: string[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'approval_needed' | 'approved' | 'rejected' | 'comment' | 'export_ready';
  title: string;
  message: string;
  assetId?: string;
  read: boolean;
  createdAt: string;
}
