<script setup>
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { onBeforeUnmount, onMounted } from 'vue'

const props = defineProps({
  modelValue: String
})
const emit = defineEmits(['update:modelValue'])

let editor

onMounted(() => {
  editor = new Editor({
    content: props.modelValue,
    extensions: [
      StarterKit,
      TextStyle,
      Color,
    ],
    onUpdate({ editor }) {
      emit('update:modelValue', editor.getHTML())
    }
  })
})

onBeforeUnmount(() => {
  editor?.destroy()
})
</script>

<template>
  <div>
    <div class="flex gap-2 mb-2">
      <button @click="editor.chain().focus().toggleBold().run()">Gras</button>
      <button @click="editor.chain().focus().toggleItalic().run()">Italique</button>
      <button @click="editor.chain().focus().unsetColor().run()">Couleur reset</button>
      <button @click="editor.chain().focus().setColor('#e11d48').run()">Rouge</button>
      <button @click="editor.chain().focus().setColor('#2563eb').run()">Bleu</button>
    </div>

    <EditorContent :editor="editor" class="border rounded p-3 min-h-[150px]" />
  </div>
</template>
