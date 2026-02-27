export type Role = 'admin' | 'customer';

export interface User {
  id: number;
  email: string;
  role: Role;
}

export type ProductType = 'rent' | 'sell' | 'both';

export interface Product {
  id: number;
  name: string;
  description: string;
  product_type: ProductType;
  rent_price: number;
  sale_price: number;
  security_deposit: number;
  total_quantity: number;
  sizes: string[];
  active: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PACKED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'PICKUP_SCHEDULED'
  | 'PICKED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'LATE';

export interface Order {
  id: number;
  user_id: number;
  status: OrderStatus;
  total_price: number;
  deposit_total: number;
  address: string;
  created_at: string;
  user?: User;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  size: string;
  product?: Product;
  rental_booking?: RentalBooking;
}

export interface RentalBooking {
  id: number;
  order_item_id: number;
  product_id: number;
  start_date: string;
  end_date: string;
  size: string;
  status: string;
  product?: Product;
}

export interface DashboardMetrics {
  active_rentals: number;
  upcoming_returns: number;
  late_returns: number;
}
