import React, { useContext } from 'react'
import { useHistory } from 'react-router'
import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonPage,
  IonContent,
} from '@ionic/react'
import 'swiper/css'
import '@ionic/react/css/ionic-swiper.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Context } from '../ContextProvider'
import { camera } from 'ionicons/icons'
import { canConstructResponseFromBodyStream } from 'workbox-core/_private'
import './DetectingTextPreview.css'

const DetectingTextPreview: React.FC = () => {
  const context = useContext(Context)
  const history = useHistory()

  console.log(context.detectData)
  const generateRectangles = (index: number) => {
    const rectangles = []
    const responses = context.detectData.responses
    if (responses.length) {
      let ratioX = 1,
        ratioY = 1
      console.log('detect')
      console.log(context.imageData)
      if (
        context.imageData[index].height !== 0 &&
        context.imageData[index].width !== 0
      ) {
        ratioY = window.screen.height / context.imageData[index].height
        ratioX = window.screen.width / context.imageData[index].width
      }

      for (let i = 1; i < responses[index].textAnnotations.length; i++) {
        const textData = responses[index].textAnnotations[i]
        const vertices = textData.boundingPoly.vertices
        const minX = Math.min(
          vertices[0].x,
          vertices[1].x,
          vertices[2].x,
          vertices[3].x,
        )
        const maxX = Math.max(
          vertices[0].x,
          vertices[1].x,
          vertices[2].x,
          vertices[3].x,
        )
        const minY = Math.min(
          vertices[0].y,
          vertices[1].y,
          vertices[2].y,
          vertices[3].y,
        )
        const maxY = Math.max(
          vertices[0].y,
          vertices[1].y,
          vertices[2].y,
          vertices[3].y,
        )
        const top = minY * ratioY
        const left = minX * ratioX
        const width = (maxX - minX) * ratioX
        const height = (maxY - minY) * ratioY
        rectangles.push(
          <div
            key={i}
            className={'rectangle'}
            style={{
              top,
              left,
              width,
              height,
            }}
          ></div>,
        )
      }
    }

    return rectangles
  }

  return (
    <IonPage>
      <IonContent>
        <Swiper>
          {context.imageData.map((image, index) => {
            return (
              <SwiperSlide key={index}>
                <img
                  src={image.photo}
                  alt="previewImage"
                  style={{
                    width: window.screen.width,
                    height: window.screen.height,
                  }}
                />
                {generateRectangles(index)}
              </SwiperSlide>
            )
          })}
        </Swiper>
        <IonFab
          color="primary"
          vertical="bottom"
          horizontal="center"
          slot="fixed"
        >
          <IonFabButton color="success" onClick={() => history.push('/')}>
            <IonIcon icon={camera} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  )
}

export default DetectingTextPreview
