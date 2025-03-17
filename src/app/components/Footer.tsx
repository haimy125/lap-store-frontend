export default function Footer() {
  const phoneNumber = "0976540201";

  return (
    <footer className="bg-black py-12 mt-8 border-t border-yellow-500 text-white">
      {/* Đổi background thành đen, border-t thành vàng, chữ thành trắng */}
      <div className="container mx-auto px-4">
        {/* Tuyển cộng tác viên (hàng ngang) */}

        {/* Chia cột thông tin */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cột 1: Chính sách trả góp */}
          <div className="text-gray-400">
            {/* Đổi màu chữ thành xám nhạt */}
            <h4 className="font-semibold text-xl mb-4 text-yellow-500">
              Chính sách trả góp
            </h4>
            <ul className="list-disc list-inside pl-4">
              <li className="mb-2">Không nợ xấu</li>
              <li className="mb-2">Góp qua CCCD và Thẻ Tín Dụng</li>
              <li className="mb-2">Trả trước 20% đối với CCCD</li>
            </ul>
          </div>

          {/* Cột 2: Chính sách bảo hành */}
          <div className="text-gray-400">
            {/* Đổi màu chữ thành xám nhạt */}
            <h4 className="font-semibold text-xl mb-4 text-yellow-500">
              Chính sách bảo hành
            </h4>
            <ul className="list-disc list-inside pl-4">
              <li className="mb-2">Bao test máy 7 ngày</li>
              <li className="mb-2">Bảo hành toàn bộ máy 1 tháng</li>
              <li className="mb-2">
                Bảo hành phần nguồn 3 tháng{" "}
                <span className="text-red-500 font-bold"></span>
              </li>
            </ul>
          </div>

          {/* Cột 3: Liên hệ và Địa chỉ */}
          <div className="text-gray-400">
            {/* Đổi màu chữ thành xám nhạt */}
            <h4 className="font-semibold text-xl mb-4 text-yellow-500">
              Liên hệ
            </h4>
            <p className="mb-2">
              Điện thoại:{" "}
              <a
                href={`tel:${phoneNumber}`}
                className="text-yellow-500 hover:underline transition duration-200"
              >
                {phoneNumber}
              </a>
            </p>
            <p className="mb-2">
              Facebook:{" "}
              <a
                href="https://www.facebook.com/ly.nhan.duyen.2024/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-500 hover:underline transition duration-200"
              >
                LÝ NHÂN DUYÊN
              </a>
            </p>

            <h4 className="font-semibold text-xl mt-6 mb-4 text-yellow-500">
              Địa chỉ
            </h4>
            <ul className="list-none pl-0 leading-relaxed">
              <li className="mb-2">
                <span className="font-bold text-yellow-300">Hà Nội:</span> 34
                Ngõ 132 Khương Trung, Quận Thanh Xuân.
              </li>
              <li className="mb-2">
                <span className="font-bold text-yellow-300">TP.HCM:</span> 58/3
                Phạm Văn Chiêu Phường 8 Gò Vấp.
              </li>
              <li className="mb-2">
                <span className="font-bold text-yellow-300">TP.Thủ Đức:</span>{" "}
                43 Đường Số 3 Phường Linh Xuân.
              </li>
            </ul>
          </div>
        </div>

        {/* Ship code (hàng ngang) */}
        <div className="text-center mt-8">
          <p className="font-semibold text-gray-400 text-lg">
            {/* Đổi màu chữ thành xám nhạt */}
            🚍🚍 Ship COD giao hàng toàn quốc (cọc 200k)
          </p>
        </div>

        <div className="my-4 text-center">
          <p className="text-yellow-300 font-semibold text-lg">
            📢 Tuyển cộng tác viên bán laptop online! Chiết khấu hấp dẫn, làm
            việc tự do. Liên hệ:{" "}
            <a
              href={`tel:${phoneNumber}`}
              className="text-yellow-500 hover:underline transition duration-200"
            >
              {phoneNumber}
            </a>{" "}
            (Call/Zalo)
          </p>
        </div>

        {/* Bản quyền (hàng ngang) */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            {/* Giữ màu chữ xám nhạt */}© {new Date().getFullYear()} MPH
            Website. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
