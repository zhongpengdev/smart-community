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
import { renameSession } from "~/utils/API/agent";

const props = defineProps<{ sessionId: number }>();

const { removeSession } = useSession();
const router = useRouter();
const route = useRoute();

const confirmDelete = () => {
  ElMessageBox.confirm("确认删除该会话吗?", "删除会话", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    confirmButtonClass: "el-button--danger",
    type: "warning",
    autofocus: false,
  })
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

const handleRename = async () => {
  try {
    const newTitle = await ElMessageBox.prompt(
      "请输入新的会话标题",
      "重命名会话",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: "", // 默认空
        inputPattern: /.+/, // 不为空
        inputErrorMessage: "标题不能为空",
      },
    );

    if (!newTitle.value) return;

    const res: any = await renameSession(props.sessionId, newTitle.value);
    if (res.code === 200) {
      ElMessage.success("修改标题成功");
      // 刷新历史列表
      const { fetchHistory } = useSession();
      await fetchHistory();
    } else {
      ElMessage.error(res.message || "修改失败");
    }
  } catch (err) {
    // 用户取消或报错
    console.log(err);
  }
};
</script>

<style>
/* Ensure popover background matches dark mode */
.el-popover.dark-mode-popover {
  /* background-color: #2a2b2d !important; */
  border-color: #374151 !important;
}
</style>
