
export type InventoryState =
  | 'AVAILABLE'
  | 'RESERVED'
  | 'CHECKOUT'
  | 'SOLD'
  | 'EXPIRED';

export type InventoryEvent =
  | 'RESERVE'
  | 'CONFIRM'
  | 'CANCEL'
  | 'EXPIRE';

export interface Reservation {
  itemId: string;
  userId: string;
  expiresAt: number;
}

/**
 * BẢNG CHUYỂN TRẠNG THÁI HỢP LỆ
 *
 * Current State  | Event   | Next State
 * ---------------|---------|-------------
 * AVAILABLE      | RESERVE | RESERVED
 * RESERVED       | CONFIRM | CHECKOUT
 * RESERVED       | CANCEL  | AVAILABLE
 * RESERVED       | EXPIRE  | EXPIRED
 * CHECKOUT       | CONFIRM | SOLD
 * CHECKOUT       | CANCEL  | AVAILABLE
 * CHECKOUT       | EXPIRE  | EXPIRED
 *
 * CÁC CHUYỂN TRẠNG THÁI BỊ CẤM
 *
 * AVAILABLE --CONFIRM--> CHECKOUT/SOLD
 * AVAILABLE --CANCEL--> AVAILABLE
 * AVAILABLE --EXPIRE--> EXPIRED
 *
 * RESERVED --RESERVE--> RESERVED (đặt trùng)
 * RESERVED --CANCEL--> EXPIRED
 * RESERVED --CONFIRM--> SOLD (bỏ qua CHECKOUT)
 *
 * CHECKOUT --RESERVE--> RESERVED
 * CHECKOUT --CONFIRM--> CHECKOUT (xác nhận lặp)
 *
 * SOLD --RESERVE--> RESERVED
 * SOLD --CONFIRM--> SOLD
 * SOLD --CANCEL--> AVAILABLE
 * SOLD --EXPIRE--> EXPIRED
 *
 * EXPIRED --RESERVE--> RESERVED
 * EXPIRED --CONFIRM--> SOLD
 *
 * INVARIANTS
 *
 * - SOLD là trạng thái cuối; không được chuyển sang trạng thái khác.
 * - EXPIRED không thể được sử dụng lại trong reservation hiện tại.
 * - Chỉ reservation hợp lệ, chưa hết hạn mới được CONFIRM.
 * - Việc chuyển trạng thái tồn kho phải được thực hiện nguyên tử
 *   để tránh bán vượt số lượng tồn kho trong flash-sale.
 *
 * NOTE
 *
 * Đây là contract và bảng đặc tả, chưa triển khai logic.
 */
