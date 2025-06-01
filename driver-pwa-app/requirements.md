Ứng dụng pwa rành cho lái xe (mỗi lái xe có tài khoản để truy cập vào dứng dụng)
Tài khoản Điều vận có thể tạo chuyến trên ứng dụng
Lái xe xem được lịch đặt xe theo thời gian
Lái xe cập nhật tình trạng chuyến xe (nhận chuyến; đang trên đường lấy hàng; đã giao hàng; đã giao giấy giao hàng)
Lái xe có thể gửi hình ảnh từ điện thoại hoặc chụp ảnh trực tiếp từ camera để upload file ảnh lên ứng dụng)
Lái xe xem được báo cáo (lịch sử chuyến trong tháng)
Khi có chuyến mới, cần có thông báo cho tài xế
Lưu ý ứng dụng pwa có thể hoạt động offline 


* handle api post và xử lý như mẫu 
export const url = 'http://hlv-ws.giangdc.company/Admin/GDCService.asmx';
export function post(api, params) {
    //console.warn(api,params);
    Platform.OS == 'ios' && StatusBar.setNetworkActivityIndicatorVisible(true);
    return new Promise(function (resolve, reject) {
        const request = new XMLHttpRequest();
        let strParams = '';
        if (params) {
            Object.keys(params).map((param) => {
                strParams += '<' + param + '>' + params[param] + '</' + param + '>';
            });
        }

        const sr =
            '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
            '<soap:Body>' +
            '<' +
            api +
            ' xmlns="http://tempuri.org/">' +
            strParams +
            '</' +
            api +
            '>' +
            '</soap:Body>' +
            '</soap:Envelope>';
        //console.warn('post ',api,sr);
        request.onload = function () {
            Platform.OS == 'ios' &&
                StatusBar.setNetworkActivityIndicatorVisible(false);
            if (this.status === 200) {
                //console.log(this._response)
                let data = this._response.split('<' + api + 'Result>')[1];
                if (data) {
                    data = data.split('</' + api + 'Result>')[0];
                } else {
                    let dt = this._response.split('<' + api + 'Result />')[1];
                    if (dt) {
                        resolve({ data: [], error: false });
                    }
                }
                // alert(JSON.stringify(data))
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    data = data;
                }
                let Data = data;
                let res = {
                    data: Data,
                    error: false,
                };
                resolve(res);
            } else {
                console.log(this._response)
                resolve({
                    error: true,
                    status: this.status,
                });
                // Something went wrong (404 etc.)
                // reject(this.status);
            }
        };
        request.onerror = function () {
            Platform.OS == 'ios' &&
                StatusBar.setNetworkActivityIndicatorVisible(false);
                //console.log(this._response)
            resolve({
                error: true,
                status: this.status,
            });
        };

        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
        request.responseType = 'json';
        request.send(sr);
    });
}


# Màn login 
Sử dụng API: CheckLogin
Trong đó có các tham số
- keyPass: Gdc825@
- userName: Nhập từ màn này
- Password: Nhập từ màn này
Kết quả
- UserID
- UserName
- type (kiểu int - có thể là một trong các giá trị sau: 1, 2, 3, 4, 5)
- idLaiXe (lưu ý, nếu tài khoản là Điều vận, thì đây là id của Điều vận)
- typeText: Loại tào khoản gồm có các giá trị sau: Trung tâm; Điều vận, Lái xe, Khách hàng

Nếu thành công, chuyển sang màn Lịch tháng
Nếu không thành công, hiển thị thông báo lỗi

Nên lưu: userName, idLaiXe, type hoặc typeText để phục vụ cho các màn sau;



#Màn lịch tháng 
- Hiển thị lịch tháng
- Trong mỗi ngày,nếu có chuyến xe của lái xe đó; sẽ hiển thị; chuyến đã chạy thì màu trắng; chuyến không chạy; màu đỏ, chuyến chưa chạy thì màu xanh; chuyến đang chạy thì màu khác
- Mỗi chuyến sẽ hiển thị giờ bắt đầu lấy hàng và địa điểm lấy hàng - địa điểm giao hàng
- Khi click vào chi tiết chuyến thì hiển thị màn hình 03
- Với tài khoản Điều vận, thì cho phép Tạo chuyến (giao diện tạo chuyến tương tự như màn 03)
- Muốn giao diện cho mobile vẽ giống lịch như hình và scroll ngang được 
- Có nút tạo mới, dành cho tài khoản Điều vận
- Khi click vào xem thông tin chi tiết một chuyến,hiển thị màn chi tiết chuyến xe

Sử dụng API: GetInfor_ShipmentDriver

