<template>
  <footer>
    <div class="container">
      <div class="columns is-vcentered">
        <div class="column is-2">
          <div class="logo">
            <img src="/logo.svg" />
          </div>
        </div>
        <div class="column is-9 has-text-centered">
          {{ $t("layouts.appFooter.copyright") }}
        </div>
        <div class="column is-1"></div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts"></script>

<style lang="scss">
footer {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #273038;
  padding: 20px 0px;
  color: #fff;

  .logo {
    width: 180px;
  }
}
</style>
