import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify/functions";
import image from "@astrojs/image";

import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  integrations: [
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
  ],
  output: "server",
  adapter: netlify(),
});