Các tham số
- keyPass: mặc định
- idLaiXe: Lấy ở màn Login
- tungay: mặc định là ngày đầu tiên trong tháng (định dạng dd-MM-yyyy)
- denngay: mặc định là ngày cuối tháng (định dạng dd-MM-yyyy)
## [{"Status":"Success"},{"Message":""},{"Data":"[{\"stt\":1,\"idChuyenXe\":100014,\"ngaynhap\":\"27-05-2025\",\"ngaynhan\":\"27-05-2025\",\"soPO\":\"\",\"trangthai\":0,\"loaivantai\":1,\"bienso\":\"99H 03552\",\"sodangky\":\"\",\"socuathung\":0,\"nhansu\":\"Lầu Văn Quyền\",\"ngaysinh\":\"09-08-1981\",\"CCCD\":\"024081019017\",\"ngaycapCCCD\":\"\",\"diachithuongtru\":\"Giáp Sơn, Lục Ngạn , Bắc Giang\",\"dienthoaiLX\":\"0971934626\",\"khachhang\":\"HLV\",\"khachhang1\":\"LINGYI\",\"khachhang2\":\"\",\"khachhang3\":\"\",\"khachhang4\":\"\",\"diachinhan\":\"Kuehne + Nagel\",\"diachigiao1\":\"LINGYI\",\"diachigiao2\":\"\",\"diachigiao3\":\"\",\"diachigiao4\":\"\",\"ngaysua\":\"27-05-2025. 08:32:27\",\"nguoisua\":\"Đoàn Văn Tùng\"},{\"stt\":2,\"idChuyenXe\":100013,\"ngaynhap\":\"26-05-2025\",\"ngaynhan\":\"26-05-2025\",\"soPO\":\"\",\"trangthai\":0,\"loaivantai\":1,\"bienso\":\"99H 03552\",\"sodangky\":\"\",\"socuathung\":0,\"nhansu\":\"Lầu Văn Quyền\",\"ngaysinh\":\"09-08-1981\",\"CCCD\":\"024081019017\",\"ngaycapCCCD\":\"\",\"diachithuongtru\":\"Giáp Sơn, Lục Ngạn , Bắc Giang\",\"dienthoaiLX\":\"0971934626\",\"khachhang\":\"HLV\",\"khachhang1\":\"DONGWON\",\"khachhang2\":\"\",\"khachhang3\":\"\",\"khachhang4\":\"\",\"diachinhan\":\"Kuehne + Nagel\",\"diachigiao1\":\"DONGWON\",\"diachigiao2\":\"\",\"diachigiao3\":\"\",\"diachigiao4\":\"\",\"ngaysua\":\"26-05-2025. 09:18:34\",\"nguoisua\":\"Đoàn Văn Tùng\"},{\"stt\":3,\"idChuyenXe\":100012,\"ngaynhap\":\"26-05-2025\",\"ngaynhan\":\"27-05-2025\",\"soPO\":\"\",\"trangthai\":0,\"loaivantai\":1,\"bienso\":\"14C - 16073\",\"sodangky\":\"\",\"socuathung\":0,\"nhansu\":\"Vũ Văn Hậu\",\"ngaysinh\":\"29-12-2003\",\"CCCD\":\"027203004591\",\"ngaycapCCCD\":\"\",\"diachithuongtru\":\"Đồng Kỵ , Từ Sơn , Bắc Ninh\",\"dienthoaiLX\":\"0394578536\",\"khachhang\":\"HLV\",\"khachhang1\":\"LINGYI\",\"khachhang2\":\"\",\"khachhang3\":\"\",\"khachhang4\":\"\",\"diachinhan\":\"Kuehne + Nagel\",\"diachigiao1\":\"LINGYI\",\"diachigiao2\":\"\",\"diachigiao3\":\"\",\"diachigiao4\":\"\",\"ngaysua\":\"26-05-2025. 08:55:21\",\"nguoisua\":\"Giangdc\"},{\"stt\":4,\"idChuyenXe\":100011,\"ngaynhap\":\"26-05-2025\",\"ngaynhan\":\"26-05-2025\",\"soPO\":\"\",\"trangthai\":1,\"loaivantai\":1,\"bienso\":\"14C - 16073\",\"sodangky\":\"\",\"socuathung\":0,\"nhansu\":\"Vũ Văn Hậu\",\"ngaysinh\":\"29-12-2003\",\"CCCD\":\"027203004591\",\"ngaycapCCCD\":\"\",\"diachithuongtru\":\"Đồng Kỵ , Từ Sơn , Bắc Ninh\",\"dienthoaiLX\":\"0394578536\",\"khachhang\":\"HLV\",\"khachhang1\":\"LINGYI\",\"khachhang2\":\"\",\"khachhang3\":\"\",\"khachhang4\":\"\",\"diachinhan\":\"Kuehne + Nagel\",\"diachigiao1\":\"LINGYI\",\"diachigiao2\":\"\",\"diachigiao3\":\"\",\"diachigiao4\":\"\",\"ngaysua\":\"26-05-2025. 09:09:01\",\"nguoisua\":\"Giangdc\"},{\"stt\":5,\"idChuyenXe\":100010,\"ngaynhap\":\"24-05-2025\",\"ngaynhan\":\"24-05-2025\",\"soPO\":\"\",\"trangthai\":0,\"loaivantai\":1,\"bienso\":\"99H-03577\",\"sodangky\":\"\",\"socuathung\":0,\"nhansu\":\"Thang Nguyên Đoàn\",\"ngaysinh\":\"26-12-1997\",\"CCCD\":\"027097005759\",\"ngaycapCCCD\":\"\",\"diachithuongtru\":\"Đồng Nguyên , TP Từ Sơn , Bắc Ninh\",\"dienthoaiLX\":\" 0332522566\",\"khachhang\":\" CE\",\"khachhang1\":\"HLV\",\"khachhang2\":\"\",\"khachhang3\":\"\",\"khachhang4\":\"\",\"diachinhan\":\" CE\",\"diachigiao1\":\"HLV\",\"diachigiao2\":\"\",\"diachigiao3\":\"\",\"diachigiao4\":\"\",\"ngaysua\":\"24-05-2025. 10:41:28\",\"nguoisua\":\"Giangdc\"},{\"stt\":6,\"idChuyenXe\":100009,\"ngaynhap\":\"23-05-2025\",\"ngaynhan\":\"23-05-2025\",\"soPO\":\"\",\"trangthai\":0,\"loaivantai\":2,\"bienso\":\"99H 03552\",\"sodangky\":\"\",\"socuathung\":0,\"nhansu\":\"Lầu Văn Quyền\",\"ngaysinh\":\"09-08-1981\",\"CCCD\":\"024081019017\",\"ngaycapCCCD\":\"\",\"diachithuongtru\":\"Giáp Sơn, Lục Ngạn , Bắc Giang\",\"dienthoaiLX\":\"0971934626\",\"khachhang\":\" CE\",\"khachhang1\":\"HLV\",\"khachhang2\":\"Kuehne + Nagel\",\"khachhang3\":\"Sungwon\",\"khachhang4\":\"DONGWON\",\"diachinhan\":\" CE\",\"diachigiao1\":\"HLV\",\"diachigiao2\":\"Kuehne + Nagel\",\"diachigiao3\":\"Sungwon\",\"diachigiao4\":\"DONGWON\",\"ngaysua\":\"23-05-2025. 08:31:45\",\"nguoisua\":\"Giangdc\"},{\"stt\":7,\"idChuyenXe\":100008,\"ngaynhap\":\"23-05-2025\",\"ngaynhan\":\"23-05-2025\",\"soPO\":\"\",\"trangthai\":0,\"loaivantai\":1,\"bienso\":\"29C-23451\",\"sodangky\":\"\",\"socuathung\":0,\"nhansu\":\"Nguyễn Văn An\",\"ngaysinh\":\"\",\"CCCD\":\"010090123456\",\"ngaycapCCCD\":\"\",\"diachithuongtru\":\"\",\"dienthoaiLX\":\"0909090909\",\"khachhang\":\" CE\",\"khachhang1\":\"DONGWON\",\"khachhang2\":\"\",\"khachhang3\":\"\",\"khachhang4\":\"\",\"diachinhan\":\" CE\",\"diachigiao1\":\"DONGWON\",\"diachigiao2\":\"\",\"diachigiao3\":\"\",\"diachigiao4\":\"\",\"ngaysua\":\"23-05-2025. 01:00:50\",\"nguoisua\":\"Giangdc\"}]"}]






