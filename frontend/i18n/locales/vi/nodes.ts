export default {
  actions: {
    copyPublicLink: 'Sao chép liên kết công khai',
    editMeta: 'Sửa siêu dữ liệu',
    exportAsMarkdown: 'Xuất ra Markdown',
    managePermissions: 'Quản lý quyền',
    newDocument: '+ Tạo tài liệu mới',
    publicLink: 'Liên kết công khai',
    removeFromShared: 'Gỡ khỏi mục được chia sẻ',
    resetBoard: 'Đặt lại bảng',
    share: 'Chia sẻ',
  },
  category: {
    editTitle: 'Danh mục & không gian làm việc',
    iconHint: 'Hỗ trợ SVG',
    name: 'Danh mục',
    new: 'Danh mục mới',
    notifications: {
      created: 'Đã tạo danh mục thành công',
      creationError: 'Lỗi khi tạo danh mục',
      updated: 'Đã cập nhật danh mục',
    },
    orderHint: 'Thứ tự danh mục trên thanh bên',
    uncategorized: 'Chưa phân loại',
  },

  container: {
    createNewDocument: '+ Tạo tài liệu mới',
    import: 'Nhập',
    newCategory: '+ Danh mục',
    newWorkspace: '+ Không gian làm việc',
    noDocuments: 'Không tìm thấy tài liệu nào',
    noDocumentsDescription: 'Danh mục này chưa có tài liệu nào',
    noWorkspaces: 'Không tìm thấy không gian làm việc hay danh mục nào',
    searchPlaceholder: 'Tìm không gian làm việc...',
    title: 'Không gian làm việc & Danh mục',
  },

  document: {
    childs: 'Tài liệu con',
    editPage: 'Sửa trang',
    lastUpdated: 'Cập nhật lần cuối',
    nextPage: 'Trang sau',
    prevPage: 'Trang trước',
    TOC: 'Mục lục',
  },

  filter: {
    footer: '{count} / {total} kết quả khớp',
    title: 'Lọc mục',
    toClose: 'để đóng',
  },

  modals: {
    delete: {
      bulkCount: 'Thao tác này sẽ xóa {count} mục.',
      confirm: 'Bạn có chắc muốn xóa {type} này không?',
      confirmBulk: 'Bạn có chắc muốn xóa các mục đã chọn không?',
      hasChildren: 'Có {count} tài liệu con trong {type} này. Các tài liệu con cũng sẽ bị xóa.',
      irreversible: 'Thao tác này không thể hoàn tác',
      title: 'Xóa {type}',
      titleBulk: 'Xóa các mục',
    },
    join: {
      access: 'Quyền truy cập',
      helperText: 'Cần có mã hoặc liên kết mời để tiếp tục.',
      inputPlaceholder: 'ABC123 hoặc https://.../join-workspace?code=ABC123',
      join: 'Tham gia',
      joining: 'Đang tham gia...',
      label: 'Mã hoặc liên kết mời',
      subtitle:
        'Dán mã mời hoặc toàn bộ liên kết mời. Nếu bạn đã tham gia không gian làm việc này với một mức quyền khác, chỉ mức quyền cao nhất được giữ lại.',
      title: 'Tham gia nhóm hoặc không gian làm việc',
    },
    metadata: {
      emojiOrIcon: 'Emoji hoặc biểu tượng',
      emojiOrIconHint: 'Hỗ trợ SVG hoặc emoji',
      labelAppearance: 'Giao diện',
      labelMedia: 'Đa phương tiện',
      labelOrganization: 'Sắp xếp',
      pinDescription: 'Ghim tài liệu này lên đầu không gian làm việc của bạn',
      thumbnail: 'Ảnh thu nhỏ',
      thumbnailHint: 'Hỗ trợ SVG',
      title: 'Siêu dữ liệu',
    },
    permissions: {
      addPermission: 'Thêm',
      defaultPermission: 'Quyền mặc định cho người dùng mới',
      generalAccess: 'Quyền truy cập chung',
      inviteCreate: 'Tạo lời mời',
      inviteCreateProgress: 'Đang tạo lời mời...',
      inviteEmpty: 'Chưa có lời mời nào',
      inviteLabel: 'Lời mời',
      invitePermission: 'Quyền',
      managePermissions: 'Quản lý quyền',
      noPermissions: 'Chưa thiết lập quyền nào',
      noResults: 'Không tìm thấy kết quả nào',
      publicInfo: 'Tài liệu này sẽ được truy cập công khai qua một URL riêng.',
      removePermission: 'Gỡ quyền',
      searchPlaceholder: 'Tên người dùng hoặc email',
      searchUser: 'Tìm người dùng',
      shareLink: 'Chia sẻ liên kết này để bất kỳ ai cũng xem được tài liệu mà không cần tài khoản:',
      title: 'Quản lý quyền',
    },
    removeShared: {
      childWarning: 'Tài liệu này có {count} tài liệu con. Các tài liệu con cũng sẽ bị gỡ.',
      confirm: 'Bạn có chắc muốn gỡ tài liệu này không?',
      noAccess: 'Sau thao tác này, bạn sẽ không còn quyền truy cập tài liệu này.',
      success: 'Đã gỡ tài liệu',
      title: 'Gỡ tài liệu này',
    },
  },

  nodes: 'Mục',

  notifications: {
    linkCopied: 'Đã sao chép liên kết vào bộ nhớ tạm',
  },

  // From the shared_target api (PWA)
  share: {
    actionChoose: 'Bạn muốn làm gì?',
    actionCreateDocument: 'Tạo tài liệu mới',
    actionCreateDocumentDesc: 'Tạo tài liệu Markdown mới từ nội dung được chia sẻ',
    actionUploadResource: 'Tải lên dưới dạng tài nguyên',
    actionUploadResourceDesc: 'Tải nội dung được chia sẻ lên dưới dạng tài nguyên (hình ảnh, PDF...) và nhận liên kết để chèn vào tài liệu',
    chooseDestination: 'Chọn nơi bạn muốn lưu nội dung này.',
    description: 'Nội dung nhận được từ ứng dụng khác.',
    sharedContent: 'Nội dung được chia sẻ',
    title: 'Chia sẻ nội dung',
  },

  tags: 'Thẻ',

  types: {
    category: 'Danh mục',
    document: 'Tài liệu',
    resource: 'Tài nguyên',
    workspace: 'Không gian làm việc',
  },

  workspace: {
    all: 'Tất cả không gian làm việc',
    new: 'Không gian làm việc mới',
    shared: 'Được chia sẻ với tôi',
  },
};
