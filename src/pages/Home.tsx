import {useEffect, useState, useContext} from 'react'
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
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { list, close, checkmark } from 'ionicons/icons'
import {
    CameraPreview,
    CameraPreviewPictureOptions,
    CameraPreviewOptions,
    CameraPreviewDimensions,
} from '@awesome-cordova-plugins/camera-preview/ngx'
import { Context } from '../ContextProvider'
import axios from 'axios'

const INITIAL_STATE = {
    photo: '/assets/images/default.png',
}
const ENDPOINT_URL = 'https://vision.googleapis.com/v1/images:annotate'
const api_key = 'AIzaSyBb-LvJr_MuCCqqnx7BqKHc5-20lUoS5CE'

const Home: React.FC = () => {
    const history = useHistory()
    const context = useContext(Context)
    const cameraPreview = new CameraPreview();
    const [photo, setPhoto] = useState<any>(INITIAL_STATE.photo)
    const [isRunningCamera, setIsRunningCamera] = useState<boolean>(false)

    useEffect(() => {
        runCamera();
    }, []);

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
            .then((res) => {
                console.log('camera success run:', res);
                setIsRunningCamera(true);
            })
            .catch(err => console.log('camera run error:', err));
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

    const savePicture = () => {
        const date = new Date();
        Filesystem.writeFile({
            path: `videoDoc/photo_${date.getFullYear()}_${date.getMonth()}_${date.getDate()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.jpg'`,
            data: photo,
            directory: Directory.Documents,
            recursive: true
        })
            .then(() => {
                const imgData = photo.split('data:image/jpeg;base64,')[1];

                axios({
                    method: 'post',
                    url: ENDPOINT_URL + `?key=${api_key}`,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        requests: [
                            {
                                features: [
                                    {
                                        type: 'DOCUMENT_TEXT_DETECTION',
                                        maxResults: 10,
                                    },
                                ],
                                image: {
                                    content: imgData,
                                },
                            },
                        ],
                    },
                })
                    .then(res => {
                        context.setImgData(photo);
                        context.setDtcData(res.data);
                        history.push('/preview');
                        // runCamera();
                    })
            })
    }

    return (
        <IonPage style={{ backgroundColor: isRunningCamera ? 'transparent' : '#FFF' }}>
            {
                isRunningCamera ? (
                    <>
                        <IonFab color="primary" vertical="bottom" horizontal="center" slot="fixed">
                            <IonFabButton color="transparent" style={{ backgroundColor: 'transparent', border: '4px solid #FFF', borderRadius: 100, marginBottom: 10 }} onClick={clickShat}>
                            </IonFabButton>
                        </IonFab>
                        <IonFab color="success" vertical="bottom" horizontal="start" slot="fixed">
                            <IonFabButton style={{ marginBottom: 10 }} onClick={async () => {
                                await cameraPreview.stopCamera()
                                history.push('/gallery')
                            }}>
                                <IonIcon icon={list} />
                            </IonFabButton>
                        </IonFab>
                    </>
                ) : (
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
                )
            }
        </IonPage>
    )
}

export default Home
