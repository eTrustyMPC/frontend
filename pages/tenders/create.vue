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
              <a href="#" @click="setActiveMenuItem(index)">{{ name }}</a>
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
          <div class="tender-main-info">
            <EInput
              v-model:value="lotTitle"
              label="Lot title"
              name="lot_title"
            />
            <EText
              v-model:value="lotDescription"
              label="Lot description"
              name="lot_description"
            />
          </div>
        </div>
        <div v-if="numberStep == 2" class="step-container">
          <h4 class="title is-4">Lot criterions</h4>
          <div v-for="(c, key) in criterions" :key="key" class="criterion-info">
            <EInput v-model:value="c.title" label="Title" />
            <EInput v-model:value="c.name" label="Name" />
            <ESelect
              label="Type"
              :values="{ boolean: 'Boolean', number: 'Number' }"
            />
            <ESelect
              label="Aggregation type"
              :values="{ sum: 'Sum', min: 'Min', max: 'Max', avg: 'Avg' }"
            />
            <hr v-if="key != criterions.length - 1" />
            <a
              v-if="criterions.length > 1"
              href="#"
              class="button delete-button"
              @click="deleteCriterion(key)"
            >
              <span class="icon">
                <i class="fa fa-trash"></i>
              </span>
            </a>
          </div>
        </div>
        <div class="buttons">
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
            v-if="numberStep == maxStep"
            class="button next-step"
            @click="addCriterion()"
          >
            <span class="icon">
              <i class="fa fa-plus"></i>
            </span>
            <span>Add criterion</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import EInput from "@/components/form/EInput.vue";
import EText from "@/components/form/EText.vue";
import ESelect from "@/components/form/ESelect.vue";

export default defineComponent({
  name: "CreatePage",
  components: {
    EInput,
    EText,
    ESelect,
  },
  data: () => {
    return {
      numberStep: 0,
      maxStep: 2,
      title: "",
      lotTitle: "",
      lotDescription: "",
      isNumOfSectionDisabled: false,
      isTypeProcedureDisabled: false,
      isJointProcurement: true,
      criterions: [
        {
          title: "",
          name: "",
          type: "boolean",
          aggType: "number",
        },
      ],
      stepNames: [
        "Tender information",
        "Tender lot information",
        "Lot criterions",
      ],
    };
  },
  computed: {
    isStepValid() {
      if (this.numberStep === 0) {
        return this.title.length >= 3;
      }

      if (this.numberStep === 1) {
        return this.lotTitle.length >= 3 && this.lotDescription !== "";
      }
      return false;
    },
  },
  methods: {
    goToNextStep() {
      if (this.isStepValid) this.numberStep++;
    },
    addCriterion() {
      this.criterions.push({
        title: "",
        name: "",
        type: "boolean",
        aggType: "number",
      });
    },
    deleteCriterion(removeIdx: Number) {
      const criterions = this.criterions;
      this.criterions = criterions
        .slice(0, removeIdx)
        .concat(criterions.slice(removeIdx + 1, criterions.length));
    },
    setActiveMenuItem(idx: Number) {
      if (this.isStepValid || idx < this.numberStep) this.numberStep = idx;
    },
  },
});
</script>

<style lang="scss">
.steps-menu {
  ul {
    margin: 0;
    list-style-type: none;

    li {
      padding: 10px;
      padding-left: 20px;
      margin: 0;
      transition: all 0.3s;

      &.is-active {
        background: #f7b452;

        a {
          color: #fff;
        }
      }

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: #f7b452;

        a {
          color: #fff;
        }
      }

      a {
        color: #273038;
        font-size: 18px;
      }
    }
  }

  .buttons {
    margin-top: 20px;
  }
}

.menu-container {
  padding: 0;
}

.tender-main-info {
  max-width: 450px;
}

.criterion-info {
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
</style>
