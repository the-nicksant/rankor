
import boxingImg from '~/assets/fighting-images/boxing.jpg'
import muayThaiImg from '~/assets/fighting-images/muaythai.png'
import jiujitsuImg from '~/assets/fighting-images/jiujitsu.jpg'
import kickboxingImg from '~/assets/fighting-images/kickboxing.jpg'
import taekwondoImg from '~/assets/fighting-images/taekwondo.png'
import mmaImg from '~/assets/fighting-images/mma.png'
import judoImg from '~/assets/fighting-images/judo.png'
import karateImg from '~/assets/fighting-images/karate.jpg'


export const getModalityImage = (modality: string) => {
  switch (modality) {
    case 'boxing':
      return boxingImg
    case 'muay_thai':
      return muayThaiImg
    case 'jiujitsu':
      return jiujitsuImg
    case 'kickboxing':
      return kickboxingImg
    case 'taekwondo':
      return taekwondoImg
    case 'mma':
      return mmaImg
    case 'judo':
      return judoImg
    case 'karate':
      return karateImg
    default:
      return ''
  }
}