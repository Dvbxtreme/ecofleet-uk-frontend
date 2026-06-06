export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <iframe src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/legal/terms`} className="w-full min-h-screen border-0" title="Terms of Service" />
    </div>
  )
}
