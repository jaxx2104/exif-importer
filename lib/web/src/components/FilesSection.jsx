import React from 'react'

function FilesSection({ files, selectedFile, onFileSelect }) {
  const getFileIcon = (extension) => {
    const icons = {
      'mp4': '🎬',
      'mov': '🎬', 
      'avi': '🎬',
      'mkv': '🎬',
      'jpg': '📷',
      'jpeg': '📷',
      'png': '📷',
      'gif': '📷',
      'arw': '📸',
      'raw': '📸',
      'cr2': '📸',
      'nef': '📸'
    }
    
    return icons[extension.toLowerCase()] || '📄'
  }

  if (!files.length) {
    return (
      <div className="files-section">
        <h2>ファイル一覧</h2>
        <p>ファイルが見つかりませんでした。</p>
      </div>
    )
  }

  return (
    <div className="files-section">
      <h2>ファイル一覧</h2>
      <div className="file-grid">
        {files.map((file) => {
          const extension = file.name.split('.').pop()
          const icon = getFileIcon(extension)
          const isSelected = selectedFile === file.name
          
          return (
            <div
              key={file.name}
              className={`file-item ${isSelected ? 'selected' : ''}`}
              onClick={() => onFileSelect(file.name)}
            >
              <div className="file-icon">{icon}</div>
              <div className="file-name">{file.name}</div>
              <div className="file-path">{file.path}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FilesSection