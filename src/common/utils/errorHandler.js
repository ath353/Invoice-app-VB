export function getSafeErrorMessage(err) {
  if (err instanceof Error) return err.message
  return 'Đã xảy ra lỗi, vui lòng thử lại'
}
