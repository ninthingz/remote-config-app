<script lang="ts" setup>
import { Ref, ref, watch } from "vue";
import { Config, ConfigHistory, getConfigHistory } from "../api/config";
import moment from "moment";

const configHistoryPageSize = ref(10);
const configHistoryPageIndex = ref(1);
const configHistoryCount = ref(0);
const configHistoryList: Ref<ConfigHistory[]> = ref([]);

const props = defineProps<{
  config: Config | undefined;
}>();

const getConfigHistoryList = async () => {
  if (!props.config) {
    return;
  }
  const res = await getConfigHistory(
    props.config.id,
    configHistoryPageSize.value,
    configHistoryPageIndex.value,
  );
  if (res.data.code === 200) {
    configHistoryList.value = res.data.data!.list;
    configHistoryCount.value = res.data.data!.count;
  }
};

const previousConfigHistoryPage = async () => {
  if (configHistoryPageIndex.value > 1) {
    configHistoryPageIndex.value -= 1;
    await getConfigHistoryList();
  }
};

const nextConfigHistoryPage = async () => {
  if (
    configHistoryPageIndex.value <
    Math.ceil(configHistoryCount.value / configHistoryPageSize.value)
  ) {
    configHistoryPageIndex.value += 1;
    await getConfigHistoryList();
  }
};

watch(
  () => props.config,
  async () => {
    await getConfigHistoryList();
  },
);

getConfigHistoryList();
</script>

<template>
  <div class="p-5">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th>旧值</th>
          <th>新值</th>
          <th>备注</th>
          <th>是否启用</th>
          <th>修改时间</th>
          <th>修改人</th>
        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
        <tr
          v-for="configHistory in configHistoryList"
          :key="configHistory.id"
          class="hover"
        >
          <td>{{ configHistory.old_value }}</td>
          <td>{{ configHistory.new_value }}</td>
          <td>{{ configHistory.message }}</td>
          <td>
            <div v-if="configHistory.enable" class="badge badge-accent">启用</div>
            <div v-else class="badge badge-neutral">禁用</div>
          </td>
          <td>{{ moment(configHistory.create_time * 1000).format("YYYY-MM-DD HH:mm:ss") }}</td>
          <td>{{ configHistory.nickname }}</td>
        </tr>
      </tbody>
    </table>
    <div class="flex justify-center">
      <div class="join">
        <button
          @click="previousConfigHistoryPage"
          class="btn join-item"
          :disabled="configHistoryCount === 0 || configHistoryPageIndex === 1"
        >
          «
        </button>
        <button class="btn join-item">{{ configHistoryPageIndex }}</button>
        <button
          @click="nextConfigHistoryPage"
          class="btn join-item"
          :disabled="
            configHistoryCount === 0 ||
            configHistoryPageIndex ===
              Math.ceil(configHistoryCount / configHistoryPageSize)
          "
        >
          »
        </button>
      </div>
    </div>
  </div>
</template>
