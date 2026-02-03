// deno-lint-ignore-file no-explicit-any
import { JSX } from "preact";

// I know this isn't best practice, but I don't want to maintain multiple
// specs of what attributes my elements can accept.
interface EthElement extends JSX.HTMLAttributes<HTMLElement> {
  [prop: string]: any;
}

declare module "preact" {
  namespace JSX {
    interface IntrinsicElements {
      "eth-header": EthElement;
      "eth-footer": EthElement;
    }
  }
}
