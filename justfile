alias s := serve
alias b := build
alias p := preview

serve:
    deno task dev
build:
    deno task build
preview:
    deno task start
