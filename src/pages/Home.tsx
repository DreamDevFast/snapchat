import {useEffect, useState} from 'react'
import { useHistory} from "react-router";
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
    IonRouterLink
} from '@ionic/react'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { defineCustomElements } from '@ionic/pwa-elements/loader'
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { list, close, checkmark } from 'ionicons/icons'
import {
    CameraPreview,
    CameraPreviewPictureOptions,
    CameraPreviewOptions,
    CameraPreviewDimensions,
} from '@awesome-cordova-plugins/camera-preview/ngx'

const INITIAL_STATE = {
    photo: '/assets/images/default.png',
}

const Home: React.FC = () => {
    defineCustomElements(window)
    const history = useHistory()
    const cameraPreview = new CameraPreview();
    const nativeStorage = new NativeStorage();
    const [photo, setPhoto] = useState<any>(INITIAL_STATE.photo)
    const [isLecturing, setIsLecturing] = useState<boolean>(false)
    const [isRunningCamera, setIsRunningCamera] = useState<boolean>(false)

    useEffect(() => {
        runCamera();
    }, []);

    const sendLectureData = () => {
        console.log('send')
        setIsLecturing(false)
    }

    const runCamera = () => {
        let options = {
            x: 0,
            y: 0,
            width: window.screen.width,
            height: window.screen.height,
            camera: cameraPreview.CAMERA_DIRECTION.BACK,
            toBack: true,
            tapPhoto: true,
            tapFocus: false,
            previewDrag: false,
            storeToFile: false,
            disableExifHeaderStripping: false
        };

        cameraPreview.startCamera(options)
            .then(() => {
                setIsRunningCamera(true);
            })
    }

    const clickShat = () => {
        let pictureOpts: CameraPreviewPictureOptions = {
            width: window.screen.width,
            height: window.screen.height,
            quality: 85
        }
        cameraPreview.takePicture(pictureOpts)
            .then(imageData => {
                cameraPreview.stopCamera()
                    .then(() => {
                        setIsRunningCamera(false);
                        setPhoto('data:image/jpeg;base64,' + imageData);
                    })
            })
    }

    const savePicture = async () => {
        const date = new Date();
        await Filesystem.writeFile({
            path: `videoDoc/photo_${date.getFullYear()}_${date.getMonth()}_${date.getDate()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.jpg'`,
            data: photo,
            directory: Directory.Documents,
            recursive: true
        });

        // TODO send data to API

        runCamera();
    }

    return (
        <IonPage style={{ backgroundColor: isRunningCamera ? 'transparent' : '#FFF' }}>
            {
                !isRunningCamera ? (
                    <>
                        <IonImg
                            style={{
                                border: '3px solid #c41be2',
                                width: window.screen.width,
                                height: window.screen.height,
                                objectFit: 'cover',
                            }}
                            src={photo}
                        />
                        <IonFab color="primary" vertical="bottom" horizontal="start" slot="fixed">
                            <IonFabButton color="default" onClick={runCamera}>
                                <IonIcon icon={close} />
                            </IonFabButton>
                        </IonFab>
                        <IonFab color="primary" vertical="bottom" horizontal="end" slot="fixed">
                            <IonFabButton color="success" onClick={savePicture}>
                                <IonIcon icon={checkmark} />
                            </IonFabButton>
                        </IonFab>
                    </>
                ) : (
                    <>
                        <IonFab color="primary" vertical="bottom" horizontal="center" slot="fixed">
                            <IonFabButton color="transparent" style={{ backgroundColor: 'transparent', border: '4px solid #FFF', borderRadius: 100, marginBottom: 10 }} onClick={clickShat}>
                            </IonFabButton>
                        </IonFab>
                        <IonFab color="success" vertical="bottom" horizontal="end" slot="fixed">
                            <IonFabButton style={{ marginBottom: 10 }} onClick={async () => {
                                await cameraPreview.stopCamera()
                                history.push('/gallery')
                            }}>
                                <IonIcon icon={list} />
                            </IonFabButton>
                        </IonFab>
                    </>
                )
            }
        </IonPage>
    )
}

export default Home
