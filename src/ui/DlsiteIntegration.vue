<template>
  <div class="rj-warp-gate-dlsite-container">
    <div class="dlsite-btn-group">
      <!-- ASMR ONE Button -->
      <a
        class="rj-dlsite-btn theme-asmrone"
        :class="{ 'is-disabled': !asmrOneUrl }"
        :href="asmrOneUrl || undefined"
        :target="asmrOneUrl ? '_blank' : undefined"
        :title="asmrOneUrl ? '在 ASMR ONE 试听' : 'ASMR ONE 暂无该资源'"
      >
        <span class="icon">🎧</span>
        <span class="text">{{ asmrOneUrl ? 'ASMR ONE 试听' : 'ASMR ONE 暂无' }}</span>
      </a>

      <!-- South Plus Search Button -->
      <button
        class="rj-dlsite-btn theme-southplus"
        :class="stateClass"
        @click="handleSearch"
        :disabled="searchState === 'loading'"
      >
        <span class="icon">{{ stateIcon }}</span>
        <span class="text">{{ stateText }}</span>
      </button>
    </div>

    <!-- Results Dropdown -->
    <transition name="dropdown">
      <div v-if="showResults && results.length > 0" class="results-dropdown">
        <div class="results-header">
          <span>共找到 {{ results.length }} 个相关帖子</span>
          <button class="close-btn" @click="showResults = false">×</button>
        </div>
        <ul class="results-list">
          <li v-for="(result, index) in results" :key="index">
            <a :href="result.url" target="_blank" class="result-link">
              <span class="result-title">{{ result.title }}</span>
              <span class="result-meta" v-if="result.author">{{ result.author }} · {{ result.date }}</span>
            </a>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { searchSouthPlus, SouthPlusSearchResult } from '../core/southplus_search';
import { WorkPromise } from '../core/scraper';

const props = defineProps<{
  rjCode: string;
}>();

const searchState = ref<'idle' | 'loading' | 'success' | 'empty' | 'error'>('idle');
const results = ref<SouthPlusSearchResult[]>([]);
const errorMessage = ref('');
const showResults = ref(false);
const asmrOneUrl = ref<string | null>(null);

onMounted(async () => {
  asmrOneUrl.value = await WorkPromise.checkAsmrOne(props.rjCode);
});

const stateIcon = computed(() => {
  switch (searchState.value) {
    case 'idle': return '🔍';
    case 'loading': return '⏳';
    case 'success': return '✅';
    case 'empty': return '❌';
    case 'error': return '⚠️';
  }
});

const stateText = computed(() => {
  switch (searchState.value) {
    case 'idle': return '检测 南+ 资源';
    case 'loading': return '正在潜入南+检索...';
    case 'success': return `找到 ${results.value.length} 个结果 (点击展开)`;
    case 'empty': return '南+ 暂无该资源';
    case 'error': return errorMessage.value || '搜索失败';
  }
});

const stateClass = computed(() => {
  return `state-${searchState.value}`;
});

async function handleSearch() {
  if (searchState.value === 'success') {
    showResults.value = !showResults.value;
    return;
  }
  
  if (searchState.value === 'loading') return;

  searchState.value = 'loading';
  showResults.value = false;

  const response = await searchSouthPlus(props.rjCode);

  if (response.isCooldown) {
    searchState.value = 'error';
    errorMessage.value = response.errorMsg || '论坛技能冷却中 (需间隔十几秒)';
    return;
  }

  if (!response.success) {
    searchState.value = 'error';
    errorMessage.value = '网络或解析错误';
    return;
  }

  if (response.results.length === 0) {
    searchState.value = 'empty';
  } else {
    results.value = response.results;
    searchState.value = 'success';
    showResults.value = true;
  }
}
</script>

<style scoped>
.rj-warp-gate-dlsite-container {
  margin: 12px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  position: relative;
}

.dlsite-btn-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.rj-dlsite-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  color: #ffffff;
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  outline: none;
}

.rj-dlsite-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  filter: brightness(1.1);
}

.rj-dlsite-btn:active {
  transform: translateY(0);
}

.theme-asmrone {
  background: linear-gradient(135deg, #51d8cf 0%, #29b8ac 100%);
}

.theme-southplus {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
}

/* States for SouthPlus Button */
.theme-southplus.state-loading {
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
  cursor: wait;
}

.theme-southplus.state-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.theme-southplus.state-empty {
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
}

.theme-southplus.state-error {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

/* Disabled State */
.rj-dlsite-btn.is-disabled {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.3);
  box-shadow: none;
  cursor: not-allowed;
  pointer-events: none;
}

/* Results Dropdown */
.results-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 12px;
  width: 550px;
  max-width: 90vw;
  
  background-color: rgba(30, 30, 30, 0.85);
  backdrop-filter: blur(12px) saturate(120%);
  -webkit-backdrop-filter: blur(12px) saturate(120%);
  
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 8px 10px rgba(0, 0, 0, 0.2);
  
  overflow: hidden;
  z-index: 2147483646;
  
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #f1f5f9;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
}

.close-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.results-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 350px;
  overflow-y: auto;
}

/* Scrollbar for list */
.results-list::-webkit-scrollbar {
  width: 6px;
}
.results-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
.results-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.results-list li {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.results-list li:last-child {
  border-bottom: none;
}

.result-link {
  display: flex;
  flex-direction: column;
  padding: 10px 12px;
  text-decoration: none;
  transition: background 0.2s;
}

.result-link:hover {
  background: rgba(255, 255, 255, 0.08);
}

.result-title {
  color: #60a5fa;
  font-size: 13px;
  line-height: 1.4;
  margin-bottom: 4px;
}

.result-meta {
  color: #9ca3af;
  font-size: 11px;
}

/* Animations */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1), transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  transform-origin: top right;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0.95);
}
</style>
