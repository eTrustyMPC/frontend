<template>
  <div class="container steps-form">
    <div class="columns">
      <div class="column menu-container box is-4">
        <div class="content steps-menu">
          <ul>
            <li
              v-for="(item, idx) in menuItems"
              :key="item"
              :class="activeItem == idx ? 'is-active' : ''"
            >
              <a @click="choseMenuItem(idx)">{{ item }}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="column is-8 box">
        <div v-if="pending" class="loader-wrapper is-active">
          <div class="loader is-loading"></div>
        </div>
        <div v-if="!pending" class="tender-info">
          <div v-if="activeItem == 0" class="tender-info-section">
            <h3 class="title is-4">{{ tender.title }}</h3>
            <div class="tender-info-option">
              <span class="icon">
                <i class="fa fa-circle-info"></i>
              </span>
              <span>Draft</span>
            </div>
            <div class="tender-info-option description">
              <span class="icon">
                <i class="fa fa-comment"></i>
              </span>
              <span
                >Lorem Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the industry's
                standard dummy text ever since the 1500s, when an unknown
                printer took a galley of type and scrambled it to make a type
                specimen book. It has survived not only five centuries, but also
                the leap into electronic typesetting, remaining essentially
                unchanged. It was popularised in the 1960s with the release of
                Letraset sheets containing Lorem Ipsum passages, and more
                recently with desktop publishing software like Aldus PageMaker
                including versions of Lorem Ipsum.</span
              >
            </div>
            <div class="tender-info-option">
              <span class="icon">
                <i class="fa fa-envelope"></i>
              </span>
              <span>asd@example.com</span>
            </div>
            <div class="tender-info-option">
              <span class="icon">
                <i class="fa fa-building"></i>
              </span>
              <span>prisma</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue";
import { useUserStore } from "@/stores/user";

const route = useRoute();
await nextTick();

const store = useUserStore();
const config = useRuntimeConfig();
const baseURL = config.public.baseURL;
const token = store.token;
const tenderId = route.params.id;
const activeItem = ref(0);
const menuItems = ["Information", "Lot information", "Lot criterions"];

const { data: tender, pending } = useFetch(
  () => `${baseURL}/api/v1/tenders/${tenderId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    default: () => [],
    transform: (result) => result.data,
  }
);

function choseMenuItem(idx) {
  activeItem.value = idx;
}
</script>

<style lang="scss">
.user-info {
  font-size: 18px;
  margin-bottom: 10px;
}

.tender-info-option {
  font-size: 18px;
  color: #273038;
  margin-bottom: 10px;

  &.description {
    display: flex;

    .icon {
      margin-right: 10px;
    }
  }

  .icon {
    margin-right: 5px;
    justify-content: left;
  }
}
</style>
