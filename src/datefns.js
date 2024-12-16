import { format, compareAsc } from "date-fns";
import { formatDistance, subDays } from "date-fns";

const x = formatDistance(subDays(new Date(), 3), new Date(), { addSuffix: true });
//=> "3 days ago"

const now = new Date()
const formatedDate = format(now,`dd MM yy` )
console.log(formatedDate)