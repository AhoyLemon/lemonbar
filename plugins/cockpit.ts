import { COCKPIT_API_URL } from "~/utils/cockpitConfig";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      cockpitApiUrl: COCKPIT_API_URL,
    },
  };
});
