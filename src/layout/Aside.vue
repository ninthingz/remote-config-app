<script lang="ts" setup>
import { Ref, ref } from "vue";
import { getProjects, Project } from "../api/projects";
import { useRouter } from "vue-router";

const router = useRouter();

const searchKeyword = ref("");

const projects = ref<Project[]>([]);

const processMap = ref<Map<string, Project[]>>(new Map());

const projectOpenMap = new Map<string, Ref<boolean>>();

const processOpenMap = new Map<string, Ref<boolean>>();

const versionMap = ref<Map<string, Project[]>>(new Map());

let lock = false;

const searchProjects = () => {
  getProjects({
    projectName: searchKeyword.value,
    showProcess: false,
    process: "",
    showVersion: false,
  }).then((res) => {
    if (res.data.code == 200) {
      projects.value = res.data.data!;

      projects.value.forEach((project) => {
        projectOpenMap.set(project.label, ref(false));
      });
    }
  });
};

const searchProcess = (projectName: string) => {
  if (lock === true) {
    lock = false;
    return;
  }
  if (projectOpenMap.get(projectName)?.value !== undefined) {
    if (!projectOpenMap.get(projectName)!.value) {
      getProjects({
        projectName: projectName,
        showProcess: true,
        process: "",
        showVersion: false,
      }).then((res) => {
        if (res.data.code == 200) {
          processMap.value.set(projectName, res.data.data!);
          res.data.data!.forEach((process) => {
            processOpenMap.set(projectName + ":" + process.label, ref(false));
          });
          projectOpenMap.get(projectName)!.value = true;
        }
      });
    } else {
      projectOpenMap.get(projectName)!.value = false;
    }
  }
};

const searchVersion = (projectName: string, process: string) => {
  if (lock === true) {
    lock = false;
    return;
  }
  if (processOpenMap.get(projectName + ":" + process)?.value !== undefined) {
    if (!processOpenMap.get(projectName + ":" + process)!.value) {
      getProjects({
        projectName: projectName,
        showProcess: true,
        process: process,
        showVersion: true,
      }).then((res) => {
        if (res.data.code == 200) {
          versionMap.value.set(projectName + ":" + process, res.data.data!);
          processOpenMap.get(projectName + ":" + process)!.value = true;
        }
      });
    } else {
      processOpenMap.get(projectName + ":" + process)!.value = false;
    }
  }
};

const showProjectChart = (
  projectName: string,
  process?: string,
  version?: string,
) => {
  lock = true;
  router.push({
    path: "/chart",
    query: {
      projectName: projectName,
      process,
      version,
    },
  });
};
</script>

<template>
  <div class="h-full w-96 flex-col overflow-y-scroll rounded-box bg-base-200">
    <div class="p-2">
      <label class="input input-bordered flex items-center">
        <input
          v-model="searchKeyword"
          type="text"
          class="grow"
          placeholder="Search"
          @keypress.enter="searchProjects"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="h-4 w-4 opacity-70"
        >
          <path
            fill-rule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clip-rule="evenodd"
          />
        </svg>
      </label>
    </div>
    <ul class="menu">
      <li v-for="project in projects">
        <details>
          <summary @click="searchProcess(project.label)">
            {{ project.label }}
            <span
              @click.prevent="showProjectChart(project.label)"
              class="badge"
              >{{ project.count }}</span
            >
          </summary>
          <ul>
            <li v-for="process in processMap.get(project.label)">
              <details>
                <summary @click="searchVersion(project.label, process.label)">
                  {{ process.label }}
                  <span
                    @click.prevent="
                      showProjectChart(project.label, process.label)
                    "
                    class="badge"
                    >{{ process.count }}</span
                  >
                </summary>
                <ul>
                  <li
                    v-for="version in versionMap.get(
                      project.label + ':' + process.label,
                    )"
                  >
                    <a
                      @click.prevent="
                        showProjectChart(
                          project.label,
                          process.label,
                          version.label,
                        )
                      "
                      >{{ version.label }}
                      <span class="badge">{{ version.count }}</span>
                    </a>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </details>
      </li>
    </ul>
  </div>
</template>
