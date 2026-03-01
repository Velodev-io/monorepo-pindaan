// Gangajal Admin — Service Layer
// These services wrap the apiClient for each domain entity.
// When NEXT_PUBLIC_USE_MOCK_ADMIN_DATA=true, apiClient intercepts all calls.
export { ProductService } from "./product.service";
export { OrderService } from "./order.service";
export { ShippingService } from "./shipping.service";
