import {reactive, toRefs} from 'vue';
import {objectFit} from '../uitls/utils'

export const useImageStyle = (image, fit) => {

    let imageWidth = 0
    let imageHeight = 0

    const style = reactive({
        width: 'auto',
        height: 'auto'
    })

    const {
        clientWidth: containerWidth,
        clientHeight: containerHeight
    } = image 

    const vertical = imageWidth / imageHeight < 1

    if (fit === objectFit.SCALE_DOWN) {
        const isSmaller =
            imageWidth < containerWidth &&
            imageHeight < containerHeight
        fit = isSmaller ? objectFit.NONE : objectFit.CONTAIN
    }

    switch (fit) {
        case objectFit.NONE:
            style.width = 'auto'
            style.height = 'auto'

        case objectFit.CONTAIN:
            vertical ? style.width = 'auto'  : style.height = 'auto' 
        case objectFit.COVER:
            style = vertical ? { height: 'auto' } : { width: 'auto' }
        default:
    }

    return {
        ...toRefs(style)
    }
}