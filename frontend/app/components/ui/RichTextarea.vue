<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);

// Le texte est maintenant directement du HTML rendu
const text = ref(props.modelValue);

// Sync parent → component
watch(
  () => props.modelValue,
  (v) => (text.value = v)
);

// Sync component → parent
watch(text, (v) => emit("update:modelValue", v));

/* ------------------------------------------------------------------
   ✨ Formatting Helpers
------------------------------------------------------------------ */

function apply(command, value = null) {
  document.execCommand(command, false, value);
}

/* Bloc pour prévenir la submission du formulaire */
function preventSubmit(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    document.execCommand("insertHTML", false, "<br>");
  }
}
</script>

<template>
  <div class="space-y-3">
    <!-- Toolbar -->
    <div class="flex flex-wrap gap-2 border p-2 rounded-lg bg-gray-50">
      <button type="button" class="btn" @click="apply('bold')"><b>B</b></button>
      <button type="button" class="btn" @click="apply('italic')">
        <i>I</i>
      </button>
      <button type="button" class="btn" @click="apply('underline')">
        <u>U</u>
      </button>
      <button type="button" class="btn" @click="apply('formatBlock', '<h3>')">
        H3
      </button>
      <button type="button" class="btn" @click="apply('insertUnorderedList')">
        • Liste
      </button>
      <button
        type="button"
        class="btn"
        @click="apply('formatBlock', '<blockquote>')"
      >
        ❝ Citation
      </button>
      <button type="button" class="btn" @click="apply('removeFormat')">
        ✖ Format
      </button>
    </div>

    <!-- Zone d’édition WYSIWYG -->
    <div
      id="rich-editor"
      class="w-full min-h-[180px] p-3 border rounded-lg focus:ring focus:ring-blue-300 bg-white"
      contenteditable="true"
      @input="text = $event.target.innerHTML"
      @keydown="preventSubmit"
      v-html="text"
    ></div>
  </div>
</template>

<style scoped>
#rich-editor:focus {
  outline: none;
}
</style>
