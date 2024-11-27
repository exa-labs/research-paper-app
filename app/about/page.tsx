// app/about/page.tsx
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--secondary-default)]">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Back Navigation */}
        <Link 
          href="/"
          className="inline-flex items-center text-[var(--brand-default)] hover:text-[var(--brand-dark)] transition-colors mb-12 opacity-0 animate-fade-up [animation-delay:200ms]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Main Content */}
        <main className="space-y-16">
          {/* Header */}
          <div className="space-y-6 opacity-0 animate-fade-up [animation-delay:400ms]">
            <h1 className="text-4xl md:text-6xl font-bold hover:text-brand-default">
                <Link href="https://exa.ai">
                     exa.ai
                </Link>
            </h1>
            <p className="text-xl">
              The Search Engine for AI
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-12 text-lg">
            <section className="space-y-6 opacity-0 animate-fade-up [animation-delay:600ms]">
              <h2 className="text-2xl font-semibold">
                What is Exa
              </h2>
              <p className="leading-relaxed text-gray-700">
                Exa is the first search engine built specifically to give you exactly what you're 
                looking for. Unlike traditional search engines, we don't show ads - we focus purely 
                on quality results. We're an applied AI lab with a mission to create perfect search.
              </p>
            </section>

            <section className="space-y-6 opacity-0 animate-fade-up [animation-delay:800ms]">
              <h2 className="text-2xl font-semibold">
                Exa API
              </h2>
              <p className="leading-relaxed text-gray-700">
                Our API helps AI applications search the web smarter. We use advanced technology 
                to understand complex questions and find relevant information quickly. This makes 
                it easy for developers to build AI tools that can search and understand web content.
              </p>
            </section>
          </div>

          {/* Join Us Section */}
          <section className="bg-[var(--brand-default)] p-8 text-white rounded-none opacity-0 animate-fade-up [animation-delay:1000ms]">
            <h2 className="text-2xl font-semibold mb-6">
              Join Our Team
            </h2>
            <p className="leading-relaxed mb-8">
              We're an AI lab based in San Francisco, working in-person to build the future of search. 
              We're looking for talented people to join our team.
            </p>
            <Link 
              href="https://exa.ai/careers" 
              target="_blank"
              className="inline-block bg-white text-[var(--brand-default)] px-6 py-3 rounded-none hover:bg-[var(--brand-fainter)] transition-colors"
            >
              View Open Positions →
            </Link>
          </section>

          {/* Additional Links */}
          <div className="flex items-center justify-between pt-12 pb-12 border-t border-[var(--gray-500)] opacity-0 animate-fade-up [animation-delay:1200ms]">
            <Link 
              href="https://exa.ai"
              className="text-[var(--brand-default)] hover:text-[var(--brand-dark)] transition-colors"
            >
              Learn more about Exa →
            </Link>
            <p>
              Made with ❤️ by team Exa
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}