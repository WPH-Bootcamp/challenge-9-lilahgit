const FormErrorSummary = ({ message }: { message?: string }) => {
  if (!message) return null
  return (
    <div className="rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-xs text-danger-700">
      {message}
    </div>
  )
}

export default FormErrorSummary
