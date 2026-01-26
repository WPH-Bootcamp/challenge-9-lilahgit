import type { ApiError } from "@/types/apiError"

const ApiErrorNotice = ({
  error,
  onRetry,
}: {
  error: ApiError
  onRetry?: () => void
}) => {
  return (
    <div className="rounded-2xl border border-danger-200 bg-danger-50 p-4 text-sm text-danger-700">
      <p className="font-semibold">{error.message}</p>
      {error.retriable && onRetry && (
        <button
          className="mt-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90"
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  )
}

export default ApiErrorNotice
