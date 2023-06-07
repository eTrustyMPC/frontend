<template>
  <div class="container steps-form">
    <div class="columns">
      <div class="column menu-container box is-4">
        <StepsMenu
          :step-names="[
            'Preliminary questions',
            'Section I: Contracting authority',
            'Section II: Object  (1)',
            'Section IV: Procedure ',
            'Section VI: Complementary information',
            'Validating form ',
          ]"
        />
      </div>
      <div class="column form-container is-8 box">
        <div class="step-container">
          <RadioButtons
            label="Type of notice"
            name="type_notice"
            :values="{
              prior_notice: 'This notice is for prior information only',
              reduce_time_limits:
                'This notice aims at reducing time limits for receipt of tenders',
              call_competition: 'This notice is a call for competition',
            }"
            @change="(v) => changeTypeNotice(v)"
          />

          <RadioButtons
            label="Type of contract"
            name="type_contract"
            :values="{
              works: 'Works',
              supplies: 'Supplies',
              services: 'Services',
            }"
          />

          <RadioButtons
            v-if="isTypeProcedureDisabled"
            label="Type of procedure"
            name="type_procedure"
            :values="{
              restricted: 'Restricted procedure',
              comp_negotiation: 'Competitive procedure with negotiation',
            }"
          />
          <ENumberInput label="Quantity of section II:" name="num_of_section" :isInputDisabled="isNumOfSectionDisabled"/>

          <div class="joint-procurement">
            <ECheckbox label="The contract involves joint procurement"/>
            <ENumberInput label="Number of contracting authorities responsible for the procedure:" name="num_of_contact"/>
          </div>
        </div>
        <div class="buttons is-right">
          <a class="button next-step" v-if="numberStep != 0">Back</a>
          <a class="button next-step" @click="goToNextStep()" :disabled="!isStepValid">Next</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import EInput from "@/components/form/EInput.vue";
import RadioButtons from "@/components/form/RadioButtons.vue";
import StepsMenu from "@/components/form/StepsMenu.vue";
import ENumberInput from "@/components/form/ENumberInput.vue";
import ECheckbox from "@/components/form/ECheckbox.vue";

export default defineComponent({
  name: "IndexPage",
  components: { StepsMenu, EInput, RadioButtons, ENumberInput, ECheckbox },
  data: () => {
    return {
      numberStep: 0,
      isNumOfSectionDisabled: false,
      isTypeProcedureDisabled: false,
      isJointProcurement: false
    }
  },
  methods: {
    goToNextStep() {
      if (this.isStepValid) this.numberStep++
    },

    changeTypeNotice(v) {
      this.isNumOfSectionDisabled = (v != 'prior_notice')
      this.isTypeProcedureDisabled = (v == 'call_competition')
    }
  },
  computed: {
    isStepValid() {
      return false
    }
  }
});
</script>

<style lang="scss">
.menu-container {
  padding: 0;
}

.joint-procurement {
  margin-top: 30px;
}
</style>
