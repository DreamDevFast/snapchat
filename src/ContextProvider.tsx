import React, {useState} from 'react'

const defaultContext = {
    imageData: '',
    detectData: {},
    setImgData: (imageData: string) => {},
    setDtcData: (detectData: object) => {}
}

export const Context = React.createContext(defaultContext)

const ContextProvider: React.FC = (props:any) => {
    const [imageData, setImageData] = useState<string>(defaultContext.imageData)
    const [detectData, setDetectData] = useState<object>(defaultContext.detectData)

    const setImgData = (imageData: string) => {
        setImageData(imageData)
    }

    const setDtcData = (detectData: object) => {
        setDetectData(detectData)
    }

    return (
        <Context.Provider value={{imageData, detectData, setImgData, setDtcData}}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;