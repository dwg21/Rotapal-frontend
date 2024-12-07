export interface Notification {
  id: string;
  type: string;
  message: string;
  createdAt: string;
}

export interface ShiftSwapRequest {
  _id: string;
  fromShiftId: string;
  toShiftId: string;
  fromEmployeeId: string;
  toEmployeeId: string;
  rotaId: string;
  businessId: string;
  venueId: string;
  status: string;
  message: string;
  createdAt: string;
}

export interface Holiday {
  _id: string;
  user: string;
  businessId: string;
  date: string;
  status: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  swapRequests: ShiftSwapRequest[];
  holidays: Holiday[];
}
