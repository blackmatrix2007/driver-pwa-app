🚚 Tính năng chính:
1. Màn hình đăng nhập

Sử dụng API CheckLogin với keyPass: "Gdc825@"
Lưu thông tin người dùng (userName, idLaiXe, type, typeText)
Phân quyền hiển thị nút tạo chuyến cho tài khoản Điều vận

2. Màn hình lịch tháng

Hiển thị lịch dạng grid 7x6 có thể scroll ngang
Màu sắc theo trạng thái:

🔴 Chờ xác nhận (đỏ)
🟢 Đã nhận chuyến (xanh lá)
🟠 Đang giao (cam)
🔵 Đã giao (xanh dương)
🟣 Hoàn thành (tím)


Click vào chuyến để xem chi tiết
Nút tạo chuyến mới cho Điều vận

3. Màn hình chi tiết chuyến xe

Hiển thị đầy đủ thông tin chuyến
Cập nhật trạng thái theo thứ tự: Chờ xác nhận → Đã nhận → Đang giao → Đã giao → Hoàn thành
Upload ảnh từ camera hoặc thư viện
Không cho phép chỉnh sửa khi "Hoàn thành"

4. Màn hình lịch sử

Xem lịch sử theo tháng
Hiển thị danh sách từ gần đây về trước
Click để xem chi tiết

5. Tính năng tạo chuyến (Điều vận)

Modal với các dropdown: lái xe, khách hàng, địa chỉ, tải trọng, xe
Sử dụng các API: GetInfor_Customer, GetInfor_Driver, GetInfor_Payload, GetInfor_Truck, GetInfor_ShippingAddress

🔧 Tính năng PWA:

Offline support: Service Worker cache các tài nguyên
Mobile responsive: Tối ưu cho điện thoại
Push notifications: Hỗ trợ thông báo
Install prompt: Có thể cài đặt như app native

🎨 Giao diện:

Material Design với gradient đẹp mắt
Navigation bottom cố định
Modal popup cho tạo chuyến
Icons emoji cho dễ nhận biết
Responsive hoàn toàn

📱 Cách sử dụng:

Đăng nhập bằng tài khoản
Xem lịch chuyến xe trong tháng
Click vào chuyến để xem chi tiết và cập nhật trạng thái
Tài khoản Điều vận có thể tạo chuyến mới
Xem lịch sử trong tab "Lịch sử"

Ứng dụng đã implement đầy đủ các API theo yêu cầu và có thể hoạt động offline. Bạn có muốn tôi điều chỉnh thêm tính năng nào khác không?
