import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'

function App() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-[#071311]" aria-label="Loading page">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-lime-300" />
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App
