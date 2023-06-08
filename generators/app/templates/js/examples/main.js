import { Client, FlatfileVirtualMachine } from "@flatfile/listener";

const config = Client.create((listener) => {
  listener.on("**", (event) => {
    console.log(`Received event: ${JSON.stringify(event, null, 2)}`);
  });
});

config.mount(new FlatfileVirtualMachine());

export default config;
