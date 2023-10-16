import { html } from 'htm/preact'
import { useRef } from 'preact/hooks'
import { ComponentChildren } from 'preact'

export const ImageDrop = ({
  children,
  box,
}: {
  children: ComponentChildren
  box: boolean
}) => {
  const dropAreaRef = useRef<HTMLDivElement>()
  const handleDragOver = (e: DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
    e.dataTransfer!.dropEffect = 'link'
    dropAreaRef.current!.classList.add('dragover')
  }

  const handleDragLeave = (e: DragEvent) => {
    dropAreaRef.current!.classList.remove('dragover')
  }

  const handleDrop = (e: DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const files = e.dataTransfer!.files
    const fileArray = Array.from(files)
    window.postMessage({
      type: 'initCanvas',
      body: {
        n: fileArray.length,
      },
    })
    fileArray.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        const data = reader.result
        window.postMessage({
          type: 'addImage',
          body: {
            data,
            uri: file.name,
          },
        })
      }
      reader.readAsArrayBuffer(file)
    })
    dropAreaRef.current!.classList.remove('dragover')
  }

  return html`
    <div
      class="drop-area"
      ondragover=${handleDragOver}
      ondrop=${handleDrop}
      ref=${dropAreaRef}
      ondragleave=${handleDragLeave}
    >
      ${children}
      ${box &&
      html`<div class="drop-area-box">
        <p>Drop files here</p>
      </div>`}
    </div>
  `
}