#Màn chi tiết chuyến xe 
Yêu cầu 
Thong tin chi tiết chuyến xe và thể hiện trực quan trạng thái của chuyến xe
Các thông tin trên giao diện, xem chi tiết tại… http://td.giangdc.company/Admin/Trucking.aspx?func=70
Lưu ý, có thể có nhiều hơn 1 điểm giao hàng và cho phép upload ảnh được chụp từ camera hoặc trên điện thoại lên ứng dụng
Đối với trạng thái "Hoàn thành" sẽ không được thay đổi thông tin gì nữa
Trạng thái của chuyến xe theo tuần tự: Chờ xác nhận --> Đã nhận chuyến (đây là trạng thái của lái xe cần xác nhận và thực hiện trên app) --> Đang giao --> Đã giao --> Hoàn thành --> hủy
Không cho phép chọn lại trạng thái trước đó


Sử dụng API GetInforDetail_TruckRoute

Trong đó
- keyPass: mặc định
- idChuyenXe: Lấy từ màn 2 Lịch tháng
ý nghĩa các trường thông tin, Sơn có thể tham khảo ở giao diện web


Tại màn này, khi chọn tạo mới, có các API sau
1. GetInfor_Customer: Danh sách khách hàng  [{"Status":"Success"},{"Message":""},{"Data":"[{\"idKhachHang\":100021,\"maKhachHang\":\" CE\",\"tenKhachHang\":\"CE Hà Nội Brand\",\"diachi\":\"TÒA NHÀ BÙI GIA - LÔ A2 CN7 ĐƯỜNG THANH LÂM MINH KHAI, BẮC TỪ LIÊM HÀ NỘI\",\"diachigiaohang\":\"TÒA NHÀ BÙI GIA - LÔ A2 CN7 ĐƯỜNG THANH LÂM MINH KHAI, BẮC TỪ LIÊM HÀ NỘI\",\"dienthoai\":\"Mr.Xuân\\t0904863477\",\"lienhe\":\"Mr.Xuân\\t0904863477\",\"linkmap\":\"\"},{\"idKhachHang\":100018,\"maKhachHang\":\"DONGWON\",\"tenKhachHang\":\"DONGWON TECH VINA\",\"diachi\":\"Lô CN1-2, KCN Quế Võ III, Xã Việt Hùng Huyện Quế Võ. Tỉnh Bắc Ninh\",\"diachigiaohang\":\"Lô CN1-2, KCN Quế Võ III, Xã Việt Hùng Huyện Quế Võ. Tỉnh Bắc Ninh\",\"dienthoai\":\"Hương\\t0977033541\",\"lienhe\":\"Hương\\t0977033541\",\"linkmap\":\"\"},{\"idKhachHang\":100013,\"maKhachHang\":\"HLV\",\"tenKhachHang\":\"Honda Logicom (Việt Nam)\",\"diachi\":\"Tòa nhà Hoài Nam, Số 6 đường Hai Bà Trưng, Phường Hùng Vương, Thành Phố Phúc Yên, Tỉnh Vĩnh Phúc\",\"diachigiaohang\":\"\",\"dienthoai\":\"0973421022\",\"lienhe\":\"0973421022\",\"linkmap\":\"\"},{\"idKhachHang\":100012,\"maKhachHang\":\"Kefico\",\"tenKhachHang\":\"Kefico Co.ltd\",\"diachi\":\"Hải Dương\",\"diachigiaohang\":\"Hải Dương\",\"dienthoai\":\"\",\"lienhe\":\"\",\"linkmap\":\"\"},{\"idKhachHang\":100017,\"maKhachHang\":\"Kuehne + Nagel\",\"tenKhachHang\":\"Kuehne + Nagel\",\"diachi\":\"Block 17, số 3 Mapletree, đường 6, KCN VSIP, Từ Sơn, Bắc Ninh\",\"diachigiaohang\":\"Block 17, số 3 Mapletree, đường 6, KCN VSIP, Từ Sơn, Bắc Ninh\",\"dienthoai\":\"Ms Hồng-0983.889.097 / Ms Huyền 0989.907.493\",\"lienhe\":\"Ms Hồng-0983.889.097 / Ms Huyền 0989.907.493\",\"linkmap\":\"\"},{\"idKhachHang\":100019,\"maKhachHang\":\"LINGYI\",\"tenKhachHang\":\"LINGYI\",\"diachi\":\"Nhà xưởng số 2, Lô CN3-4 KCN Yên Phong (khu mở rộng) Xã Yên Trung, Huyện Yên Phong Tỉnh Bắc Ninh 16000 Việt Nam\",\"diachigiaohang\":\"Nhà xưởng số 2, Lô CN3-4 KCN Yên Phong (khu mở rộng) Xã Yên Trung, Huyện Yên Phong Tỉnh Bắc Ninh 16000 Việt Nam\",\"dienthoai\":\"Ms. Hoàng Anh\\t0339557210\",\"lienhe\":\"Ms. Hoàng Anh\\t0339557210\",\"linkmap\":\"\"},{\"idKhachHang\":100009,\"maKhachHang\":\"MES\",\"tenKhachHang\":\"MES\",\"diachi\":\"Số 6 hẻm 12 ngách 69 ngõ 75 đường Phú Diễn, Bắc Từ Liêm, Hà Nội\",\"diachigiaohang\":\"Số 6 hẻm 12 ngách 69 ngõ 75 đường Phú Diễn, Bắc Từ Liêm, Hà Nội\",\"dienthoai\":\"Mr Hoàng\\t0968190590\",\"lienhe\":\"Mr Hoàng\\t0968190590\",\"linkmap\":\"\"},{\"idKhachHang\":100011,\"maKhachHang\":\"MSK\",\"tenKhachHang\":\"MSK\",\"diachi\":\"Hải Dương\",\"diachigiaohang\":\"Hải Dương\",\"dienthoai\":\"\",\"lienhe\":\"\",\"linkmap\":\"\"},{\"idKhachHang\":100014,\"maKhachHang\":\"Ohara\",\"tenKhachHang\":\"CÔNG TY TNHH OHARA PLASTICS VIỆT NAM\",\"diachi\":\"Ohara Lot 11 Quang Minh industrial park, Quang Minh town, Me Linh district, Hanoi city\",\"diachigiaohang\":\"Ohara Lot 11 Quang Minh industrial park, Quang Minh town, Me Linh district, Hanoi city\",\"dienthoai\":\"Ms Thư 0967892332/02432012369\",\"lienhe\":\"Ms Thư 0967892332/02432012369\",\"linkmap\":\"\"},{\"idKhachHang\":100020,\"maKhachHang\":\"SEI\",\"tenKhachHang\":\"SEI\",\"diachi\":\"Plot C6, Thang Long Industrial Park,Vong La commune, Dong Anh, Ha Noi, Viet Nam\",\"diachigiaohang\":\"Plot C6, Thang Long Industrial Park,Vong La commune, Dong Anh, Ha Noi, Viet Nam\",\"dienthoai\":\"Mr.Đông\\t0982980907\",\"lienhe\":\"Mr.Đông\\t0982980907\",\"linkmap\":\"\"},{\"idKhachHang\":100016,\"maKhachHang\":\"SENA TECH\",\"tenKhachHang\":\"SENA TECH\",\"diachi\":\"Lô H3-1C, KCN Quế Võ Phường Vân Dương Thành phố Bắc Ninh Tỉnh Bắc Ninh\",\"diachigiaohang\":\"Lô H3-1C, KCN Quế Võ Phường Vân Dương Thành phố Bắc Ninh Tỉnh Bắc Ninh\",\"dienthoai\":\"Ms.Yến - 0378244881\",\"lienhe\":\"Ms.Yến - 0378244881\",\"linkmap\":\"\"},{\"idKhachHang\":100008,\"maKhachHang\":\"SUMI HANEL\",\"tenKhachHang\":\"SUMI HANEL\",\"diachi\":\"Kho Sumi-Hanel – Lô D2- Khu công nghiệp Hà Nội- Đài Tư 386 Nguyễn Văn Linh- Phường Thạch Bàn- Quận Long Biên-Hà Nôi\",\"diachigiaohang\":\"Kho Sumi-Hanel – Lô D2- Khu công nghiệp Hà Nội- Đài Tư 386 Nguyễn Văn Linh- Phường Thạch Bàn- Quận Long Biên-Hà Nôi\",\"dienthoai\":\"Mr.Chương\\t0973984584\",\"lienhe\":\"Mr.Chương\\t0973984584\",\"linkmap\":\"\"},{\"idKhachHang\":100022,\"maKhachHang\":\"SUMI NINH GIANG\",\"tenKhachHang\":\"SUMI NINH GIANG\",\"diachi\":\"Cụm CN Nghĩa An,xã Nghĩa An, huyện Ninh Giang, TP Hải Dương, tỉnh Hải Dương\",\"diachigiaohang\":\"Cụm CN Nghĩa An,xã Nghĩa An, huyện Ninh Giang, TP Hải Dương, tỉnh Hải Dương\",\"dienthoai\":\"Mr Thành\\t0982203268\",\"lienhe\":\"Mr Thành\\t0982203268\",\"linkmap\":\"\"},{\"idKhachHang\":100023,\"maKhachHang\":\"Sungwon\",\"tenKhachHang\":\"Sungwon\",\"diachi\":\"Đường Nguyễn Tất Thành phường Định Trung TP. Vĩnh Yên tỉnh Vĩnh Phúc\",\"diachigiaohang\":\"Đường Nguyễn Tất Thành phường Định Trung TP. Vĩnh Yên tỉnh Vĩnh Phúc\",\"dienthoai\":\"Ms.Toàn\\t0977955123\",\"lienhe\":\"Ms.Toàn\\t0977955123\",\"linkmap\":\"\"},{\"idKhachHang\":100010,\"maKhachHang\":\"Toyota\",\"tenKhachHang\":\"Toyota Vĩnh Phúc\",\"diachi\":\"Phường Phúc Thắng Thành phố Phúc Yên Tỉnh Vĩnh Phúc\",\"diachigiaohang\":\"Phường Phúc Thắng Thành phố Phúc Yên Tỉnh Vĩnh Phúc\",\"dienthoai\":\"Mr. Thành DX\\t088.838.6565\",\"lienhe\":\"Mr. Thành DX\\t088.838.6565\",\"linkmap\":\"\"},{\"idKhachHang\":100024,\"maKhachHang\":\"UPE HÀ NỘI\",\"tenKhachHang\":\"UPE HÀ NỘI\",\"diachi\":\"thôn 5, Phú Cát, Quốc Oai, Hà Nội\",\"diachigiaohang\":\"thôn 5, Phú Cát, Quốc Oai, Hà Nội\",\"dienthoai\":\"Ms. Tuyết-0934681366\",\"lienhe\":\"Ms. Tuyết-0934681366\",\"linkmap\":\"\"},{\"idKhachHang\":100026,\"maKhachHang\":\"VINFAST\",\"tenKhachHang\":\"VINFAST\",\"diachi\":\"Khu kinh tế Đình Vũ - Cát Hải, đảo Cát Hải, thị trấn Cát Hải, huyện Cát Hải, TP. Hải Phòng\",\"diachigiaohang\":\"Khu kinh tế Đình Vũ - Cát Hải, đảo Cát Hải, thị trấn Cát Hải, huyện Cát Hải, TP. Hải Phòng\",\"dienthoai\":\"Mr.Thuận - 394161898 / 086763122\",\"lienhe\":\"Mr.Thuận - 394161898 / 086763122\",\"linkmap\":\"\"},{\"idKhachHang\":100027,\"maKhachHang\":\"VNPRTECH\",\"tenKhachHang\":\"VIET NAM PROS TECHNOLOGY\",\"diachi\":\"Số 40, đường Nông Dân, thôn Vân Lũng, An Khánh, Hoài Đức, Hà Nội\",\"diachigiaohang\":\"Số 40, đường Nông Dân, thôn Vân Lũng, An Khánh, Hoài Đức, Hà Nội\",\"dienthoai\":\"Ms. Hồng - 0913 075 885\",\"lienhe\":\"Ms. Hồng - 0913 075 885\",\"linkmap\":\"\"},{\"idKhachHang\":100025,\"maKhachHang\":\"Yazaki\",\"tenKhachHang\":\" Công ty cổ phần quản lý chuỗi cung ứng Jupiter Hải Phòng Việt Nam\",\"diachi\":\"Lô đất CN4D, Khu công nghiệp Deep C 2B, Khu kinh tế Đình Vũ - Cát Hải, Phường Đông Hải, Quận Hải An, Thành phố Hải Phòng, Việt Nam\",\"diachigiaohang\":\"Lô đất CN4D, Khu công nghiệp Deep C 2B, Khu kinh tế Đình Vũ - Cát Hải, Phường Đông Hải, Quận Hải An, Thành phố Hải Phòng, Việt Nam\",\"dienthoai\":\"Mr. Tuấn/ Mr.Đạt - 0395048909/ 0797349258\",\"lienhe\":\"Mr. Tuấn/ Mr.Đạt - 0395048909/ 0797349258\",\"linkmap\":\"\"}]"}]

