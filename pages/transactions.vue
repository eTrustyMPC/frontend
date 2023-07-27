<template>
  <div class="container wrapper">
    <h3 class="page-title title is-4">Transactions</h3>
    <div class="columns">
      <div class="column box transactions-container">
        <!-- <ESelect :values="{asc: ''}"/> -->
        <div v-if="transactions" class="transactions-list">
          <div class="box header">
            <div class="columns">
              <div class="column is-3">Identifier</div>
              <div class="column is-3">Sender</div>
              <div class="column is-2">Contract address</div>
              <div class="column is-2">Action</div>
              <div class="column is-2">Date</div>
            </div>
          </div>
          <div
            v-for="transaction in transactions"
            :key="transaction"
            class="box"
          >
            <div class="columns">
              <div class="column is-3">
                {{ subHash(transaction.node.identifier) }}
                <a href="#" @click="copyHash(transaction.node.identifier)">
                  <span class="icon">
                    <i class="fa fa-copy"></i>
                  </span>
                </a>
              </div>
              <div class="column is-3">
                {{ subHash(transaction.node.from) }}
                <a href="#" @click="copyHash(transaction.node.from)">
                  <span class="icon">
                    <i class="fa fa-copy"></i>
                  </span>
                </a>
              </div>
              <div class="column is-2">
                {{ subHash(transaction.node.contractId) }}
                <a href="#" @click="copyHash(transaction.node.contractId)">
                  <span class="icon">
                    <i class="fa fa-copy"></i>
                  </span>
                </a>
              </div>
              <div class="column is-2">
                {{
                  transaction.node.event ? transaction.node.event.action : ""
                }}
              </div>
              <div class="column is-2">
                {{
                  moment
                    .unix(transaction.node.productionTime / 1000)
                    .format("YYYY-MM-DD HH:mm")
                }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="hasNextPage && !isLoading" class="buttons is-centered">
          <button class="button add-more-button" @click="getTransactions">
            View more
          </button>
        </div>
        <div v-if="isLoading" class="loader-wrapper is-active">
          <div class="loader is-loading"></div>
        </div>
      </div>
    </div>
    <div :class="['notification ', isNotification ? 'is-active' : '']">
      <button class="delete" @click="isNotification = false"></button>
      {{ notificationText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue";
import moment from "moment";

await nextTick();

const url = "https://backend.browser.partisiablockchain.com/graphql/query";
const isNotification = ref(false);
const notificationText = ref("");
const afterPage = ref(null);
const transactions = ref([]);
const isLoading = ref(true);
const hasNextPage = ref(false);

function subHash(hash) {
  return hash.substr(0, 4) + "..." + hash.substr(-3);
}

function copyHash(hash) {
  navigator.clipboard.writeText(hash);
  isNotification.value = true;
  notificationText.value = `Copied to clipboard: ${hash}`;
  setTimeout(() => (isNotification.value = false), 3000);
}

function getTransactions() {
  isLoading.value = true;
  const body = {
    query: `query TransactionPaginationQuery( $after: String = "" $filter: TransactionFilter = null $first: Int = 20 ) { ...TransactionTablePagination_Query_G9cLv } fragment TransactionTablePagination_Query_G9cLv on Query { latestTransactions(first: $first, after: $after, filter: $filter) { pageInfo { hasNextPage endCursor } edges { node { identifier productionTime executionSucceeded from contractId event { action id } id __typename } cursor } } }`,
  };
  if (afterPage.value) body.variables = { after: afterPage.value, first: 20 };
  useFetch(() => url, {
    method: "POST",
    body: JSON.stringify(body),
    default: () => [],
    onResponse({ response }) {
      const latestTransactions = response._data.data.latestTransactions;
      isLoading.value = false;
      afterPage.value = latestTransactions.pageInfo.endCursor;
      hasNextPage.value = latestTransactions.pageInfo.hasNextPage;
      transactions.value = [...transactions.value, ...latestTransactions.edges];
    },
  });
}

getTransactions();
</script>

<style lang="scss">
.transactions-container {
  .buttons {
    margin-top: 40px;
  }
}
.transactions-filter {
  padding: 0 0 20px 0;
  max-width: 320px;

  .buttons {
    margin-top: 20px;

    .button {
      margin-left: 10px !important;
      margin-right: 10px !important;
      transition: 0.3s all;
    }

    .apply {
      background: #e5c076;
      color: #fff;
      border: 1px solid #e5c076;

      &:hover {
        background: #fff;
        color: #273038;
      }
    }

    .reset {
      border: 1px solid #e5c076;

      &:hover {
        background: #e5c076;
        color: #fff;
      }
    }
  }

  .filter-title {
    padding: 10px 0;
    text-align: center;
    border-bottom: 1px solid #273038;
  }

  .filter-item {
    padding: 15px;

    .checkbox {
      display: block;
    }
  }
}
.transactions-list {
  .box {
    transition: 0.3s all;
    margin-bottom: 10px;

    h4 {
      transition: 0.3s all;
    }

    a {
      color: #e5c076;
    }

    &:hover,
    &.header {
      box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0 0 1px #e5c076;
      background: #e5c076;
      color: #fff;

      h4 {
        color: #fff;
      }

      a {
        color: #fff;
      }
    }
  }
}
</style>
