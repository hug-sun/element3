<template>
    <span class="el-tag" :class="classes" :style="{ backgroundColor: props.color }">
        <span v-if="$slots.default">
            <slot />
        </span>
        <i v-if="closable" @click="closeTag" class="el-tag__close el-icon-close"></i>
    </span>
    <!-- 暂无transition组件，后续可考虑迭代 -->
</template>

<script lang="ts" setup>
import { computed, withDefaults } from 'vue'

type tagType = 'success' | 'info' | 'warning' | 'danger'
type sizeType = 'medium' | 'small' | 'mini'
type effectType = 'dark' | 'light' | 'plain'

interface TagProps {
    type?: tagType
    closable?: boolean,
    size?: sizeType,
    effect?: effectType,
    color?: string,
    hit?: boolean,
    disableTransitions?: boolean,
}

const props = withDefaults(defineProps<TagProps>(), {
    closable: false,
    effect: 'light',
    hit: false,
    disableTransitions: false,
})

const emits = defineEmits(['close'])

function useClasses({ props }) {
    return computed(() => {
        return [
            props.type ? `el-tag--${props.type}` : '',
            props.size ? `el-tag--${props.size}` : '',
            props.effect ? `el-tag--${props.effect}` : '',
            props.hit ? `is-hit ${props.disableTransitions}` : '',
        ]
    })
}
const classes = useClasses({ props })

function closeTag() {
    emits('close')
}

</script>

<style lang="scss">
@import "../../theme/src/tag.scss";

.el-tag {
    margin: 5px;
}
</style>