2. GetInfor_Driver: Danh sách lái xe
[{"Status":"Success"},{"Message":""},{"Data":"[{\"idNhanSu\":100004,\"soCCCD\":\"017202006479\",\"tenNhanSu\":\"Bùi Văn Phong\",\"dienthoai\":\"0333403401\",\"diachi\":\"Ân Nghĩa , Lạc Sơn , Hòa Bình\",\"ngaysinh\":\"06-09-2002\",\"UserID\":100005},{\"idNhanSu\":100008,\"soCCCD\":\"027084011912\",\"tenNhanSu\":\"Chử Quang Hảo\",\"dienthoai\":\" 0972588929\",\"diachi\":\"Đồng Kỵ , Từ Sơn , Bắc Ninh\",\"ngaysinh\":\"27-10-1984\",\"UserID\":0},{\"idNhanSu\":100003,\"soCCCD\":\"027082008095\",\"tenNhanSu\":\"Chử Văn Dũng\",\"dienthoai\":\"0904709411\",\"diachi\":\"Đồng Kỵ , Từ Sơn , Bắc Ninh\",\"ngaysinh\":\"25-06-1982\",\"UserID\":0},{\"idNhanSu\":100002,\"soCCCD\":\"024081019017\",\"tenNhanSu\":\"Lầu Văn Quyền\",\"dienthoai\":\"0971934626\",\"diachi\":\"Giáp Sơn, Lục Ngạn , Bắc Giang\",\"ngaysinh\":\"09-08-1981\",\"UserID\":100006},{\"idNhanSu\":100006,\"soCCCD\":\"042097002814\",\"tenNhanSu\":\"Nguyễn Đăng Khoa\",\"dienthoai\":\"0869566911\",\"diachi\":\"Kỳ Hoa, Kỳ Anh , Hà Tĩnh\",\"ngaysinh\":\"11-02-1997\",\"UserID\":100007},{\"idNhanSu\":100005,\"soCCCD\":\"027097005759\",\"tenNhanSu\":\"Thang Nguyên Đoàn\",\"dienthoai\":\" 0332522566\",\"diachi\":\"Đồng Nguyên , TP Từ Sơn , Bắc Ninh\",\"ngaysinh\":\"26-12-1997\",\"UserID\":0},{\"idNhanSu\":100007,\"soCCCD\":\"027203004591\",\"tenNhanSu\":\"Vũ Văn Hậu\",\"dienthoai\":\"0394578536\",\"diachi\":\"Đồng Kỵ , Từ Sơn , Bắc Ninh\",\"ngaysinh\":\"29-12-2003\",\"UserID\":0}]"}]


