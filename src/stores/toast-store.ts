import { defineStore } from "pinia";
import { ref } from "vue";

export const useToastStore = defineStore("toast", () => {
  const msg = ref("");
  const showInfo = ref(false);
  const showSuccess = ref(false);

  const showToast = (message: string, type: "info" | "success") => {
    msg.value = message;

    if (type === "success") {
      showSuccess.value = true;
      setTimeout(() => {
        showSuccess.value = false;
      }, 3000);
    }

    if (type === "info") {
      showInfo.value = true;
      setTimeout(() => {
        showInfo.value = false;
      }, 3000);
    }
  };

  return { msg, showInfo, showSuccess, showToast };
});
