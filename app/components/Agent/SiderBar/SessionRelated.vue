<template>
  <div
    @click.stop
    class="absolute right-1 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
  >
    <el-popover
      placement="bottom-end"
      :width="140"
      trigger="click"
      :show-arrow="false"
      popper-class="!p-0 !min-w-[140px] !rounded !border-gray-200 dark:!border-gray-700 !bg-white dark:!bg-[#2A2B2D] shadow-xl"
    >
      <template #reference>
        <div
          class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors cursor-pointer text-gray-500 dark:text-gray-400"
        >
          <Icon name="lucide:more-horizontal" size="16" />
        </div>
      </template>

      <!-- Menu Content -->
      <div
        class="flex flex-col p-1.5 gap-0.5 bg-white dark:bg-[#2A2B2D] rounded border border-transparent"
      >
        <!-- Share (Future) -->
        <button
          class="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded transition-colors w-full text-left"
        >
          <Icon name="lucide:share-2" size="14" />
          <span>Share</span>
        </button>

        <div class="h-[1px] bg-gray-100 dark:bg-gray-700 my-0.5 mx-1"></div>

        <!-- Delete -->
        <button
          @click.stop="confirmDelete"
          class="flex items-center gap-2 px-2 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors w-full text-left"
        >
          <Icon name="lucide:trash-2" size="14" />
          <span>Delete</span>
        </button>

        <button
          @click.stop="handleRename"
          class="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded transition-colors w-full text-left"
        >
          <Icon name="lucide:edit-2" size="14" />
          <span>Rename</span>
        </button>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { useSession } from "~/composables/agent/useSession";

const props = defineProps<{ sessionId: number }>();

const emit = defineEmits<{
  (e: "rename"): void;
}>();

const { removeSession } = useSession();
const route = useRoute();

const confirmDelete = () => {
  ElMessageBox.confirm(
    "删除会话后，其中的聊天记录将永久丢失且无法找回。是否确认删除？",
    "确认删除会话",
    {
      confirmButtonText: "删除",
      cancelButtonText: "取消",
      customClass: "custom-confirm-box",
      confirmButtonClass: "btn-delete-confirm",
      cancelButtonClass: "btn-delete-cancel",
      type: "warning",
      autofocus: false,
    }
  )
    .then(async () => {
      await handleDelete();
    })
    .catch(() => {
      // Cancelled
    });
};

const handleDelete = async () => {
  const success = await removeSession(props.sessionId);
  if (success) {
    const currentId = Number(route.params.sessionId);

    if (!Number.isNaN(currentId) && currentId === props.sessionId) {
      await navigateTo("/agent");
    }
  }
};

const handleRename = () => {
  emit("rename");
};
</script>

<style>
/* Global MessageBox Overrides for modern minimal aesthetics */
.custom-confirm-box {
  border-radius: 12px !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02) !important;
  padding: 16px 20px !important;
}

.dark .custom-confirm-box {
  background-color: #121212 !important;
  border-color: #27272a !important;
  color: #f4f4f5 !important;
}

.custom-confirm-box .el-message-box__header {
  padding: 0 0 8px 0 !important;
}

.custom-confirm-box .el-message-box__title {
  font-size: 15px !important;
  font-weight: 600 !important;
}

.dark .custom-confirm-box .el-message-box__title {
  color: #f4f4f5 !important;
}

.custom-confirm-box .el-message-box__content {
  padding: 0 0 16px 0 !important;
}

.custom-confirm-box .el-message-box__message {
  font-size: 13px !important;
  line-height: 1.5 !important;
  color: #64748b !important;
}

.dark .custom-confirm-box .el-message-box__message {
  color: #a1a1aa !important;
}

.custom-confirm-box .el-message-box__btns {
  padding: 0 !important;
}

/* Custom Buttons inside MessageBox */
.custom-confirm-box .btn-delete-confirm {
  background-color: #ef4444 !important;
  border-color: #ef4444 !important;
  color: #ffffff !important;
  border-radius: 6px !important;
  font-size: 12px !important;
  padding: 6px 14px !important;
  font-weight: 500 !important;
}

.custom-confirm-box .btn-delete-confirm:hover,
.custom-confirm-box .btn-delete-confirm:focus {
  background-color: #dc2626 !important;
  border-color: #dc2626 !important;
  color: #ffffff !important;
}

.custom-confirm-box .btn-delete-cancel {
  background-color: transparent !important;
  border-color: #e2e8f0 !important;
  color: #64748b !important;
  border-radius: 6px !important;
  font-size: 12px !important;
  padding: 6px 14px !important;
  font-weight: 500 !important;
}

.dark .custom-confirm-box .btn-delete-cancel {
  border-color: #27272a !important;
  color: #a1a1aa !important;
}

.custom-confirm-box .btn-delete-cancel:hover,
.custom-confirm-box .btn-delete-cancel:focus {
  background-color: #f1f5f9 !important;
  color: #1e293b !important;
  border-color: #cbd5e1 !important;
}

.dark .custom-confirm-box .btn-delete-cancel:hover,
.dark .custom-confirm-box .btn-delete-cancel:focus {
  background-color: #18181b !important;
  color: #f4f4f5 !important;
  border-color: #3f3f46 !important;
}
</style>