3. GetInfor_Payload: Danh sách tải trọng xe
[{"Status":"Success"},{"Message":""},{"Data":"[{\"idTrongTai\":100001,\"trongTai\":\"1.25T\"},{\"idTrongTai\":100006,\"trongTai\":\"10T\"},{\"idTrongTai\":100007,\"trongTai\":\"14T\"},{\"idTrongTai\":100002,\"trongTai\":\"2.5T\"},{\"idTrongTai\":100003,\"trongTai\":\"3.5T\"},{\"idTrongTai\":100004,\"trongTai\":\"5T\"},{\"idTrongTai\":100005,\"trongTai\":\"8T\"}]"}]

4. GetInfor_Truck: Danh sách xe (có lọc dữ liệu, truyền tham số tải trọng xe)
[{"Status":"Success"},{"Message":""},{"Data":"[{\"idXe\":100004,\"bienso\":\"14C - 16073\",\"idLaixe\":100007,\"idTrongTai\":1,\"trongTai\":\"\"},{\"idXe\":100003,\"bienso\":\"29C-23451\",\"idLaixe\":100000,\"idTrongTai\":0,\"trongTai\":\"\"},{\"idXe\":100002,\"bienso\":\"99C-12345\",\"idLaixe\":100001,\"idTrongTai\":0,\"trongTai\":\"\"},{\"idXe\":100006,\"bienso\":\"99H 03552\",\"idLaixe\":100002,\"idTrongTai\":3,\"trongTai\":\"\"},{\"idXe\":100005,\"bienso\":\"99H-03577\",\"idLaixe\":0,\"idTrongTai\":3,\"trongTai\":\"\"}]"}]

