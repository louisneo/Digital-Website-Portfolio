import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import fs from 'fs'
import path from 'path'
import { createRelicModel } from '../src/lib/relicModels.js'

globalThis.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(buf => {
      this.result = buf
      if (this.onloadend) this.onloadend({ target: this })
      if (this.onload) this.onload({ target: this })
    })
  }
}

const MODELS = [
  { file: 'job-whirlwind.glb', title: 'Voice out of the Whirlwind' },
  { file: 'panchatantra-manuscripts.glb', title: 'The Panchatantra' },
  { file: 'ramayana-bow.glb', title: 'The Ramayana' },
  { file: 'mahabharata-wheel.glb', title: 'The Mahabharata' },
  { file: 'iliad-shield.glb', title: 'The Iliad' },
  { file: 'odyssey-ship.glb', title: 'The Odyssey' },
  { file: 'roland-olifant.glb', title: 'The Song of Roland' },
]

async function exportAll() {
  const outDir = path.resolve('public/models')
  fs.mkdirSync(outDir, { recursive: true })

  const exporter = new GLTFExporter()

  for (const item of MODELS) {
    console.log(`Generating model for ${item.title} -> ${item.file}...`)
    const root = createRelicModel(THREE, item.title)

    // Remove particle systems for GLTF export if any, as GLTF standard uses meshes
    const toRemove = []
    root.traverse(obj => {
      if (obj.isPoints) toRemove.push(obj)
    })
    toRemove.forEach(obj => obj.parent && obj.parent.remove(obj))

    const filePath = path.join(outDir, item.file)
    await new Promise((resolve, reject) => {
      exporter.parse(
        root,
        gltf => {
          fs.writeFileSync(filePath, Buffer.from(gltf))
          console.log(`  ✓ Wrote ${item.file} (${(fs.statSync(filePath).size / 1024).toFixed(1)} KB)`)
          resolve()
        },
        err => {
          console.error(`  ✗ Error exporting ${item.file}:`, err)
          reject(err)
        },
        { binary: true }
      )
    })
  }

  // Remove test.glb if it exists
  const testPath = path.join(outDir, 'test.glb')
  if (fs.existsSync(testPath)) fs.unlinkSync(testPath)

  console.log('All GLB models generated successfully!')
}

exportAll().catch(console.error)
