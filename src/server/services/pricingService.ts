import { DeliveryTier, PackageDetails, PricingQuote, Address } from '@/types';
import { db } from '@/server/db';

export class PricingService {
  // Haversine formula to compute great-circle distance between two coordinates in km
  public static calculateDistanceKm(from: { lat: number; lng: number }, to: { lat: number; lng: number }): number {
    const R = 6371; // Earth radius in km
    const dLat = ((to.lat - from.lat) * Math.PI) / 180;
    const dLng = ((to.lng - from.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((from.lat * Math.PI) / 180) *
        Math.cos((to.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;
    return Math.max(1, Math.round(dist * 10) / 10);
  }

  public static calculateQuote(params: {
    origin: Address;
    destination: Address;
    packageDetails: PackageDetails;
    deliveryTier: DeliveryTier;
  }): PricingQuote {
    const rules = db.getPricingRules();

    const distanceKm = this.calculateDistanceKm(
      params.origin.coordinates || { lat: 40.7128, lng: -74.006 },
      params.destination.coordinates || { lat: 40.7589, lng: -73.9851 }
    );

    // Chargeable weight is the maximum between actual weight and dimensional weight
    const volumetricWeightKg =
      (params.packageDetails.dimensions.lengthCm *
        params.packageDetails.dimensions.widthCm *
        params.packageDetails.dimensions.heightCm) /
      5000;
    const chargeableWeight = Math.max(params.packageDetails.weightKg, volumetricWeightKg, 0.5);

    const basePrice = rules.baseRate;
    const distanceFee = Math.round(distanceKm * rules.perKmRate * 100) / 100;
    const weightFee = Math.round(chargeableWeight * rules.perKgRate * 100) / 100;

    const tierMultiplier = rules.tierMultipliers[params.deliveryTier] || 1.0;

    // Determine zone surcharge
    let zoneSurcharge = rules.zoneSurcharges.METRO;
    if (distanceKm > 50 && distanceKm <= 300) {
      zoneSurcharge = rules.zoneSurcharges.REGIONAL;
    } else if (distanceKm > 300) {
      zoneSurcharge = rules.zoneSurcharges.CROSS_BORDER;
    }

    const subtotalBeforeTier = basePrice + distanceFee + weightFee + zoneSurcharge;
    const adjustedSubtotal = Math.round(subtotalBeforeTier * tierMultiplier * 100) / 100;

    const fuelSurcharge = Math.round(adjustedSubtotal * rules.fuelSurchargePercent * 100) / 100;
    const tax = Math.round((adjustedSubtotal + fuelSurcharge) * rules.taxPercent * 100) / 100;
    const total = Math.round((adjustedSubtotal + fuelSurcharge + tax) * 100) / 100;

    return {
      basePrice,
      distanceKm,
      distanceFee,
      weightFee,
      tierMultiplier,
      zoneSurcharge,
      fuelSurcharge,
      tax,
      discount: 0,
      total,
      currency: 'USD',
    };
  }
}
