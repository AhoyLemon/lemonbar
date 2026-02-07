<template lang="pug">
.dummy-data-notice
  .notice-content
    .notice-text
      strong This is demo data.
      |  You are viewing the default tenant with sample data. 
      | Real tenant data will be loaded when you access a specific tenant URL.
</template>

<style lang="scss" scoped>
  @use "sass:color";
  @use "@/assets/styles/variables" as *;

  .dummy-data-notice {
    background: linear-gradient(135deg, #17a2b8 0%, color.adjust(#17a2b8, $lightness: -10%) 100%);
    color: white;
    padding: $spacing-sm $spacing-lg;
    margin: -16px 0 26px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .notice-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      gap: $spacing-sm;
      align-items: center;

      .notice-text {
        font-size: 0.95rem;
        line-height: 1.5;

        strong {
          font-weight: 700;
        }
      }
    }
  }
</style>
