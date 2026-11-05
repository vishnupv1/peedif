import { copyFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const coreOut = resolve(root, 'public/tesseract-core')
const workerOut = resolve(root, 'public/tesseract')
const langOut = resolve(root, 'public/tessdata')

mkdirSync(coreOut, { recursive: true })
mkdirSync(workerOut, { recursive: true })
mkdirSync(langOut, { recursive: true })

const coreFiles = [
  'tesseract-core-lstm.wasm.js',
  'tesseract-core-lstm.wasm',
  'tesseract-core-simd-lstm.wasm.js',
  'tesseract-core-simd-lstm.wasm',
  'tesseract-core-relaxedsimd-lstm.wasm.js',
  'tesseract-core-relaxedsimd-lstm.wasm',
]

for (const file of coreFiles) {
  copyFileSync(resolve(root, 'node_modules/tesseract.js-core', file), resolve(coreOut, file))
}

copyFileSync(resolve(root, 'node_modules/tesseract.js/dist/worker.min.js'), resolve(workerOut, 'worker.min.js'))
copyFileSync(
  resolve(root, 'node_modules/@tesseract.js-data/eng/4.0.0/eng.traineddata.gz'),
  resolve(langOut, 'eng.traineddata.gz'),
)
