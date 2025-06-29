import { useState, useEffect } from 'react'
import Header from './components/Header'
import ConfigSection from './components/ConfigSection'
import FilesSection from './components/FilesSection'
import MetadataSection from './components/MetadataSection'

const API_BASE_URL = 'http://localhost:3000'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [config, setConfig] = useState(null)
  const [files, setFiles] = useState([])
  const [metadata, setMetadata] = useState(null)
  const [xmlData, setXmlData] = useState(null)
  const [xmpData, setXmpData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [configResponse, filesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/config`),
        fetch(`${API_BASE_URL}/api/files`)
      ])
      
      const configData = await configResponse.json()
      const filesData = await filesResponse.json()
      
      setConfig(configData)
      setFiles(filesData)
    } catch (err) {
      setError('初期データの読み込みに失敗しました: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (filename) => {
    try {
      setSelectedFile(filename)
      setMetadata(null)
      setXmlData(null)
      setXmpData(null)
      
      const [metadataResponse, xmlResponse, xmpResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/metadata/${filename}`),
        fetch(`${API_BASE_URL}/api/xml/${filename}`),
        fetch(`${API_BASE_URL}/api/xmp/${filename}`)
      ])
      
      const metadataData = await metadataResponse.json()
      const xmlDataData = await xmlResponse.json()
      const xmpDataData = await xmpResponse.json()
      
      setMetadata(metadataData)
      setXmlData(xmlDataData)
      setXmpData(xmpDataData)
    } catch (err) {
      setError('メタデータの読み込みに失敗しました: ' + err.message)
    }
  }

  const handleSaveMetadata = async (updatedXmlData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/xml/${selectedFile}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ xmlData: updatedXmlData })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Reload metadata to show updated values
        setTimeout(() => handleFileSelect(selectedFile), 1000)
        return { success: true, message: 'メタデータが正常に保存されました。' }
      } else {
        throw new Error(result.error || '保存に失敗しました')
      }
    } catch (err) {
      return { success: false, message: 'メタデータの保存に失敗しました: ' + err.message }
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">読み込み中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    )
  }

  return (
    <div className="container">
      <Header />
      
      <div className="main-layout">
        <div className="left-column">
          <ConfigSection config={config} />
          <FilesSection 
            files={files} 
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
          />
        </div>
        
        <div className="right-column">
          {selectedFile && (
            <MetadataSection 
              selectedFile={selectedFile}
              metadata={metadata}
              xmlData={xmlData}
              xmpData={xmpData}
              onSave={handleSaveMetadata}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App