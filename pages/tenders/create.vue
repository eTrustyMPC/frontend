<template>
  <div class="container steps-form">
    <div class="columns">
      <div class="column menu-container box is-4">
        <div class="content steps-menu">
          <ul>
            <li
              v-for="(name, index) in stepNames"
              :key="name"
              :class="numberStep == index ? 'is-active' : ''"
            >
              <a
                href="#"
                :class="disabledItems.includes(index) ? 'disabled' : ''"
                @click="setActiveMenuItem(index)"
                >{{ name }}</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="column form-container is-8 box">
        <div v-if="numberStep == 0" class="step-container">
          <div class="tender-main-info">
            <EInput v-model:value="title" label="Tender name" name="title" />
          </div>
        </div>
        <div v-if="numberStep == 1" class="step-container">
          <div v-for="(l, key) in lots" :key="key" class="lot-info">
            <EInput v-model:value="l.title" label="Lot title" />
            <EText v-model:value="l.description" label="Lot description" />
            <a
              v-if="lots.length > 1"
              href="#"
              class="button delete-button"
              @click="deleteLot(key)"
            >
              <span class="icon">
                <i class="fa fa-trash"></i>
              </span>
            </a>
            <hr v-if="key != lots.length - 1" />
          </div>
        </div>
        <div v-if="numberStep == 2" class="step-container">
          <h4 class="title is-4">Lot criterions</h4>
          <div v-for="(c, key) in criterions" :key="key" class="criterion-info">
            <EInput v-model:value="c.title" label="Title" />
            <EInput v-model:value="c.name" label="Name" />
            <ESelect
              v-model:value="c.type"
              label="Type"
              selected="NUMBER"
              :values="{ NUMBER: 'Number', BOOLEAN: 'Boolean' }"
            />
            <ESelect
              v-model:value="c.aggType"
              label="Aggregation type"
              selected="AVG"
              :values="{ AVG: 'Avg', SUM: 'Sum', MIN: 'Min', MAX: 'Max' }"
            />
          </div>
        </div>
        <div v-if="numberStep == 3" class="step-container">
          <label class="label">Submission dates</label>
          <VueDatePicker
            v-model="period"
            class="range"
            :enable-time-picker="false"
            range
            :partial-range="false"
            :min-date="new Date()"
          ></VueDatePicker>
        </div>
        <div
          v-if="numberStep == 4 && !isPending && !isCreated"
          class="step-container"
        >
          <label class="label">The deadline for estimation submission</label>
          <VueDatePicker
            v-model="deadlineDate"
            class="range"
            :enable-time-picker="false"
            :partial-range="false"
            :min-date="new Date()"
          ></VueDatePicker>
          <div class="jury-email">
            <label class="label">Jury emails</label>
            <div
              v-for="(e, key) in juryEmails"
              :key="key"
              class="tender-main-info email-row"
            >
              <EInput v-model:value="e.email" />
              <a
                v-if="juryEmails.length > 1"
                href="#"
                class="button delete-button"
                @click="deleteEmail(key)"
              >
                <span class="icon">
                  <i class="fa fa-trash"></i>
                </span>
              </a>
            </div>
          </div>
        </div>
        <div v-if="isPending" class="loader-wrapper is-active">
          <div class="loader is-loading"></div>
        </div>
        <div v-if="isCreated" class="created-status">
          <span class="icon">
            <i class="fa fa-check"></i>
          </span>
        </div>
        <div v-if="!isPending && !isCreated" class="buttons">
          <button
            v-if="numberStep != 0"
            class="button next-step"
            @click="numberStep--"
          >
            Back
          </button>
          <button
            v-if="isStepValid && numberStep != maxStep"
            class="button next-step"
            @click="goToNextStep()"
          >
            Next
          </button>
          <button
            v-if="!isStepValid && numberStep != maxStep"
            class="button next-step"
            disabled
            @click="goToNextStep()"
          >
            Next
          </button>
          <button
            v-if="numberStep == 1"
            class="button next-step"
            @click="addLot()"
          >
            <span class="icon">
              <i class="fa fa-plus"></i>
            </span>
            <span>Add lot</span>
          </button>
          <button
            v-if="numberStep == 4"
            class="button next-step"
            @click="addJuryEmail()"
          >
            <span class="icon">
              <i class="fa fa-plus"></i>
            </span>
            <span>Add email</span>
          </button>

          <button
            v-if="(numberStep == maxStep) & isStepValid"
            class="button"
            @click="create"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import EInput from "@/components/form/EInput.vue";
import EText from "@/components/form/EText.vue";
import ESelect from "@/components/form/ESelect.vue";
import { useUserStore } from "@/stores/user";

