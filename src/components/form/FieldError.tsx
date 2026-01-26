const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null
  return <p className="text-xs text-primary">{message}</p>
}

export default FieldError
