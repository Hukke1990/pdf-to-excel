// web/src/App.jsx
import React, { useState, useRef } from 'react'
import './styles.css'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001'

export default function App() {
	const [file, setFile] = useState(null)
	const [busy, setBusy] = useState(false)
	const [error, setError] = useState('')
	const [dragOver, setDragOver] = useState(false)
	const inputRef = useRef(null)

	const onChange = (e) => {
		setError('')
		if (e.target.files?.[0]) setFile(e.target.files[0])
	}

	const onDrop = (e) => {
		e.preventDefault()
		setDragOver(false)
		const f = e.dataTransfer?.files?.[0]
		if (f && f.type === 'application/pdf') setFile(f)
	}

	const convert = async () => {
		if (!file) return
		setBusy(true)
		setError('')
		try {
			const fd = new FormData()
			fd.append('pdf', file)
			const res = await fetch(`${API_BASE}/convert`, { method: 'POST', body: fd })
			if (!res.ok) {
				const msg = await res.json().catch(() => ({}))
				throw new Error(msg.error || `Error HTTP ${res.status}`)
			}
			const blob = await res.blob()
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = `lista_precios_${Date.now()}.xlsx`
			document.body.appendChild(a)
			a.click()
			a.remove()
			URL.revokeObjectURL(url)
		} catch (e) {
			setError(e.message)
		} finally {
			setBusy(false)
		}
	}

	return (
		<div className="app-wrap">
			<div className="card">
				<div className="header">
					<div className="logo">PDF</div>
					<div>
						<h1>PDF → Excel</h1>
						<p className="lead">Subí un PDF con la lista de precios y descargá el Excel. Recomendado: PDFs con texto (no escaneos).</p>
					</div>
				</div>

				<div
					className={`dropzone ${dragOver ? 'dragover' : ''}`}
					onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
					onDragLeave={() => setDragOver(false)}
					onDrop={onDrop}
					onClick={() => inputRef.current?.click()}
				>
					<div className="info">
						<div className="title">Arrastrá y soltá tu PDF aquí</div>
						<div className="muted">O hacé click para seleccionar — solo archivos .pdf</div>
					</div>
					<input ref={inputRef} style={{ display: 'none' }} type="file" accept="application/pdf" onChange={onChange} />
					{file ? (
						<div className="file-info">{file.name} · {(file.size/1024).toFixed(1)} KB</div>
					) : (
						<div className="muted">No hay archivo seleccionado</div>
					)}
				</div>

				<div className="controls">
					<button className="btn primary" onClick={convert} disabled={!file || busy}>
						{busy ? <span style={{display:'inline-flex',alignItems:'center',gap:8}}><span className="spinner"/> Convirtiendo…</span> : 'Convertir y descargar XLSX'}
					</button>
				</div>

				{error && (
					<div className="error">⚠️ {error}</div>
				)}

				<hr className="sep" />
			</div>
		</div>
	)
}