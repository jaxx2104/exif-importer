import React, { useState, useEffect } from 'react'

function MetadataSection({ selectedFile, metadata, xmlData, xmpData, onSave }) {
  const [editableXmlData, setEditableXmlData] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (xmlData) {
      setEditableXmlData(JSON.stringify(xmlData, null, 2))
    }
  }, [xmlData])

  const handleSave = async () => {
    try {
      const updatedXmlData = JSON.parse(editableXmlData)
      const result = await onSave(updatedXmlData)
      
      setMessage(result)
      if (result.success) {
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (err) {
      setMessage({
        success: false,
        message: 'JSONの形式が正しくありません: ' + err.message
      })
    }
  }

  const handleReset = () => {
    if (xmlData) {
      setEditableXmlData(JSON.stringify(xmlData, null, 2))
      setMessage(null)
    }
  }

  if (!metadata || !xmlData || !xmpData) {
    return (
      <div className="metadata-section">
        <h2>メタデータ</h2>
        <div className="loading">メタデータを読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="metadata-section">
      <h2>メタデータ</h2>
      
      {message && (
        <div className={message.success ? 'success' : 'error'}>
          {message.message}
        </div>
      )}
      
      <h3>EXIFメタデータ</h3>
      <div className="metadata-item">
        <label>作成日時:</label>
        <input 
          type="text" 
          value={metadata.createDate || ''} 
          readOnly 
        />
      </div>
      <div className="metadata-item">
        <label>更新日時:</label>
        <input 
          type="text" 
          value={metadata.modifyDate || ''} 
          readOnly 
        />
      </div>
      <div className="metadata-item">
        <label>GPS経度:</label>
        <input 
          type="text" 
          value={metadata.gpsLongitude || ''} 
          readOnly 
        />
      </div>
      <div className="metadata-item">
        <label>GPS緯度:</label>
        <input 
          type="text" 
          value={metadata.gpsLatitude || ''} 
          readOnly 
        />
      </div>
      <div className="metadata-item">
        <label>カメラモデル:</label>
        <input 
          type="text" 
          value={metadata.cameraModel || ''} 
          readOnly 
        />
      </div>
      
      <h3>XMPデータ</h3>
      <div className="metadata-item">
        <label>XMP内容:</label>
        <textarea 
          rows="15" 
          value={xmpData.content || xmpData.message || 'XMPデータが見つかりません'} 
          readOnly 
        />
      </div>
      
      <h3>XMLデータ</h3>
      <div className="metadata-item">
        <label>XML内容 (JSON形式):</label>
        <textarea 
          rows="10" 
          value={editableXmlData}
          onChange={(e) => setEditableXmlData(e.target.value)}
        />
      </div>
      
      <div>
        <button className="btn" onClick={handleSave}>
          メタデータを保存
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          リセット
        </button>
      </div>
    </div>
  )
}

export default MetadataSection