import { lazy, Suspense, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { LoadingState } from './components/common'

const Dashboard = lazy(() => import('./pages/Dashboard').then((module) => ({ default: module.Dashboard })))
const Tutor = lazy(() => import('./pages/Tutor').then((module) => ({ default: module.Tutor })))
const Resources = lazy(() => import('./pages/Resources').then((module) => ({ default: module.Resources })))
const Quiz = lazy(() => import('./pages/Quiz').then((module) => ({ default: module.Quiz })))
const Progress = lazy(() => import('./pages/Progress').then((module) => ({ default: module.Progress })))
const Settings = lazy(() => import('./pages/Settings').then((module) => ({ default: module.Settings })))
const NotFound = lazy(() => import('./pages/NotFound').then((module) => ({ default: module.NotFound })))

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <BrowserRouter>
      <Suspense fallback={<main className="page-content"><LoadingState label="Opening your workspace…" /></main>}>
        <Routes>
          <Route element={<AppLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}>
            <Route index element={<Dashboard />} />
            <Route path="tutor" element={<Tutor />} />
            <Route path="resources" element={<Resources />} />
            <Route path="practice" element={<Quiz />} />
            <Route path="progress" element={<Progress />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/home" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
