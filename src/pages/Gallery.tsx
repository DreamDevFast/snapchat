import React, { useEffect, useState, useContext } from 'react'
import { useHistory } from 'react-router'
import axios from 'axios'
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { Directory, Filesystem } from '@capacitor/filesystem'
import { checkmarkCircle, close, folderOpen } from 'ionicons/icons'
import { Context } from '../ContextProvider'

const ENDPOINT_URL = 'https://vision.googleapis.com/v1/images:annotate'
const api_key = 'AIzaSyBb-LvJr_MuCCqqnx7BqKHc5-20lUoS5CE'

let delayTime = 0
let pressTimer: any

const Gallery: React.FC = () => {
  const context = useContext(Context)
  const history = useHistory()

  const [photos, setPhotos] = useState<Array<any>>([])
  const [files, setFiles] = useState<Array<any>>([])
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false)
  const [selectedPhotos, setSelectedPhotos] = useState<Array<any>>([])
  const [pressedPhoto, setPressedPhoto] = useState<any>(null)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = () => {
    setPressedPhoto(null)
    setSelectedPhotos([])
    setIsSelectionMode(false)
    Filesystem.readdir({
      path: 'videoDoc',
      directory: Directory.Documents,
    }).then(async (res) => {
      setFiles(res.files)
      const photos = await Promise.all(
        res.files.map(async (file) => {
          const photoData = await Filesystem.readFile({ path: file.uri })
          return 'data:image/jpeg;base64,' + photoData.data
        }),
      )
      setPhotos(photos)
    })
  }

  const deleteFiles = async () => {
    for (const photoIndex of selectedPhotos) {
      await Filesystem.deleteFile({
        path: `videoDoc/${files[photoIndex]['name']}`,
        directory: Directory.Documents,
      })
    }
    fetchFiles()
  }

  const delayUp = () => {
    delayTime += 100
  }

  const handleDownItem = (index: number) => {
    console.log('down')
    setPressedPhoto(index)
    if (isSelectionMode) {
      if (selectedPhotos.includes(index))
        setSelectedPhotos(selectedPhotos.filter((photo) => photo !== index))
      else setSelectedPhotos([...selectedPhotos, index])
    } else {
      setSelectedPhotos([index])
    }
    pressTimer = setInterval(delayUp, 100)
    setTimeout(() => {
      console.log(delayTime)
      if (delayTime >= 400) setIsSelectionMode(true)
    }, 500)
  }

  const handleUpItem = (index: number) => {
    console.log('up')
    console.log(delayTime)
    clearInterval(pressTimer)
    delayTime = 0
    setPressedPhoto(null)
  }

  const cancelSelectionMode = () => {
    setIsSelectionMode(false)
    setSelectedPhotos([])
  }

  const lecturePhotos = () => {
    const imgData = photos.filter((photo, index) =>
      selectedPhotos.includes(index),
    )

    axios({
      method: 'post',
      url: ENDPOINT_URL + `?key=${api_key}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        requests: imgData.map((image, index) => ({
          features: [
            {
              type: 'DOCUMENT_TEXT_DETECTION',
              maxResults: 10,
            },
          ],
          image: {
            content: image.split('data:image/jpeg;base64,')[1],
          },
        })),
      },
    }).then((res) => {
      const images = Array<any>(0)
      imgData.forEach((photo) => {
        const image = new Image()
        image.src = photo
        images.push(image)
      })

      setTimeout(() => {
        context.setImgData(
          images.map((image, index) => ({
            photo: imgData[index],
            width: image.width,
            height: image.height,
          })),
        )
        context.setDtcData(res.data)
        history.push('/preview')
      }, 500)
    })
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {isSelectionMode ? (
            <IonButtons slot="start">
              <IonIcon
                icon={close}
                style={{ fontSize: 25, marginLeft: 10 }}
                onClick={cancelSelectionMode}
              />
            </IonButtons>
          ) : (
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" />
            </IonButtons>
          )}
          {isSelectionMode && (
            <IonButtons slot="primary">
              <IonButton color="danger" onClick={deleteFiles}>
                Delete
              </IonButton>
              <IonButton color="primary" onClick={lecturePhotos}>
                Lecture
              </IonButton>
            </IonButtons>
          )}
          <IonTitle>Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {photos.length === 0 ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <IonIcon
              icon={folderOpen}
              style={{ fontSize: 70, color: '#8e8b8b' }}
            />
          </div>
        ) : (
          <IonRow>
            {photos.map((photo: string, index: number) => (
              <IonCol
                key={index}
                size={'4'}
                style={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onTouchStart={() => handleDownItem(index)}
                onTouchEnd={() => handleUpItem(index)}
              >
                <img
                  src={photo}
                  alt={index.toString()}
                  style={{
                    width: pressedPhoto === index ? '95%' : '100%',
                    height: pressedPhoto === index ? '95%' : '100%',
                    objectFit: 'cover',
                  }}
                />
                {isSelectionMode && selectedPhotos.includes(index) && (
                  <IonIcon
                    icon={checkmarkCircle}
                    style={{
                      fontSize: 50,
                      color: 'rgba(0,0,0,0.7)',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%)`,
                    }}
                  />
                )}
              </IonCol>
            ))}
          </IonRow>
        )}
      </IonContent>
    </IonPage>
  )
}

export default Gallery
