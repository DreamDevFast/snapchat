import { useState } from 'react'
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonImg,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/react'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { defineCustomElements } from '@ionic/pwa-elements/loader'
import { camera, arrowUp } from 'ionicons/icons'

const INITIAL_STATE = {
  photo: '/assets/images/default.png',
}

const Home: React.FC = () => {
  defineCustomElements(window)
  const [photo, setPhoto] = useState<any>(INITIAL_STATE.photo)
  const [isLecturing, setIsLecturing] = useState<boolean>(false)

  const takePicture = () => {
    Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      promptLabelPhoto: 'Gallery',
      promptLabelPicture: 'Camera',
      promptLabelHeader: 'Cancel',
    })
      .then((image) => {
        setIsLecturing(true)
        setPhoto(image.webPath)
      })
      .catch((err) => console.log(err))
  }

  const sendLectureData = () => {
    console.log('send')
    setIsLecturing(false)
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ionic Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonImg
          style={{ border: '1px solid black', minHeight: '100px' }}
          src={photo}
        ></IonImg>
        <IonFab
          color="primary"
          vertical="bottom"
          horizontal="center"
          slot="fixed"
        >
          <IonFabButton
            color="primary"
            onClick={isLecturing ? sendLectureData : takePicture}
          >
            <IonIcon icon={isLecturing ? arrowUp : camera} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  )
}

export default Home
