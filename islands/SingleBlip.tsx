// deno-lint-ignore-file react-no-danger
import { useEffect, useState } from "preact/hooks";
import { type Blip } from "../utils/fetchBlips.ts";
import "dayjs";

export default function Blip(props: Blip) {
  const [currentTime, setCurrentTime] = useState(Date.now());

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
    };
    return date.toLocaleString("en-GB", options);
  };

  const getRelativeDate = (createdAt: Date, now: number) => {
    //const nowDate = new Date(now);
    //const distance = formatDistance(createdAt, nowDate, { addSuffix: false });
    //return distance
    //  .replace(/^about /, "")
    //  .replace(/^over /, "")
    //  .replace(/^almost /, "")
    //  .replace(/^less than a minute$/, "now")
    //  .replace(/^half a minute$/, "now")
    //  .replace(/^less than \d+ seconds?$/, "now")
    //  .replace(/^(\d+) minutes?$/, "$1m")
    //  .replace(/^(\d+) hours?$/, "$1hr")
    //  .replace(/^(\d+) days?$/, "$1d")
    //  .replace(/^(\d+) weeks?$/, "$1w")
    //  .replace(/^(\d+) months?$/, "$1mth")
    //  .replace(/^(\d+) years?$/, "$1yr");
    return "sometime idk";
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div class="blip" id={props._id}>
      <div class="time">
        <time class="relative" datetime={getISODate(createdAtDate)}>
          {getRelativeDate(createdAtDate, currentTime)}
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
