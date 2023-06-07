import { Client, FlatfileVirtualMachine } from "@flatfile/listener";

const config = Client.create((listener) => {});

config.mount(new FlatfileVirtualMachine());

export default config;
