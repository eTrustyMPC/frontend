<template>
  <div class="container wrapper">
    <h3 class="page-title title is-4">Transactions</h3>
    <div class="columns">
      <div class="column box transactions-container">
        <!-- <ESelect :values="{asc: ''}"/> -->
        <div v-if="pending" class="loader-wrapper is-active">
          <div class="loader is-loading"></div>
        </div>
        <div v-if="!pending" class="transactions-list">
          <div class="box header">
            <div class="columns">
              <div class="column is-3">Identifier</div>
              <div class="column is-3">Sender</div>
              <div class="column is-2">Contract address</div>
              <div class="column is-1">Action</div>
              <div class="column is-3">Date</div>
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
              <div class="column is-1">
                {{
                  transaction.node.event ? transaction.node.event.action : ""
                }}
              </div>
              <div class="column is-3">
                {{
                  moment
                    .unix(transaction.node.productionTime / 1000)
                    .format("YYYY-MM-DD HH:mm")
                }}
              </div>
            </div>
          </div>
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

function subHash(hash) {
  return hash.substr(0, 4) + "..." + hash.substr(-3);
}

function copyHash(hash) {
  navigator.clipboard.writeText(hash);
  isNotification.value = true;
  notificationText.value = `Copied to clipboard: ${hash}`;
  setTimeout(() => (isNotification.value = false), 3000);
}

const { data: transactions, pending } = useFetch(() => url, {
  method: "POST",
  body: JSON.stringify({
    query:
      'query TransactionOverviewQuery { ...TransactionTablePagination_Query } fragment TransactionTablePagination_Query on Query { latestTransactions(first: 20, after: "") { pageInfo { hasNextPage endCursor } edges { node { identifier productionTime executionSucceeded from contractId event { action id } id __typename } cursor } } }',
  }),
  default: () => [],
  transform: (result) => result.data.latestTransactions.edges,
});
</script>

<style lang="scss">
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
