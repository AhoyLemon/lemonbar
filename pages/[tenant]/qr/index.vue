<template lang="pug">

  .qr-page
    h1 {{ barName }}
    p Scan this QR code to see what drinks are available.
    .qr-container
      canvas.qr-canvas(ref="qrCanvas")
    .url-section#UrlSection
      input.url-input(type="text" readonly :value="qrUrl" @click="copyUrl" ref="urlInput")
      button.print-button(@click="printPage") Print QR Code

</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from "vue";
  // @ts-ignore
  import QRCode from "qrcode";
  import { getTenantConfig, getDefaultTenantConfig } from "~/utils/tenants";

  const config = useRuntimeConfig();

  const tenant = useValidateTenant();
  const tenantConfig = computed(() => {
    return getTenantConfig(tenant.value) || getDefaultTenantConfig();
  });
  const barName = computed(() => tenantConfig.value.barName);
  const qrCanvas = ref<HTMLCanvasElement>();
  const urlInput = ref<HTMLInputElement>();

  const baseUrl = config.app.baseURL;
  const qrUrl = ref("");

  const printPage = () => {
    window.print();
  };

  const copyUrl = async () => {
    if (urlInput.value) {
      urlInput.value.select();
      try {
        await navigator.clipboard.writeText(qrUrl.value);
        // Optional: show a brief success message
        console.log("URL copied to clipboard");
      } catch (err) {
        console.error("Failed to copy URL:", err);
      }
    }
  };

  onMounted(async () => {
    // Set QR URL on client side only
    qrUrl.value = `${window.location.origin}${baseUrl}${tenant.value}/available`;

    if (qrCanvas.value) {
      await QRCode.toCanvas(qrCanvas.value, qrUrl.value, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
    }
  });
</script>

<style scoped>
  .qr-page {
    text-align: center;
    padding: 2rem;
  }

  .qr-container {
    margin: 2rem 0;
  }

  .qr-canvas {
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  .url-section {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .url-input {
    width: 100%;
    max-width: 400px;
    padding: 0.5rem;
    font-family: monospace;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #f9f9f9;
    text-align: center;
  }

  .print-button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
  }

  .print-button:hover {
    background: #0056b3;
  }
</style>

<style>
  @media print {
    .app-header,
    .app-footer,
    #UrlSection {
      display: none !important;
    }
  }
</style>
