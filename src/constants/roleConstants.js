// Định nghĩa các role
export const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee', 
  CUSTOMER: 'customer'
};

// Định nghĩa permissions cho từng role
export const PERMISSIONS = {
  [ROLES.ADMIN]: [
    'dashboard.view',
    'users.manage',
    'courses.manage',
    'subscriptions.manage',
    'payments.manage',
    'reports.view',
    'settings.manage',
    'instruments.manage',
    'vouchers.manage'
  ],
  [ROLES.EMPLOYEE]: [
    'dashboard.view',
    'users.view',
    'courses.manage',
    'subscriptions.view',
    'payments.view',
    'reports.view',
    'instruments.view',
    'vouchers.view'
  ],
  [ROLES.CUSTOMER]: [
    'dashboard.view',
    'profile.manage',
    'courses.view',
    'subscriptions.view',
    'payments.view',
    'instruments.view'
  ]
};

// Định nghĩa routes cho từng role
export const ROLE_ROUTES = {
  [ROLES.ADMIN]: [
    { path: '/admin', name: 'Dashboard', icon: 'dashboard' },
    { path: '/admin/users', name: 'Người dùng', icon: 'users' },
    { path: '/admin/courses', name: 'Khóa học', icon: 'courses' },
    { path: '/admin/payments', name: 'Thanh toán', icon: 'payments' },
    { path: '/admin/vouchers', name: 'Voucher', icon: 'vouchers' },
    { path: '/admin/reports', name: 'Báo cáo', icon: 'reports' }
  ],
  [ROLES.EMPLOYEE]: [
    { path: '/employee', name: 'Dashboard', icon: 'dashboard' },
    { path: '/employee/courses', name: 'Khóa học', icon: 'courses' },
    { path: '/employee/users', name: 'Người dùng', icon: 'users' },
    { path: '/employee/reports', name: 'Báo cáo', icon: 'reports' }
  ],
  [ROLES.CUSTOMER]: [
    { path: '/home', name: 'Trang chủ', icon: 'home' },
    { path: '/instrument-select', name: 'Chọn nhạc cụ', icon: 'sound' },
    { path: '/dan-tranh', name: 'Đàn Tranh', icon: 'play' },
    { path: '/dan-tranh/songs', name: 'Danh sách bài hát', icon: 'book' },
    { path: '/dan-tranh/ranking', name: 'Bảng xếp hạng', icon: 'trophy' },
    { path: '/dan-tranh/profile', name: 'Hồ sơ cá nhân', icon: 'profile' },
    { path: '/subscription', name: 'Gói đăng ký', icon: 'subscription' },
    { path: '/favorites', name: 'Yêu thích', icon: 'heart' },
    { path: '/settings', name: 'Cài đặt', icon: 'settings' }
  ]
};
