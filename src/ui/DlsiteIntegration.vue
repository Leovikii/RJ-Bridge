<template>
  <div class="rj-fab-container" :class="{ 'is-expanded': isExpanded }" ref="fabContainerRef">
    
    <!-- Expanded Panel -->
    <transition name="panel-slide">
      <div v-show="isExpanded" class="fab-panel">
        <div class="panel-header">
          <span>{{ t.title }}</span>
          <button class="close-btn" @click.stop="isExpanded = false">×</button>
        </div>
        
        <div class="panel-body">
          <!-- ASMR ONE Button -->
          <LinkButton 
            v-if="asmrOneUrl"
            theme="asmrone"
            :href="asmrOneUrl"
            :title="t.asmrOne"
          />

          <!-- South Plus Results -->
          <div class="southplus-section" v-if="results.length > 0">
            <div class="sp-header">🔍 {{ t.spResources }} ({{ results.length }})</div>
            <ul class="results-list">
              <li v-for="(result, index) in results" :key="index">
                <a :href="result.url" target="_blank" class="result-link">
                  <span class="result-title">{{ result.title }}</span>
                  <span class="result-meta" v-if="result.author">{{ result.author }} · {{ result.date }}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>

    <!-- FAB Trigger -->
    <div 
      class="fab-trigger" 
      :class="{ 'is-clickable': isClickable, 'is-loading': isLoading, 'is-error': isError }"
      @click="togglePanel"
    >
      <div class="fab-content">
        <span class="fab-logo">🪐</span>
        <div class="fab-status">
          <span v-if="isLoading" class="status-icon blink">⏳ {{ t.searching }}</span>
          <span v-else-if="isError" class="status-icon error" title="点击强制重试">⚠️ 检索失败</span>
          <template v-else>
            <span v-if="!hasAnyResource" class="status-icon empty">{{ t.noResource }}</span>
            <template v-else>
              <span v-if="asmrOneUrl" class="status-icon asmr">
                🎧 
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="check-icon">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              <span v-if="results.length > 0" class="status-icon sp">🔍 {{ results.length }}</span>
            </template>
          </template>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { searchSouthPlus, SouthPlusSearchResult } from '../core/southplus_search';
import { WorkPromise } from '../core/scraper';
import LinkButton from './components/LinkButton.vue';
import { localize } from '../config/localization';

const t = {
  title: localize('rj_warp_gate_title'),
  searching: localize('searching'),
  noResource: localize('no_resources'),
  spResources: localize('southplus_resources'),
  asmrOne: localize('go_to_asmrone'),
};

const props = defineProps<{
  rjCode: string;
}>();

const isExpanded = ref(false);
const fabContainerRef = ref<HTMLElement | null>(null);

function handleClickOutside(event: MouseEvent) {
  if (isExpanded.value && fabContainerRef.value && !fabContainerRef.value.contains(event.target as Node)) {
    isExpanded.value = false;
  }
}

const asmrOneState = ref<'loading' | 'success' | 'empty'>('loading');
const asmrOneUrl = ref<string | null>(null);

const spState = ref<'loading' | 'success' | 'empty' | 'error'>('loading');
const results = ref<SouthPlusSearchResult[]>([]);
const errorMessage = ref('');

function fetchSouthPlus(force = false) {
  spState.value = 'loading';
  searchSouthPlus(props.rjCode, force).then(response => {
    if (response.isCooldown || !response.success) {
      spState.value = 'error';
      errorMessage.value = response.errorMsg || '检索失败';
      return;
    }
    if (response.results.length === 0) {
      spState.value = 'empty';
    } else {
      results.value = response.results;
      spState.value = 'success';
    }
  });
}

onMounted(async () => {
  // Bind click outside listener
  document.addEventListener('click', handleClickOutside);

  // Fire both searches in parallel
  WorkPromise.checkAsmrOne(props.rjCode).then(url => {
    asmrOneUrl.value = url;
    asmrOneState.value = url ? 'success' : 'empty';
  });

  fetchSouthPlus(false);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const isLoading = computed(() => asmrOneState.value === 'loading' || spState.value === 'loading');
const isError = computed(() => spState.value === 'error');
const hasAnyResource = computed(() => asmrOneUrl.value !== null || results.value.length > 0);
const isClickable = computed(() => !isLoading.value && (hasAnyResource.value || isError.value));

function togglePanel() {
  if (isLoading.value) return;
  if (isError.value) {
    fetchSouthPlus(true); // Force retry bypasses cache
    return;
  }
  if (isClickable.value) {
    isExpanded.value = !isExpanded.value;
  }
}
</script>

<style scoped>
.rj-fab-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 2147483647;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

/* FAB Trigger */
.fab-trigger {
  background: rgba(30, 30, 30, 0.85);
  backdrop-filter: blur(12px) saturate(120%);
  -webkit-backdrop-filter: blur(12px) saturate(120%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 30px;
  padding: 8px 16px;
  height: 48px;
  display: flex;
  align-items: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  user-select: none;
}

.fab-trigger.is-clickable {
  cursor: pointer;
}

.fab-trigger.is-clickable:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
  background: rgba(45, 45, 45, 0.9);
  border-color: rgba(255, 255, 255, 0.3);
}

.fab-trigger.is-clickable:active {
  transform: translateY(0) scale(0.98);
}

.fab-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.fab-logo {
  font-size: 20px;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
}

.fab-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
}

.status-icon {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  gap: 4px; /* Add gap between emoji and SVG */
}

.check-icon {
  width: 12px;
  height: 12px;
  margin-left: 2px;
}

.status-icon.asmr {
  color: #51d8cf;
  background: rgba(81, 216, 207, 0.15);
}

.status-icon.sp {
  color: #a78bfa;
  background: rgba(167, 139, 250, 0.15);
}

.status-icon.error {
  color: #fca5a5;
  background: rgba(248, 113, 113, 0.15);
}

.status-icon.empty {
  color: #9ca3af;
  font-weight: normal;
}

.blink {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

/* Expanded Panel */
.fab-panel {
  position: absolute;
  bottom: calc(100% + 16px);
  right: 0;
  width: 400px;
  max-width: 90vw;
  background-color: rgba(25, 25, 25, 0.95);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: 0.5px;
}

.close-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: transparent;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.panel-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Premium Buttons */
.rj-premium-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 12px;
  text-decoration: none;
  color: #ffffff;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.rj-premium-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.15);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.theme-asmrone {
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
}

/* South Plus Section */
.southplus-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sp-header {
  font-size: 13px;
  font-weight: 600;
  color: #a78bfa;
  padding-left: 4px;
}

.results-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 250px;
  overflow-y: auto;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.results-list::-webkit-scrollbar {
  width: 6px;
}
.results-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}
.results-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
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
  padding: 12px;
  text-decoration: none;
  transition: background 0.2s;
}

.result-link:hover {
  background: rgba(255, 255, 255, 0.05);
}

.result-title {
  color: #e2e8f0;
  font-size: 13px;
  line-height: 1.4;
  margin-bottom: 4px;
}

.result-link:hover .result-title {
  color: #60a5fa;
}

.result-meta {
  color: #94a3b8;
  font-size: 11px;
}

/* Animations */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1), transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  transform-origin: bottom right;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>
