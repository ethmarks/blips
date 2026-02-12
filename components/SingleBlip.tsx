// deno-lint-ignore-file react-no-danger
import { type Blip } from "../utils/fetchBlips.ts";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "now",
    m: "1m",
    mm: "%dm",
    h: "1hr",
    hh: "%dhr",
    d: "1d",
    dd: "%dd",
    M: "1mth",
    MM: "%dmth",
    y: "1yr",
    yy: "%dyr",
  },
});

export default function Blip(props: Blip) {
  const createdAtDate = new Date(props._createdAt);

  const getISODate = (date: Date) => date.toISOString();

  const getAbsoluteDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      hour12: true,
      minute: "numeric",
      timeZone: "America/New_York",
    };
    return date.toLocaleString("en-GB", options);
  };

  const getRelativeDate = (createdAt: Date) => {
    return dayjs(createdAt).fromNow(true);
  };

  return (
    <div class="blip" id={props._id}>
      <div class="time">
        <time class="relative" datetime={getISODate(createdAtDate)}>
          {getRelativeDate(createdAtDate)}
        </time>
        <time class="absolute" datetime={getISODate(createdAtDate)}>
          {getAbsoluteDate(createdAtDate)}
        </time>
      </div>
      <div
        class="blip-content"
        dangerouslySetInnerHTML={{ __html: props.renderedContent }}
      />
    </div>
  );
}
