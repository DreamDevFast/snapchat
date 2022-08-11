import React, { useContext } from "react";
import {useHistory} from "react-router";
import {IonFab, IonFabButton, IonIcon, IonPage} from "@ionic/react";
import { Context } from '../ContextProvider';
import {camera} from "ionicons/icons";

const DetectingTextPreview: React.FC = () => {
    const context = useContext(Context);
    const history = useHistory()

    console.log(context.detectData);

    return (
        <IonPage>
            <img src={context.imageData} alt="previewImage" style={{ width: window.screen.width, height:window.screen.height }}/>
            <IonFab color="primary" vertical="bottom" horizontal="center" slot="fixed">
                <IonFabButton color="success" onClick={() => history.push('/')}>
                    <IonIcon icon={camera} />
                </IonFabButton>
            </IonFab>
        </IonPage>
    )
}

export default DetectingTextPreview;