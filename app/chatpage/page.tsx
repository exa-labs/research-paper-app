// // app/chatpage/page.tsx
// 'use client';

// import { useSearchParams } from 'next/navigation';
// import ChatWithPaper from '@/components/ChatWithPaper';

// export default function ChatWithPaperPage() {
//   const searchParams = useSearchParams();
//   const paperParam = searchParams.get('paper');
  
//   const paperContext = paperParam ? JSON.parse(decodeURIComponent(paperParam)) : null;

//   if (!paperContext) {
//     return <div>No paper context provided</div>;
//   }

//   return (
//     <main className="flex relative min-h-screen flex-col items-center justify-center p-4">

//         {/* background grid design texture code */}
//         <div className="absolute inset-0 -z-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_0px),linear-gradient(to_bottom,#80808012_1px,transparent_0px)] bg-[size:50px_50px]"></div>
//         <ChatWithPaper paperContext={paperContext} />

//     </main>
//   );
// }


// app/chatpage/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import ChatWithPaper from '@/components/ChatWithPaper';

export default function ChatWithPaperPage() {
  const searchParams = useSearchParams();
  const paperParam = searchParams.get('paper');
  
  let paperContext = null;
  
  try {
    // Decode the base64 string back to JSON
    if (paperParam) {
      const decodedData = atob(paperParam);
      paperContext = JSON.parse(decodedData);
    }
  } catch (error) {
    console.error('Error parsing paper context:', error);
  }

  if (!paperContext) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">No paper context provided or invalid data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ChatWithPaper paperContext={paperContext} />
    </div>
  );
}