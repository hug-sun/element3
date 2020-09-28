<template>
  <transition-group
    tag="ul"
    :class="[
      'el-upload-list',
      'el-upload-list--' + listType,
      { 'is-disabled': disabled }
    ]"
    name="el-list"
  >
    <li
      v-for="(file, idx) in files"
      :key="idx"
      :class="[
        'el-upload-list__item',
        'is-' + file.status,
        focusing ? 'focusing' : ''
      ]"
      tabindex="0"
      @keydown.delete="!disabled && handleRemove($event, file)"
      @focus="focusing = true"
      @blur="focusing = false"
      @click="onFileClicked"
    >
      <slot :file="file">
        <img
          v-if="
            file.status !== 'uploading' &&
            ['picture-card', 'picture'].includes(listType)
          "
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          alt=""
        />
        <a class="el-upload-list__item-name" @click="handleClick(file)">
          <i class="el-icon-document"></i>{{ file.name }}
        </a>
        <label class="el-upload-list__item-status-label">
          <i
            :class="{
              'el-icon-upload-success': true,
              'el-icon-circle-check': listType === 'text',
              'el-icon-check': ['picture-card', 'picture'].includes(listType)
            }"
          ></i>
        </label>
        <i
          v-if="!disabled"
          class="el-icon-close"
          @click="handleRemove($event, file)"
        ></i>
        <i v-if="!disabled" class="el-icon-close-tip">
          {{ t('el.upload.deleteTip') }}
        </i>
        <el-progress
          v-if="file.status === 'uploading'"
          :type="listType === 'picture-card' ? 'circle' : 'line'"
          :stroke-width="listType === 'picture-card' ? 6 : 2"
          :percentage="parsePercentage(file.percentage)"
        />
        <span
          v-if="listType === 'picture-card'"
          class="el-upload-list__item-actions"
        >
          <span
            class="el-upload-list__item-preview"
            @click="handlePreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove($event, file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </slot>
    </li>
  </transition-group>
</template>
<script>
import { defineComponent, ref } from 'vue'
import Locale from 'element-ui/src/mixins/locale'
import ElProgress from 'element-ui/packages/progress'

export default defineComponent({
  name: 'ElUploadList',
  components: { ElProgress },
  mixins: [Locale],
  props: {
    files: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    handlePreview: Function,
    listType: {
      type: String,
      default: 'text'
    }
  },
  emits: ['remove'],
  setup(props, { emit }) {
    const parsePercentage = (val) => {
      return parseInt(val, 10)
    }

    const handleClick = (file) => {
      props.handlePreview(file)
    }

    const onFileClicked = (e) => {
      e.target.focus()
    }

    const handleRemove = (e, file) => {
      emit('remove', file)
    }
    return {
      focusing: ref(false),
      parsePercentage,
      handleClick,
      handleRemove,
      onFileClicked
    }
  }
})
</script>
