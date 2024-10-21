<script lang="ts" setup>
import { Ref, ref } from "vue";
import { useToastStore } from "../stores/toast-store";
import {
  Config,
  createConfig,
  deleteConfig,
  listConfig,
  updateConfig,
} from "../api/config";
import ConfigHistoryView from "../components/ConfigHistoryView.vue";
import moment from "moment";

const toastStore = useToastStore();

const configList: Ref<Config[]> = ref([]);
const configMap = ref(new Map<number, Config>());
const configPageSize = ref(10);
const configPageIndex = ref(1);
const configCount = ref(0);

const keyword = ref("");

const selectConfigMap = ref(new Map<number, Config>());

const selectedConfig: Ref<Config> = ref({
  id: 0,
  name: "",
  value: "",
  message: "",
  secret: "",
  enable: false,
  last_get_time: 0,
});
const selectedConfigByHistory: Ref<Config | undefined> = ref();

const showConfigEditDialog = ref(false);
const showConfigDeleteDiglog = ref(false);
const showConfigHistoryDiglog = ref(false);

const multiSelected = ref(false);

const dialogType: Ref<"create" | "modify"> = ref("create");

const getConfigList = async () => {
  const res = await listConfig(
    keyword.value,
    configPageSize.value,
    configPageIndex.value,
  );
  if (res.data.code === 200) {
    configList.value = res.data.data!.list;
    configMap.value.clear();
    selectConfigMap.value.clear();
    configList.value.forEach((config) => {
      configMap.value.set(config.id, config);
    });
    configCount.value = res.data.data!.count;
  }
};

const createConfigClick = () => {
  dialogType.value = "create";
  selectedConfig.value = {
    id: 0,
    name: "",
    value: "",
    message: "",
    enable: false,
    secret: "",
    last_get_time: 0,
  };
  showConfigEditDialog.value = true;
};

const editConfigClick = (config: Config) => {
  dialogType.value = "modify";
  selectedConfig.value = config;
  multiSelected.value = false;
  showConfigEditDialog.value = true;
};

const batchEdit = () => {
  if (selectConfigMap.value.size === 0) {
    toastStore.showToast("请选择要批量修改的配置", "info");
    return;
  }
  dialogType.value = "modify";
  multiSelected.value = true;
  showConfigEditDialog.value = true;
};

const deleteConfigClick = (config: Config) => {
  selectedConfig.value = config;

  const lastGetTime = moment(selectedConfig.value.last_get_time * 1000);
  const newTime = moment();

  if (newTime.diff(lastGetTime, "days") < 7) {
    toastStore.showToast("删除失败，最近一次调用时间小于7天", "info");
    return;
  }

  showConfigDeleteDiglog.value = true;
};

const configHistoryClick = (config: Config) => {
  selectedConfigByHistory.value = undefined;
  selectedConfigByHistory.value = config;
  showConfigHistoryDiglog.value = true;
};

const editConfigComfirm = async () => {
  if (selectedConfig.value) {
    if (dialogType.value === "modify") {
      if (multiSelected.value) {
        let successCount = 0;
        let errorCount = 0;
        for (const [_, config] of selectConfigMap.value) {
          const res = await updateConfig({
            id: config.id,
            name: config.name,
            value: selectedConfig.value!.value,
            message: config.message,
            enable: selectedConfig.value!.enable,
            secret: config.secret,
            last_get_time: config.last_get_time,
          });
          if (res.data.code === 200) {
            successCount += 1;
          } else {
            errorCount += 1;
          }
        }
        if (errorCount === 0) {
          showConfigEditDialog.value = false;
          toastStore.showToast(`批量修改${successCount}条记录成功`, "success");
          getConfigList();
        }
      } else {
        const res = await updateConfig({
          id: selectedConfig.value!.id,
          name: selectedConfig.value!.name,
          value: selectedConfig.value!.value,
          message: selectedConfig.value!.message,
          enable: selectedConfig.value!.enable,
          secret: selectedConfig.value!.secret,
          last_get_time: selectedConfig.value!.last_get_time,
        });
        if (res.data.code === 200) {
          showConfigEditDialog.value = false;
          toastStore.showToast("修改成功", "success");
          getConfigList();
        }
      }
    } else {
      const res = await createConfig({
        id: selectedConfig.value.id,
        name: selectedConfig.value.name,
        value: selectedConfig.value.value,
        message: selectedConfig.value.message,
        enable: selectedConfig.value.enable,
        secret: selectedConfig.value.secret,
        last_get_time: selectedConfig.value.last_get_time,
      });
      if (res.data.code === 200) {
        showConfigEditDialog.value = false;
        toastStore.showToast("新增成功", "success");
        getConfigList();
      }
    }
  }
};

const deleteComfirm = async () => {
  if (selectedConfig.value) {
    const res = await deleteConfig(selectedConfig.value.name);
    if (res.data.data?.code === 200) {
      showConfigDeleteDiglog.value = false;
      toastStore.showToast("删除成功", "success");
      getConfigList();
    }
  }
};

const changeSelectedConfig = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const id = parseInt(target.value);
  const config = configMap.value.get(id);
  if (config) {
    const selected = target.checked;
    if (selected) {
      selectConfigMap.value.set(id, config);
      selectedConfig.value = config;
    } else {
      selectConfigMap.value.delete(id);
    }
  }
};

const selectAllChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selected = target.checked;
  if (selected) {
    configList.value.forEach((config) => {
      selectConfigMap.value.set(config.id, config);
    });

    if (configList.value.length > 0) {
      selectedConfig.value = configList.value[0];
    }
  } else {
    selectConfigMap.value.clear();
  }
};

const formatTime = (time: number) => {
  return moment(time * 1000).format("YYYY-MM-DD HH:mm:ss");
};

const previousConfigPage = () => {
  configPageIndex.value -= 1;
  getConfigList();
};

const nextConfigPage = () => {
  configPageIndex.value += 1;
  getConfigList();
};

getConfigList();
</script>

<template>
  <div class="pl-12 pr-12">
    <dialog class="modal" :class="{ 'modal-open': showConfigDeleteDiglog }">
      <div class="modal-box">
        <h3 class="text-lg font-bold">提示</h3>
        <p class="py-4">是否确认删除?</p>
        <div class="modal-action">
          <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button @click="deleteComfirm" class="btn btn-primary m-2">
              确认
            </button>
            <button
              @click="showConfigDeleteDiglog = false"
              class="btn btn-info"
            >
              取消
            </button>
          </form>
        </div>
      </div>
    </dialog>

    <dialog
      ref="configHistoryDiglog"
      class="modal"
      :class="{ 'modal-open': showConfigHistoryDiglog }"
    >
      <div class="modal-box w-11/12 max-w-full">
        <ConfigHistoryView
          :config="selectedConfigByHistory"
        ></ConfigHistoryView>
        <div class="modal-action">
          <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button
              @click="showConfigHistoryDiglog = false"
              class="btn btn-info"
            >
              关闭
            </button>
          </form>
        </div>
      </div>
    </dialog>

    <dialog
      ref="configEditDialog"
      class="modal"
      :class="{ 'modal-open': showConfigEditDialog }"
    >
      <div class="modal-box flex flex-col justify-center">
        <div class="label">
          <span class="label-text">键</span>
        </div>
        <input
          v-if="dialogType === 'modify'"
          :disabled="true"
          :value="multiSelected ? '批量修改' : selectedConfig?.name"
          type="text"
          class="input input-bordered"
        />
        <input
          v-if="dialogType === 'create'"
          v-model="selectedConfig.name"
          type="text"
          class="input input-bordered"
        />
        <div class="label">
          <span class="label-text">值</span>
        </div>
        <input
          v-model="selectedConfig.value"
          type="text"
          class="input input-bordered"
        />
        <div class="label">
          <span class="label-text">备注</span>
        </div>
        <input
          v-model="selectedConfig.message"
          type="text"
          class="input input-bordered"
        />
        <div class="label">
          <span class="label-text">是否启用</span>
        </div>
        <input
          v-model="selectedConfig.enable"
          type="checkbox"
          class="toggle toggle-success"
        />
        <div class="modal-action">
          <form method="dialog">
            <button @click="editConfigComfirm" class="btn btn-primary m-2">
              确认
            </button>
            <button
              @click="showConfigEditDialog = false"
              class="btn btn-neutral"
            >
              取消
            </button>
          </form>
        </div>
      </div>
    </dialog>
    <div class="overflow-x-auto">
      <div class="flex justify-between">
        <div class="flex">
          <input
            @keypress.enter.prevent="getConfigList"
            v-model="keyword"
            type="text"
            class="input input-bordered m-2"
            placeholder="请输入关键字"
          />
          <button @click="getConfigList" class="btn btn-primary m-2">
            搜索
          </button>
        </div>
        <div>
          <button @click="batchEdit" class="btn btn-info m-2">批量修改</button>
          <button @click="createConfigClick" class="btn btn-primary">
            新增
          </button>
        </div>
      </div>
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th>
              <label>
                <input
                  @change="selectAllChange"
                  type="checkbox"
                  class="checkbox"
                />
              </label>
            </th>
            <th>键</th>
            <th>值</th>
            <th>上一次调用时间</th>
            <th>备注</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          <tr v-for="config in configList" :key="config.id" class="hover">
            <td>
              <label>
                <input
                  @change="changeSelectedConfig"
                  :value="config.id"
                  :checked="selectConfigMap.has(config.id)"
                  type="checkbox"
                  class="checkbox"
                />
              </label>
            </td>
            <td>{{ config.name }}</td>
            <td>{{ config.value }}</td>
            <td>{{ formatTime(config.last_get_time) }}</td>
            <td>{{ config.message }}</td>
            <td>
              <div v-if="config.enable" class="badge badge-accent w-12">
                启用
              </div>
              <div v-else class="badge badge-neutral w-12">禁用</div>
            </td>
            <td>
              <button
                @click="editConfigClick(config)"
                class="btn btn-primary btn-sm"
              >
                编辑
              </button>
              <button
                @click="configHistoryClick(config)"
                class="btn btn-secondary btn-sm m-2"
              >
                历史
              </button>
              <button
                @click="deleteConfigClick(config)"
                class="btn btn-error btn-sm"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-center">
        <div class="join">
          <button
            @click="previousConfigPage"
            class="btn join-item"
            :disabled="configCount === 0 || configPageIndex === 1"
          >
            «
          </button>
          <button class="btn join-item">{{ configPageIndex }}</button>
          <button
            @click="nextConfigPage"
            class="btn join-item"
            :disabled="
              configCount === 0 ||
              configPageIndex === Math.ceil(configCount / configPageSize)
            "
          >
            »
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
