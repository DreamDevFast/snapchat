import React, {useEffect, useState} from 'react';
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
    IonToolbar
} from "@ionic/react";
import {Directory, Filesystem} from '@capacitor/filesystem';
import {checkmarkCircle, close, folderOpen} from "ionicons/icons";

let delayTime = 0;
let pressTimer:any;

const Gallery: React.FC = () => {
    const [ photos, setPhotos ] = useState<Array<any>>([]);
    const [ files, setFiles ] = useState<Array<any>>([]);
    const [ isSelectionMode, setIsSelectionMode ] = useState<boolean>(false);
    const [ selectedPhotos, setSelectedPhotos ] = useState<Array<any>>([]);
    const [ pressedPhoto, setPressedPhoto ] = useState<any>(null);

    useEffect(() => {
        fetchFiles();
    }, [])

    const fetchFiles = () => {
        setPressedPhoto(null);
        setSelectedPhotos([]);
        setIsSelectionMode(false);
        Filesystem.readdir({ path: 'videoDoc', directory: Directory.Documents })
            .then(async res => {
                setFiles(res.files);
                const photos = await Promise.all(res.files.map(async file => {
                    const photoData = await Filesystem.readFile({ path: file.uri });
                    return 'data:image/jpeg;base64,' + photoData.data;
                }))
                setPhotos(photos);
            })
    }

    const deleteFiles = async () => {
        for (const photoIndex of selectedPhotos) {
            await Filesystem.deleteFile({path: `videoDoc/${files[photoIndex]['name']}`, directory: Directory.Documents})
        }
        fetchFiles();
    }

    const delayUp = () => {
        delayTime += 100
    }

    const handleDownItem = (index:number) => {
        setPressedPhoto(index);
        if(isSelectionMode) {
            if(selectedPhotos.includes(index)) setSelectedPhotos(selectedPhotos.filter(photo => photo !== index))
            else setSelectedPhotos([...selectedPhotos, index]);
        }
        else {
            setSelectedPhotos([index]);
        }
        pressTimer = setInterval(delayUp, 100);
        setTimeout(() => {
            if(delayTime >= 500) setIsSelectionMode(true);
        }, 500);
    }

    const handleUpItem = (index:number) => {
        clearInterval(pressTimer);
        delayTime = 0;
        setPressedPhoto(null);
    }

    const cancelSelectionMode = () => {
        setIsSelectionMode(false);
        setSelectedPhotos([]);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    {
                        isSelectionMode ? (
                            <IonButtons slot="start">
                                <IonIcon icon={close} style={{ fontSize: 25, marginLeft: 10 }} onClick={cancelSelectionMode}/>
                            </IonButtons>
                        ) : (
                            <IonButtons slot="start">
                                <IonBackButton defaultHref="/" />
                            </IonButtons>
                        )
                    }
                    {
                        isSelectionMode && (
                            <IonButtons slot="primary">
                                <IonButton color="danger" onClick={deleteFiles}>Delete</IonButton>
                                <IonButton color="primary">Lecture</IonButton>
                            </IonButtons>
                        )
                    }
                    <IonTitle>Gallery</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                {
                    photos.length === 0 ? (
                        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <IonIcon icon={folderOpen} style={{ fontSize: 70, color: '#8e8b8b' }} />
                        </div>
                    ) : (
                        <IonRow>
                            {
                                photos.map((photo:string, index:number) => (
                                    <IonCol
                                        key={index}
                                        size={'4'}
                                        style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                        onTouchStart={() => handleDownItem(index)}
                                        onTouchEnd={() => handleUpItem(index)}
                                    >
                                        <img src={photo} alt={index.toString()} style={{ width: pressedPhoto === index ? '95%' : '100%', height: pressedPhoto === index ? '95%' : '100%', objectFit: 'cover' }}/>
                                        {
                                            isSelectionMode && selectedPhotos.includes(index) && (
                                                <IonIcon icon={checkmarkCircle} style={{ fontSize: 50, color: 'rgba(0,0,0,0.7)', position: 'absolute', top: '50%', left: '50%',
                                                    transform: `translate(-50%, -50%)`  }} />
                                            )
                                        }
                                    </IonCol>
                                ))
                            }
                        </IonRow>
                    )
                }
            </IonContent>
        </IonPage>
    );
};

export default Gallery;