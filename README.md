GIẢI THÍCH GIẢI PHÁP

I. PHƯƠNG PHÁP TIẾP CẬN( YOUR APPROACH)
    - Trong phương pháp của tôi sử dụng hashing để chuyển mã khuyến mãi thành một index đuy nhất, sau đó dùng BitSet đề dánh dấu sự tồn tại của index đó trong từng file.
    - Để kiểm tra một mã khuyến mãi có tồn tại trong cả hai file hay không, chỉ cần kiểm tra sự tồn tại của index đó trong cả hai BitSet.
    - Dựa trên ràng buộc của bài toán, chỉ có tối đa 5 ký tự và gồm a - z nên suy ra chỉ cần khoảng 12 triệu bit để lưu trữ các mã khuyến mãi tương ứng với index của riêng mã đó.

Quy trình: 
    1. Khởi tạo 2 BitSet, (campaignBitSet và membershipBitSet) 
    2. Stream song song 2 file:
            campaignFile -> hash code -> mark in campaignBitSet
            membershipFile -> hash code -> mark in membershipBitSet 
    3. Kiểm tra sự tồn tại của mã:
            hash code -> index
            check bit[index] trong cả 2 bitSet
            return về true nếu cả 2 bit[index] đều là 1, ngược lại return false

II. CẤU TRÚC DỮ LIỆU ĐÃ SỬ DỤNG
    1. Bitset(Uint8Array): Mỗi bitSet đại diện cho một file, bitSet[i] = 1 nếu mã khuyến mãi tại index i tồn tại trong file, ngược lại bitSet[i] = 0.
        Mục đích: Lưu trữ 12,356,630 bits (tổng số mã có thể) ~ 1.5MB
    2. Stream(Readline): Sử dụng để xử lý file đầu vào theo từng dòng.

III. CÂN NHẮC VỀ HIỆU NÂNG
    1. Time complexity: O(N + M) với N là số lượng dòng trong file campaign, M là số lượng dòng trong file membership.
    2. Space complexity: O(1) với kích thước của bitset không thay đổi

IV. QUYẾT ĐỊNH THIẾT KẾ VÀ ĐÁNH ĐỔI
    1. QUyết định thiết kế
        - Sử dụng BitSet để lưu trữ các mã khuyến mãi
        - Sử dụng stream để xử lý file đầu vào theo từng dòng
        - Sử dụng hashing để chuyển mã khuyến mãi thành một index duy nhất
        - Sử dụng bitwise operation để đánh dấu sự tồn tại của index trong bitset
    2. Quyết định đánh đổi
        - Sử dụng BitSet để lưu trữu các mã khuyến mãi là một cách tối ưu về bộ nhớ so với việc lưu hàng triệu chuỗi string vào trong Set.
        - Sự đánh đổi: Giải pháp này được tối ưu hóa cho bài toán cụ thể này, với các ràng buộc cố định( "max 5 chars","a-z"), nếu yêu cầu thay đổi( ví dụ độ đài mã 10 ký tự, hoặc bao gồm cả số, ký tự in hoa, ký tự đặc biệt),thì không gian lưu trữu sẽ tăng lên rất nhiều. Khi đó BitSet sẽ quả lớn để lưu trữ và giải pháp này sẽ không còn hiệu quả.