5. GetInfor_ShippingAddress: Danh sách địa chỉ giao hàng (khi có thông tin về khách hàng)
[{"Status":"Success"},{"Message":""},{"Data":"[{\"idDiaChi\":100036,\"maDiaChi\":\" CE\",\"diaChi\":\"TÒA NHÀ BÙI GIA - LÔ A2 CN7 ĐƯỜNG THANH LÂM MINH KHAI, BẮC TỪ LIÊM HÀ NỘI\",\"lienhe\":\"Mr.Xuân\\t0904863477\",\"linkmap\":\"\"},{\"idDiaChi\":100043,\"maDiaChi\":\" CE\",\"diaChi\":\"TÒA NHÀ BÙI GIA - LÔ A2 CN7 ĐƯỜNG THANH LÂM MINH KHAI, BẮC TỪ LIÊM HÀ NỘI\",\"lienhe\":\"Mr.Xuân\\t0904863477\",\"linkmap\":\"\"},{\"idDiaChi\":100033,\"maDiaChi\":\"DONGWON\",\"diaChi\":\"Lô CN1-2, KCN Quế Võ III, Xã Việt Hùng Huyện Quế Võ. Tỉnh Bắc Ninh\",\"lienhe\":\"Hương\\t0977033541\",\"linkmap\":\"\"},{\"idDiaChi\":100029,\"maDiaChi\":\"HLV\",\"diaChi\":\"Tòa nhà Hoài Nam, Số 6 đường Hai Bà Trưng, Phường Hùng Vương, Thành Phố Phúc Yên, Tỉnh Vĩnh Phúc\",\"lienhe\":\"0973421022\",\"linkmap\":\"\"},{\"idDiaChi\":100028,\"maDiaChi\":\"Kefico\",\"diaChi\":\"Hải Dương\",\"lienhe\":\"\",\"linkmap\":\"\"},{\"idDiaChi\":100032,\"maDiaChi\":\"Kuehne + Nagel\",\"diaChi\":\"Block 17, số 3 Mapletree, đường 6, KCN VSIP, Từ Sơn, Bắc Ninh\",\"lienhe\":\"Ms Hồng-0983.889.097 / Ms Huyền 0989.907.493\",\"linkmap\":\"\"},{\"idDiaChi\":100034,\"maDiaChi\":\"LINGYI\",\"diaChi\":\"Nhà xưởng số 2, Lô CN3-4 KCN Yên Phong (khu mở rộng) Xã Yên Trung, Huyện Yên Phong Tỉnh Bắc Ninh 16000 Việt Nam\",\"lienhe\":\"Ms. Hoàng Anh\\t0339557210\",\"linkmap\":\"\"},{\"idDiaChi\":100025,\"maDiaChi\":\"MES\",\"diaChi\":\"Số 6 hẻm 12 ngách 69 ngõ 75 đường Phú Diễn, Bắc Từ Liêm, Hà Nội\",\"lienhe\":\"Mr Hoàng\\t0968190590\",\"linkmap\":\"\"},{\"idDiaChi\":100027,\"maDiaChi\":\"MSK\",\"diaChi\":\"Hải Dương\",\"lienhe\":\"\",\"linkmap\":\"\"},{\"idDiaChi\":100030,\"maDiaChi\":\"Ohara\",\"diaChi\":\"Ohara Lot 11 Quang Minh industrial park, Quang Minh town, Me Linh district, Hanoi city\",\"lienhe\":\"Ms Thư 0967892332/02432012369\",\"linkmap\":\"\"},{\"idDiaChi\":100035,\"maDiaChi\":\"SEI\",\"diaChi\":\"Plot C6, Thang Long Industrial Park,Vong La commune, Dong Anh, Ha Noi, Viet Nam\",\"lienhe\":\"Mr.Đông\\t0982980907\",\"linkmap\":\"\"},{\"idDiaChi\":100031,\"maDiaChi\":\"SENA TECH\",\"diaChi\":\"Lô H3-1C, KCN Quế Võ Phường Vân Dương Thành phố Bắc Ninh Tỉnh Bắc Ninh\",\"lienhe\":\"Ms.Yến - 0378244881\",\"linkmap\":\"\"},{\"idDiaChi\":100024,\"maDiaChi\":\"SUMI HANEL\",\"diaChi\":\"Kho Sumi-Hanel – Lô D2- Khu công nghiệp Hà Nội- Đài Tư 386 Nguyễn Văn Linh- Phường Thạch Bàn- Quận Long Biên-Hà Nôi\",\"lienhe\":\"Mr.Chương\\t0973984584\",\"linkmap\":\"\"},{\"idDiaChi\":100037,\"maDiaChi\":\"SUMI NINH GIANG\",\"diaChi\":\"Cụm CN Nghĩa An,xã Nghĩa An, huyện Ninh Giang, TP Hải Dương, tỉnh Hải Dương\",\"lienhe\":\"Mr Thành\\t0982203268\",\"linkmap\":\"\"},{\"idDiaChi\":100038,\"maDiaChi\":\"Sungwon\",\"diaChi\":\"Đường Nguyễn Tất Thành phường Định Trung TP. Vĩnh Yên tỉnh Vĩnh Phúc\",\"lienhe\":\"Ms.Toàn\\t0977955123\",\"linkmap\":\"\"},{\"idDiaChi\":100026,\"maDiaChi\":\"Toyota\",\"diaChi\":\"Phường Phúc Thắng Thành phố Phúc Yên Tỉnh Vĩnh Phúc\",\"lienhe\":\"Mr. Thành DX\\t088.838.6565\",\"linkmap\":\"\"},{\"idDiaChi\":100039,\"maDiaChi\":\"UPE HÀ NỘI\",\"diaChi\":\"thôn 5, Phú Cát, Quốc Oai, Hà Nội\",\"lienhe\":\"Ms. Tuyết-0934681366\",\"linkmap\":\"\"},{\"idDiaChi\":100041,\"maDiaChi\":\"VINFAST\",\"diaChi\":\"Khu kinh tế Đình Vũ - Cát Hải, đảo Cát Hải, thị trấn Cát Hải, huyện Cát Hải, TP. Hải Phòng\",\"lienhe\":\"Mr.Thuận - 394161898 / 086763122\",\"linkmap\":\"\"},{\"idDiaChi\":100042,\"maDiaChi\":\"VNPRTECH\",\"diaChi\":\"Số 40, đường Nông Dân, thôn Vân Lũng, An Khánh, Hoài Đức, Hà Nội\",\"lienhe\":\"Ms. Hồng - 0913 075 885\",\"linkmap\":\"\"},{\"idDiaChi\":100040,\"maDiaChi\":\"Yazaki\",\"diaChi\":\"Lô đất CN4D, Khu công nghiệp Deep C 2B, Khu kinh tế Đình Vũ - Cát Hải, Phường Đông Hải, Quận Hải An, Thành phố Hải Phòng, Việt Nam\",\"lienhe\":\"Mr. Tuấn/ Mr.Đạt - 0395048909/ 0797349258\",\"linkmap\":\"\"}]"}]

