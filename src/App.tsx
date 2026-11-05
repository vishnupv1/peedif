import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout.tsx'
import { Home } from './pages/Home.tsx'
import { NotFound } from './pages/NotFound.tsx'
import { Pricing } from './pages/Pricing.tsx'
import { Privacy } from './pages/Privacy.tsx'
import { Terms } from './pages/Terms.tsx'

const MergePDF = lazy(() => import('./pages/tools/MergePDF.tsx').then((module) => ({ default: module.MergePDF })))
const SplitPDF = lazy(() => import('./pages/tools/SplitPDF.tsx').then((module) => ({ default: module.SplitPDF })))
const CompressPDF = lazy(() => import('./pages/tools/CompressPDF.tsx').then((module) => ({ default: module.CompressPDF })))
const ImagesToPDF = lazy(() => import('./pages/tools/ImagesToPDF.tsx').then((module) => ({ default: module.ImagesToPDF })))
const RotatePDF = lazy(() => import('./pages/tools/RotatePDF.tsx').then((module) => ({ default: module.RotatePDF })))
const AddPageNumbers = lazy(() => import('./pages/tools/AddPageNumbers.tsx').then((module) => ({ default: module.AddPageNumbers })))
const PdfToWord = lazy(() => import('./pages/tools/PdfToWord.tsx').then((module) => ({ default: module.PdfToWord })))
const WordToPDF = lazy(() => import('./pages/tools/WordToPDF.tsx').then((module) => ({ default: module.WordToPDF })))
const PdfToJpg = lazy(() => import('./pages/tools/PdfToJpg.tsx').then((module) => ({ default: module.PdfToJpg })))
const JpgToPDF = lazy(() => import('./pages/tools/JpgToPDF.tsx').then((module) => ({ default: module.JpgToPDF })))
const PdfToPpt = lazy(() => import('./pages/tools/PdfToPpt.tsx').then((module) => ({ default: module.PdfToPpt })))
const PptToPDF = lazy(() => import('./pages/tools/PptToPDF.tsx').then((module) => ({ default: module.PptToPDF })))
const PdfToExcel = lazy(() => import('./pages/tools/PdfToExcel.tsx').then((module) => ({ default: module.PdfToExcel })))
const ExcelToPDF = lazy(() => import('./pages/tools/ExcelToPDF.tsx').then((module) => ({ default: module.ExcelToPDF })))
const HtmlToPDF = lazy(() => import('./pages/tools/HtmlToPDF.tsx').then((module) => ({ default: module.HtmlToPDF })))
const WebpageToPDF = lazy(() => import('./pages/tools/WebpageToPDF.tsx').then((module) => ({ default: module.WebpageToPDF })))
const QrBarcode = lazy(() => import('./pages/tools/QrBarcode.tsx').then((module) => ({ default: module.QrBarcode })))
const OcrPDF = lazy(() => import('./pages/tools/OcrPDF.tsx').then((module) => ({ default: module.OcrPDF })))
const TranslatePDF = lazy(() => import('./pages/tools/TranslatePDF.tsx').then((module) => ({ default: module.TranslatePDF })))

function ToolFallback() {
  return <p className="mx-auto w-full max-w-3xl px-4 py-16 text-sm text-muted sm:px-6">Loading tool…</p>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="merge-pdf" element={<Suspense fallback={<ToolFallback />}><MergePDF /></Suspense>} />
        <Route path="split-pdf" element={<Suspense fallback={<ToolFallback />}><SplitPDF /></Suspense>} />
        <Route path="compress-pdf" element={<Suspense fallback={<ToolFallback />}><CompressPDF /></Suspense>} />
        <Route path="images-to-pdf" element={<Suspense fallback={<ToolFallback />}><ImagesToPDF /></Suspense>} />
        <Route path="rotate-pdf" element={<Suspense fallback={<ToolFallback />}><RotatePDF /></Suspense>} />
        <Route path="add-page-numbers" element={<Suspense fallback={<ToolFallback />}><AddPageNumbers /></Suspense>} />
        <Route path="pdf-to-word" element={<Suspense fallback={<ToolFallback />}><PdfToWord /></Suspense>} />
        <Route path="word-to-pdf" element={<Suspense fallback={<ToolFallback />}><WordToPDF /></Suspense>} />
        <Route path="pdf-to-jpg" element={<Suspense fallback={<ToolFallback />}><PdfToJpg /></Suspense>} />
        <Route path="jpg-to-pdf" element={<Suspense fallback={<ToolFallback />}><JpgToPDF /></Suspense>} />
        <Route path="pdf-to-ppt" element={<Suspense fallback={<ToolFallback />}><PdfToPpt /></Suspense>} />
        <Route path="ppt-to-pdf" element={<Suspense fallback={<ToolFallback />}><PptToPDF /></Suspense>} />
        <Route path="pdf-to-excel" element={<Suspense fallback={<ToolFallback />}><PdfToExcel /></Suspense>} />
        <Route path="excel-to-pdf" element={<Suspense fallback={<ToolFallback />}><ExcelToPDF /></Suspense>} />
        <Route path="html-to-pdf" element={<Suspense fallback={<ToolFallback />}><HtmlToPDF /></Suspense>} />
        <Route path="webpage-to-pdf" element={<Suspense fallback={<ToolFallback />}><WebpageToPDF /></Suspense>} />
        <Route path="qr-barcode" element={<Suspense fallback={<ToolFallback />}><QrBarcode /></Suspense>} />
        <Route path="ocr" element={<Suspense fallback={<ToolFallback />}><OcrPDF /></Suspense>} />
        <Route path="translate" element={<Suspense fallback={<ToolFallback />}><TranslatePDF /></Suspense>} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
