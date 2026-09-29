import fs from 'fs';
import path from 'path';
import { DatabaseSchema, initialSeedData } from './seed';
import { Shipment, User, Driver, Vehicle, Warehouse, InventoryItem, BusinessAccount, AuditLog, NotificationItem, Invoice, ShipmentStatus, ShipmentEvent } from '@/types';

import os from 'os';

function getDbFilePath(): string {
  // If running in Vercel serverless environment, store in os.tmpdir()
  if (process.env.VERCEL === '1') {
    return path.join(os.tmpdir(), 'flowship.json');
  }
  return path.join(process.cwd(), 'data', 'flowship.json');
}

const DB_FILE_PATH = getDbFilePath();
const BUNDLED_SEED_PATH = path.join(process.cwd(), 'data', 'flowship.json');

class DatabaseEngine {
  private cache: DatabaseSchema | null = null;
  private isWriting = false;

  private ensureDataDir(targetPath: string): void {
    try {
      const dir = path.dirname(targetPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch (e) {
      // Ignore directory creation errors in constrained environments
    }
  }

  public getData(): DatabaseSchema {
    if (this.cache) {
      return this.cache;
    }

    this.ensureDataDir(DB_FILE_PATH);

    // If active db file exists, load it
    if (fs.existsSync(DB_FILE_PATH)) {
      try {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        this.cache = JSON.parse(raw);
        return this.cache!;
      } catch (err) {
        console.warn('Error reading DB_FILE_PATH, will check bundled seed:', err);
      }
    }

    // If bundled seed file exists in project root data/
    if (fs.existsSync(BUNDLED_SEED_PATH)) {
      try {
        const raw = fs.readFileSync(BUNDLED_SEED_PATH, 'utf-8');
        this.cache = JSON.parse(raw);
        this.persistSync();
        return this.cache!;
      } catch (err) {
        console.warn('Error reading BUNDLED_SEED_PATH:', err);
      }
    }

    // Default to code-defined initial seed data
    this.cache = JSON.parse(JSON.stringify(initialSeedData));
    this.persistSync();
    return this.cache!;
  }

  private persistSync(): void {
    if (!this.cache) return;
    try {
      this.ensureDataDir(DB_FILE_PATH);
      const tempPath = `${DB_FILE_PATH}.${Date.now()}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.cache, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE_PATH);
    } catch (err) {
      // In serverless / read-only contexts, in-memory cache remains active
      console.warn('Warning: Disk write failed, maintaining in-memory database:', err);
    }
  }

  public save(): void {
    this.persistSync();
  }

  // Users
  public getUsers() {
    return this.getData().users;
  }

  public getUserById(id: string) {
    return this.getData().users.find((u) => u.id === id);
  }

  public getUserByEmail(email: string) {
    return this.getData().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: DatabaseSchema['users'][0]) {
    const data = this.getData();
    data.users.push(user);
    this.save();
    return user;
  }

  // Shipments
  public getShipments(): Shipment[] {
    return this.getData().shipments;
  }

  public getShipmentById(id: string): Shipment | undefined {
    return this.getData().shipments.find((s) => s.id === id);
  }

  public getShipmentByTrackingNumber(trackingNumber: string): Shipment | undefined {
    return this.getData().shipments.find(
      (s) => s.trackingNumber.trim().toUpperCase() === trackingNumber.trim().toUpperCase()
    );
  }

  public getShipmentsByCustomerId(customerId: string): Shipment[] {
    return this.getData().shipments.filter((s) => s.customerId === customerId);
  }

  public getShipmentsByDriverId(driverId: string): Shipment[] {
    return this.getData().shipments.filter((s) => s.driverId === driverId);
  }

  public createShipment(shipment: Shipment): Shipment {
    const data = this.getData();
    data.shipments.unshift(shipment);
    this.save();
    return shipment;
  }

  public updateShipment(id: string, updates: Partial<Shipment>): Shipment | null {
    const data = this.getData();
    const idx = data.shipments.findIndex((s) => s.id === id);
    if (idx === -1) return null;

    data.shipments[idx] = {
      ...data.shipments[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return data.shipments[idx];
  }

  // Drivers
  public getDrivers(): Driver[] {
    return this.getData().drivers;
  }

  public getDriverById(id: string): Driver | undefined {
    return this.getData().drivers.find((d) => d.id === id);
  }

  public getDriverByUserId(userId: string): Driver | undefined {
    return this.getData().drivers.find((d) => d.userId === userId);
  }

  public updateDriver(id: string, updates: Partial<Driver>): Driver | null {
    const data = this.getData();
    const idx = data.drivers.findIndex((d) => d.id === id);
    if (idx === -1) return null;

    data.drivers[idx] = {
      ...data.drivers[idx],
      ...updates,
    };
    this.save();
    return data.drivers[idx];
  }

  // Vehicles
  public getVehicles(): Vehicle[] {
    return this.getData().vehicles;
  }

  public getVehicleById(id: string): Vehicle | undefined {
    return this.getData().vehicles.find((v) => v.id === id);
  }

  public updateVehicle(id: string, updates: Partial<Vehicle>): Vehicle | null {
    const data = this.getData();
    const idx = data.vehicles.findIndex((v) => v.id === id);
    if (idx === -1) return null;

    data.vehicles[idx] = {
      ...data.vehicles[idx],
      ...updates,
    };
    this.save();
    return data.vehicles[idx];
  }

  // Warehouses & Inventory
  public getWarehouses(): Warehouse[] {
    return this.getData().warehouses;
  }

  public getInventory(): InventoryItem[] {
    return this.getData().inventory;
  }

  public updateInventoryItem(id: string, updates: Partial<InventoryItem>): InventoryItem | null {
    const data = this.getData();
    const idx = data.inventory.findIndex((i) => i.id === id);
    if (idx === -1) return null;

    data.inventory[idx] = {
      ...data.inventory[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return data.inventory[idx];
  }

  // Invoices
  public getInvoices(): Invoice[] {
    return this.getData().invoices;
  }

  public getInvoiceById(id: string): Invoice | undefined {
    return this.getData().invoices.find((i) => i.id === id);
  }

  public createInvoice(invoice: Invoice): Invoice {
    const data = this.getData();
    data.invoices.unshift(invoice);
    this.save();
    return invoice;
  }

  // Notifications
  public getNotifications(userId: string): NotificationItem[] {
    return this.getData().notifications.filter((n) => n.userId === userId);
  }

  public createNotification(notification: NotificationItem): NotificationItem {
    const data = this.getData();
    data.notifications.unshift(notification);
    this.save();
    return notification;
  }

  public markNotificationAsRead(id: string, userId: string): boolean {
    const data = this.getData();
    const notif = data.notifications.find((n) => n.id === id && n.userId === userId);
    if (notif) {
      notif.read = true;
      this.save();
      return true;
    }
    return false;
  }

  public markAllNotificationsAsRead(userId: string): void {
    const data = this.getData();
    data.notifications.forEach((n) => {
      if (n.userId === userId) {
        n.read = true;
      }
    });
    this.save();
  }

  // Audit Logs
  public getAuditLogs(): AuditLog[] {
    return this.getData().auditLogs;
  }

  public createAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const fullLog: AuditLog = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...log,
    };
    const data = this.getData();
    data.auditLogs.unshift(fullLog);
    this.save();
    return fullLog;
  }

  // Pricing Rules
  public getPricingRules() {
    return this.getData().pricingRules;
  }

  public updatePricingRules(rules: Partial<DatabaseSchema['pricingRules']>) {
    const data = this.getData();
    data.pricingRules = { ...data.pricingRules, ...rules };
    this.save();
    return data.pricingRules;
  }

  // Businesses
  public getBusinesses(): BusinessAccount[] {
    return this.getData().businesses;
  }
}

export const db = new DatabaseEngine();
