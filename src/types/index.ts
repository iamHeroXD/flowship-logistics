export type UserRole = 'CUSTOMER' | 'DISPATCHER' | 'DRIVER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  organizationId?: string;
  addresses?: Address[];
  createdAt: string;
  updatedAt: string;
  isVerified?: boolean;
}

export interface Address {
  id: string;
  label?: string; // e.g. "Headquarters", "Warehouse A"
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export type ShipmentStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type DeliveryTier = 'SAME_DAY' | 'EXPRESS' | 'STANDARD' | 'SCHEDULED';

export interface PackageDetails {
  weightKg: number;
  dimensions: {
    lengthCm: number;
    widthCm: number;
    heightCm: number;
  };
  category: 'ELECTRONICS' | 'DOCUMENTS' | 'PERISHABLE' | 'GENERAL' | 'HAZARDOUS' | 'FRAGILE';
  description: string;
  declaredValue: number;
  currency: string;
}

export interface ProofOfDelivery {
  receiverName: string;
  signatureDataUrl?: string;
  photoUrl?: string;
  signedAt: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  notes?: string;
}

export interface ShipmentEvent {
  id: string;
  timestamp: string;
  status: ShipmentStatus;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  actorName: string;
  actorRole: UserRole;
  notes?: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string; // e.g. FLW-2026-89421
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  organizationId?: string;
  
  origin: Address;
  destination: Address;
  
  package: PackageDetails;
  deliveryTier: DeliveryTier;
  scheduledPickup?: string;
  scheduledDelivery?: string;
  specialInstructions?: string;

  status: ShipmentStatus;
  events: ShipmentEvent[];

  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleId?: string;

  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;

  pricing: PricingQuote;
  payment: PaymentRecord;
  proofOfDelivery?: ProofOfDelivery;

  createdAt: string;
  updatedAt: string;
}

export interface PricingQuote {
  basePrice: number;
  distanceKm: number;
  distanceFee: number;
  weightFee: number;
  tierMultiplier: number;
  zoneSurcharge: number;
  fuelSurcharge: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
}

export type PaymentMethod = 'CARD' | 'BANK_TRANSFER' | 'WALLET' | 'CASH_ON_DELIVERY';
export type PaymentStatus = 'CREATED' | 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED';

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  provider: 'STRIPE' | 'PAYSTACK' | 'FLUTTERWAVE' | 'INTERNAL_WALLET' | 'COD';
  transactionReference: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. INV-2026-0041
  shipmentId: string;
  trackingNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  billingAddress: Address;
  lineItems: {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
  paymentStatus: PaymentStatus;
  issuedDate: string;
  dueDate: string;
}

export type DriverStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export interface Driver {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  rating: number;
  totalDeliveries: number;
  status: DriverStatus;
  currentLocation: {
    lat: number;
    lng: number;
    lastUpdated: string;
  };
  assignedVehicleId?: string;
  activeShipmentIds: string[];
}

export type VehicleType = 'CARGO_VAN' | 'BOX_TRUCK' | 'MOTORCYCLE' | 'ELECTRIC_VAN' | 'SEMI_TRAILER';

export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  type: VehicleType;
  maxWeightCapacityKg: number;
  maxVolumeCapacityM3: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'DECOMMISSIONED';
  assignedDriverId?: string;
  lastMaintenanceDate: string;
  nextMaintenanceDue: string;
  mileageKm: number;
}

export interface Warehouse {
  id: string;
  code: string; // e.g. WH-ORD-01
  name: string;
  city: string;
  country: string;
  address: string;
  capacityTotalM3: number;
  capacityUsedM3: number;
  status: 'OPERATIONAL' | 'FULL' | 'MAINTENANCE';
  managerName: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  warehouseId: string;
  warehouseCode: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
  reorderLevel: number;
  unitValue: number;
  currency: string;
  updatedAt: string;
}

export interface BusinessAccount {
  id: string;
  name: string;
  industry: string;
  contactEmail: string;
  billingEmail: string;
  phone: string;
  creditLimit: number;
  balance: number;
  currency: string;
  apiKey: string;
  plan: 'ENTERPRISE_CUSTOM' | 'GROWTH_TIER' | 'STANDARD_B2B';
  membersCount: number;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  ipAddress?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'SHIPMENT' | 'PAYMENT' | 'SYSTEM' | 'SECURITY';
  read: boolean;
  linkUrl?: string;
  createdAt: string;
}
