import React, {useEffect, useState} from 'react';
import {
    IonPage,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonIcon, IonFabButton
} from "@ionic/react";
import {Directory, Filesystem} from '@capacitor/filesystem';
import { folderOpen } from "ionicons/icons";

const Gallery: React.FC = () => {
    const [ photos, setPhotos ] = useState<any>([]);
    useEffect(() => {
        Filesystem.readdir({ path: 'videoDoc', directory: Directory.Documents })
            .then(async res => {
                const photos = await Promise.all(res.files.map(async file => {
                    const photoData = await Filesystem.readFile({ path: file.uri });
                    return 'data:image/jpeg;base64,' + photoData.data;
                }))
                setPhotos(photos);
            })
    }, [])
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/" />
                    </IonButtons>
                    <IonTitle>Gallery</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                {
                    photos.length === 0 ? (
                        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <IonIcon icon={folderOpen} style={{ fontSize: 70, color: '#9c0ed7' }} />
                        </div>
                    ) : (
                        <IonRow>
                            {
                                photos.map((photo:string, index:number) => (
                                    <IonCol
                                        key={index}
                                        size={'3'}
                                    >
                                        <img src={photo} alt={index.toString()} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
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