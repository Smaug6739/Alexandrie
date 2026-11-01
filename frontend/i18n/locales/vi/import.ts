export default {
  actions: {
    cancel: 'Hủy',
    extractFrontMatter: 'Trích xuất front matter thành siêu dữ liệu',
    importAll: 'Nhập tất cả',
    importing: 'Đang nhập...',
    normalizeLineEndings: 'Chuẩn hóa ký tự xuống dòng',
    optionsTitle: 'Tùy chọn nhập',
    preserveTimestamps: 'Giữ nguyên thời gian gốc',
    skipExisting: 'Bỏ qua tài liệu đã có (chỉ nhập tài liệu mới)',
  },

  categories: {
    backup: {
      description: 'Khôi phục toàn bộ bản sao lưu Alexandrie, bao gồm tài liệu và cài đặt.',
      title: 'Nhập từ bản sao lưu',
    },
    files: {
      description: 'Nhập tài liệu từ các tệp markdown với nhiều tùy chọn linh hoạt.',
      title: 'Nhập từ tệp',
    },
    folder: {
      description: 'Nhập toàn bộ thư mục (kể cả thư mục con và tệp tải lên) với các tùy chọn riêng để kiểm soát tối đa.',
      title: 'Nhập thư mục',
    },
  },

  files: {
    importable:
      'Bạn có thể nhập các tệp markdown hoặc một thư mục chứa tệp markdown. Thư mục sẽ được nhập đệ quy, giữ nguyên cấu trúc nếu bạn chọn tùy chọn nhập tất cả.',
    meta: {
      description: 'Nhập nhanh các tệp markdown, kèm tùy chọn về nơi lưu và cách xử lý.',
      title: 'Nhập từ tệp markdown',
    },
    toImport: 'Mục cần nhập',
  },

  folder: {
    defaultColor: 'Màu mặc định cho tài liệu được nhập',
    defaultDescription: 'Mô tả mặc định cho tài liệu được nhập',
    defaultIcon: 'Biểu tượng mặc định cho tài liệu được nhập (svg hoặc emoji unicode)',
    defaultParent: 'Danh mục cha mặc định cho tài liệu được nhập',
    defaultTags: 'Thẻ mặc định cho tài liệu được nhập (phân tách bằng dấu phẩy)',
    defaultTheme: 'Chủ đề mặc định cho tài liệu được nhập',
    defaultThumbnail: 'Ảnh thu nhỏ mặc định cho tài liệu được nhập (svg hoặc emoji unicode)',
    options: 'Tùy chọn nhập nâng cao',
  },

  header: {
    changeFile: 'Đổi tệp',
    created: 'Ngày tạo',
    documents: 'Tài liệu',
    files: 'Tệp',
    metadata: 'Siêu dữ liệu',
    settings: 'Cài đặt',
    title: 'Thông tin bản sao lưu',
    totalDocuments: 'Tổng số tài liệu',
    totalSize: 'Tổng dung lượng',
    version: 'Phiên bản',
  },

  meta: {
    breadcrumb: 'Nhập dữ liệu',
    description: 'Bạn có thể nhập tài liệu từ một bản xuất trước đó. Nếu chưa có, hãy tạo bản xuất trong',
    settingsLink: 'cài đặt',
    title: 'Nhập tài liệu',
  },

  notifications: {
    importCompleteMessage: 'Đã nhập tài liệu thành công.',
    importCompleteTitle: 'Nhập hoàn tất',
    importFailedMessage: 'Đã xảy ra lỗi khi nhập. Vui lòng thử lại.',
    importFailedTitle: 'Nhập thất bại',
    localImportedMessage: 'Cài đặt cục bộ của bạn đã được thay bằng bản sao lưu.',
    localImportedTitle: 'Đã nhập cài đặt cục bộ',
  },

  progress: {
    title: 'Tiến trình nhập',
  },

  report: {
    empty: 'Không có mục nào đã nhập để hiển thị.',
    startNew: 'Bắt đầu lượt nhập mới',
    title: 'Báo cáo nhập',
  },

  steps: {
    select: {
      analyzing: 'Đang phân tích...',
      startImport: 'Bắt đầu nhập',
    },
  },

  summary: {
    documentsToUpdate: 'Tài liệu cần cập nhật',
    newDocuments: 'Tài liệu mới',
    title: 'Tóm tắt lượt nhập',
    unchanged: 'Không thay đổi',
  },

  tabs: {
    backup: 'Bản sao lưu',
    current: 'Hiện tại',
    import: 'Nhập',
    importFromBackup: 'Nhập từ bản sao lưu',
    importLocalSettings: 'Nhập cài đặt cục bộ',
    importSelected: 'Nhập mục đã chọn ({count})',
    localSettings: 'Cài đặt và tùy chọn cục bộ',
    localSettingsAvailable: 'Có thể nhập cài đặt và tùy chọn cục bộ',
    localSettingsWarning: 'Thao tác này sẽ ghi đè cài đặt cục bộ hiện tại của bạn, kể cả các đoạn mã mẫu (snippet)',
    newDocuments: 'Tài liệu mới',
    noLocalSettings: 'Không tìm thấy cài đặt cục bộ trong bản sao lưu',
    noNewDocuments: 'Không có tài liệu mới để nhập',
    noUpdates: 'Không có tài liệu cần cập nhật',
    replaceLocalSettings: 'Thay cài đặt cục bộ của bạn bằng bản sao lưu?',
    selectAll: 'Chọn tất cả',
    updates: 'Cập nhật',
    updateSelected: 'Cập nhật mục đã chọn ({count})',
  },
};