6. GetInfor_Price: Chi phí chuyến xe (sau khi có khách hàng, địa chỉ lấy hàng, địa chỉ giao hàng, xe vận chuyển
[{"Status":"Success"},{"Message":""},{"Data":"[{\"dongia\":2000000},{\"dongia\":900000},{\"dongia\":4000000},{\"dongia\":2000000},{\"dongia\":800000}]"}]

7. UpdateStatus_TruckRoute: Cập nhật trạng thái của chuyến xe

8. SAVE_TruckRoute: Lưu chuyến xe 





#Màn này có hiển thị trạng thái chuyến xe
Có 05 trạng thái: (value - text)
0 - Chờ xác nhận
1 - Đã nhận chuyến
2 - Đang giao
4 - Đã giao
5 - Hoàn thành
9 - Hủy

Trong đó, khi tạo chuyến từ Điều vận: mặc định là trạng thái 0 - Chờ xác nhận
Chuyến vừa khởi tạo, có chỉ định lái xe, hệ thống gửi thông báo tới ứng dụng.
Tài xế truy cập vào màn này bấm Đã nhận chuyến

Sau khi lấy hàng xong; Tài xế vào app, bấm chuyển trạng thái sang Đang giao 

Sau khi đã giao hàng, tài xế vào app, bấm chuyển trạng thái sang Đã giao

Lúc này, có tính năng cho phép tài xế upload ảnh từ ứng dụng lên hệ thống. 
và chuyển trạng thái từ Đã giao sang Hoàn thành (ảnh là biên bản giao hàng)



#Màn lịch sử chuyến xe 
Tổng hợp trong trong 01 tháng; có cho phép chọn theo thời gian; (Đây là báo cáo theo mỗi tài khoản)
Hiển thị dưới dạng danh sách, theo thứ tự từ gần đây trở về trước
Hiển thị trong 1 tháng
Sử dụng API: GetInfor_ShipmentDriver
[{"Status":"Success"},{"Message":""},{"Data":"[{\"stt\":1,\"idChuyenXe\":100014,\"ngaynhap\":\"27-05-2025\",\"ngaynhan\":\"27-05-2025\",\"soPO\":\"\",\"trangthai\":0,\"loaivantai\":1,\"bienso\":\"99H 03552\",\"sodangky\":\"\",\"socuathung\":0,\"nhansu\":\"Lầu Văn Quyền\",\"ngaysinh\":\"09-08-1981\",\"CCCD\":\"024081019017\",\"ngaycapCCCD\":\"\",\"diachithuongtru\":\"Giáp Sơn, Lục Ngạn , Bắc Giang\",\"dienthoaiLX\":\"0971934626\",\"khachhang\":\"HLV\",\"khachhang1\":\"LINGYI\",\"khachhang2\":\"\",\"khachhang3\":\"\",\"khachhang4\":\"\",\"diachinhan\":\"Kuehne + Nagel\",\"diachigiao1\":\"LINGYI\",\"diachigiao2\":\"\",\"diachigiao3\":\"\",\"diachigiao4\":\"\",\"ngaysua\":\"27-05-2025. 08:32:27\",\"nguoisua\":\"Đoàn Văn Tùng\"},{\"stt\":2,\"idChuyenXe\":100013,\"ngaynhap\":\"26-05-2025\",\"ngaynhan\":\"26-05-2025\",\"soPO\":\"\",\"trangthai\":0,\"loaivantai\":1,\"bienso\":\"99H 03552\",\"sodangky\":\"\",\"socuathung\":0,\"nhansu\":\"Lầu Văn Quyền\",\"ngaysinh\":\"09-08-1981\",\"CCCD\":\"024081019017\",\"ngaycapCCCD\":\"\",\"diachithuongtru\":\"Giáp Sơn, Lục Ngạn , Bắc Giang\",\"dienthoaiLX\":\"0971934626\",\"khachhang\":\"HLV\",\"khachhang1\":\"DONGWON\",\"khachhang2\":\"\",\"khachhang3\":\"\",\"khachhang4\":\"\",\"diachinhan\":\"Kuehne + Nagel\",\"diachigiao1\":\"DONGWON\",\"diachigiao2\":\"\",\"diachigiao3\":\"\",\"diachigiao4\":\"\",\"ngaysua\":\"26-05-2025. 09:18:34\",\"nguoisua\":\"Đoàn Văn Tùng\"},{\"stt\":3,\"idChuyenXe\":100012,\"ngaynhap\":\"26-05-2025\",\"ngaynhan\":\"27-05-2025\",\"soPO\":\"\",\"trangthai\":0,\"loaivantai\":1,\"bienso\":\"14C - 16073\",\"sodangky\":\"\",\"socuathung\":0,\"nhansu\":\"Vũ Văn Hậu\",\"ngaysinh\":\"29-12-2003\",\"CCCD\":\"027203004591\",\"ngaycapCCCD\":\"\",\"diachithuongtru\":\"Đồng Kỵ , Từ Sơn , Bắc Ninh\",\"dienthoaiLX\":\"0394578536\",\"khachhang\":\"HLV\",\"khachhang1\":\"LINGYI\",\"khachhang2\":\"\",\"khachhang3\":\"\",\"khachhang4\":\"\",\"diachinhan\":\"Kuehne + Nagel\",\"diachigiao1\":\"LINGYI\",\"diachigiao2\":\"\",\"diachigiao3\":\"\",\"diachigiao4\":\"\",\"ngaysua\":\"26-05-2025. 08:55:21\",\"nguoisua\":\"Giangdc\"},{\"stt\":4,\"idChuyenXe\":100011,\"ngaynhap\":\"26-05-2025\",\"ngaynhan\":\"26-05-2025\",\"soPO\":\"\",\"trangthai\":1,\"loaivantai\":1,\"bienso\":\"14C - 16073\",\"sodangky\":\"\",\"socuathung\":0,\"nhansu\":\"Vũ Văn Hậu\",\"ngaysinh\":\"29-12-2003\",\"CCCD\":\"027203004591\",\"ngaycapCCCD\":\"\",\"diachithuongtru\":\"Đồng Kỵ , Từ Sơn , Bắc Ninh\",\"dienthoaiLX\":\"0394578536\",\"khachhang\":\"HLV\",\"khachhang1\":\"LINGYI\",\"khachhang2\":\"\",\"khachhang3\":\"\",\"khachhang4\":\"\",\"diachinhan\":\"Kuehne + Nagel\",\"diachigiao1\":\"LINGYI\",\"diachigiao2\":\"\",\"diachigiao3\":\"\",\"diachigiao4\":\"\",\"ngaysua\":\"26-05-2025. 09:09:01\",\"nguoisua\":\"Giangdc\"},{\"stt\":5,\"idChuyenXe\":100010,\"ngaynhap\":\"24-05-2025\",\"ngaynhan\":\"24-05-2025\",\"soPO\":\"\",\"trangthai\":0,\"loaivantai\":1,\"bienso\":\"99H-03577\",\"sodangky\":\"\",\"socuathung\":0,\"nhansu\":\"Thang Nguyên Đoàn\",\"ngaysinh\":\"26-12-1997\",\"CCCD\":\"027097005759\",\"ngaycapCCCD\":\"\",\"diachithuongtru\":\"Đồng Nguyên , TP Từ Sơn , Bắc Ninh\",\"dienthoaiLX\":\" 0332522566\",\"khachhang\":\" CE\",\"khachhang1\":\"HLV\",\"khachhang2\":\"\",\"khachhang3\":\"\",\"khachhang4\":\"\",\"diachinhan\":\" CE\",\"diachigiao1\":\"HLV\",\"diachigiao2\":\"\",\"diachigiao3\":\"\",\"diachigiao4\":\"\",\"ngaysua\":\"24-05-2025. 10:41:28\",\"nguoisua\":\"Giangdc\"},{\"stt\":6,\"idChuyenXe\":100009,\"ngaynhap\":\"23-05-2025\",\"ngaynhan\":\"23-05-2025\",\"soPO\":\"\",\"trangthai\":0,\"loaivantai\":2,\"bienso\":\"99H 03552\",\"sodangky\":\"\",\"socuathung\":0,\"nhansu\":\"Lầu Văn Quyền\",\"ngaysinh\":\"09-08-1981\",\"CCCD\":\"024081019017\",\"ngaycapCCCD\":\"\",\"diachithuongtru\":\"Giáp Sơn, Lục Ngạn , Bắc Giang\",\"dienthoaiLX\":\"0971934626\",\"khachhang\":\" CE\",\"khachhang1\":\"HLV\",\"khachhang2\":\"Kuehne + Nagel\",\"khachhang3\":\"Sungwon\",\"khachhang4\":\"DONGWON\",\"diachinhan\":\" CE\",\"diachigiao1\":\"HLV\",\"diachigiao2\":\"Kuehne + Nagel\",\"diachigiao3\":\"Sungwon\",\"diachigiao4\":\"DONGWON\",\"ngaysua\":\"23-05-2025. 08:31:45\",\"nguoisua\":\"Giangdc\"},{\"stt\":7,\"idChuyenXe\":100008,\"ngaynhap\":\"23-05-2025\",\"ngaynhan\":\"23-05-2025\",\"soPO\":\"\",\"trangthai\":0,\"loaivantai\":1,\"bienso\":\"29C-23451\",\"sodangky\":\"\",\"socuathung\":0,\"nhansu\":\"Nguyễn Văn An\",\"ngaysinh\":\"\",\"CCCD\":\"010090123456\",\"ngaycapCCCD\":\"\",\"diachithuongtru\":\"\",\"dienthoaiLX\":\"0909090909\",\"khachhang\":\" CE\",\"khachhang1\":\"DONGWON\",\"khachhang2\":\"\",\"khachhang3\":\"\",\"khachhang4\":\"\",\"diachinhan\":\" CE\",\"diachigiao1\":\"DONGWON\",\"diachigiao2\":\"\",\"diachigiao3\":\"\",\"diachigiao4\":\"\",\"ngaysua\":\"23-05-2025. 01:00:50\",\"nguoisua\":\"Giangdc\"}]"}]