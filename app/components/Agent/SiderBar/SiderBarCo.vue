<template>
  <div
    class="h-full flex flex-col transition-all duration-300 ease-in-out bg-zinc-50/80 dark:bg-zinc-950/40 border-r border-gray-200/50 dark:border-zinc-800/50 shrink-0"
    :class="[isExpanded ? 'w-64' : 'w-12']"
  >
    <!-- Toggle Button Header -->
    <div
      class="p-2 flex items-center h-12 shrink-0"
      :class="[isExpanded ? 'justify-between' : 'justify-center']"
    >
      <div
        v-if="isExpanded"
        class="pl-2 font-semibold text-gray-700 dark:text-gray-200 truncate text-sm"
      >
        <span>History</span>
      </div>
      <button
        @click="toggleSidebar"
        class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400 transition-colors focus:outline-none"
        :title="isExpanded ? 'Collapse' : 'Expand'"
      >
        <Icon
          :name="
            isExpanded ? 'lucide:panel-left-close' : 'lucide:panel-left-open'
          "
          size="18"
        />
      </button>
    </div>

    <!-- New Chat Button Section -->
    <div
      class="px-2 pb-2 shrink-0 flex flex-col border-b border-gray-200/30 dark:border-zinc-800/30"
      :class="[isExpanded ? 'items-stretch' : 'items-center']"
    >
      <button
        v-if="isExpanded"
        @click="handleNewSession"
        class="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 border border-gray-200/50 dark:border-zinc-800/50 hover:border-gray-300 dark:hover:border-zinc-700 rounded-lg hover:bg-gray-100/60 dark:hover:bg-zinc-800/60 transition-all duration-200 focus:outline-none group"
      >
        <span class="flex items-center gap-2">
          <Icon name="lucide:square-pen" size="14" class="text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100" />
          <span>New Chat</span>
        </span>
        <span class="text-[9px] font-mono text-gray-400 dark:text-gray-500 bg-zinc-50 dark:bg-black border border-gray-200/50 dark:border-zinc-800/50 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">New</span>
      </button>
      
      <button
        v-else
        @click="handleNewSession"
        class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200/50 dark:border-zinc-800/50 hover:border-gray-300 dark:hover:border-zinc-700 hover:bg-gray-100/60 dark:hover:bg-zinc-800/60 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all focus:outline-none"
        title="New Chat"
      >
        <Icon name="lucide:plus" size="16" />
      </button>
    </div>

    <!-- Content Area (Only visible when expanded) -->
    <div
      v-if="isExpanded"
      class="flex-1 overflow-hidden flex flex-col animate-fade-in"
    >
      <!-- Loading State -->
      <div v-if="loading" class="flex-1 flex items-center justify-center">
        <Icon
          name="lucide:loader-2"
          class="animate-spin text-gray-400"
          size="20"
        />
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="flex-1 flex flex-col items-center justify-center p-4 text-center"
      >
        <Icon name="lucide:alert-circle" class="text-red-400 mb-2" size="20" />
        <p class="text-[10px] text-gray-500">Failed to load</p>
        <button
          @click="fetchHistory"
          class="mt-2 text-[10px] text-blue-500 hover:underline"
        >
          Retry
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!historyList || historyList.length === 0"
        class="flex-1 flex flex-col items-center justify-center p-4 text-center text-gray-400"
      >
        <Icon name="lucide:clock" size="20" class="mb-2 opacity-30" />
        <p class="text-[10px]">No history yet</p>
      </div>

      <!-- List -->
      <div v-else class="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        <div
          v-for="item in historyList"
          :key="item.id"
          @click="handleSessionClick(item.id)"
          class="p-2.5 rounded hover:bg-gray-200/50 dark:hover:bg-zinc-800/50 cursor-pointer group transition-all border border-transparent hover:border-gray-200/30 dark:hover:border-zinc-800/30 relative pr-8"
        >
          <!-- Inline renaming input box -->
          <div v-if="editingSessionId === item.id" @click.stop class="w-full flex items-center pr-2 py-0.5">
            <input
              ref="inputRef"
              v-model="editingTitle"
              type="text"
              class="w-full text-xs px-2 py-1 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 border border-blue-500 rounded outline-none focus:ring-1 focus:ring-blue-500"
              @keydown.enter="handleSaveRename(item.id)"
              @keydown.esc="handleCancelRename"
              @blur="handleSaveRename(item.id)"
            />
          </div>
          
          <!-- Default layout displaying title and timestamp -->
          <template v-else>
            <div
              class="text-xs text-gray-700 dark:text-gray-200 truncate font-medium"
            >
              {{ item.title || "New Chat" }}
            </div>
            <div
              class="text-[10px] text-gray-400 mt-1 flex justify-between items-center opacity-70"
            >
              <span>{{ formatDate(item.created_at) }}</span>
            </div>
          </template>

          <!-- Session context menu -->
          <AgentSiderBarSessionRelated :session-id="item.id" @rename="startRename(item)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSession } from "~/composables/agent/useSession";
import { renameSession } from "~/utils/API/agent";
import dayjs from "dayjs";
import { useAgentStore } from "~/stores/agent";

const agentStore = useAgentStore();
const isExpanded = computed({
  get: () => agentStore.isSidebarExpanded,
  set: (val) => { agentStore.isSidebarExpanded = val }
});
const { historyList, loading, error, fetchHistory } = useSession();
const userStore = useUserStore();

onMounted(async () => {
  if (isExpanded.value) {
    await fetchHistory();
  }
});

watch(
  () => userStore.userInfo?.userId,
  async (newId) => {
    if (newId && isExpanded.value && historyList.value.length === 0) {
      await fetchHistory();
    }
  }
);

const editingSessionId = ref<number | null>(null);
const editingTitle = ref("");
const inputRef = ref<HTMLInputElement | null>(null);

const startRename = (item: { id: number; title: string }) => {
  editingSessionId.value = item.id;
  editingTitle.value = item.title || "New Chat";
  nextTick(() => {
    inputRef.value?.focus();
    inputRef.value?.select();
  });
};

const handleSaveRename = async (id: number) => {
  if (editingSessionId.value === null) return;
  const title = editingTitle.value.trim();
  editingSessionId.value = null; // Set to null immediately to prevent double calls (blur + enter)
  if (!title) return;
  
  try {
    const res: any = await renameSession(id, title);
    if (res.code === 200) {
      await fetchHistory();
    }
  } catch (e) {
    console.error(e);
  }
};

const handleCancelRename = () => {
  editingSessionId.value = null;
};

const handleSessionClick = (id: number) => {
  navigateTo(`/agent/${id}`);
};

const handleNewSession = async () => {
  agentStore.clearSession();
  navigateTo(`/agent`);
};

const toggleSidebar = async () => {
  isExpanded.value = !isExpanded.value;
  if (isExpanded.value) {
    if (historyList.value.length === 0) {
      await fetchHistory();
    }
  }
};

const formatDate = (date: string) => {
  if (!date) return "";
  return dayjs(date).format("MM-DD HH:mm");
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* Custom Scrollbar */
div::-webkit-scrollbar {
  width: 3px;
}

div::-webkit-scrollbar-track {
  background: transparent;
}

div::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.2);
  border-radius: 3px;
}

div::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.4);
}
</style>
