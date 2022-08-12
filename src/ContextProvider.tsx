import React, { useState } from 'react'
type DetectData = {
  responses: Array<any>
}

type ImageData = Array<{
  photo: string
  width: number
  height: number
}>

const defaultContext = {
  imageData: [{ photo: '', width: 0, height: 0 }],
  detectData: { responses: Array<any>(0) },
  setImgData: (imageData: ImageData) => {},
  setDtcData: (detectData: DetectData) => {},
}

export const Context = React.createContext(defaultContext)

const ContextProvider: React.FC = (props: any) => {
  const [imageData, setImageData] = useState<ImageData>(
    defaultContext.imageData,
  )
  const [detectData, setDetectData] = useState<DetectData>(
    defaultContext.detectData,
  )

  const setImgData = (imageData: ImageData) => {
    setImageData(imageData)
  }

  const setDtcData = (detectData: DetectData) => {
    setDetectData(detectData)
  }

  return (
    <Context.Provider value={{ imageData, detectData, setImgData, setDtcData }}>
      {props.children}
    </Context.Provider>
  )
}

export default ContextProvider