export default defineComponent({
  name: "CreatePage",
  components: {
    EInput,
    EText,
    ESelect,
    VueDatePicker,
  },
  data: () => {
    return {
      userStore: useUserStore(),
      numberStep: 0,
      maxStep: 4,
      isNumOfSectionDisabled: false,
      isTypeProcedureDisabled: false,
      isJointProcurement: true,
      disabledItems: [1, 2, 3, 4],
      isPending: false,
      isCreated: false,
      stepNames: [
        "Tender information",
        "Tender lot information",
        "Lot criterion",
        "Submission dates",
        "Contacts",
      ],
      emailRegex:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

      // Form fields
      title: "",
      lots: [
        {
          title: "",
          description: "",
        },
      ],
      criterions: [
        {
          title: "",
          name: "",
          type: "NUMBER",
          aggType: "AVG",
        },
      ],

      period: null,
      juryEmails: [{ email: "" }],
      deadlineDate: null,
      // Test data
      // title: "Test t 1",
      // lots: [
      //   {
      //     title: "Lot 1",
      //     description: "Desc 1",
      //   },
      //   {
      //     title: "Lot 2",
      //     description: "Desc 2",
      //   },
      // ],
      // criterions: [
      //   {
      //     title: "Criterion title 1",
      //     name: "Criterion name 1",
      //     type: "NUMBER",
      //     aggType: "MIN",
      //   },
      // ],
      // period: [new Date(), new Date()],
      // juryEmails: [{ email: "nikita@etrusty.io" }],
      // deadlineDate: new Date(),
    };
  },
  computed: {
    isStepValid() {
      if (this.numberStep === 0) {
        return this.title.length >= 3;
      }

      if (this.numberStep === 1) {
        for (const lidx in this.lots) {
          const lot = this.lots[lidx];
          if (lot.title.length < 3 || lot.description.length < 3) {
            return false;
          }
        }
        return true;
      }

      if (this.numberStep === 2) {
        for (const cidx in this.criterions) {
          const criterion = this.criterions[cidx];
          if (criterion.title.length < 3 || criterion.name.length < 3) {
            return false;
          }
        }
        return true;
      }
      if (this.numberStep === 3) {
        return this.period && this.period.length !== 0;
      }
      if (this.numberStep === 4) {
        for (const cidx in this.juryEmails) {
          const emailInfo = this.juryEmails[cidx];
          if (!emailInfo.email.match(this.emailRegex)) return false;
        }
        return this.deadlineDate && this.deadlineDate.length !== 0;
      }
      return false;
    },
  },
  methods: {
    goToNextStep() {
      if (this.isStepValid) {
        this.numberStep++;
        this.disabledItems.splice(
          this.disabledItems.indexOf(this.numberStep),
          1
        );
      }
    },
    addLot() {
      this.lots.push({
        title: "",
        description: "",
      });
    },
    addJuryEmail() {
      this.juryEmails.push({
        email: "",
      });
    },
    deleteLot(removeIdx: Number) {
      const lots = this.lots;
      this.lots = lots
        .slice(0, removeIdx)
        .concat(lots.slice(removeIdx + 1, lots.length));
    },
    deleteEmail(removeIdx: Number) {
      const emails = this.juryEmails;
      this.juryEmails = emails
        .slice(0, removeIdx)
        .concat(emails.slice(removeIdx + 1, emails.length));
    },
    setActiveMenuItem(idx: Number) {
      if (this.isStepValid || idx < this.numberStep) this.numberStep = idx;
    },
    async _sendRequest(url, data) {
      const token = this.userStore.user.token;
      return await useFetch(() => url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
    },
    async create() {
      this.isPending = true;
      const url = this.$config.public.baseURL;
      const { data: tender } = await this._sendRequest(
        `${url}/api/tender/create`,
        {
          data: {
            ownerId: this.userStore.user.id,
            title: this.title,
            status: "ACTIVE",
            startAt: this.period[0].toISOString(),
            finishAt: this.period[1].toISOString(),
            jury_emails: this.juryEmails.map((e) => e.email),
          },
        }
      );
      const tenderId = tender.value.data.id;
      const criterionInfo = this.criterions[0];
      const { data: criterion } = await this._sendRequest(
        `${url}/api/criterion/create`,
        {
          data: {
            ownerId: this.userStore.user.id,
            name: criterionInfo.name,
            title: criterionInfo.title,
            // scoreType: criterion.type,
            // agregationType: criterion.aggType,
          },
        }
      );

      const token = this.userStore.user.token;
      this.lots.forEach((lot) => {
        useFetch(() => `${url}/api/lot/create`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              ownerId: this.userStore.user.id,
              title: lot.title,
              description: lot.description,
              criterionId: criterion.value.data.id,
              tenderId,
            },
          }),
        });
      });
      this.isPending = false;
      this.isCreated = true;
      setTimeout(
        () => this.$router.push({ path: `/tenders/${tenderId}` }),
        3000
      );
    },
  },
});
</script>

<style lang="scss">
.menu-container {
  padding: 0;
}

.tender-main-info {
  max-width: 450px;

  &.email-row {
    margin-bottom: 20px;
    position: relative;

    .delete-button {
      position: absolute;
      right: -60px;
      top: 0;
    }
  }
}

.criterion-info {
  max-width: 450px;
}

.lot-info {
  position: relative;

  .delete-button {
    position: absolute;
    right: 0;
    top: 30px;
  }

  .input-field {
    max-width: 70%;
  }

  .select-field {
    margin-top: 20px;
  }

  hr {
    margin: 20px 0;
    background: rgb(39 48 56 / 50%);
  }

  .delete-button {
    &:hover {
      background: #273038;
      color: #fff;
      transition: all 0.3s;
    }
  }
}
.step-container {
  .range {
    max-width: 400px;
  }

  .jury-email {
    margin-top: 20px;
  }
}
</style>
